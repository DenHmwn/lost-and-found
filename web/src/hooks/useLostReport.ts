import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useLostReports() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:3001/api/lostreport",
    fetcher
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
