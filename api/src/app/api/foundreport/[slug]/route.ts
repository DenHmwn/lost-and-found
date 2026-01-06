import prisma from "@/lib/prisma";
import { StatusReport } from "@prisma/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SECRET } from "@/lib/secret";
import { jwtVerify } from "jose";

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
    // ambil data dari header
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Terjadi kesalahan, silakan login ulang" },
        { status: 401 }
      );
    }

    const { payload } = await jwtVerify(token, SECRET);
    const currentAdminId = Number(payload.id);
    const currentRole = String(payload.role);

    // Cek Role ADMIN
    if (currentRole !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Hanya Admin yang boleh mengedit." },
        { status: 403 }
      );
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

    // cek pemilik laporan
    if (existingRecord.adminId !== currentAdminId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Anda tidak memiliki izin untuk mengedit laporan Admin lain.",
        },
        { status: 403 }
      );
    }

    // Validasi admin ada atau tidaknya dan adalah ADMIN role
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
        lostReportId:
          data.lostReportId !== undefined
            ? data.lostReportId
              ? Number(data.lostReportId)
              : null
            : existingRecord.lostReportId,
        statusReport: data.statusReport || existingRecord.statusReport,
      },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            notelp: true,
          },
        },
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

    return NextResponse.json(
      {
        success: true,
        message: "Data barang temuan berhasil diubah",
        data: updatedReport,
      },
      { status: 200 }
    );
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

    const headerId =
      request.headers.get("user-id") ?? request.headers.get("userId");
    const headerRole =
      request.headers.get("user-role") ?? request.headers.get("userRole");

    if (!headerId) {
      return NextResponse.json(
        { success: false, message: "Anda belum login, silahkan login" },
        { status: 401 }
      );
    }

    const currentAdminId = Number(headerId);

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

    if (headerRole !== "ADMIN" || existingRecord.adminId !== currentAdminId) {
      return NextResponse.json(
        {
          success: false,
          message: "Anda tidak berhak menghapus laporan ini.",
        },
        { status: 403 }
      );
    }

    await prisma.foundReport.delete({
      where: { id },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Data barang temuan berhasil dihapus",
      },
      { status: 200 }
    );
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
