// app/page.tsx
export default function HomePage() {
  return (
    <section className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] px-6">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
      <div className="max-w-4xl text-center space-y-10 relative z-10">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          AI Cost. <span className="text-white/50">Controlled.</span>
        </h1>
        <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">
          Real-time usage tracking, budget enforcement, anomaly detection, and
          billing integration for production AI systems.
        </p>
        <div className="flex items-center justify-center gap-6">
          <a
            href="/dashboard"
            className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition shadow-glow"
          >
            Open Dashboard
          </a>
          <a
            href="/docs"
            className="px-6 py-3 rounded-full border border-white/20 text-sm text-white/70 hover:text-white hover:border-white/40 transition"
          >
            Documentation
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
          <FeatureCard
            title="Usage Intelligence"
            desc="Token-level and request-level tracking with historical rollups."
          />
          <FeatureCard
            title="Budget Enforcement"
            desc="Threshold alerts, anomaly spikes, and automatic detection."
          />
          <FeatureCard
            title="Enterprise Ready"
            desc="Role-based access control, audit logs, billing, exports."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  desc
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:border-white/20 transition">
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}
