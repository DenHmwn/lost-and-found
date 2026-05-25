import { NextRequest, NextResponse } from "next/server";
import { LostStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getAuth } from "@/lib/getAuth";
import { pagination } from "@/lib/pagination";

// GET semua laporan lost
export async function GET(req: NextRequest) {
  const { page, limit, skip } = pagination(req);

  // ambil total data
  const totalData = await prisma.lostReport.count();

  try {
    // data semua laporan sama laporan include relasi
    const reports = await prisma.lostReport.findMany({
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
            role: true,
          },
        },
        // relasi ke foundreport (jika sudah dicocokkan dengan barang temuan)
        foundReport: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // response success
    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data laporan",
        pagination: {
          page,
          limit,
          totalData,
          totalPage: Math.ceil(totalData / limit),
        },
        data: reports,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching lost reports:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data laporan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

export const runtime = "nodejs";
// POST pada lost report
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { namaBarang, deskripsi, lokasiHilang, tanggalHilang, waktuHilang } =
      data;

    // ambil id admin dari helper
    const user = await getAuth();

    // cek user
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Token tidak valid atau belum login.",
        },
        { status: 401 },
      );
    }

    const headerId = Number(user.id);
    const headerRole = user.role;

    if (headerRole !== "USER") {
      return NextResponse.json(
        { success: false, message: "Hanya user yang dapat membuat laporan." },
        { status: 403 },
      );
    }

    if (
      !namaBarang ||
      !deskripsi ||
      !lokasiHilang ||
      !tanggalHilang ||
      !waktuHilang
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap. Pastikan semua field terisi.",
        },
        { status: 400 },
      );
    }

    const userId = Number(headerId);
    if (!Number.isFinite(userId)) {
      return NextResponse.json(
        { success: false, message: "User ID tidak valid." },
        { status: 400 },
      );
    }

    const formatTanggalHilang = new Date(tanggalHilang);
    if (Number.isNaN(formatTanggalHilang.getTime())) {
      return NextResponse.json(
        { success: false, message: "Format tanggal tidak valid." },
        { status: 400 },
      );
    }

    const report = await prisma.lostReport.create({
      data: {
        namaBarang: String(namaBarang).trim(),
        deskripsi: String(deskripsi).trim(),
        lokasiHilang: String(lokasiHilang).trim(),
        userId,
        status: LostStatus.PENDING,
        tanggalHilang: formatTanggalHilang,
        waktuHilang: String(waktuHilang).trim(),
      },
      include: {
        user: { select: { id: true, name: true, email: true, notelp: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Laporan barang hilang berhasil dibuat.",
        data: report,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, message: "Gagal membuat laporan", error: msg },
      { status: 500 },
    );
  }
}
