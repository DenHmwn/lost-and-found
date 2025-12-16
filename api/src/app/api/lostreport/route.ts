import prisma from "@/lib/prisma";
import { LostStatus } from "@prisma/client";
import { NextResponse } from "next/server";

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

    if (!namaBarang || !deskripsi || !lokasiHilang || !userId || !tanggal || !waktu) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap. Pastikan semua field terisi.",
        },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!userExists) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    if (userExists.role !== "USER") {
      return NextResponse.json(
        { success: false, message: "Hanya user yang dapat membuat laporan." },
        { status: 403 }
      );
    }

    const report = await prisma.lostReport.create({
      data: {
        namaBarang: namaBarang.trim(),
        deskripsi: deskripsi.trim(),
        lokasiHilang: lokasiHilang.trim(),
        userId: Number(userId),
        status: LostStatus.PENDING,
        tanggalHilang: new Date(tanggal), 
        waktuHilang: waktu,               
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
        message: "Laporan barang hilang berhasil dibuat",
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

