import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    // Validasi token
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token tidak ditemukan" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error("Verify token error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Gagal memverifikasi token",
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}