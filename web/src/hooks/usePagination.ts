import { useRouter, useSearchParams } from "next/navigation";

// pagination params
export const useQueryPagination = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`?${params.toString()}`);
  };

  return { page, setPage };
};

// pagination items per page
export const getPaginationItems = (current: number, total: number) => {
  if (total <= 1) return [];

  const pages: (number | "...")[] = [];

  // selalu nampil page pertama
  pages.push(1);

  const start = Math.max(2, current - 2);
  const end = Math.min(total - 1, current + 2);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total - 1) pages.push("...");

  // always show last
  if (total > 1) pages.push(total);

  return pages;
};
