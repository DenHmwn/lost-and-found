import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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
    return NextResponse.json(
      {
        success: true,
        message: "Berhasil mengambil data barang temuan",
        data: reports,
      },
      {
        status: 200,
      }
    );
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
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // pastikan request JSON
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ success: false, message: "Request harus berupa JSON." }, { status: 415 });
    }

    const data = await req.json();

    const namaBarang = String(data?.namaBarang ?? data?.itemname ?? data?.itemName ?? "").trim();
    const deskripsi = String(data?.deskripsi ?? data?.description ?? "").trim();
    const lokasiTemu = String(data?.lokasiTemu ?? data?.meetingLocation ?? data?.["meeting location"] ?? data?.meeting_location ?? "").trim();
    const tanggal = String(data?.tanggal ?? data?.meetingdate ?? data?.meetingDate ?? data?.["meeting date"] ?? data?.meeting_date ?? "").trim();
    const waktu = String(data?.waktu ?? data?.meetingtime ?? data?.meetingTime ?? data?.["meeting time"] ?? data?.meeting_time ?? "").trim();

    // lostReportId opsional
    const lostReportIdRaw = data?.lostReportId;

    // Ambil id admin & role dari header middleware
    const headerId = req.headers.get("userId") || req.headers.get("user-id") || req.headers.get("user_id");

    const headerUserRole = req.headers.get("userRole") || req.headers.get("user-role") || req.headers.get("user_role");

    // validasi auth
    if (!headerId || !headerUserRole) {
      return NextResponse.json({ success: false, message: "Unauthorized: Silakan login ulang" }, { status: 401 });
    }

    // Validasi Role ADMIN
    if (headerUserRole !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Akses Ditolak. Hanya ADMIN yang dapat membuat laporan temuan.",
        },
        { status: 403 }
      );
    }

    // validasi input wajib
    if (!namaBarang || !deskripsi || !lokasiTemu || !tanggal || !waktu) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak lengkap. Pastikan nama barang, deskripsi, lokasi temuan, tanggal, dan waktu terisi.",
        },
        { status: 400 }
      );
    }

    // validasi adminId harus angka
    const adminId = Number(headerId);
    if (!Number.isFinite(adminId)) {
      return NextResponse.json({ success: false, message: "Admin ID tidak valid (bukan angka)." }, { status: 400 });
    }

    // Pastikan admin ada di database dan rolenya ADMIN
    const admin = await prisma.user.findUnique({
      where: { id: adminId },
      select: { id: true, role: true },
    });
    if (!admin) {
      return NextResponse.json({ success: false, message: "Admin tidak ditemukan. Silakan login ulang." }, { status: 401 });
    }
    if (admin.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Akses Ditolak. Hanya ADMIN yang dapat membuat laporan temuan." }, { status: 403 });
    }

    // Validasi format waktu (HH:mm)
    const timeOk = /^([01]\d|2[0-3]):[0-5]\d$/.test(waktu);
    if (!timeOk) {
      return NextResponse.json({ success: false, message: "Format waktu tidak valid. Gunakan HH:mm" }, { status: 400 });
    }

    // Validasi dan parsing tanggal
    const tanggalTemu = new Date(tanggal);
    if (Number.isNaN(tanggalTemu.getTime())) {
      return NextResponse.json({ success: false, message: "Format tanggal tidak valid." }, { status: 400 });
    }

    // Normalisasi lostReportId (optional)
    let lostReportId: number | null = null;
    if (lostReportIdRaw !== undefined && lostReportIdRaw !== null && lostReportIdRaw !== "") {
      const parsed = Number(lostReportIdRaw);
      if (!Number.isFinite(parsed)) {
        return NextResponse.json({ success: false, message: "lostReportId tidak valid (bukan angka)." }, { status: 400 });
      }
      lostReportId = parsed;

      // cek lostReport exists
      const lostReportExists = await prisma.lostReport.findUnique({
        where: { id: lostReportId },
      });

      if (!lostReportExists) {
        return NextResponse.json({ success: false, message: "Laporan barang hilang tidak ditemukan" }, { status: 404 });
      }

      // cek apakah lostReport sudah punya pasangan foundReport
      //  gunakan findFirst agar tidak error jika lostReportId tidak UNIQUE di schema
      const alreadyMatched = await prisma.foundReport.findUnique({
        where: { lostReportId },
        select: { id: true },
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

    // create report
    const report = await prisma.foundReport.create({
      data: {
        namaBarang,
        deskripsi,
        lokasiTemu,
        adminId,
        lostReportId, // null jika tidak ada
        tanggalTemu,
        waktuTemu: waktu,
      },
      include: {
        admin: {
          select: { id: true, name: true, email: true, notelp: true },
        },
        lostReport: lostReportId
          ? {
              include: {
                user: { select: { id: true, name: true, email: true, notelp: true } },
              },
            }
          : false,
      },
    });

    return NextResponse.json({ success: true, message: "Laporan barang temuan berhasil dibuat", data: report }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating found report:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json({ success: false, message: "Gagal membuat laporan barang temuan", error: msg }, { status: 500 });
  }
}
