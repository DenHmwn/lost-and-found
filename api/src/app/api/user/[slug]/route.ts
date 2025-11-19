import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE user by id
export async function DELETE(
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
  // cek apakah data nya ada
    const existingRecord = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Data laporan tidak ditemukan",
        },
        { status: 404 }
      );
    }
     // Delete data
    await prisma.user.delete({
      where: { id },
    });
    // response success
    return NextResponse.json({
      success: true,
      message: "Data user berhasil dihapus",
    });
}
