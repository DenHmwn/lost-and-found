import useSWR from "swr";
import { api } from "@/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useLostReports() {
  const { data, error, isLoading } = useSWR(
    "/lostreport",
    fetcher
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
