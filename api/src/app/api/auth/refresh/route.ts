import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { AccessToken } from "@/lib/accessToken";
import { SECRET } from "@/lib/secret";
import { RefreshPayload } from "@/lib/interface";

export async function GET(req: NextRequest) {
  try {
    // Ambil refresh token dari cookie
    const refreshToken = req.cookies.get("refreshToken")?.value;

    // Validasi refresh token
    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: "Refresh token tidak ditemukan" },
        { status: 401 }
      );
    }
    let decoded: RefreshPayload;
    try {
      const { payload } = await jwtVerify(refreshToken, SECRET);
      decoded = payload as unknown as RefreshPayload;
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Refresh token tidak valid atau kedaluwarsa",
        },
        { status: 403 }
      );
    }

    // Buat access token baru
    const newAccessToken = await AccessToken({
      id: decoded.id,
      name: decoded.name,
      role: decoded.role,
    });

    // Kirim response
    const res = NextResponse.json({
      success: true,
      message: "Access token diperbarui",
      accessToken: newAccessToken,
    });

    // // Set access token cookie baru
    // res.cookies.set("accessToken", newAccessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 60 * 15, // 15 menit
    //   path: "/",
    //   sameSite: "lax",
    // });

    return res;
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memperbarui token" },
      { status: 500 }
    );
  }
}
