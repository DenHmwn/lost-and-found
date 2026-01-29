import useSWR from "swr";
import { fetcher } from "../services/fetchService";

export function useAdmin() {
  const { data, error, isLoading, mutate } = useSWR(
    "/user?role=ADMIN",
    fetcher,
  );

  return {
    data: data?.data,
    error,
    isLoading,
    mutate,
  };
}
