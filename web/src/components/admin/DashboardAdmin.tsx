"use client";
import { AppSidebarAdmin } from "@/components/AppSidebarAdmin";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useFoundReports } from "@/hooks/useFoundReport";
import { useLostReports } from "@/hooks/useLostReport";
import { useUsers } from "@/hooks/useUsers";
import { FoundReport } from "@/types/FoundReport";
import { LostReport } from "@/types/LostReport";
import { Users } from "@/types/users";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import DashboardAdminSkeleton from "../SkeletonDashboard";

export default function DashboardAdmin() {
  interface RecentItem extends Partial<FoundReport & LostReport> {
    type: "hilang" | "ditemukan";
    itemName: string;
  }
  const router = useRouter();
  const { data: foundReports, isLoading: loadingFound } = useFoundReports();
  const { data: lostReports, isLoading: loadingLost } = useLostReports();
  const { data: users, isLoading: loadingUsers } = useUsers();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalLost = lostReports?.length || 0;
    const totalFound = foundReports?.length || 0;
    const totalUsers =
      users?.filter((admin: Users) => admin.role === "ADMIN").length || 0;

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

  // Get recent items (last 5)
  const recentItems = useMemo(() => {
    if (!foundReports && !lostReports) return [];

    const foundItems: RecentItem[] = (foundReports || []).map(
      (item: FoundReport) => ({
        ...item,
        type: "ditemukan" as const,
      })
    );

    const lostItems: RecentItem[] = (lostReports || []).map(
      (item: LostReport) => ({
        ...item,
        type: "hilang" as const,
      })
    );

    const allItems = [...foundItems, ...lostItems];

    return allItems
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);
  }, [foundReports, lostReports]);

  // Calculate success rate
  const successRate = useMemo(() => {
    if (!foundReports || foundReports.length === 0) return 0;
    return Math.round((stats.claimed / stats.totalFound) * 100);
  }, [stats.claimed, stats.totalFound, foundReports]);

  // Format time ago
  const formatTimeAgo = (date: string): string => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "1 hari lalu";
    return `${diffDays} hari lalu`;
  };

  const isLoading = loadingFound || loadingLost || loadingUsers;

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
      title: "Total Admin",
      value: stats.totalUsers,
      change: "Pengguna aktif",
      icon: User,
      color: "bg-purple-500",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  if (isLoading) {
    return (
      // <section className="min-h-screen bg-gray-50 flex items-center justify-center">
      //   <section className="text-center">
      //     <section className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></section>
      //     <p className="text-gray-600">Memuat dashboard...</p>
      //   </section>
      // </section>
      <DashboardAdminSkeleton />
    );
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
              <section className="bg-white border-b border-gray-200 px-6 py-4">
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

                {/* Recent Activity */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Items List */}
                  <section className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                    <section className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">
                        Aktivitas Terbaru
                      </h2>
                    </section>
                    <section className="divide-y divide-gray-200">
                      {recentItems.length === 0 ? (
                        <section className="p-8 text-center">
                          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">Belum ada aktivitas</p>
                        </section>
                      ) : (
                        recentItems.map((item, index) => (
                          <section
                            key={index}
                            className="p-6 hover:bg-gray-50 transition-colors"
                          >
                            <section className="flex items-center justify-between">
                              <section className="flex items-center gap-4">
                                <section
                                  className={`p-2 rounded-lg ${
                                    item.type === "hilang"
                                      ? "bg-red-50"
                                      : "bg-blue-50"
                                  }`}
                                >
                                  {item.type === "hilang" ? (
                                    <Search className="w-5 h-5 text-red-600" />
                                  ) : (
                                    <Package className="w-5 h-5 text-blue-600" />
                                  )}
                                </section>
                                <section>
                                  <p className="font-medium text-gray-900">
                                    {item.itemName || "Barang"}
                                  </p>
                                  <section className="flex items-center gap-2 mt-1">
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        item.type === "hilang"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {item.type === "hilang"
                                        ? "Barang Hilang"
                                        : "Barang Ditemukan"}
                                    </span>
                                    {item.status && (
                                      <span
                                        className={`text-xs px-2 py-1 rounded-full ${
                                          item.status === "PENDING"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : item.status === "APPROVED" ||
                                              item.status === "REJECTED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-gray-100 text-gray-700"
                                        }`}
                                      >
                                        {item.status === "PENDING"
                                          ? "PENDING"
                                          : item.status === "APPROVED"
                                          ? "Diklaim"
                                          : item.status === "REJECTED"
                                          ? "Dikembalikan"
                                          : item.status}
                                      </span>
                                    )}
                                  </section>
                                </section>
                              </section>
                              <section className="flex items-center gap-2 text-gray-500 text-sm">
                                <Clock className="w-4 h-4" />
                                {formatTimeAgo(
                                  item.createdAt || item.createdAt || ""
                                )}
                              </section>
                            </section>
                          </section>
                        ))
                      )}
                    </section>
                  </section>

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
                              strokeDasharray={`${
                                2 * Math.PI * 56 * (successRate / 100)
                              } ${2 * Math.PI * 56}`}
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
                        {stats.claimed} dari {stats.totalFound} barang berhasil
                        dikembalikan
                      </p>
                    </section>

                    {/* Quick Actions */}
                    <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Aksi Cepat
                      </h3>
                      <section className="space-y-3">
                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        onClick={() => router.push("/homepage/admin/found")}>
                          Lihat Laporan Temuan
                        </Button>
                        <Button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                        onClick={() => router.push("/homepage/admin/list-user")}>
                          Kelola User
                        </Button>
                      </section>
                    </section>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>
      </SidebarInset>
    </SidebarProvider>
  );
}