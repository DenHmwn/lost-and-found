import useSWR from "swr";
import axios from "axios";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export function useUsers() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:3000/api/user",
    fetcher
  );

  return {
    data: data?.data,
    error,
    isLoading,
  };
}
