import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SECRET } from "./lib/secret";

// Helper function untuk set CORS headers
  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000");
function setCorsHeaders(req: NextRequest, response: NextResponse) {
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, DELETE, PUT, PATCH, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
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
    return setCorsHeaders(req, response);
  }

  // Skip nextjs internal paths
  if (pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

 if (pathname.startsWith("/api/auth")) {
   return setCorsHeaders(req, NextResponse.next());
  }

  // Allow user registration
  if (pathname === "/api/user" && req.method === "POST") {
    const response = NextResponse.next();
    return setCorsHeaders(req, response);
  }

  const cookieToken = req.cookies.get("accessToken")?.value;
  const token = cookieToken;
  if (!token) {
    const res = NextResponse.json(
      { success: false, message: "Token tidak ada", authenticated: false },
      { status: 401 },
    );
    return setCorsHeaders(req, res);
  }

  // Verifikasi token
  try {
    await jwtVerify(token, SECRET);
    const response = NextResponse.next();
    return setCorsHeaders(req, response);
  } catch (err) {
    const response = NextResponse.json(
      {
        success: false,
        message: "Token invalid atau expired",
        error: err instanceof Error ? err.message : String(err),
        authenticated: false,
      },
      { status: 401 },
    );
    return setCorsHeaders(req, response);
  }
}

export const config = {
  matcher: ["/api/:path*"],
};
