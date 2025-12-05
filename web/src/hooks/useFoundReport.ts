import useSWR from "swr";
import { api } from "@/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

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
