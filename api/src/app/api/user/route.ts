import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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