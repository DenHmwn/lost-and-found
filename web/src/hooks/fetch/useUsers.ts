import { useFetchData } from "./useFetchData";
import { Users } from "@/types/Users";

export function useUsers(page = 1, limit = 10) {
  return useFetchData<Users>("/user", page, limit, {role: "USER"});
}
