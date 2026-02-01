import { fetcher } from "@/services/fetchService";
import useSWR from "swr";

export function useFetchData<T>(
  endpoint: string,
  page = 1,
  limit = 10,
  query?: Record<string, string>,
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...query,
  });
  // const key = `${endpoint}?page=${page}&limit=${limit}`;
  const key = `${endpoint}?${params.toString()}`;


  const { data, error, isLoading, mutate } = useSWR(key, fetcher);

  return {
    data: data?.data as T[],
    pagination: data?.pagination,
    error,
    isLoading,
    mutate,
  };
}
