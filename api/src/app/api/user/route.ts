import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// get all user
export const GET = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data user",
        data: users,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data user",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};

// buat POST user
export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();

    // Validasi sederhana
    if (!data.name || !data.email || !data.password || !data.notelp) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap",
        },
        { status: 400 }
      );
    }

    // Cek apakah email atau notelp sudah digunakan
    const check = await prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { notelp: data.notelp }],
      },
    });

    if (check) {
      return NextResponse.json(
        {
          success: false,
          message: "Email atau no telp sudah digunakan user lain",
        },
        { status: 409 }
      );
    }

    // Simpan data user
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        notelp: data.notelp,
        role: data.role,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Data berhasil disimpan",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menyimpan data",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
};
