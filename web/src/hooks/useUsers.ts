import useSWR from "swr";
import { fetcher } from "./useFetch";

export function useUsers(page = 1, limit = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    `/user?page=${page}&limit=${limit}`,
    fetcher,
  );

  return {
    data: data?.data,
    pagination: data?.pagination,
    error,
    isLoading,
    mutate
  };
}
