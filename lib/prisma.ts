import { PrismaClient } from "@prisma/client";

/* ===============================
   PrismaClient グローバル管理
   - 開発時のホットリロード対策
   - 本番では単一インスタンス
=============================== */

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined;
}

const prisma =
  global.__prisma__ ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"]
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma__ = prisma;
}

export { prisma };
