import { NextResponse } from "next/server";

// GET semua laporan lost
export async function GET() {
  // data semua laporan sama laporan include relasi
  const reports = await prisma.lostReport.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          notelp: true,
          role: true,
        },
      },
      // relasi ke foundreport (jika sudah dicocokkan dengan barang temuan)
      foundReport: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  // response success
    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data laporan",
      data: reports,
    });
}
