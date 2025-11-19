import { NextResponse } from "next/server";

// buat fungsi GET by id
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    // Validasi ID
    const id = Number(slug);
    if (isNaN(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "ID tidak valid",
        },
        { status: 400 }
      );
    }
    // laporan by id
    const report = await prisma.lostReport.findUnique({
      where: { id },
      include: {
        // include yang melaporkan
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
            role: true,
          },
        },
        // include barang temuan jika sudah dicocokkan
        foundReport: true,
      },
    });
}