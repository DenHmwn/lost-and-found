import useSWR from "swr";
import { fetcher } from "./usefetch";

export function useFoundReports() {
  const { data, error, isLoading } = useSWR(
    "/foundreport",
    fetcher
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
