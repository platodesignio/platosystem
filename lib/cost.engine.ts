/* ===============================
   モデル単価定義（USD per 1 token）
   ※ 必要に応じて更新する
=============================== */

type Pricing = {
  prompt: number;
  completion: number;
};

const MODEL_PRICING: Record<string, Pricing> = {
  "gpt-4o": {
    prompt: 0.000005,
    completion: 0.000015
  },
  "gpt-4o-mini": {
    prompt: 0.0000003,
    completion: 0.0000012
  }
};

/* ===============================
   コスト計算
=============================== */

export function calculateCost(
  model: string,
  promptTokens: number,
  completionTokens: number
): number {
  const pricing = MODEL_PRICING[model];

  if (!pricing) {
    throw new Error("Unsupported model for pricing");
  }

  const promptCost =
    promptTokens * pricing.prompt;

  const completionCost =
    completionTokens * pricing.completion;

  const total = promptCost + completionCost;

  // 小数誤差防止（USD 6桁精度）
  return Number(total.toFixed(6));
}

/* ===============================
   モデル一覧取得（UI用）
=============================== */

export function getSupportedModels(): string[] {
  return Object.keys(MODEL_PRICING);
}
