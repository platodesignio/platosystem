// app/(app)/integrations/google/page.tsx
export default function GoogleIntegrationPage() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Google</h1>
        <p className="mt-2 text-sm text-white/60">
          This connector surface is reserved for future expansion. Current production usage ingestion is provider-agnostic.
        </p>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-white/60 leading-relaxed">
        When Google model usage is added, provider-specific normalization and pricing import will be implemented here while keeping the same
        metering pipeline and reporting UI.
      </div>
    </div>
  );
}
