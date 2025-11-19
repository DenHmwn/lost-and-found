import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// buat GET user
export const GET = async () => {
  const users = await prisma.user.findMany({
  orderBy: {
    id: "desc"
  }
  });
   return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data laporan",
      data: users,
    });
};

// Buat POST user
export const POST = async (req: NextRequest) => {
  // simpan data
  const data = await req.json();
  // cek apakah udh ada apa belum
  const check = await prisma.user.findFirst({
    where: {
      email: data.email,
      notelp: data.notelp
    },
    select: {
      email: true,
      notelp: true
    }
  })
}