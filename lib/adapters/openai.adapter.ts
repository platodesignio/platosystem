import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    "OPENAI_API_KEY is not defined"
  );
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export type OpenAIResult = {
  output: string;
  promptTokens: number;
  completionTokens: number;
};

export async function runOpenAI(
  model: string,
  prompt: string
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
        ]
      });

    return {
      output:
        response.choices[0]
          ?.message?.content ?? "",
      promptTokens:
        response.usage
          ?.prompt_tokens ?? 0,
      completionTokens:
        response.usage
          ?.completion_tokens ?? 0
    };
  } catch (error) {
    console.error(
      "OPENAI ERROR:",
      error
    );
    throw error;
  }
}
