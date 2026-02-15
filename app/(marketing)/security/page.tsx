// app/(marketing)/security/page.tsx
export default function SecurityPage() {
  return (
    <section className="max-w-4xl mx-auto px-6 space-y-10">
      <h1 className="text-4xl font-semibold text-center">Security</h1>

      <div className="space-y-6 text-white/70 leading-relaxed text-sm">
        <p>
          Plato System enforces strict access control, secure session handling,
          encrypted API keys, and audit logging across all workspace operations.
        </p>
        <p>
          Production deployments use TLS, hardened HTTP headers, and isolated
          environment variables within Vercel.
        </p>
        <p>
          Stripe billing and provider integrations use signed webhooks and
          signature verification to prevent tampering.
        </p>
      </div>
    </section>
  );
}
