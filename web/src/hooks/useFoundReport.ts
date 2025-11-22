import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function useFoundReports() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:3001/api/foundreport",
    fetcher
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
