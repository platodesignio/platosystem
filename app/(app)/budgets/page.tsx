// app/(app)/budgets/page.tsx
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";
import Link from "next/link";

async function getWorkspaceId() {
  const c = cookies();
  return c.get("plato_workspace")?.value || null;
}

export default async function BudgetsPage() {
  const workspaceId = await getWorkspaceId();

  if (!workspaceId) {
    return <Empty message="No workspace selected." />;
  }

  const budgets = await prisma.budget.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-12">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
          <p className="text-sm text-white/60 mt-2">
            Define spending constraints and threshold policies.
          </p>
        </div>
        <Link
          href="/budgets/new"
          className="px-4 py-2 rounded-full bg-white text-black text-sm hover:bg-white/90 transition"
        >
          Create Budget
        </Link>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-right px-6 py-4">Amount (USD)</th>
              <th className="text-right px-6 py-4">Threshold %</th>
              <th className="text-right px-6 py-4">Active</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => (
              <tr
                key={b.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4">
                  <Link
                    href={`/budgets/${b.id}`}
                    className="hover:text-white transition"
                  >
                    {b.name}
                  </Link>
                </td>
                <td className="px-6 py-4 text-right">
                  {Number(b.amountUsd).toFixed(2)}
                </td>
                <td className="px-6 py-4 text-right">{b.thresholdPct}%</td>
                <td className="px-6 py-4 text-right">
                  {b.isActive ? "Yes" : "No"}
                </td>
              </tr>
            ))}
            {budgets.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-white/60"
                >
                  No budgets defined.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
      {message}
    </div>
  );
}
