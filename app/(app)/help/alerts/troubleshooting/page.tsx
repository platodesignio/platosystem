// app/(app)/help/troubleshooting/page.tsx
export default function TroubleshootingPage() {
  return (
    <div className="space-y-12 max-w-3xl">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Troubleshooting</h1>
        <p className="mt-2 text-sm text-white/60">
          Common issues in Vercel + Postgres + Prisma deployments.
        </p>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-7 space-y-4 text-sm text-white/60 leading-relaxed">
        <div>
          If pages show “No workspace selected”, ensure the workspace cookie is set at login or onboarding.
        </div>
        <div>
          If Prisma fails on Vercel, confirm DATABASE_URL is configured and migrations were applied.
        </div>
        <div>
          If ingestion returns 401, verify you are sending x-plato-key and the key is not revoked.
        </div>
        <div>
          If costs are zero, import provider rates in Integrations, or pass costUsd explicitly in ingestion payload.
        </div>
      </div>
    </div>
  );
}
