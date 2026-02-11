import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const { verifyToken } = await import("@/lib/auth");

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const monthly =
      await prisma.execution.aggregate({
        where: {
          userId: decoded.userId,
          createdAt: { gte: startOfMonth }
        },
        _sum: {
          cost: true,
          totalTokens: true
        },
        _count: true
      });

    return NextResponse.json({
      monthly: {
        used: monthly._sum.cost ?? 0,
        totalTokens:
          monthly._sum.totalTokens ?? 0,
        executionCount:
          monthly._count ?? 0
      }
    });
  } catch (error) {
    console.error("Usage error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
