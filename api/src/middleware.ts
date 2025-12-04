import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const response = NextResponse.next();

  // skip nextjs internal paths
  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // kasih access auth routes
  if (
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/api/auth/verify")
  ) {
    return NextResponse.next();
  }

  // Allow user regis
  if (pathname === "/api/user" && req.method === "POST") {
    return NextResponse.next();
  }
   // Get token dari Authorization header ATAU cookie
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.split(" ")[1];
  const cookieToken = req.cookies.get("accessToken")?.value;

  // get token
  const tokenFromHeader = authHeader?.split(" ")[1];

    // Prioritas: Bearer token > Cookie token
  const token = bearerToken || cookieToken;

  // cek token ada atau tidak
  if (!tokenFromHeader) {
    return NextResponse.json(
      {
        success: false,
        message: "Akses ditolak: Token tidak ada",
        authenticated: false,
      },
      { status: 401 }
    );
  }

  // verifikasi token
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(tokenFromHeader, secret);

    // buat request header untuk user info di berrier token
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("user-id", String(payload.id));
    requestHeaders.set("user-name", String(payload.name));
    requestHeaders.set("user-role", String(payload.role));
    requestHeaders.set("authenticated", "true");

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Token invalid atau expired",
        error: err instanceof Error ? err.message : String(err),
        authenticated: false,
      },
      { status: 401 }
    );
  }

  // response.headers.set("Access-Control-Allow-Origin", "*");
  // response.headers.set(
  //   "Access-Control-Allow-Methods",
  //   "GET, POST, DELETE, PUT"
  // );
  // response.headers.set(
  //   "Access-Control-Allow-Headers",
  //   "Content-Type, Authorization"
  // );

  return response;
}

export const config = {
  matcher: [
    // "/api/:path*",
    "/api/user",
    "/api/user/:path*",
    "/api/lostreport/:path*",
    "/api/foundreport/:path*",
  ],
};
