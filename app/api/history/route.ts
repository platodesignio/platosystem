import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { hashApiKey } from "@/lib/key.util";

/* ===============================
   Cookie安全取得
=============================== */

function getCookieValue(
  cookieHeader: string | null,
  name: string
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name && value) {
      return value;
    }
  }

  return null;
}

/* ===============================
   認証
=============================== */

async function authenticate(req: Request) {
  const cookieHeader = req.headers.get("cookie");

  const token = getCookieValue(cookieHeader, "token");

  if (token) {
    try {
      const decoded = verifyToken(token);

      return prisma.user.findUnique({
        where: { id: decoded.userId }
      });
    } catch {
      // 無効トークンは無視
    }
  }

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
   GET
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

    const url = new URL(req.url);

    const limitParam = url.searchParams.get("limit");
    const fromParam = url.searchParams.get("from");
    const toParam = url.searchParams.get("to");

    const limit = limitParam
      ? Math.min(parseInt(limitParam, 10), 100)
      : 50;

    const whereClause: any = {
      userId: user.id
    };

    if (fromParam || toParam) {
      whereClause.createdAt = {};

      if (fromParam) {
        whereClause.createdAt.gte = new Date(fromParam);
      }

      if (toParam) {
        whereClause.createdAt.lte = new Date(toParam);
      }
    }

    const executions = await prisma.execution.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        model: true,
        promptTokens: true,
        completionTokens: true,
        totalTokens: true,
        cost: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      count: executions.length,
      data: executions
    });
  } catch (error) {
    console.error("History API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
