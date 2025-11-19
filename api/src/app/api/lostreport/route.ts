import { NextResponse } from "next/server";

// GET semua laporan lost
export async function GET() {
  try {
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
    // response error
  } catch (error) {
    console.error("Error fetching lost reports:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data laporan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
