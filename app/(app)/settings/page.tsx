// app/(app)/settings/page.tsx
import Link from "next/link";

export default function SettingsHomePage() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-white/60">
          Profile, workspace, API keys, audit logs, and product feedback.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          title="Profile"
          subtitle="Account details and session info."
          href="/settings/profile"
          badge="Account"
        />
        <Card
          title="Workspace"
          subtitle="Rename workspace and manage workspace preferences."
          href="/settings/workspace"
          badge="Org"
        />
        <Card
          title="API Keys"
          subtitle="Create ingestion keys and manage scope."
          href="/settings/api-keys"
          badge="Security"
        />
        <Card
          title="Audit Logs"
          subtitle="Immutable event log for governance and traceability."
          href="/settings/audit"
          badge="Governance"
        />
        <Card
          title="Feedback"
          subtitle="Send feedback with an execution runId for traceability."
          href="/settings/feedback"
          badge="Product"
        />
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
