import { useFetchData } from "./useFetchData";
import { FoundReport } from "@/types/FoundReport";

export function useFoundReports(page = 1, limit = 10) {
  return useFetchData<FoundReport>("/foundreport", page, limit);
}
