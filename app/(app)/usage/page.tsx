// app/(app)/usage/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { startOfDay, subDays } from "date-fns";

async function getWorkspaceIdFromCookie() {
  const c = cookies();
  return c.get("plato_workspace")?.value || null;
}

export default async function UsagePage() {
  const workspaceId = await getWorkspaceIdFromCookie();

  if (!workspaceId) {
    return (
      <EmptyState message="No workspace selected." />
    );
  }

  const since = startOfDay(subDays(new Date(), 30));

  const totals = await prisma.usageEvent.aggregate({
    where: {
      workspaceId,
      occurredAt: { gte: since }
    },
    _sum: {
      inputTokens: true,
      outputTokens: true,
      totalTokens: true,
      costUsd: true,
      requestCount: true
    }
  });

  const byModel = await prisma.usageEvent.groupBy({
    by: ["model"],
    where: {
      workspaceId,
      occurredAt: { gte: since }
    },
    _sum: {
      totalTokens: true,
      costUsd: true
    },
    orderBy: {
      _sum: { costUsd: "desc" }
    }
  });

  const daily = await prisma.usageDailyRollup.findMany({
    where: {
      workspaceId,
      day: { gte: since }
    },
    orderBy: { day: "asc" }
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Usage</h1>
        <p className="text-sm text-white/60 mt-2">
          Last 30 days overview across tokens, requests, and cost.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          label="Total Tokens"
          value={totals._sum.totalTokens ?? 0}
        />
        <MetricCard
          label="Input Tokens"
          value={totals._sum.inputTokens ?? 0}
        />
        <MetricCard
          label="Output Tokens"
          value={totals._sum.outputTokens ?? 0}
        />
        <MetricCard
          label="Cost (USD)"
          value={Number(totals._sum.costUsd ?? 0).toFixed(2)}
        />
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">By Model</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-white/60 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4">Model</th>
                <th className="text-right px-6 py-4">Tokens</th>
                <th className="text-right px-6 py-4">Cost (USD)</th>
              </tr>
            </thead>
            <tbody>
              {byModel.map((row) => (
                <tr
                  key={row.model}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4">{row.model}</td>
                  <td className="px-6 py-4 text-right">
                    {row._sum.totalTokens ?? 0}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {Number(row._sum.costUsd ?? 0).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">Daily Rollup</h2>
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-white/60 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-right px-6 py-4">Tokens</th>
                <th className="text-right px-6 py-4">Requests</th>
                <th className="text-right px-6 py-4">Cost (USD)</th>
              </tr>
            </thead>
            <tbody>
              {daily.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-6 py-4">
                    {d.day.toISOString().slice(0, 10)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {d.totalTokens}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {d.requestCount}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {Number(d.costUsd).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pt-4">
        <Link
          href="/reports"
          className="text-sm text-white/60 hover:text-white transition"
        >
          Generate detailed report →
        </Link>
      </section>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">
        {value}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
      {message}
    </div>
  );
}
