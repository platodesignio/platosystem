// app/(app)/reports/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function ReportsPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return <Empty message="No workspace selected." />;

  const jobs = await prisma.exportJob.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" },
    take: 20
  });

  return (
    <div className="space-y-12">
      <section className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="mt-2 text-sm text-white/60">
            Generate CSV/PDF exports for finance, audit, and analysis.
          </p>
        </div>
        <Link
          href="/reports/exports"
          className="px-4 py-2 rounded-full bg-white text-black text-sm hover:bg-white/90 transition"
        >
          New Export
        </Link>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4">Type</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Created</th>
              <th className="text-right px-6 py-4">File</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr
                key={j.id}
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="px-6 py-4">{j.kind}</td>
                <td className="px-6 py-4">{j.status}</td>
                <td className="px-6 py-4">
                  {j.createdAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-6 py-4 text-right">
                  {j.filePath ? (
                    <a
                      href={j.filePath}
                      className="hover:text-white transition"
                    >
                      Download
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-white/60"
                >
                  No exports generated.
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
