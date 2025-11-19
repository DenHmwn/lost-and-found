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
}
