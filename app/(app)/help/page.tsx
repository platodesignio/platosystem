// app/(app)/help/page.tsx
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Help</h1>
        <p className="mt-2 text-sm text-white/60">
          Quickstart, ingestion examples, alerts, and troubleshooting.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          title="Quickstart"
          subtitle="Get your workspace ready in 5 minutes."
          href="/help/quickstart"
          badge="Start"
        />
        <Card
          title="Ingestion API"
          subtitle="Send usage events into Plato System."
          href="/help/ingestion"
          badge="API"
        />
        <Card
          title="Alerts"
          subtitle="Rules, incidents, and delivery channels."
          href="/help/alerts"
          badge="Ops"
        />
        <Card
          title="Troubleshooting"
          subtitle="Common deployment and runtime issues."
          href="/help/troubleshooting"
          badge="Fix"
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
