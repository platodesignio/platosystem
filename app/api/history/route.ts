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

    const executions =
      await prisma.execution.findMany({
        where: { userId: decoded.userId },
        orderBy: { createdAt: "desc" },
        take: 50
      });

    return NextResponse.json(executions);
  } catch (error) {
    console.error("History error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
