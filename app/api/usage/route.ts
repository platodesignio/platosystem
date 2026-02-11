import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
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

    const now = new Date();
    const firstDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const result =
      await prisma.execution.aggregate({
        where: {
          userId: decoded.userId,
          createdAt: {
            gte: firstDay
          }
        },
        _sum: {
          totalCost: true,
          promptTokens: true,
          completionTokens: true
        },
        _count: true
      });

    const totalTokens =
      (result._sum.promptTokens || 0) +
      (result._sum.completionTokens ||
        0);

    return NextResponse.json({
      monthly: {
        used:
          result._sum.totalCost || 0,
        totalTokens,
        executionCount:
          result._count || 0
      }
    });
  } catch (error) {
    console.error(
      "Usage API error:",
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

