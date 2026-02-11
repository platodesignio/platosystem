import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(
  request: NextRequest
) {
  const token =
    request.cookies.get("token");

  const { pathname } =
    request.nextUrl;

  // 認証不要ルート
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith(
      "/register"
    ) ||
    pathname.startsWith("/api") ||
    pathname.startsWith(
      "/_next"
    ) ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 未認証ならログインへ
  if (!token) {
    return NextResponse.redirect(
      new URL(
        "/login",
        request.url
      )
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/apikeys/:path*"
  ]
};
