import { Users } from "./users";

export interface LostReport {
  id: number;
  namaBarang: string;
  deskripsi: string;
  lokasiHilang: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  statusReport: "Done" | "OnProgress" | "Closed";
  createdAt: string;
  user: Users;
}