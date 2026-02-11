import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(req: NextRequest) {
  try {
    const { prisma } =
      await import("@/lib/prisma");
    const { verifyToken } =
      await import("@/lib/auth");

    const cookie =
      req.cookies.get("token");

    if (!cookie) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded =
      verifyToken(cookie.value);

    await prisma.execution.deleteMany({
      where: { userId: decoded.userId }
    });

    await prisma.apiKey.deleteMany({
      where: { userId: decoded.userId }
    });

    await prisma.user.delete({
      where: { id: decoded.userId }
    });

    const response =
      NextResponse.json({
        success: true
      });

    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0
    });

    return response;
  } catch (error) {
    console.error(
      "Account delete error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error"
      },
      { status: 500 }
    );
  }
}
