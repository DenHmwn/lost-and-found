import prisma from "@/lib/prisma";
import { StatusReport } from "@prisma/client";
import { NextResponse } from "next/server";

// get found report by id
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

    const report = await prisma.foundReport.findUnique({
      where: { id },
      include: {
        admin: {
          select: { id: true, name: true, email: true, notelp: true, role: true },
        },
        lostReport: {
          include: {
            user: { select: { id: true, name: true, email: true, notelp: true } },
          },
        },
      },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, message: "Data barang temuan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data barang temuan",
        data: report,
      },
      { status: 200 }
    );
  } catch (error) {
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

// Put found report by id
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

    if (!data.namaBarang || !data.deskripsi || !data.lokasiTemu || !data.adminId) {
      return NextResponse.json(
        { success: false, message: "Data tidak lengkap. Pastikan semua field terisi." },
        { status: 400 }
      );
    }

    const existingRecord = await prisma.foundReport.findUnique({ where: { id } });
    if (!existingRecord) {
      return NextResponse.json(
        { success: false, message: "Data barang temuan tidak ditemukan" },
        { status: 404 }
      );
    }

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

    if (data.statusReport && !Object.values(StatusReport).includes(data.statusReport)) {
      return NextResponse.json(
        { success: false, message: "Status report tidak valid" },
        { status: 400 }
      );
    }

    if (data.lostReportId !== undefined && data.lostReportId !== null) {
      const lostReportExists = await prisma.lostReport.findUnique({
        where: { id: Number(data.lostReportId) },
      });

      if (!lostReportExists) {
        return NextResponse.json(
          { success: false, message: "Laporan barang hilang tidak ditemukan" },
          { status: 404 }
        );
      }
    }

    if (existingRecord.lostReportId !== Number(data.lostReportId)) {
      const alreadyMatched = await prisma.foundReport.findUnique({
        where: { lostReportId: Number(data.lostReportId) },
      });

      if (alreadyMatched) {
        return NextResponse.json(
          {
            success: false,
            message: "Laporan barang hilang ini sudah memiliki pasangan barang temuan",
          },
          { status: 409 }
        );
      }
    }

    const updatedReport = await prisma.foundReport.update({
      where: { id },
      data: {
        namaBarang: data.namaBarang.trim(),
        deskripsi: data.deskripsi.trim(),
        lokasiTemu: data.lokasiTemu.trim(),
        adminId: Number(data.adminId),
        lostReportId: data.lostReportId ? Number(data.lostReportId) : null,
        statusReport: data.statusReport || existingRecord.statusReport,
      },
      include: {
        admin: { select: { id: true, name: true, email: true, notelp: true } },
        lostReport: {
          include: {
            user: { select: { id: true, name: true, email: true, notelp: true } },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Data barang temuan berhasil diubah",
        data: updatedReport,
      },
      { status: 200 }
    );
  } catch (error) {
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

// Delete found report by id
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

    const existingRecord = await prisma.foundReport.findUnique({ where: { id } });
    if (!existingRecord) {
      return NextResponse.json(
        { success: false, message: "Data barang temuan tidak ditemukan" },
        { status: 404 }
      );
    }

    await prisma.foundReport.delete({ where: { id } });

    return NextResponse.json(
      {
        success: true,
        message: "Data barang temuan berhasil dihapus",
      },
      { status: 200 }
    );
  } catch (error) {
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
