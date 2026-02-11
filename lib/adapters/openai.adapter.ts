import OpenAI from "openai";

/* ===============================
   環境変数チェック
=============================== */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined");
}

/* ===============================
   クライアント初期化
=============================== */

const client = new OpenAI({
  apiKey: OPENAI_API_KEY
});

/* ===============================
   型定義
=============================== */

type OpenAIResult = {
  content: string;
  promptTokens: number;
  completionTokens: number;
};

/* ===============================
   メイン呼び出し
=============================== */

export async function callOpenAI(
  model: string,
  prompt: string,
  maxTokens?: number
): Promise<OpenAIResult> {
  try {
    const response =
      await client.chat.completions.create({
        model,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: maxTokens ?? 1024
      });

    const content =
      response.choices?.[0]?.message?.content ?? "";

    const usage = response.usage;

    return {
      content,
      promptTokens: usage?.prompt_tokens ?? 0,
      completionTokens: usage?.completion_tokens ?? 0
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);

    // OpenAIのエラー構造に対応
    if (error?.status) {
      throw new Error(
        `OpenAI error (${error.status})`
      );
    }

    throw new Error("OpenAI request failed");
  }
}
