// app/(app)/help/ingestion/page.tsx
export default function IngestionHelpPage() {
  return (
    <div className="space-y-12 max-w-3xl">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Ingestion API</h1>
        <p className="mt-2 text-sm text-white/60">
          Provider-agnostic metering endpoint for cost and usage intelligence.
        </p>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-7 space-y-4">
        <div className="text-sm font-medium">Endpoint</div>
        <div className="text-sm text-white/60">
          POST <span className="font-mono text-white/80">/api/usage/ingest</span>
        </div>

        <div className="text-sm font-medium pt-4">Header</div>
        <div className="text-sm text-white/60">
          <span className="font-mono text-white/80">x-plato-key</span>: ingestion key
        </div>

        <div className="text-sm font-medium pt-4">Body (concept)</div>
        <div className="text-sm text-white/60 leading-relaxed">
          model, provider, inputTokens, outputTokens, totalTokens, requestCount, occurredAt, and optional costUsd. If costUsd is omitted, the server
          computes cost from ProviderRate for the matching provider+model.
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-7 text-sm text-white/60 leading-relaxed">
        If you need strict governance, send your internal requestId and userId hash in metadata. The system stores an immutable usage event and updates
        the daily rollup for reporting.
      </div>
    </div>
  );
}
