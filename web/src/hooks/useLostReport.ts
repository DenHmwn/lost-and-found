import useSWR from "swr";
import { fetcher } from "./usefetch";

export function useLostReports() {
  const { data, error, isLoading, mutate } = useSWR(
    "/lostreport",
    fetcher
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
