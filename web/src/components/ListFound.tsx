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
} from "lucide-react";
import { useFoundReports } from "@/hooks/useFoundReport";
import { FoundReport } from "@/types/FoundReport";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AppSidebarAdmin } from "@/components/AppSidebarAdmin";
import { formatDate } from "@/lib/scripts";

export default function ListFoundPage() {
  // Fetch data menggunakan custom hook
  const { data: FoundReports = [], error, isLoading } = useFoundReports();

  // Status Report Badge
  const StatusReportBadge = ({
    status,
  }: {
    status: "Done" | "OnProgress" | "Closed";
  }) => {
    const variants = {
      Done: {
        color: "bg-blue-50 text-blue-700 border-blue-200",
        text: "Selesai",
        icon: CheckCircle2,
      },
      OnProgress: {
        color: "bg-orange-50 text-orange-700 border-orange-200",
        text: "Dalam Proses",
        icon: Clock,
      },
      Closed: {
        color: "bg-gray-50 text-gray-700 border-gray-200",
        text: "Ditutup",
        icon: XCircle,
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

  // Stats Cards
  const getStats = () => {
    const total = FoundReports.length;
    const done = FoundReports.filter(
      (r: FoundReport) => r.statusReport === "Done"
    ).length;
    const onProgress = FoundReports.filter(
      (r: FoundReport) => r.statusReport === "OnProgress"
    ).length;
    const closed = FoundReports.filter(
      (r: FoundReport) => r.statusReport === "Closed"
    ).length;
    const matched = FoundReports.filter(
      (r: FoundReport) => r.lostReportId !== null
    ).length;

    return { total, done, onProgress, closed, matched };
  };

  const stats = getStats();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebarAdmin variant="inset" />
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
                    Barang Temu
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola dan pantau semua laporan barang yang ditemukan
                  </p>
                </section>
              </section>
            </header>

            {isLoading ? (
              <section className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
                <section className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Memuat data...
                  </span>
                </section>
              </section>
            ) : error ? (
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
                          Dalam Proses
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                          {stats.onProgress}
                        </p>
                      </section>
                      <section className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </section>
                    </section>
                  </section>

                  <section className="rounded-lg border bg-card p-6 shadow-sm">
                    <section className="flex items-center justify-between">
                      <section>
                        <p className="text-sm font-medium text-muted-foreground">
                          Selesai
                        </p>
                        <p className="mt-2 text-3xl font-bold">{stats.done}</p>
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
                          Tercocok
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                          {stats.matched}
                        </p>
                      </section>
                      <section className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                        <CheckCircle2 className="h-6 w-6 text-purple-600" />
                      </section>
                    </section>
                  </section>
                </section>

                {/* Table */}
                <section className="rounded-lg border bg-card shadow-sm">
                  <section className="border-b bg-muted/50 px-6 py-4">
                    <h2 className="font-semibold">
                      Daftar Laporan Barang Temu
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Total {FoundReports.length} laporan barang yang ditemukan
                    </p>
                  </section>

                  <section className="overflow-x-auto">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="border-b bg-muted/30">
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Info Barang
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Lokasi Temu
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Admin/Pelapor
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Status
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Tanggal
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="sectionide-y sectionide-border">
                        {FoundReports.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="px-6 py-16 text-center"
                            >
                              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                              <p className="mt-4 font-medium text-muted-foreground">
                                Belum ada laporan
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Laporan barang yang ditemukan akan muncul di
                                sini
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          FoundReports.map((report: FoundReport) => (
                            <TableRow
                              key={report.id}
                              className="transition-colors hover:bg-muted/50"
                            >
                              <TableCell className="px-6 py-4">
                                <section className="flex items-start gap-3">
                                  <section className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Package className="h-5 w-5 text-primary" />
                                  </section>
                                  <section className="min-w-0 flex-1">
                                    <p className="font-medium text-sm">
                                      {report.namaBarang}
                                    </p>
                                    {/* <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                      {report.deskripsi}
                                    </p> */}
                                    {report.lostReportId && (
                                      <span className="inline-flex items-center gap-1 mt-1 text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Tercocok dengan laporan #
                                        {report.lostReportId}
                                      </span>
                                    )}
                                  </section>
                                </section>
                              </TableCell>
                              <TableCell className="px-6 py-4">
                                <section className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {report.lokasiTemu}
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
                                      {report.admin.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {report.admin.notelp}
                                    </p>
                                  </section>
                                </section>
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
                                    {formatDate(report.createdAt)}
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
