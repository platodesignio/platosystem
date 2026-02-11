import { prisma } from "@/lib/prisma";

export async function getMonthlyUsage(
  userId: string
) {
  const now = new Date();

  const firstDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const result =
    await prisma.execution.aggregate({
      where: {
        userId,
        createdAt: {
          gte: firstDay
        }
      },
      _sum: {
        totalCost: true,
        promptTokens: true,
        completionTokens: true
      },
      _count: true
    });

  const totalTokens =
    (result._sum.promptTokens || 0) +
    (result._sum.completionTokens ||
      0);

  return {
    used:
      result._sum.totalCost || 0,
    totalTokens,
    executionCount:
      result._count || 0
  };
}
