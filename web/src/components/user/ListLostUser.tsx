"use client";

import { SiteHeader } from "@/components/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  MapPin,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import { useLostReports } from "@/hooks/useLostReport";
import { LostReport } from "@/types/LostReport";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate, formatTimeAgo } from "@/lib/scripts";
import { AppSidebarUser } from "../AppSidebarUser";
import SkeletonListItem from "../SkeletonListItem";

export default function ListLostUser() {
  // Fetch data menggunakan custom hook
  const { data: lostReports = [], error, isLoading } = useLostReports();

  // Status Badge Component
  const StatusBadge = ({
    status,
  }: {
    status: "PENDING" | "APPROVED" | "REJECTED";
  }) => {
    const variants = {
      PENDING: {
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        icon: Clock,
        text: "Pending",
      },
      APPROVED: {
        color: "bg-green-50 text-green-700 border-green-200",
        icon: CheckCircle2,
        text: "Disetujui",
      },
      REJECTED: {
        color: "bg-red-50 text-red-700 border-red-200",
        icon: XCircle,
        text: "Ditolak",
      },
    };

    const variant = variants[status];
    const Icon = variant.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-medium ${variant.color}`}
      >
        <Icon className="h-3.5 w-3.5" />
        {variant.text}
      </span>
    );
  };

  // Status Report Badge
  const StatusReportBadge = ({
    status,
  }: {
    status: "Done" | "OnProgress" | "Closed";
  }) => {
    const variants = {
      Done: {
        color: "bg-green-50 text-green-700 border-green-200",
        text: "Selesai",
      },
      OnProgress: {
        color: "bg-yellow-50 text-yellow-600 border-yellow-200",
        text: "Dalam Proses",
      },
      Closed: {
        color: "bg-red-50 text-red-700 border-red-200",
        text: "Ditutup",
      },
    };

    const variant = variants[status];

    return (
      <span
        className={`inline-flex items-center rounded-lg border px-3 py-1 text-xs font-medium ${variant.color}`}
      >
        {variant.text}
      </span>
    );
  };

  // Stats Cards
  const getStats = () => {
    const total = lostReports.length;
    const pending = lostReports.filter(
      (r: LostReport) => r.status === "PENDING"
    ).length;
    const approved = lostReports.filter(
      (r: LostReport) => r.status === "APPROVED"
    ).length;
    const onProgress = lostReports.filter(
      (r: LostReport) => r.statusReport === "OnProgress"
    ).length;

    return { total, pending, approved, onProgress };
  };

  const stats = getStats();

  if (isLoading) {
    return <SkeletonListItem />;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebarUser variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <section className="flex flex-1 flex-col">
          <section className="@container/main flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <header className="space-y-2">
              <section className="flex items-center gap-2">
                <section className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </section>
                <section>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Barang Hilang
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola dan pantau semua laporan barang hilang
                  </p>
                </section>
              </section>
            </header>

            {error ? (
              <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                <XCircle className="mx-auto h-10 w-10 text-red-600 mb-2" />
                <p className="font-medium text-red-900">Gagal memuat data</p>
                <p className="text-sm text-red-700 mt-1">
                  Silakan coba refresh halaman atau hubungi administrator
                </p>
              </section>
            ) : (
              <article>
                {/* Stats Cards */}
                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <section className="rounded-lg border bg-card p-6 shadow-sm">
                    <section className="flex items-center justify-between">
                      <section>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Laporan
                        </p>
                        <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                      </section>
                      <section className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <Package className="h-6 w-6 text-blue-600" />
                      </section>
                    </section>
                  </section>

                  <section className="rounded-lg border bg-card p-6 shadow-sm">
                    <section className="flex items-center justify-between">
                      <section>
                        <p className="text-sm font-medium text-muted-foreground">
                          Menunggu Approval
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                          {stats.pending}
                        </p>
                      </section>
                      <section className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                        <Clock className="h-6 w-6 text-yellow-600" />
                      </section>
                    </section>
                  </section>

                  <section className="rounded-lg border bg-card p-6 shadow-sm">
                    <section className="flex items-center justify-between">
                      <section>
                        <p className="text-sm font-medium text-muted-foreground">
                          Disetujui
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                          {stats.approved}
                        </p>
                      </section>
                      <section className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </section>
                    </section>
                  </section>

                  <section className="rounded-lg border bg-card p-6 shadow-sm">
                    <section className="flex items-center justify-between">
                      <section>
                        <p className="text-sm font-medium text-muted-foreground">
                          Dalam Proses
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                          {stats.onProgress}
                        </p>
                      </section>
                      <section className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                        <Loader2 className="h-6 w-6 text-orange-600" />
                      </section>
                    </section>
                  </section>
                </section>

                {/* Table */}
                <section className="rounded-lg border bg-card shadow-sm">
                  <section className="border-b bg-muted/50 px-6 py-4">
                    <h2 className="font-semibold">Daftar Laporan</h2>
                    <p className="text-sm text-muted-foreground">
                      Total {lostReports.length} laporan barang hilang
                    </p>
                  </section>

                  <section className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="border-b bg-muted/30">
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            No Laporan
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Info Barang
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Lokasi
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Pelapor
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Status
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Status Laporan
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Tanggal Kehilangan
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Tanggal Laporan
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="sectionide-y sectionide-border">
                        {lostReports.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="px-6 py-16 text-center"
                            >
                              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                              <p className="mt-4 font-medium text-muted-foreground">
                                Belum ada laporan
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Laporan barang hilang akan muncul di sini
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          lostReports.map((report: LostReport) => (
                            <TableRow
                              key={report.id}
                              className="transition-colors hover:bg-muted/50"
                            >
                              <TableCell className="px-6 py-4">
                                <section className="flex items-center gap-2">
                                  <Tag className="h-4 w-4" />
                                  <span className="text-sm">{report.id}</span>
                                </section>
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <section className="flex items-start gap-3">
                                  <section className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Package className="h-5 w-5 text-primary" />
                                  </section>
                                  <section className="min-w-0 flex-1">
                                    <p className="font-medium text-sm">
                                      {report.namaBarang}
                                    </p>
                                    <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                      {report.deskripsi}
                                    </p>
                                  </section>
                                </section>
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <section className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {report.lokasiHilang}
                                  </span>
                                </section>
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <section className="flex items-center gap-2">
                                  <section className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-4 w-4 text-primary" />
                                  </section>
                                  <section>
                                    <p className="text-sm font-medium">
                                      {report.user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {report.user.notelp}
                                    </p>
                                  </section>
                                </section>
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <StatusBadge status={report.status} />
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <StatusReportBadge
                                  status={report.statusReport}
                                />
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <section className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-xs">
                                    {formatDate(report.tanggalHilang, report.waktuHilang)}
                                  </span>
                                </section>
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <section className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-xs">
                                    {formatTimeAgo(report.createdAt)}
                                  </span>
                                </section>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </section>
                </section>
              </article>
            )}
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
