import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/apikeys") ||
    pathname.startsWith("/api/execute") ||
    pathname.startsWith("/api/usage") ||
    pathname.startsWith("/api/history") ||
    pathname.startsWith("/api/dashboard") ||
    pathname.startsWith("/api/apikeys")
  );
}

function isAuthPage(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register")
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtectedPath(pathname) && !isAuthPage(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  try {
    verifyToken(token);

    if (isAuthPage(pathname)) {
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      );
    }

    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/apikeys/:path*",
    "/login",
    "/register",
    "/api/execute",
    "/api/usage",
    "/api/history",
    "/api/dashboard",
    "/api/apikeys"
  ]
};

