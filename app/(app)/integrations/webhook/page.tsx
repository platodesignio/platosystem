// app/(app)/integrations/webhook/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function WebhooksPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
        No workspace selected.
      </div>
    );
  }

  const hooks = await prisma.webhookEndpoint.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-12">
      <section className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Webhooks</h1>
          <p className="mt-2 text-sm text-white/60">
            Outbound delivery targets for incident notifications and automation.
          </p>
        </div>
        <Link
          href="/integrations/webhook/new"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90 transition"
        >
          New endpoint
        </Link>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-left px-6 py-4">URL</th>
              <th className="text-right px-6 py-4">Enabled</th>
            </tr>
          </thead>
          <tbody>
            {hooks.map((h) => (
              <tr key={h.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4">{h.name}</td>
                <td className="px-6 py-4 text-white/70">{h.url}</td>
                <td className="px-6 py-4 text-right">{h.isEnabled ? "Yes" : "No"}</td>
              </tr>
            ))}
            {hooks.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-white/60">
                  No webhook endpoints.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-white/60 leading-relaxed">
        Endpoints are signed using a per-endpoint secret. Delivery is performed by the alert notifier on incident creation/update.
      </div>
    </div>
  );
}
