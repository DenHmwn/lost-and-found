import { NextRequest } from "next/server";

export function pagination(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  // ambil query params
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const skip = (Number(page) - 1) * limit;
  return {
    page,
    limit,
    skip,
  };
}
