import useSWR from "swr";
import { fetcher } from "../services/fetchService";

export function useUsers(page = 1, limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/user? role=USER&page=${page}&limit=${limit}`,
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
