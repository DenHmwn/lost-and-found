import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get user info dari header di middleware
    const userId = req.headers.get("user-id");

    if (!userId) {
       return NextResponse.json({ message: "Akses ditolak: Identitas pengguna tidak valid." }, { status: 403 });
    }

    // Fetch user data from database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        name: true,
        email: true,
        notelp: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Data user tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data user berhasil diambil",
      data: user,
    });

  } catch (error) {
    console.error(" Error di /api/user/me:", error);
    
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}