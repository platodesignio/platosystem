// app/(app)/help/alerts/page.tsx
import Link from "next/link";

export default function AlertsHelpPage() {
  return (
    <div className="space-y-12 max-w-3xl">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Alerts</h1>
        <p className="mt-2 text-sm text-white/60">
          Rules create incidents when thresholds are crossed. Incidents can deliver to Slack or webhooks.
        </p>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-7 space-y-4 text-sm text-white/60 leading-relaxed">
        <div>
          Rules live in <Link className="text-white/80 hover:text-white transition" href="/alerts/rules">Alerts → Rules</Link>. They define trigger conditions
          such as budget consumption percent, daily spend spike, or error-rate anomalies.
        </div>
        <div>
          Incidents live in <Link className="text-white/80 hover:text-white transition" href="/alerts/incidents">Alerts → Incidents</Link>. Each incident has a
          status (OPEN/ACK/RESOLVED) and severity.
        </div>
        <div>
          Delivery is configured in <Link className="text-white/80 hover:text-white transition" href="/integrations">Integrations</Link>.
        </div>
      </div>
    </div>
  );
}
