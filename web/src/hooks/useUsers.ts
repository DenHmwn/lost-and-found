import useSWR from "swr";
import { fetcher } from "./usefetch";

export function useUsers() {
  const { data, error, isLoading } = useSWR("/user", fetcher);

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
