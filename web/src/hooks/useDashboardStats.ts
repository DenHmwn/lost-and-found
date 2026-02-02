import { useMemo } from "react";
import { useLostReports } from "./useLostReport";
import { useFoundReports } from "./useFoundReport";
import { Users } from "@/types/Users";
import { useUsers } from "./useUsers";
import { FoundReport } from "@/types/FoundReport";
import { LostReport } from "@/types/LostReport";
import { useAdmin } from "./useAdmin";
import { Admin } from "@/types/Admin";
export const useDashboardStats = () => {
  interface RecentItem extends Partial<FoundReport & LostReport> {
    type: "hilang" | "ditemukan";
    itemName: string;
  }
  
  const { data: foundReports, isLoading: loadingFound } = useFoundReports();
  const { data: lostReports, isLoading: loadingLost } = useLostReports();
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: admin, isLoading: loadingAdmin } = useAdmin();

  const isLoading = loadingFound || loadingLost || loadingUsers || loadingAdmin;

  // calculate stats
  const stats = useMemo(() => {
    const totalLost = lostReports?.length || 0;
    const totalFound = foundReports?.length || 0;
    const totalUsers =
      users?.filter((user: Users) => user.role === "USER").length || 0;
    const totalAdmin =
      admin?.filter((admin: Admin) => admin.role === "ADMIN").length || 0;

    // Count claimed/returned items
    const claimed =
      foundReports?.filter(
        (item: FoundReport | undefined) =>
          item?.statusReport === "Done" || item?.statusReport === "Closed",
      ).length || 0;

    // Calculate items from today
    const today = new Date().toDateString();
    const lostToday =
      lostReports?.filter((item: LostReport | undefined) => {
        const date = item?.createdAt;
        return date ? new Date(date).toDateString() === today : false;
      }).length || 0;

    const foundToday =
      foundReports?.filter((item: FoundReport | undefined) => {
        const date = item?.createdAt;
        return date ? new Date(date).toDateString() === today : false;
      }).length || 0;

    return {
      totalLost,
      totalFound,
      claimed,
      totalUsers,
      totalAdmin,
      lostToday,
      foundToday,
    };
  }, [foundReports, lostReports, users, admin]);

  // calculate success rate
  const successRate = useMemo(() => {
    if (!foundReports || foundReports.length === 0) return 0;
    return Math.round((stats.claimed / stats.totalFound) * 100);
  }, [stats.claimed, stats.totalFound, foundReports]);

  // Get recent items (last 5)
  const recentItems = useMemo(() => {
    if (!foundReports && !lostReports) return [];

    const foundItems: RecentItemTypes[] = (foundReports || []).map(
      (item: FoundReport) => ({
        ...item,
        type: "ditemukan" as const,
        itemName: item.namaBarang,
      }),
    );

    const lostItems: RecentItemTypes[] = (lostReports || []).map(
      (item: LostReport) => ({
        ...item,
        type: "hilang" as const,
        itemName: item.namaBarang,
      }),
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

  return { stats, successRate, recentItems, isLoading };
};
