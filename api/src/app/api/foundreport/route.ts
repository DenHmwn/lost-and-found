import prisma from "@/lib/prisma";

// GET all found reports
export async function GET() {
  const reports = await prisma.foundReport.findMany({
    include: {
      // rellasi ke admin yang buat laporan temu
      admin: {
        select: {
          id: true,
          name: true,
          email: true,
          notelp: true,
          role: true,
        },
      },
      // relasi ke lostreport (jika udah di cocokkan)
      lostReport: {
        include: {
          // include sama data user yang kehilangan barang
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              notelp: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
