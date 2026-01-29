import useSWR from "swr";
import { fetcher } from "../services/fetchService";

export function useLostReports(page = 1, limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/lostreport?page=${page}&limit=${limit}`,
    fetcher,
  );

  return {
    data: data?.data,
    pagination: data?.pagination,
    error,
    isLoading,
    mutate,
  };
}
