// app/(app)/budgets/[budgetId]/page.tsx
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";

export default async function BudgetDetailPage({
  params
}: {
  params: { budgetId: string };
}) {
  const budget = await prisma.budget.findUnique({
    where: { id: params.budgetId }
  });

  if (!budget) return notFound();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        {budget.name}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card label="Amount (USD)" value={Number(budget.amountUsd).toFixed(2)} />
        <Card label="Threshold %" value={`${budget.thresholdPct}%`} />
        <Card label="Status" value={budget.isActive ? "Active" : "Inactive"} />
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-3 text-xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
