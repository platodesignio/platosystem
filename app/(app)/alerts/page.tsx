// app/(app)/alerts/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { cookies } from "next/headers";

async function getWorkspaceId() {
  return cookies().get("plato_workspace")?.value || null;
}

export default async function AlertsPage() {
  const workspaceId = await getWorkspaceId();
  if (!workspaceId) return <Empty message="No workspace selected." />;

  const openCount = await prisma.incident.count({
    where: { workspaceId, status: { in: ["OPEN", "ACK"] } }
  });

  const ruleCount = await prisma.alertRule.count({
    where: { workspaceId, isEnabled: true }
  });

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Alerts</h1>
        <p className="mt-2 text-sm text-white/60">
          Budget thresholds, anomaly spikes, error rate detection.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card
          title="Rules"
          value={`${ruleCount}`}
          description="Active alert rules configured."
          href="/alerts/rules"
        />
        <Card
          title="Open Incidents"
          value={`${openCount}`}
          description="Currently unresolved alert incidents."
          href="/alerts/incidents"
        />
      </section>
    </div>
  );
}

function Card({
  title,
  value,
  description,
  href
}: {
  title: string;
  value: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition block"
    >
      <div className="text-sm text-white/60">{title}</div>
      <div className="mt-3 text-3xl font-semibold">{value}</div>
      <div className="mt-4 text-xs text-white/50">{description}</div>
    </Link>
  );
}

function Empty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-white/60">
      {message}
    </div>
  );
}
