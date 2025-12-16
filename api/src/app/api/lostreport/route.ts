import { NextResponse } from "next/server";
import { LostStatus } from "@prisma/client";
import prisma from "@/lib/prisma";

// GET semua laporan lost
export async function GET() {
  try {
    // data semua laporan sama laporan include relasi
    const reports = await prisma.lostReport.findMany({
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
        data: reports,
      },
      {
        status: 200,
      }
    );
    // response error
  } catch (error) {
    console.error("Error fetching lost reports:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data laporan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// POST pada lost report
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { namaBarang, deskripsi, lokasiHilang, userId, tanggal, waktu } = data;

    // Validasi semua field wajib
    if (!namaBarang || !deskripsi || !lokasiHilang || !userId || !tanggal || !waktu) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap. Pastikan semua field terisi.",
        },
        { status: 400 }
      );
    }

    // Validasi user
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    if (user.role !== "USER") {
      return NextResponse.json(
        { success: false, message: "Hanya user yang dapat membuat laporan." },
        { status: 403 }
      );
    }

    // Validasi dan parsing tanggal
    const tanggalHilang = new Date(tanggal);
    if (isNaN(tanggalHilang.getTime())) {
      return NextResponse.json(
        { success: false, message: "Format tanggal tidak valid." },
        { status: 400 }
      );
    }

    // Simpan ke database
    const report = await prisma.lostReport.create({
      data: {
        namaBarang: namaBarang.trim(),
        deskripsi: deskripsi.trim(),
        lokasiHilang: lokasiHilang.trim(),
        userId: Number(userId),
        status: LostStatus.PENDING,
        tanggalHilang,
        waktuHilang: waktu.trim(),
      },
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
    });

    return NextResponse.json(
      {
        success: true,
        message: "Laporan barang hilang berhasil dibuat.",
        data: report,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating lost report:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat laporan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

