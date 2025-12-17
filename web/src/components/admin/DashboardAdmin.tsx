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






}