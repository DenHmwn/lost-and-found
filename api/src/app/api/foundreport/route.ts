import { getAuth } from "@/lib/getAuth";
import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// buat fungsi GET
export async function GET(req: NextRequest) {
  try {
    const { page, limit, skip } = pagination(req);

    // ambil total data
    const totalData = await prisma.foundReport.count();

    const reports = await prisma.foundReport.findMany({
      skip,
      take: limit,
      include: {
        // rellasi ke admin yang buat laporan temu
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
            role: true,
          },
        },
        // relasi ke lostreport (jika udah di cocokkan)
        lostReport: {
          include: {
            // include sama data user yang kehilangan barang
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                notelp: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    //   Response Success
    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data barang temuan",
        pagination: {
          page,
          limit,
          totalData,
          totalPage: Math.ceil(totalData / limit),
        },
        data: reports,
      },
      {
        status: 200,
      },
    );
    // Response Error
  } catch (error) {
    console.error("Error fetching found reports:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data barang temuan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
// BUat fungsi POST
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      namaBarang,
      deskripsi,
      lokasiTemu,
      lostReportId,
      tanggalTemu,
      waktuTemu,
    } = data;

    // ambil id admin dari header cookies
    const admin = await getAuth();

    // validasi auth
    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Token tidak valid atau belum login.",
        },
        { status: 401 },
      );
    }

    const headerId = Number(admin.id);
    const headerRole = admin.role;

    // Validasi Role ADMIN
    if (headerRole !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Akses Ditolak. Hanya ADMIN yang dapat membuat laporan temuan.",
        },
        { status: 403 },
      );
    }

    // validasi input data
    if (
      !namaBarang ||
      !deskripsi ||
      !lokasiTemu ||
      !tanggalTemu ||
      !waktuTemu
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data tidak lengkap. Pastikan nama barang, deskripsi, lokasi temuan, dan admin ID terisi.",
        },
        { status: 400 },
      );
    }

    // Validasi dan parsing tanggal
    const formatTanggalTemu = new Date(tanggalTemu);
    if (isNaN(formatTanggalTemu.getTime())) {
      return NextResponse.json(
        { success: false, message: "Format tanggal tidak valid." },
        { status: 400 },
      );
    }

    // Validasi lostReportId jika ada
    if (lostReportId) {
      const lostReportExists = await prisma.lostReport.findUnique({
        where: { id: Number(lostReportId) },
      });

      if (!lostReportExists) {
        return NextResponse.json(
          {
            success: false,
            message: "Laporan barang hilang tidak ditemukan",
          },
          { status: 404 },
        );
      }
      // Cek apakah lostReport sudah memiliki foundReport
      const alreadyMatched = await prisma.foundReport.findUnique({
        where: { lostReportId: Number(lostReportId) },
      });

      if (alreadyMatched) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Laporan barang hilang ini sudah memiliki pasangan barang temuan",
          },
          { status: 409 },
        );
      }
    }

    //   create report
    const report = await prisma.foundReport.create({
      data: {
        namaBarang: namaBarang.trim(),
        deskripsi: deskripsi.trim(),
        lokasiTemu: lokasiTemu.trim(),
        adminId: Number(headerId),
        lostReportId: lostReportId ? Number(lostReportId) : null,
        tanggalTemu: formatTanggalTemu,
        waktuTemu: String(waktuTemu).trim(),
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
          },
        },
        lostReport: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                notelp: true,
              },
            },
          },
        },
      },
    });
    // Response Success
    return NextResponse.json(
      {
        success: true,
        message: "Laporan barang temuan berhasil dibuat",
        data: report,
      },
      { status: 201 },
    );
    // response error
  } catch (error) {
    console.error("Error creating found report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat laporan barang temuan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
