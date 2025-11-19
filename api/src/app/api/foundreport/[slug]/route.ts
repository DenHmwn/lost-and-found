import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
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
}