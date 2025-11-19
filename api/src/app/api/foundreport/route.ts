import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all found reports
export async function GET() {
  try {
    const reports = await prisma.foundReport.findMany({
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
    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data barang temuan",
      data: reports,
    });
  } catch (error) {
    console.error("Error fetching found reports:", error);
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
