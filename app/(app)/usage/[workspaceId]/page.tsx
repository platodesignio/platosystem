// app/(app)/usage/[workspaceId]/page.tsx
import { prisma } from "@/lib/db/prisma";
import { notFound } from "next/navigation";

export default async function WorkspaceUsagePage({
  params
}: {
  params: { workspaceId: string };
}) {
  const workspace = await prisma.workspace.findUnique({
    where: { id: params.workspaceId }
  });

  if (!workspace) return notFound();

  const total = await prisma.usageEvent.aggregate({
    where: { workspaceId: params.workspaceId },
    _sum: { totalTokens: true, costUsd: true }
  });

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        {workspace.name} Usage
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricCard
          label="Total Tokens"
          value={total._sum.totalTokens ?? 0}
        />
        <MetricCard
          label="Total Cost (USD)"
          value={Number(total._sum.costUsd ?? 0).toFixed(2)}
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}
