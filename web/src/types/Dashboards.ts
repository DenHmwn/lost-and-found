import { LucideIcon } from "lucide-react";

export interface StatsCardConfig {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  color: string;
  lightBg: string;
  textColor: string;
  };

export interface RecentItem {
  type: "hilang" | "ditemukan";
  itemName: string;
  createdAt: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}
