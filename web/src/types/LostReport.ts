import { Users } from "./Users";

export interface LostReport {
  id: number;
  namaBarang: string;
  deskripsi: string;
  lokasiHilang: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  statusReport: "Done" | "OnProgress" | "Closed";
  tanggalHilang: string;
  waktuHilang: string;
  createdAt: string;
  user: Users;
}
