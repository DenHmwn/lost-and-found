"use client";
import {
  CheckCircle,
  Package,
  Search,
  User,
} from "lucide-react";
import { AppSidebarUser } from "../AppSidebarUser";
import { SiteHeader } from "../SiteHeader";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import SkeletonDasboard from "../SkeletonDashboard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import StatsGrid from "../dashboard/StatsGrid";
import { StatsCardConfigTypes } from "@/types/Dashboards";

export default function DashboardUser() {
  const { stats, recentItems, successRate, isLoading } = useDashboardStats();

  const statsConfig: StatsCardConfigTypes[] = [
    {
      title: "Total Barang Hilang",
      value: stats.totalLost,
      change: `+${stats.lostToday} hari ini`,
      icon: Search,
      color: "bg-red-500",
      lightBg: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Total Barang Ditemukan",
      value: stats.totalFound,
      change: `+${stats.foundToday} hari ini`,
      icon: Package,
      color: "bg-blue-500",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Berhasil Dikembalikan",
      value: stats.claimed,
      change: `${successRate}% dari total`,
      icon: CheckCircle,
      color: "bg-green-500",
      lightBg: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Total User",
      value: stats.totalUsers,
      change: "Pengguna aktif",
      icon: User,
      color: "bg-purple-500",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  if (isLoading) {
    return <SkeletonDasboard />;
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
          <section className="@container/main flex flex-1 flex-col gap-2">
            <section className="min-h-screen bg-gray-50">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 px-6 py-4">
                <section className="flex items-center justify-between">
                  <section>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Dashboard User
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                      Selamat datang kembali
                    </p>
                  </section>
                  <section className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </section>
                </section>
              </header>
              {/* Main Content */}
              <article>
                <section className="p-6">
                  {/* Stats Grid */}
                  <StatsGrid statsConfig={statsConfig} />
                  {/* Recent Activity */}
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Items List */}
                    <RecentActivity recentItems={recentItems} />
                    {/* Quick Stats */}
                    <section className="space-y-6">
                      {/* Success Rate */}
                      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Tingkat Keberhasilan
                        </h3>
                        <section className="flex items-center justify-center">
                          <section className="relative w-32 h-32">
                            <svg className="w-32 h-32 transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#e5e7eb"
                                strokeWidth="12"
                                fill="none"
                              />
                              <circle
                                cx="64"
                                cy="64"
                                r="56"
                                stroke="#10b981"
                                strokeWidth="12"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 56 * (successRate / 100)} ${2 * Math.PI * 56}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <section className="absolute inset-0 flex items-center justify-center">
                              <span className="text-3xl font-bold text-gray-900">
                                {successRate}%
                              </span>
                            </section>
                          </section>
                        </section>
                        <p className="text-center text-sm text-gray-600 mt-4">
                          {stats.claimed} dari {stats.totalFound} barang
                          berhasil dikembalikan
                        </p>
                      </section>
                      {/* Quick Actions */}
                      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Aksi Cepat
                        </h3>
                        <section className="space-y-3">
                          <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                            onClick={() => router.push("/homepage/user/lost")}
                          >
                            Lihat Laporan Hilang
                          </Button>
                          <Button
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                            onClick={() =>
                              router.push("/homepage/user/list-admin")
                            }
                          >
                            Lihat Admin
                          </Button>
                        </section>
                      </section>
                    </section>
                  </section>
                </section>
              </article>
            </section>
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
