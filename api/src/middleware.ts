import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SECRET } from "./lib/secret";

// Helper function untuk set CORS headers
function setCorsHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400");
  return response;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Handle preflight options request
  if (req.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 200 });
    return setCorsHeaders(response);
  }

  // Skip nextjs internal paths
  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/auth/refresh")) {
    const res = NextResponse.next();
    return setCorsHeaders(res);
  }

  // Kasih akses auth routes
  if (
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/register") ||
    pathname.startsWith("/api/auth/verify")
  ) {
    const response = NextResponse.next();
    return setCorsHeaders(response);
  }

  // Allow user registration
  if (pathname === "/api/user" && req.method === "POST") {
    const response = NextResponse.next();
    return setCorsHeaders(response);
  }

  // Get token dari Authorization header ATAU cookie
  // const authHeader = req.headers.get("authorization");
  // const tokenFromHeader = authHeader?.split(" ")[1];
  const cookieToken = req.cookies.get("accessToken")?.value;
  const token = cookieToken;
  if (!token) {
    const res = NextResponse.json(
      { success: false, message: "Token tidak ada", authenticated: false },
      { status: 401 }
    );
    return setCorsHeaders(res);
  }

  // Verifikasi token
  try {
    // const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    // const { payload } = await jwtVerify(token, SECRET);
    await jwtVerify(token, SECRET);

    // Buat request header untuk user info
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
    // const requestHeaders = new Headers(req.headers);
    // requestHeaders.set("userId", String(payload.id));
    // requestHeaders.set("userName", String(payload.name));
    // requestHeaders.set("userRole", String(payload.role));

    return setCorsHeaders(response);
  } catch (err) {
    const response = NextResponse.json(
      {
        success: false,
        message: "Token invalid atau expired",
        error: err instanceof Error ? err.message : String(err),
        authenticated: false,
      },
      { status: 401 }
    );
    return setCorsHeaders(response);
  }
}

export const config = {
  matcher: [
    "/api/user",
    "/api/user/:path*",

    "/api/lostreport",
    "/api/lostreport/:path*",

    "/api/foundreport",
    "/api/foundreport/:path*",

    "/api/auth/login",
    "/api/auth/register",
    // "/api/auth/verify",
    "/api/auth/logout",
    "/api/auth/refresh", 
  ],
};