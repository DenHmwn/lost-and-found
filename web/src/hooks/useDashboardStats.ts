import { useMemo } from "react";
import { Users } from "@/types/Users";
import { FoundReport } from "@/types/FoundReport";
import { LostReport } from "@/types/LostReport";
import { Admin } from "@/types/Admin";
import { useAdmin } from "./fetch/useAdmin";
import { useUsers } from "./fetch/useUsers";
import { useFoundReports } from "./fetch/useFoundReport";
import { useLostReports } from "./fetch/useLostReport";
import { useQueryPagination } from "./usePagination";
import { RecentItemTypes } from "@/types/Dashboards";
export const useDashboardStats = () => {
  const { page } = useQueryPagination();
  const {
    data: foundReports,
    isLoading: loadingFound,
    pagination: paginationFound,
  } = useFoundReports(page);
  const {
    data: lostReports,
    isLoading: loadingLost,
    pagination: paginationLost,
  } = useLostReports(page);
  const { data: users, isLoading: loadingUsers } = useUsers();
  const { data: admin, isLoading: loadingAdmin } = useAdmin();

  const isLoading = loadingFound || loadingLost || loadingUsers || loadingAdmin;

  // calculate stats
  const stats = useMemo(() => {
    const totalLost = paginationLost?.totalData ?? 0;
    const totalFound = paginationFound?.totalData || 0;
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
  }, [
    foundReports,
    lostReports,
    users,
    admin,
    paginationLost,
    paginationFound,
  ]);

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
