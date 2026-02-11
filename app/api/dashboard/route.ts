import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { getCurrentMonthUsage } from "@/lib/usage.engine";

function extractToken(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

export async function GET(req: Request) {
  try {
    /* ===============================
       1. 認証
    =============================== */

    const token = extractToken(req.headers.get("cookie"));
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    /* ===============================
       2. ユーザー取得
    =============================== */

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* ===============================
       3. 今月の期間算出
    =============================== */

    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    /* ===============================
       4. 今月使用額
    =============================== */

    const currentUsage = await getCurrentMonthUsage(user.id);

    const remaining = Math.max(
      0,
      user.monthlyLimit - currentUsage
    );

    /* ===============================
       5. 今月実行集計
    =============================== */

    const monthlyAggregates = await prisma.execution.aggregate({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth
        }
      },
      _count: true,
      _sum: {
        totalTokens: true,
        cost: true
      }
    });

    /* ===============================
       6. モデル別集計
    =============================== */

    const modelBreakdown = await prisma.execution.groupBy({
      by: ["model"],
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        totalTokens: true,
        cost: true
      },
      _count: true
    });

    /* ===============================
       7. 直近履歴（20件）
    =============================== */

    const recentExecutions = await prisma.execution.findMany({
      where: {
        userId: user.id
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      select: {
        id: true,
        model: true,
        totalTokens: true,
        cost: true,
        createdAt: true
      }
    });

    /* ===============================
       8. レスポンス
    =============================== */

    return NextResponse.json({
      limit: user.monthlyLimit,
      used: currentUsage,
      remaining,
      maxTokensPerReq: user.maxTokensPerReq,

      monthly: {
        executionCount: monthlyAggregates._count,
        totalTokens:
          monthlyAggregates._sum.totalTokens ?? 0,
        totalCost:
          monthlyAggregates._sum.cost ?? 0
      },

      modelBreakdown,
      recentExecutions
    });
  } catch (error) {
    console.error("Dashboard API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
