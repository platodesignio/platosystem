import OpenAI from "openai";

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
      await client.responses.create({
        model,
        input: prompt
      });

    const output =
      response.output_text ?? "";

    const usage = response.usage ?? {
      input_tokens: 0,
      output_tokens: 0
    };

    return {
      output,
      promptTokens:
        usage.input_tokens ?? 0,
      completionTokens:
        usage.output_tokens ?? 0
    };
  } catch (error) {
    console.error(
      "OPENAI FULL ERROR:",
      error
    );
    throw error;
  }
}
