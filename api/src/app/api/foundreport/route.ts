import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// buat fungsi GET
export async function GET() {
  try {
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
    //   Response Success
    return NextResponse.json({
      success: true,
      message: "Berhasil mengambil data barang temuan",
      data: reports,
    },
  {
      status: 200
  });
    // Response Error
  } catch (error) {
    console.error("Error fetching found reports:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data barang temuan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
// BUat fungsi POST
export async function POST(req: Request) {
    try {
  const data = await req.json();
  const { namaBarang, deskripsi, lokasiTemu, adminId, lostReportId } = data;

  // validasi input data
  if (!namaBarang || !deskripsi || !lokasiTemu || !adminId) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Data tidak lengkap. Pastikan nama barang, deskripsi, lokasi temuan, dan admin ID terisi.",
      },
      { status: 400 }
    );
  }

  //   validasi admin ada atau tidak
  const adminExists = await prisma.user.findUnique({
    where: { id: Number(adminId) },
  });

  if (!adminExists) {
    return NextResponse.json(
      {
        success: false,
        message: "Admin tidak ditemukan",
      },
      { status: 404 }
    );
  }

  if (adminExists.role !== "ADMIN") {
    return NextResponse.json(
      {
        success: false,
        message:
          "Pengguna ini bukan admin. Hanya admin yang dapat membuat laporan barang temuan.",
      },
      { status: 403 }
    );
  }

  // Validasi lostReportId jika ada
  if (lostReportId) {
    const lostReportExists = await prisma.lostReport.findUnique({
      where: { id: Number(lostReportId) },
    });

    if (!lostReportExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Laporan barang hilang tidak ditemukan",
        },
        { status: 404 }
      );
    }
    // Cek apakah lostReport sudah memiliki foundReport
    const alreadyMatched = await prisma.foundReport.findUnique({
      where: { lostReportId: Number(lostReportId) },
    });

    if (alreadyMatched) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Laporan barang hilang ini sudah memiliki pasangan barang temuan",
        },
        { status: 409 }
      );
    }
  }

  //   create report
  const report = await prisma.foundReport.create({
      data: {
        namaBarang: namaBarang.trim(),
        deskripsi: deskripsi.trim(),
        lokasiTemu: lokasiTemu.trim(),
        adminId: Number(adminId),
        lostReportId: lostReportId ? Number(lostReportId) : null
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true
          }
        },
        lostReport: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                notelp: true
              }
            }
          }
        }
      }
    });
    // Response Success
    return NextResponse.json(
      {
        success: true,
        message: "Laporan barang temuan berhasil dibuat",
        data: report
      },
      { status: 201 }
    );
    // response error
  } catch (error) {
    console.error("Error creating found report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat laporan barang temuan",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
