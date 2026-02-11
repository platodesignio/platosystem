import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { verifyPassword, signToken } =
      await import("@/lib/auth");

    const { email, password } =
      await req.json();

    const user =
      await prisma.user.findUnique({
        where: { email }
      });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const valid =
      await verifyPassword(
        password,
        user.password
      );

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token =
      signToken(user.id);

    const response =
      NextResponse.json({
        success: true
      });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: true,        // Vercel本番は必ずtrue
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
