"use client";
import { AppSidebarAdmin } from "@/components/AppSidebarAdmin";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { CheckCircle, Package, Search, User } from "lucide-react";
import SkeletonDasboard from "../SkeletonDashboard";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import StatsGrid from "../dashboard/StatsGrid";
import RecentActivity from "../dashboard/RecentActivity";
import { StatsCardConfigTypes } from "@/types/Dashboards";
import SuccessRate from "../dashboard/SuccessRate";

export default function DashboardAdmin() {
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
      title: "Total Admin",
      value: stats.totalAdmin,
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
      <AppSidebarAdmin variant="inset" />
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
                      Dashboard
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
                  <StatsGrid statsConfig={statsConfig} />
                  {/* Recent Activity */}
                  <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <RecentActivity recentItems={recentItems} />
                    {/* Quick Stats */}
                    <section className="space-y-6">
                      <SuccessRate
                        successRate={successRate}
                        claimed={stats.claimed}
                        totalFound={stats.totalFound}
                      />
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
