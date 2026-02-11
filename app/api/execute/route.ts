import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { prisma } =
      await import("@/lib/prisma");
    const { verifyToken } =
      await import("@/lib/auth");
    const { calculateCost } =
      await import("@/lib/cost.engine");
    const { runOpenAI } =
      await import(
        "@/lib/adapters/openai.adapter"
      );

    // ===== 認証 =====
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

    const user =
      await prisma.user.findUnique({
        where: {
          id: decoded.userId
        }
      });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ===== 入力取得 =====
    const body =
      await req.json();

    const prompt =
      body.prompt;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // ===== モデルを強制固定 =====
    const model = "gpt-4o";

    // ===== OpenAI 実行 =====
    const result =
      await runOpenAI(
        model,
        prompt
      );

    // ===== コスト計算 =====
    const cost = calculateCost(
      model,
      result.promptTokens,
      result.completionTokens
    );

    // ===== DB保存 =====
    const execution =
      await prisma.execution.create({
        data: {
          userId: user.id,
          model,
          prompt,
          output: result.output,
          promptTokens:
            result.promptTokens,
          completionTokens:
            result.completionTokens,
          totalCost: cost
        }
      });

    return NextResponse.json({
      output: result.output,
      cost,
      executionId: execution.id
    });
  } catch (error) {
    console.error(
      "Execute error:",
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
