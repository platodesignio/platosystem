// app/(app)/reports/exports/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewExportPage() {
  const router = useRouter();

  const [type, setType] = useState("usage_csv");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setErr(null);

    try {
      const res = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: type,
          params: {}
        })
      });

      if (!res.ok) {
        const j = await res.json();
        setErr(j.error || "Failed to generate export.");
        return;
      }

      router.push("/reports");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">
        Generate Export
      </h1>

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div className="space-y-2">
          <label className="text-xs text-white/60">Export Type</label>
          <select
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm focus:border-white/30 outline-none"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="usage_csv">Usage CSV</option>
            <option value="usage_pdf">Usage PDF</option>
          </select>
        </div>

        {err && (
          <div className="text-sm text-white/70 bg-black/40 p-3 rounded-xl border border-white/10">
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-white text-black text-sm py-2 hover:bg-white/90 transition"
        >
          {busy ? "Generating…" : "Generate"}
        </button>
      </form>
    </div>
  );
}
