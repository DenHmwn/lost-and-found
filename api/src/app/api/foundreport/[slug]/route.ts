import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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
    // get laporan by id
    const report = await prisma.foundReport.findUnique({
      where: { id },
      include: {
        // include sama data admin
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
            role: true,
          },
        },
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
    });
    // cek jika data tidak ditemukan
    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Data barang temuan tidak ditemukan",
        },
        { status: 404 }
      );
    }
    // response jika data ditemukan
    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data barang temuan",
      data: report,
    });
    // response error
  } catch (error) {
    console.error("Error fetching found report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data barang temuan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Fungsi PUT di foundreport
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
    // Validasi input required
    if (
      !data.namaBarang ||
      !data.deskripsi ||
      !data.lokasiTemu ||
      !data.adminId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap. Pastikan semua field terisi.",
        },
        { status: 400 }
      );
    }
    // Cek apakah record ada
    const existingRecord = await prisma.foundReport.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Data barang temuan tidak ditemukan",
        },
        { status: 404 }
      );
    }
    // Validasi admin ada atau tidaknya dan adalah ADMIN role
    const adminExists = await prisma.user.findUnique({
      where: { id: Number(data.adminId) },
    });
    if (!adminExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin tidak ditemukan",
        },
        { status: 404 }
      );
    }
    if (adminExists.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "User bukan admin",
        },
        { status: 403 }
      );
    }
}