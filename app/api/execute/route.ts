import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // すべて実行時ロード
    const { prisma } = await import("@/lib/prisma");
    const { verifyToken } = await import("@/lib/auth");
    const { callOpenAI } = await import(
      "@/lib/adapters/openai.adapter"
    );
    const { calculateCost } = await import(
      "@/lib/cost.engine"
    );
    const { estimateTokens } = await import(
      "@/lib/token.util"
    );

    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { model, prompt } = body;

    const estimatedTokens =
      estimateTokens(prompt);

    if (
      estimatedTokens > user.maxTokensPerReq
    ) {
      return NextResponse.json(
        { error: "Prompt too large" },
        { status: 400 }
      );
    }

    const aiResult = await callOpenAI(
      model,
      prompt,
      user.maxTokensPerReq
    );

    const totalTokens =
      aiResult.promptTokens +
      aiResult.completionTokens;

    const cost = calculateCost(
      model,
      aiResult.promptTokens,
      aiResult.completionTokens
    );

    await prisma.execution.create({
      data: {
        userId: user.id,
        model,
        promptTokens: aiResult.promptTokens,
        completionTokens:
          aiResult.completionTokens,
        totalTokens,
        cost
      }
    });

    return NextResponse.json({
      content: aiResult.content,
      usage: {
        promptTokens:
          aiResult.promptTokens,
        completionTokens:
          aiResult.completionTokens,
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
