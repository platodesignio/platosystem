import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";

function extractBodyError() {
  return NextResponse.json(
    { error: "Invalid credentials" },
    { status: 401 }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return extractBodyError();
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    // 存在しない場合も同じレスポンス
    if (!user) {
      return extractBodyError();
    }

    const isValid = await verifyPassword(
      password,
      user.password
    );

    if (!isValid) {
      return extractBodyError();
    }

    const token = signToken(user.id);

    const response = NextResponse.json({
      success: true
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7日
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
