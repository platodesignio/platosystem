// app/(app)/billing/invoices/page.tsx
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function InvoicesPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return <Empty message="No workspace selected." />;

  const items = await prisma.auditEvent.findMany({
    where: {
      workspaceId,
      action: { in: ["billing.invoice.created", "billing.invoice.paid"] }
    },
    orderBy: { createdAt: "desc" },
    take: 25
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
        <p className="mt-2 text-sm text-white/60">
          Invoice activity is recorded in audit logs. Stripe Portal provides official PDFs.
        </p>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="text-white/60 border-b border-white/10">
            <tr>
              <th className="text-left px-6 py-4">Event</th>
              <th className="text-left px-6 py-4">Created</th>
              <th className="text-right px-6 py-4">Detail</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => (
              <tr key={e.id} className="border-b border-white/5 hover:bg-white/5 transition">
                <td className="px-6 py-4">{e.action}</td>
                <td className="px-6 py-4">{e.createdAt.toISOString().slice(0, 10)}</td>
                <td className="px-6 py-4 text-right text-white/70">
                  {e.metadataJson ? "Recorded" : "-"}
                </td>
              </tr>
            ))}
            {items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-10 text-center text-white/60">
                  No invoice events recorded yet.
                </td>
              </tr>
            ) : null}
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
