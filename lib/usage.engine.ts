import { prisma } from "./prisma";

/* ===============================
   今月使用額取得
=============================== */

export async function getCurrentMonthUsage(
  userId: string
): Promise<number> {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const result = await prisma.execution.aggregate({
    where: {
      userId,
      createdAt: {
        gte: startOfMonth
      }
    },
    _sum: {
      cost: true
    }
  });

  return result._sum.cost ?? 0;
}

