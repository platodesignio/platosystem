// app/(app)/settings/audit/page.tsx
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function AuditPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
        No workspace selected.
      </div>
    );
  }

  const events = await prisma.auditEvent.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Audit Logs</h1>
        <p className="mt-2 text-sm text-white/60">Immutable events for governance, operations, and traceability.</p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4">Time</th>
              <th className="text-left px-6 py-4">Actor</th>
              <th className="text-left px-6 py-4">Action</th>
              <th className="text-left px-6 py-4">Target</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4 text-white/70">{e.createdAt.toISOString()}</td>
                <td className="px-6 py-4">{e.actorType}</td>
                <td className="px-6 py-4">{e.action}</td>
                <td className="px-6 py-4 text-white/70">
                  {e.targetType ? `${e.targetType}${e.targetId ? `:${e.targetId}` : ""}` : "-"}
                </td>
              </tr>
            ))}
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-white/60">
                  No audit events.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </div>
  );
}
