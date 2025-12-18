import prisma from "@/lib/prisma";
import { StatusReport } from "@prisma/client";
import { NextResponse } from "next/server";

// buat Fungsi GET
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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

    //  laporan by id
    const report = await prisma.foundReport.findUnique({
      where: { id },
      include: {
        // include sama data admin
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
            role: true,
          },
        },
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
    });

    // cek jika data tidak ditemukan
    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Data barang temuan tidak ditemukan",
        },
        { status: 404 }
      );
    }
    // response jika data ditemukan
    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data barang temuan",
        data: report,
      },
      { status: 200 }
    );
    // response error
  } catch (error) {
    console.error("Error fetching found report:", error);
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

// Fungsi PUT di foundreport
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await request.json();

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

    // Validasi input required
    // if (
    //   !data.namaBarang ||
    //   !data.deskripsi ||
    //   !data.lokasiTemu ||
    //   !data.adminId
    // ) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Data tidak lengkap. Pastikan semua field terisi.",
    //     },
    //     { status: 400 }
    //   );
    // }

    // Cek request apakah bertujuan mengedit detail barang
    const isEditingItem =
      data.namaBarang !== undefined ||
      data.deskripsi !== undefined ||
      data.lokasiTemu !== undefined;

    // jika sedang edit item, cek apakah semua field terisi
    if (isEditingItem) {
      if (
        !data.namaBarang ||
        !data.deskripsi ||
        !data.lokasiTemu
        // adminId cek secara terpisah
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Data tidak lengkap. Pastikan semua field terisi saat mengedit barang.",
          },
          { status: 400 }
        );
      }
    }

    // Cek apakah record ada
    const existingRecord = await prisma.foundReport.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Data barang temuan tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // Validasi admin ada atau tidaknya dan adalah ADMIN role
    // const adminExists = await prisma.user.findUnique({
    //   where: { id: Number(data.adminId) },
    // });
    // if (!adminExists) {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "Admin tidak ditemukan",
    //     },
    //     { status: 404 }
    //   );
    // }
    // if (adminExists.role !== "ADMIN") {
    //   return NextResponse.json(
    //     {
    //       success: false,
    //       message: "User bukan admin",
    //     },
    //     { status: 403 }
    //   );
    // }

    // Hanya cek admin jika data adminId dikirim oleh frontend
    if (data.adminId) {
      const adminExists = await prisma.user.findUnique({
        where: { id: Number(data.adminId) },
      });
      if (!adminExists) {
        return NextResponse.json(
          { success: false, message: "Admin tidak ditemukan" },
          { status: 404 }
        );
      }
      if (adminExists.role !== "ADMIN") {
        return NextResponse.json(
          { success: false, message: "User bukan admin" },
          { status: 403 }
        );
      }
    }

    // Validasi statusReport jika dikirim
    if (
      data.statusReport &&
      !Object.values(StatusReport).includes(data.statusReport)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status report tidak valid. Gunakan: Done, OnProgress, Closed",
        },
        { status: 400 }
      );
    }
    // Validasi lostReportId jika ada dan berubah
    if (data.lostReportId !== undefined && data.lostReportId !== null) {
      const lostReportExists = await prisma.lostReport.findUnique({
        where: { id: Number(data.lostReportId) },
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
      // Cek apakah lostReport sudah memiliki foundReport lain
      if (existingRecord.lostReportId !== Number(data.lostReportId)) {
        const alreadyMatched = await prisma.foundReport.findUnique({
          where: { lostReportId: Number(data.lostReportId) },
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
    }
    // Update data pake ternary operator
    const updatedReport = await prisma.foundReport.update({
      where: { id },
      data: {
        namaBarang: data.namaBarang
          ? data.namaBarang.trim()
          : existingRecord.namaBarang,
        deskripsi: data.deskripsi
          ? data.deskripsi.trim()
          : existingRecord.deskripsi,
        lokasiTemu: data.lokasiTemu
          ? data.lokasiTemu.trim()
          : existingRecord.lokasiTemu,

        // Update Admin ID (pakai baru jika ada, jika tidak pakai lama)
        adminId: data.adminId ? Number(data.adminId) : existingRecord.adminId,

        // Update lostReportId (bisa null jika ingin unlink, atau pakai lama jika undefined)
        lostReportId:
          data.lostReportId !== undefined
            ? data.lostReportId
              ? Number(data.lostReportId)
              : null
            : existingRecord.lostReportId,

        // Update statusReport jika dikirim, jika tidak pakai yang lama
        statusReport: data.statusReport || existingRecord.statusReport,
      },
      include: {
        // Return data admin (tanpa password)
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
          },
        },
        // Return data lostReport jika ada
        lostReport: {
          include: {
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
    });
    // response success
    return NextResponse.json(
      {
        success: true,
        message: "Data barang temuan berhasil diubah",
        data: updatedReport,
      },
      {
        status: 200,
      }
    );
    // response error
  } catch (error) {
    console.error("Error updating found report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengubah data barang temuan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// DELETE found report
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
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
    // Cek apakah data nya ada
    const existingRecord = await prisma.foundReport.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Data barang temuan tidak ditemukan",
        },
        { status: 404 }
      );
    }
    // Delete data
    await prisma.foundReport.delete({
      where: { id },
    });
    // response success
    return NextResponse.json(
      {
        success: true,
        message: "Data barang temuan berhasil dihapus",
      },
      {
        status: 200,
      }
    );
    // response error
  } catch (error) {
    console.error("Error deleting found report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus data barang temuan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
