import useSWR from "swr";
import { fetcher } from "./useFetch";

export function useUsers() {
  const { data, error, isLoading } = useSWR("/user", fetcher);

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
