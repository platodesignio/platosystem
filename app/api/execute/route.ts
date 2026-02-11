import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { callOpenAI } from "@/lib/adapters/openai.adapter";
import { calculateCost } from "@/lib/cost.engine";
import { estimateTokens } from "@/lib/token.util";
import { getCurrentMonthUsage } from "@/lib/usage.engine";
import { hashApiKey } from "@/lib/key.util";
import { checkRateLimit } from "@/lib/rate-limit";

/* ===============================
   認証（JWT or API Key）
=============================== */

async function authenticate(req: Request) {
  // JWT Cookie 認証
  const cookieHeader = req.headers.get("cookie");

  if (cookieHeader) {
    const match = cookieHeader.match(/token=([^;]+)/);

    if (match && match[1]) {
      try {
        const decoded = verifyToken(match[1]);

        return prisma.user.findUnique({
          where: { id: decoded.userId }
        });
      } catch {
        // 無効トークンは無視
      }
    }
  }

  // APIキー認証
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
   POST
=============================== */

export async function POST(req: Request) {
  try {
    /* ---------- 認証 ---------- */

    const user = await authenticate(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------- レート制限 ---------- */

    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }

    /* ---------- リクエスト検証 ---------- */

    const body = await req.json();
    const { model, prompt } = body;

    if (
      !model ||
      !prompt ||
      typeof prompt !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    /* ---------- モデル制限 ---------- */

    const allowedModels = ["gpt-4o", "gpt-4o-mini"];

    if (!allowedModels.includes(model)) {
      return NextResponse.json(
        { error: "Model not allowed" },
        { status: 403 }
      );
    }

    /* ---------- 月間上限チェック ---------- */

    const currentUsage = await getCurrentMonthUsage(
      user.id
    );

    if (currentUsage >= user.monthlyLimit) {
      return NextResponse.json(
        { error: "Monthly limit exceeded" },
        { status: 403 }
      );
    }

    /* ---------- 事前トークン推定 ---------- */

    const estimatedTokens = estimateTokens(prompt);

    if (estimatedTokens > user.maxTokensPerReq) {
      return NextResponse.json(
        { error: "Prompt too large" },
        { status: 403 }
      );
    }

    /* ---------- AI実行 ---------- */

    const aiResult = await callOpenAI(
      model,
      prompt,
      user.maxTokensPerReq
    );

    const totalTokens =
      aiResult.promptTokens +
      aiResult.completionTokens;

    /* ---------- 実トークン再チェック ---------- */

    if (totalTokens > user.maxTokensPerReq) {
      return NextResponse.json(
        { error: "Token limit exceeded" },
        { status: 403 }
      );
    }

    /* ---------- コスト計算 ---------- */

    const cost = calculateCost(
      model,
      aiResult.promptTokens,
      aiResult.completionTokens
    );

    /* ---------- 最終上限検証 ---------- */

    if (currentUsage + cost > user.monthlyLimit) {
      return NextResponse.json(
        { error: "Monthly limit would be exceeded" },
        { status: 403 }
      );
    }

    /* ---------- ログ保存 ---------- */

    await prisma.execution.create({
      data: {
        userId: user.id,
        model,
        promptTokens: aiResult.promptTokens,
        completionTokens: aiResult.completionTokens,
        totalTokens,
        cost
      }
    });

    /* ---------- レスポンス ---------- */

    return NextResponse.json({
      content: aiResult.content,
      usage: {
        promptTokens: aiResult.promptTokens,
        completionTokens: aiResult.completionTokens,
        totalTokens,
        cost
      }
    });
  } catch (error) {
    console.error("Execute error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
