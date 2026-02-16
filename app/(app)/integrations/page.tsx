// app/(app)/integrations/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function IntegrationsPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
        No workspace selected.
      </div>
    );
  }

  const providers = await prisma.providerRate.findMany({
    where: { workspaceId },
    orderBy: [{ provider: "asc" }, { model: "asc" }],
    take: 12
  });

  const webhookCount = await prisma.webhookEndpoint.count({
    where: { workspaceId, isEnabled: true }
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Integrations</h1>
        <p className="mt-2 text-sm text-white/60">
          Connect providers, sync pricing, and configure outgoing webhooks for alerts and automation.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          title="OpenAI"
          subtitle="Validate key, import rates, and verify ingestion."
          href="/integrations/openai"
          badge="Provider"
        />
        <Card
          title="Anthropic"
          subtitle="Validate key, import rates, and verify ingestion."
          href="/integrations/anthropic"
          badge="Provider"
        />
        <Card
          title="Google"
          subtitle="Placeholder connector surface for future expansion."
          href="/integrations/google"
          badge="Provider"
        />
        <Card
          title="Slack"
          subtitle="Connect workspace notifications (optional)."
          href="/integrations/slack"
          badge="Notify"
        />
        <Card
          title="Webhooks"
          subtitle={`Manage endpoints. Enabled: ${webhookCount}`}
          href="/integrations/webhook"
          badge="Outbound"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-medium">Current provider rates</h2>
            <p className="mt-1 text-xs text-white/50">
              Rates are used to convert usage into cost. You can import or override them per workspace.
            </p>
          </div>
          <Link
            href="/integrations/openai"
            className="text-sm text-white/60 hover:text-white transition"
          >
            Manage rates →
          </Link>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-white/60 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4">Provider</th>
                <th className="text-left px-6 py-4">Model</th>
                <th className="text-right px-6 py-4">Input / 1M</th>
                <th className="text-right px-6 py-4">Output / 1M</th>
                <th className="text-right px-6 py-4">Currency</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((r) => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition">
                  <td className="px-6 py-4">{r.provider}</td>
                  <td className="px-6 py-4">{r.model}</td>
                  <td className="px-6 py-4 text-right">{Number(r.inputPer1M).toFixed(4)}</td>
                  <td className="px-6 py-4 text-right">{Number(r.outputPer1M).toFixed(4)}</td>
                  <td className="px-6 py-4 text-right">{r.currency}</td>
                </tr>
              ))}
              {providers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-white/60">
                    No rates found. Import from a provider page to start.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Card({
  title,
  subtitle,
  href,
  badge
}: {
  title: string;
  subtitle: string;
  href: string;
  badge: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/60">{badge}</div>
        <div className="h-2 w-2 rounded-full bg-white/40" />
      </div>
      <div className="mt-4 text-xl font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-white/60 leading-relaxed">{subtitle}</div>
      <div className="mt-6 text-sm text-white/60">Open →</div>
    </Link>
  );
}
