import { useFetchData } from "./useFetchData";
import { LostReport } from "@/types/LostReport";

export function useLostReports(page = 1, limit = 10) {
  return useFetchData<LostReport>("/lostreport", page, limit);
}
