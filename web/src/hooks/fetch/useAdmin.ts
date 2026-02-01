import { useFetchData } from "./useFetchData";
import { Admin } from "@/types/Admin";

export function useAdmin(page = 1, limit = 10) {
  return useFetchData<Admin>("/user", page, limit, { role: "ADMIN" });
}
