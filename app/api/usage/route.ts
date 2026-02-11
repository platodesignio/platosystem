import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { hashApiKey } from "@/lib/key.util";

/* ===============================
   認証ヘルパー
=============================== */

async function authenticate(req: Request) {
  // JWT Cookie
  const cookieHeader = req.headers.get("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/token=([^;]+)/);
    if (match) {
      try {
        const decoded = verifyToken(match[1]);
        return prisma.user.findUnique({
          where: { id: decoded.userId }
        });
      } catch {
        // APIキーへフォールバック
      }
    }
  }

  // APIキー
  const apiKeyHeader = req.headers.get("x-api-key");
  if (apiKeyHeader) {
    const hashed = hashApiKey(apiKeyHeader);

    const apiKey = await prisma.apiKey.findUnique({
      where: { key: hashed }
    });

    if (apiKey) {
      return prisma.user.findUnique({
        where: { id: apiKey.userId }
      });
    }
  }

  return null;
}

/* ===============================
   GET: 使用状況取得
=============================== */

export async function GET(req: Request) {
  try {
    const user = await authenticate(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    );

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    /* ---------- 今月集計 ---------- */

    const monthlyAggregate =
      await prisma.execution.aggregate({
        where: {
          userId: user.id,
          createdAt: { gte: startOfMonth }
        },
        _sum: {
          cost: true,
          totalTokens: true
        },
        _count: true
      });

    const monthlyUsed =
      monthlyAggregate._sum.cost ?? 0;

    const monthlyTokens =
      monthlyAggregate._sum.totalTokens ?? 0;

    const monthlyCount =
      monthlyAggregate._count ?? 0;

    const remaining = Math.max(
      0,
      user.monthlyLimit - monthlyUsed
    );

    /* ---------- 本日集計 ---------- */

    const dailyAggregate =
      await prisma.execution.aggregate({
        where: {
          userId: user.id,
          createdAt: { gte: startOfDay }
        },
        _sum: {
          cost: true,
          totalTokens: true
        },
        _count: true
      });

    const dailyUsed =
      dailyAggregate._sum.cost ?? 0;

    const dailyTokens =
      dailyAggregate._sum.totalTokens ?? 0;

    const dailyCount =
      dailyAggregate._count ?? 0;

    /* ---------- レスポンス ---------- */

    return NextResponse.json({
      monthly: {
        limit: user.monthlyLimit,
        used: monthlyUsed,
        remaining,
        executionCount: monthlyCount,
        totalTokens: monthlyTokens
      },
      daily: {
        used: dailyUsed,
        executionCount: dailyCount,
        totalTokens: dailyTokens
      },
      maxTokensPerReq: user.maxTokensPerReq
    });
  } catch (error) {
    console.error("Usage API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
