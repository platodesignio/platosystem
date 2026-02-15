// app/(marketing)/docs/page.tsx
export default function DocsPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 space-y-12">
      <h1 className="text-4xl font-semibold text-center">Documentation</h1>

      <DocSection
        title="Usage Ingestion API"
        body="Send usage data to /api/usage/ingest with a valid workspace API key. Supports token-level and request-level tracking."
      />

      <DocSection
        title="Budget Evaluation"
        body="Budgets are evaluated automatically by scheduled background jobs or via /api/budgets/evaluate."
      />

      <DocSection
        title="Exports"
        body="Generate CSV or PDF reports via /api/reports/generate. Files are stored and retrievable from the dashboard."
      />
    </section>
  );
}

function DocSection({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-8">
      <h2 className="text-xl font-medium mb-4">{title}</h2>
      <p className="text-white/60 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
