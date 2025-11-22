"use client";

import { AppSidebar } from "@/components/AppSidebar";
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

interface User {
  id: number;
  name: string;
  email: string;
  notelp: string;
}

interface FoundReport {
  id: number;
  namaBarang: string;
  deskripsi: string;
  lokasiTemu: string;
  statusReport: "Done" | "OnProgress" | "Closed";
  createdAt: string;
  admin: User;
  lostReportId: number | null;
}

export default function ListBarangTemuPage() {
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

  // Format Date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-6 p-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">
                    Barang Temu
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Kelola dan pantau semua laporan barang yang ditemukan
                  </p>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">
                    Memuat data...
                  </span>
                </div>
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
                <XCircle className="mx-auto h-10 w-10 text-red-600 mb-2" />
                <p className="font-medium text-red-900">Gagal memuat data</p>
                <p className="text-sm text-red-700 mt-1">
                  Silakan coba refresh halaman atau hubungi administrator
                </p>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Total Laporan
                        </p>
                        <p className="mt-2 text-3xl font-bold">{stats.total}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Dalam Proses
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                          {stats.onProgress}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Selesai
                        </p>
                        <p className="mt-2 text-3xl font-bold">{stats.done}</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Tercocok
                        </p>
                        <p className="mt-2 text-3xl font-bold">
                          {stats.matched}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                        <CheckCircle2 className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-lg border bg-card shadow-sm">
                  <div className="border-b bg-muted/50 px-6 py-4">
                    <h2 className="font-semibold">
                      Daftar Laporan Barang Temu
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Total {FoundReports.length} laporan barang yang ditemukan
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/30">
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Info Barang
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Lokasi Temu
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Admin/Pelapor
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Tanggal
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {FoundReports.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-16 text-center">
                              <Package className="mx-auto h-12 w-12 text-muted-foreground/50" />
                              <p className="mt-4 font-medium text-muted-foreground">
                                Belum ada laporan
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Laporan barang yang ditemukan akan muncul di
                                sini
                              </p>
                            </td>
                          </tr>
                        ) : (
                          FoundReports.map((report: FoundReport) => (
                            <tr
                              key={report.id}
                              className="transition-colors hover:bg-muted/50"
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Package className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="min-w-0 flex-1">
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
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {report.lokasiTemu}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                    <User className="h-4 w-4 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      {report.admin.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {report.admin.notelp}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <StatusReportBadge
                                  status={report.statusReport}
                                />
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  <span className="text-xs">
                                    {formatDate(report.createdAt)}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
