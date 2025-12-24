import prisma from "@/lib/prisma";
import { LostStatus, StatusReport } from "@prisma/client";
import { NextResponse } from "next/server";

// buat fungsi GET by id
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
    // jika laporan tidak ditemukan
    if (!report) {
      return NextResponse.json(
        {
          success: false,
          message: "Data laporan tidak ditemukan",
        },
        { status: 404 }
      );
    }
    // response success
    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data laporan",
        data: report,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error fetching lost report:", error);
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

// PUT lostreport by id
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

    const headerId = request.headers.get("user-id");
    if (!headerId) {
      return NextResponse.json(
        { success: false, message: "Terjadi kesalahan, Silakan login ulang" },
        { status: 401 }
      );
    }

    const currentUserId = Number(headerId);

    // Validasi input
    /* if (
      !data.namaBarang ||
      !data.deskripsi ||
      !data.lokasiHilang ||
      !data.userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap. Pastikan semua field terisi.",
        },
        { status: 400 }
      );
    } 
    */

    // Cek request
    const isEditingItem =
      data.namaBarang !== undefined ||
      data.deskripsi !== undefined ||
      data.lokasiHilang !== undefined;

    // JIKA sedang edit item, cek semua field
    if (isEditingItem) {
      if (
        !data.namaBarang ||
        !data.deskripsi ||
        !data.lokasiHilang
        // userId cek secara terpisah
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

    // Validasi status jika ada
    if (data.status && !Object.values(LostStatus).includes(data.status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status tidak valid. Gunakan: PENDING, APPROVED, atau REJECTED",
        },
        { status: 400 }
      );
    }
    // Validasi statusReport jika ada
    if (
      data.statusReport &&
      !Object.values(StatusReport).includes(data.statusReport)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status Report tidak valid. Gunakan: Done, OnProgress, atau Closed",
        },
        { status: 400 }
      );
    }
    // Cek apakah record ada atau tidak
    const existingRecord = await prisma.lostReport.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Data laporan tidak ditemukan",
        },
        { status: 404 }
      );
    }

    // cek apakah user yang request pemilik laporan
    if (existingRecord.userId !== currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak memiliki izin untuk mengedit laporan ini.",
        },
        { status: 403 }
      );
    }
    /*
    const userExists = await prisma.user.findUnique({
      where: { id: Number(data.userId) },
    });

    if (!userExists) {
      return NextResponse.json(
        {
          success: false,
          message: "User tidak ditemukan",
        },
        { status: 404 }
      );
    }
    */
    // cek user jika id user
    if (data.userId) {
      const userExists = await prisma.user.findUnique({
        where: { id: Number(data.userId) },
      });

      if (!userExists) {
        return NextResponse.json(
          { success: false, message: "User tidak ditemukan" },
          { status: 404 }
        );
      }
    }
    /*
    const updatedReport = await prisma.lostReport.update({
      where: { id },
      data: {
        namaBarang: data.namaBarang.trim(),
        deskripsi: data.deskripsi.trim(),
        lokasiHilang: data.lokasiHilang.trim(),
        status: data.status || existingRecord.status,
        statusReport: data.statusReport || existingRecord.statusReport,
        userId: Number(data.userId),
      },
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
    });
    */
    // Menggunakan ternary operator: Jika data baru dikirim -> Pakai data baru. Jika tidak -> Pakai data lama.
    const updatedReport = await prisma.lostReport.update({
      where: { id },
      data: {
        namaBarang: data.namaBarang
          ? data.namaBarang.trim()
          : existingRecord.namaBarang,
        deskripsi: data.deskripsi
          ? data.deskripsi.trim()
          : existingRecord.deskripsi,
        lokasiHilang: data.lokasiHilang
          ? data.lokasiHilang.trim()
          : existingRecord.lokasiHilang,

        // Status & Report tetap logika lama (atau existing)
        status: data.status || existingRecord.status,
        statusReport: data.statusReport || existingRecord.statusReport,

        // UserId update hanya jika ada, jika tidak pakai yang lama
        // userId: data.userId ? Number(data.userId) : existingRecord.userId,
      },
      include: {
        // include data user
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
          },
        },
      },
    });
    // response success
    return NextResponse.json(
      {
        success: true,
        message: "Data laporan berhasil diubah",
        data: updatedReport,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating lost report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengubah data laporan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Delete LostReport by id
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
    // ambil user dari header cookies
    const headerId = request.headers.get("user-id");

    if (!headerId) {
      return NextResponse.json(
        { success: false, message: "Anda belum login, silahkan login" },
        { status: 401 }
      );
    }

    const currentUserId = Number(headerId);

    // Cek apakah data ada atau tidak
    const existingRecord = await prisma.lostReport.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        {
          success: false,
          message: "Data laporan tidak ditemukan",
        },
        { status: 404 }
      );
    }
    if (existingRecord.userId !== currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak bisa menghapus laporan milik orang lain",
        },
        { status: 403 }
      );
    }

    // Delete data
    await prisma.lostReport.delete({
      where: { id },
    });
    // response success
    return NextResponse.json(
      {
        success: true,
        message: "Data laporan berhasil dihapus",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error deleting lost report:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus data laporan",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
