// app/(app)/alerts/rules/page.tsx
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function RulesPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return <Empty message="No workspace selected." />;

  const rules = await prisma.alertRule.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-semibold tracking-tight">Alert Rules</h1>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-left px-6 py-4">Type</th>
              <th className="text-right px-6 py-4">Severity</th>
              <th className="text-right px-6 py-4">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr
                key={r.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4">{r.name}</td>
                <td className="px-6 py-4">{r.type}</td>
                <td className="px-6 py-4 text-right">{r.severity}</td>
                <td className="px-6 py-4 text-right">
                  {r.isEnabled ? "Yes" : "No"}
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-white/60"
                >
                  No rules defined.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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
