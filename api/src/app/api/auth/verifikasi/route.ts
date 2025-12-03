import { verifyToken } from "@/lib/verifikasi";
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

    // Verifikasi token
    const decoded = await verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Token invalid atau expired",
          details: "Token tidak bisa diverifikasi dengan JWT_SECRET yang ada",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Token valid",
      decoded,
    });
  } catch (error: unknown) {
    console.error("Verify token error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memverifikasi token",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
