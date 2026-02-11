import OpenAI from "openai";

/* ===============================
   実行時にクライアント生成
=============================== */

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not defined");
  }

  return new OpenAI({
    apiKey
  });
}

/* ===============================
   型
=============================== */

type OpenAIResult = {
  content: string;
  promptTokens: number;
  completionTokens: number;
};

/* ===============================
   呼び出し
=============================== */

export async function callOpenAI(
  model: string,
  prompt: string,
  maxTokens?: number
): Promise<OpenAIResult> {
  const client = getClient();

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
    completionTokens:
      usage?.completion_tokens ?? 0
  };
}

