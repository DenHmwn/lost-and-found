import useSWR from "swr";
import { api } from "@/lib/axios";

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useUsers() {
  const { data, error, isLoading } = useSWR(
    "/user",
    fetcher
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
