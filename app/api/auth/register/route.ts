import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { hashPassword, signToken } =
      await import("@/lib/auth");

    const { email, password } =
      await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const existing =
      await prisma.user.findUnique({
        where: { email }
      });

    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashed =
      await hashPassword(password);

    const user =
      await prisma.user.create({
        data: {
          email,
          password: hashed
        }
      });

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
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
