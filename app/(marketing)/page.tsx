// app/(marketing)/page.tsx
export default function MarketingHome() {
  return (
    <section className="max-w-6xl mx-auto px-6">
      <div className="text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">
          Control AI Economics.
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          Plato System provides real-time cost intelligence, budget enforcement,
          anomaly detection, and enterprise-grade governance for AI infrastructure.
        </p>
        <div className="flex justify-center gap-6 pt-6">
          <a
            href="/signup"
            className="px-6 py-3 rounded-full bg-white text-black hover:bg-white/90 transition"
          >
            Start Free
          </a>
          <a
            href="/pricing"
            className="px-6 py-3 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition"
          >
            View Pricing
          </a>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24">
        <Feature
          title="Real-time Usage"
          desc="Track tokens, requests, model-level cost, and usage patterns in real time."
        />
        <Feature
          title="Budgets & Alerts"
          desc="Define spending thresholds and detect abnormal spikes instantly."
        />
        <Feature
          title="Audit & Compliance"
          desc="Role-based access, audit logs, and structured reporting."
        />
      </div>
    </section>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl hover:border-white/20 transition">
      <h3 className="text-xl font-medium mb-4">{title}</h3>
      <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
