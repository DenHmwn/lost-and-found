import prisma from "@/lib/prisma";
import { LostStatus, StatusReport } from "@prisma/client";
import { NextResponse } from "next/server";

// GET LOST REPORT BY ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const id = Number(slug);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const report = await prisma.lostReport.findUnique({
      where: { id },
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
        foundReport: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Data laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data laporan",
        data: report,
      },
      { status: 200 }
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

// UPDATE LOST REPORT BY ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const data = await request.json();

    const id = Number(slug);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    if (
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

    if (
      data.statusReport &&
      !Object.values(StatusReport).includes(data.statusReport)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "StatusReport tidak valid. Gunakan: Done, OnProgress, atau Closed",
        },
        { status: 400 }
      );
    }

    const existingRecord = await prisma.lostReport.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, message: "Data laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: { id: Number(data.userId) },
    });

    if (!userExists) {
      return NextResponse.json(
        { success: false, message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

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

    return NextResponse.json(
      {
        success: true,
        message: "Data laporan berhasil diubah",
        data: updatedReport,
      },
      { status: 200 }
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

// DELETE LOST REPORT BY ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const id = Number(slug);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: "ID tidak valid" },
        { status: 400 }
      );
    }

    const existingRecord = await prisma.lostReport.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return NextResponse.json(
        { success: false, message: "Data laporan tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.lostReport.delete({ where: { id } });

    return NextResponse.json(
      {
        success: true,
        message: "Data laporan berhasil dihapus",
      },
      { status: 200 }
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
