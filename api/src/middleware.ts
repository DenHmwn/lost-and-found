import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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
  const authHeader = req.headers.get("authorization");
  const tokenFromHeader = authHeader?.split(" ")[1];
  const cookieToken = req.cookies.get("accessToken")?.value;
  const token = tokenFromHeader || cookieToken;
  if (!token) {
  const res = NextResponse.json(
    { success: false, message: "Token tidak ada", authenticated: false },
    { status: 401 }
  );
  return setCorsHeaders(res);
}

  // const bearerToken = authHeader?.split(" ")[1];
  // const cookieToken = req.cookies.get("accessToken")?.value;


  // Jika token tidak ada
  // if (!tokenFromHeader) {
  //   const response = NextResponse.json(
  //     {
  //       success: false,
  //       message: "Akses ditolak: Token tidak ada",
  //       authenticated: false,
  //     },
  //     { status: 401 }
  //   );
  //   return setCorsHeaders(response);
  // }

  // Verifikasi token
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    // Buat request header untuk user info
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("user-id", String(payload.id));
    requestHeaders.set("user-name", String(payload.name));
    requestHeaders.set("user-role", String(payload.role));
    requestHeaders.set("authenticated", "true");

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

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
    "/api/lostreport/:path*",
    "/api/foundreport/:path*",
    "/api/auth/login",
    "/api/auth/register",
    // "/api/auth/verify",
    "/api/auth/logout",
    "/api/auth/refresh",
  ],
};