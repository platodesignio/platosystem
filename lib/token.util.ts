/* ===============================
   トークン推定ロジック
   - 英語: 約4文字 ≒ 1 token
   - 日本語: 約1.5〜2文字 ≒ 1 token
   安全側に倒して計算する
=============================== */

function containsJapanese(text: string): boolean {
  return /[\u3040-\u30ff\u3400-\u9fff]/.test(text);
}

/* ===============================
   単純推定（高速）
=============================== */

export function estimateTokens(
  text: string
): number {
  if (!text) return 0;

  const length = text.length;

  if (containsJapanese(text)) {
    // 日本語はトークン効率が低い
    return Math.ceil(length / 2);
  }

  // 英語・その他
  return Math.ceil(length / 4);
}

/* ===============================
   メッセージ配列対応（将来拡張）
=============================== */

export function estimateChatTokens(
  messages: { role: string; content: string }[]
): number {
  if (!messages || messages.length === 0) {
    return 0;
  }

  let total = 0;

  for (const message of messages) {
    total += estimateTokens(message.content);
    total += 4; // role + metadata overhead 推定
  }

  return total;
}
