import { LucideIcon } from "lucide-react";

export interface StatsCardConfigTypes {
  title: string;
  value: string | number;
  change: string;
  icon: LucideIcon;
  color: string;
  lightBg: string;
  textColor: string;
  };

export interface RecentItemTypes {
  type: "hilang" | "ditemukan";
  itemName: string;
  createdAt: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
}
