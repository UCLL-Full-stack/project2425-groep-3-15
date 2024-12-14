import { NextResponse } from "next/server";

import { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token");

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".css") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      console.log("Middleware - User logged in, redirecting to home");
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    console.log("Middleware - No token found, redirecting to /login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  console.log("Middleware - Token exists, allowing access");
  return NextResponse.next();
}
