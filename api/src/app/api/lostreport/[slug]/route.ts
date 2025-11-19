import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// buat fungsi GET by id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
    try{
    const { slug } = await params;

    // Validasi ID
    const id = Number(slug);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID tidak valid",
        },
        { status: 400 }
      );
    }
    // laporan by id
    const report = await prisma.lostReport.findUnique({
      where: { id },
      include: {
        // include yang melaporkan
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
            role: true,
          },
        },
        // include barang temuan jika sudah dicocokkan
        foundReport: true,
      },
    });
    // jika laporan tidak ditemukan
    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Data laporan tidak ditemukan",
        },
        { status: 404 }
      );
    } // response success
    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data laporan",
      data: report,
    });
  } catch (error) {
    console.error("Error fetching lost report:", error);
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

// PUT llostreoport by id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const data = await request.json();

    // Validasi ID
    const id = Number(slug);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID tidak valid",
        },
        { status: 400 }
      );
    }
    // Validasi input
    if (
      !data.namaBarang ||
      !data.deskripsi ||
      !data.lokasiHilang ||
      !data.userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap. Pastikan semua field terisi.",
        },
        { status: 400 }
      );
    }
}