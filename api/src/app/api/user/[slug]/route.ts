import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// DELETE user by id
export async function DELETE(
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
    return NextResponse.json(
      {
        success: true,
        message: "Data user berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting lost report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus data laporan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// put user by id
export const PUT = async (
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await context.params;
    const userId = Number(slug);

    if (isNaN(userId)) {
      return NextResponse.json({
        message: "id tidak valid",
        success: false,
      },
    {
        status: 400,
    });
    }

    const data = await request.json();

    // Cek email apakah sudah dipakai user lain
    const existingUser = await prisma.user.findFirst({
      where: {
        email: data.email,
        NOT: { id: userId },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message: "email sudah digunakan user lain",
          success: false,
        },
        {
          status: 409,
        }
      );
    }
    // Update user by id
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
    });
    // response success
    return NextResponse.json(
      {
        message: "data berhasil diubah",
        success: true,
        data: updatedUser,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    return NextResponse.json({
      message: (error as Error).message || "Terjadi kesalahan",
      success: false,
    },
  {
      status: 500,
  });
  }
};

// GET User by id
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
    // user by id
    const report = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        notelp: true,
        role: true,
      },
    });
    // jika data tidak ditemukan
    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Data user tidak ditemukan",
        },
        { status: 404 }
      );
    }
    // response success
    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data user",
        data: report,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching lost report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
