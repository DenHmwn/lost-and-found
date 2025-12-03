import { AccessToken, RefreshToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Validasi input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password harus diisi" },
        { status: 400 }
      );
    }

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        notelp: true,
      }
    });

    // cek email
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email tidak ditemukan" },
        { status: 404 }
      );
    }

    // cek password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: "Password salah" },
        { status: 401 }
      );
    }

    // Buat acces token
    const accessToken = await AccessToken({
      id: String(user.id),
      name: user.name,
      role: user.role,
    });

    // Buat refresh token
    const refreshToken = await RefreshToken({
      id: String(user.id),
      name: user.name,
      role: user.role,
    });

    // Buat response dengan user data
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        notelp: user.notelp,
      },
    });

    // Set token HTTP-only cookie untuk keamanan
    response.cookies.set("accesstoken", accessToken,  {
      // Tidak bisa diakses JavaScript
      httpOnly: true, 
      // HTTPS only di production
      secure: process.env.NODE_ENV === "production", 
      // set waktu kedaluwarsa 
      maxAge: 60 * 15, //15 mnt
      path: "/", 
      // Proteksi CSRF
      sameSite: "lax", 
    });
    
    response.cookies.set("refreshToken", refreshToken,  {
      // Tidak bisa diakses JavaScript
      httpOnly: true, 
      // HTTPS only di production
      secure: process.env.NODE_ENV === "production", 
      // set waktu kedaluwarsa 
      maxAge: 60 * 60 * 24 * 7,
      path: "/", 
      // Proteksi CSRF
      sameSite: "lax", 
    });


  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal login" },
      { status: 500 }
    );
  }
}