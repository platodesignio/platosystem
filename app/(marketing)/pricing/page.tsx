// app/(marketing)/pricing/page.tsx
export default function PricingPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 text-center">
      <h1 className="text-4xl font-semibold mb-8">Pricing</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <Plan
          name="Starter"
          price="$29 / month"
          features={[
            "Up to 5M tokens tracked",
            "Basic alerts",
            "Single workspace",
            "Email support"
          ]}
        />
        <Plan
          name="Pro"
          price="$99 / month"
          features={[
            "Unlimited token tracking",
            "Advanced anomaly detection",
            "Multi-workspace support",
            "Priority support",
            "Audit logs"
          ]}
        />
      </div>
    </section>
  );
}

function Plan({
  name,
  price,
  features
}: {
  name: string;
  price: string;
  features: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
      <h2 className="text-2xl font-semibold mb-4">{name}</h2>
      <p className="text-white/70 mb-6">{price}</p>
      <ul className="text-sm text-white/60 space-y-2 mb-6">
        {features.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>
      <a
        href="/signup"
        className="px-6 py-2 rounded-full bg-white text-black text-sm hover:bg-white/90 transition"
      >
        Choose Plan
      </a>
    </div>
  );
}
