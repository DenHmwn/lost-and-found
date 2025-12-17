'use client';
import { AppSidebarAdmin } from "@/components/AppSidebarAdmin";
import { SiteHeader } from "@/components/SiteHeader";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import { useFoundReports } from "@/hooks/useFoundReport";
import { useLostReports } from "@/hooks/useLostReport";
import { useUsers } from "@/hooks/useUsers";
import { FoundReport } from "@/types/FoundReport";
import { LostReport } from "@/types/LostReport";

export default function DashboardAdmin() {
     interface RecentItem extends Partial<FoundReport & LostReport> {
    type: "hilang" | "ditemukan";
    itemName: string;
  }
    const { data: foundReports, isLoading: loadingFound } = useFoundReports();
    const { data: lostReports, isLoading: loadingLost } = useLostReports();
    const { data: users, isLoading: loadingUsers } = useUsers();

   const stats = useMemo(() => {
    const totalLost = lostReports?.length || 0;
    const totalUsers = users?.length || 0;

     const claimed =
      foundReports?.filter(
        (item : FoundReport | undefined) => item?.statusReport === "Done" || item?.statusReport === "Closed"
      ).length || 0;

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


    const successRate = useMemo(() => {
    if (!foundReports || foundReports.length === 0) return 0;
    return Math.round((stats.claimed / stats.totalFound) * 100);
  }, [stats.claimed, stats.totalFound, foundReports]);

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
      title: "Total User",
      value: stats.totalUsers,
      change: "Pengguna aktif",
      icon: Users,
      color: "bg-purple-500",
      lightBg: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  if (isLoading) {

      return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
        
        );


  }


















}