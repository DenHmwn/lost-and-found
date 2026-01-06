import { Users } from "./users";

export interface FoundReport {
  id: number;
  namaBarang: string;
  deskripsi: string;
  lokasiTemu: string;
  statusReport: "Done" | "OnProgress" | "Closed";
  tanggalTemu: string;
  waktuTemu: string;
  createdAt: string;
  admin: Users;
  lostReportId: number | null;
}