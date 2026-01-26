import { pagination } from "@/lib/pagination";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// buat GET user
export const GET = async (req: NextRequest) => {
  const { page, limit, skip } = pagination(req);

  // ambil total data
  const totalData = await prisma.user.count();

  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["USER", "ADMIN"],
      },
    },
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      notelp: true,
      role: true,
    },
    orderBy: {
      id: "desc",
    },
  });
  return NextResponse.json(
    {
      success: true,
      message: "Berhasil mengambil data laporan",
      pagination: {
        page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
      },
      data: users,
    },
    {
      status: 200,
    },
  );
};
// Buat POST user
export const POST = async (req: NextRequest) => {
  // simpan data
  const data = await req.json();
  // cek apakah udh ada apa belum
  const check = await prisma.user.findFirst({
    where: {
      email: data.email,
      notelp: data.notelp,
    },
    select: {
      email: true,
      notelp: true,
    },
  });
  // jika user tidak ada
  if (check) {
    return NextResponse.json(
      {
        message: "data user gagal disimpan, email atau no telp sudah ada",
        success: false,
      },
      {
        status: 409,
      },
    );
  }
  // simpan data sesuai request
  await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      notelp: data.notelp,
      role: data.role,
    },
  });

  // response success
  return NextResponse.json(
    {
      message: "Data berhasil disimpan",
      success: true,
    },
    {
      status: 201,
    },
  );
};
