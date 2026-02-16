// app/(app)/integrations/anthropic/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ApiRes = { ok?: boolean; error?: string; imported?: number; message?: string };

export default function AnthropicIntegrationPage() {
  const router = useRouter();
  const [busyTest, setBusyTest] = useState(false);
  const [busyImport, setBusyImport] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  async function testKey() {
    if (busyTest) return;
    setBusyTest(true);
    setResult(null);
    try {
      const res = await fetch("/api/integrations/anthropic/test", { method: "POST" });
      const j = (await res.json().catch(() => ({}))) as ApiRes;
      if (!res.ok) {
        setResult(j.error || "Test failed.");
        return;
      }
      setResult(j.message || "Anthropic key OK.");
      router.refresh();
    } catch {
      setResult("Network error.");
    } finally {
      setBusyTest(false);
    }
  }

  async function importRates() {
    if (busyImport) return;
    setBusyImport(true);
    setResult(null);
    try {
      const res = await fetch("/api/integrations/anthropic/import-pricing", { method: "POST" });
      const j = (await res.json().catch(() => ({}))) as ApiRes;
      if (!res.ok) {
        setResult(j.error || "Import failed.");
        return;
      }
      setResult(`Imported ${j.imported ?? 0} rate entries.`);
      router.refresh();
    } catch {
      setResult("Network error.");
    } finally {
      setBusyImport(false);
    }
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Anthropic</h1>
        <p className="mt-2 text-sm text-white/60">
          Validate credentials and import workspace-scoped pricing rates used for cost computation.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Panel
          title="Credential test"
          body="Runs a lightweight server-side check against your configured ANTHROPIC_API_KEY."
          action={
            <button
              onClick={testKey}
              disabled={busyTest}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 transition"
            >
              {busyTest ? "Testing…" : "Test key"}
            </button>
          }
        />
        <Panel
          title="Import pricing"
          body="Writes a curated default rate table into ProviderRate for this workspace."
          action={
            <button
              onClick={importRates}
              disabled={busyImport}
              className="rounded-full border border-white/15 bg-black/30 px-5 py-2.5 text-sm text-white/80 hover:text-white hover:border-white/30 disabled:opacity-60 transition"
            >
              {busyImport ? "Importing…" : "Import rates"}
            </button>
          }
        />
      </section>

      {result ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
          {result}
        </div>
      ) : null}
    </div>
  );
}

function Panel({
  title,
  body,
  action
}: {
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
      <div className="text-lg font-semibold tracking-tight">{title}</div>
      <div className="mt-2 text-sm text-white/60 leading-relaxed">{body}</div>
      <div className="mt-6">{action}</div>
    </div>
  );
}
