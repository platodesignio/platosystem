// app/(app)/help/quickstart/page.tsx
import Link from "next/link";

export default function QuickstartPage() {
  return (
    <div className="space-y-12 max-w-3xl">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Quickstart</h1>
        <p className="mt-2 text-sm text-white/60">
          Minimal path: create an ingestion key, send one event, and verify in Usage.
        </p>
      </section>

      <Block title="1. Create ingestion key">
        Go to <Link className="text-white/80 hover:text-white transition" href="/settings/api-keys">Settings → API Keys</Link> and create an INGEST key.
      </Block>

      <Block title="2. Send one usage event">
        Use the endpoint <Code>/api/usage/ingest</Code> with header <Code>x-plato-key</Code>.
        The payload is provider-agnostic: you send the model, tokens, and optional price metadata.
      </Block>

      <Block title="3. Verify usage">
        Open <Link className="text-white/80 hover:text-white transition" href="/usage">Usage</Link> and confirm the event appears.
        If you imported provider rates, the cost will be computed automatically.
      </Block>

      <Block title="4. Add budgets & alerts">
        Create a budget in <Link className="text-white/80 hover:text-white transition" href="/budgets">Budgets</Link>, then enable a rule in{" "}
        <Link className="text-white/80 hover:text-white transition" href="/alerts/rules">Alerts → Rules</Link>.
      </Block>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-7">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-3 text-sm text-white/60 leading-relaxed">{children}</div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 font-mono text-xs text-white/80">
      {children}
    </span>
  );
}
