import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/api/execute") ||
    pathname.startsWith("/api/usage") ||
    pathname.startsWith("/api/history")
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

  // 保護対象でないパスは通す
  if (!isProtectedPath(pathname) && !isAuthPage(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  /* ============================
     未ログイン処理
  ============================ */

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

  /* ============================
     JWT検証
  ============================ */

  try {
    verifyToken(token);

    // ログイン済みならlogin/registerに入れない
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

/* ============================
   マッチ対象を明示
============================ */

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/execute",
    "/api/usage",
    "/api/history"
  ]
};
