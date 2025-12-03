import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout berhasil",
    });

    // // Hapus cookie token
    // response.cookies.delete("accessToken");
    // response.cookies.delete("refreshToken");

    // hapus acces token cookie
    response.cookies.set("accessToken", "", {
      maxAge: 0,
      path: "/",
    });

    // hapus refresh token cookie
    response.cookies.set("refreshToken", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal logout" },
      { status: 500 }
    );
  }
}