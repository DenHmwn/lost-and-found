'use client';
import { CheckCircle, Package, Search, TrendingUp, User } from "lucide-react";
import { AppSidebarUser } from "../AppSidebarUser";
import { SiteHeader } from "../SiteHeader";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";
import { useFoundReports } from "@/hooks/useFoundReport";
import { useLostReports } from "@/hooks/useLostReport";
import { useUsers } from "@/hooks/useUsers";
import { FoundReport } from "@/types/FoundReport";
import { LostReport } from "@/types/LostReport";
import { useMemo } from "react";
import { Users } from "@/types/users";

export default function DashboardUser() {
  const { data: foundReports, isLoading: loadingFound } = useFoundReports();
  const { data: lostReports, isLoading: loadingLost } = useLostReports();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const stats = useMemo(() => {
    const totalLost = lostReports?.length || 0;
    const totalFound = foundReports?.length || 0;
    const totalUsers =
      users?.filter((user: Users) => user.role === "USER").length || 0;

    // Count claimed/returned items
    const claimed =
      foundReports?.filter(
        (item: FoundReport | undefined) =>
          item?.statusReport === "Done" || item?.statusReport === "Closed"
      ).length || 0;

    // Calculate items from today
    const today = new Date().toDateString();
    const lostToday =
      lostReports?.filter((item: LostReport | undefined) => {
        const date = item?.createdAt || item?.createdAt;
        return date ? new Date(date).toDateString() === today : false;
      }).length || 0;

    const foundToday =
      foundReports?.filter((item: FoundReport | undefined) => {
        const date = item?.createdAt || item?.createdAt;
        return date ? new Date(date).toDateString() === today : false;
      }).length || 0;

    return {
      totalLost,
      totalFound,
      claimed,
      totalUsers,
      lostToday,
      foundToday,
    };
  }, [foundReports, lostReports, users]);
  // Calculate success rate
  const successRate = useMemo(() => {
    if (!foundReports || foundReports.length === 0) return 0;
    return Math.round((stats.claimed / stats.totalFound) * 100);
  }, [stats.claimed, stats.totalFound, foundReports]);
  const statsConfig = [
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
              <section className="bg-white border-b border-gray-200 px-6 py-4">
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
              </section>
              {/* Main Content */}
              <section className="p-6">
                {/* Stats Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {statsConfig.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <section
                        key={index}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <section className="flex items-center justify-between mb-4">
                          <section className={`${stat.lightBg} p-3 rounded-lg`}>
                            <Icon className={`w-6 h-6 ${stat.textColor}`} />
                          </section>
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        </section>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">
                          {stat.title}
                        </h3>
                        <p className="text-3xl font-bold text-gray-900 mb-1">
                          {stat.value}
                        </p>
                        <p className="text-xs text-gray-500">{stat.change}</p>
                      </section>
                    );
                  })}
                </section>
              </section>
            </section>
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}
