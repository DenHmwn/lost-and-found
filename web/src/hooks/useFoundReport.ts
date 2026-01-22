import useSWR from "swr";
import { fetcher } from "./usefetch";

export function useFoundReports() {
  const { data, error, isLoading, mutate } = useSWR("/foundreport", fetcher);

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
  };
}
