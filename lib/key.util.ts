import crypto from "crypto";

/* ===============================
   APIキー生成
   例: plato_live_xxxxxxxxxxxxxxxxx
=============================== */

const KEY_PREFIX = "plato_live_";
const KEY_BYTE_LENGTH = 32; // 256bit

export function generateApiKey(): string {
  const randomPart = crypto
    .randomBytes(KEY_BYTE_LENGTH)
    .toString("hex");

  return `${KEY_PREFIX}${randomPart}`;
}

/* ===============================
   APIキーのハッシュ化
   DBにはこの値のみ保存
=============================== */

export function hashApiKey(
  apiKey: string
): string {
  return crypto
    .createHash("sha256")
    .update(apiKey)
    .digest("hex");
}

/* ===============================
   安全比較（将来用）
   timing attack 対策
=============================== */

export function safeCompare(
  a: string,
  b: string
): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    bufferA,
    bufferB
  );
}
