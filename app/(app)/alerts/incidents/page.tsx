// app/(app)/alerts/incidents/page.tsx
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function IncidentsPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return <Empty message="No workspace selected." />;

  const incidents = await prisma.incident.findMany({
    where: { workspaceId },
    orderBy: { lastSeenAt: "desc" }
  });

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-semibold tracking-tight">Incidents</h1>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4">Title</th>
              <th className="text-left px-6 py-4">Severity</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-right px-6 py-4">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((i) => (
              <tr
                key={i.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4">{i.title}</td>
                <td className="px-6 py-4">{i.severity}</td>
                <td className="px-6 py-4">{i.status}</td>
                <td className="px-6 py-4 text-right">
                  {i.lastSeenAt.toISOString().slice(0, 10)}
                </td>
              </tr>
            ))}
            {incidents.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-white/60"
                >
                  No incidents.
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
