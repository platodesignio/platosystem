// app/(app)/integrations/webhook/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ApiRes = { ok?: boolean; error?: string };

export default function NewWebhookPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);

    try {
      const res = await fetch("/api/integrations/webhooks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, url })
      });
      const j = (await res.json().catch(() => ({}))) as ApiRes;
      if (!res.ok) {
        setErr(j.error || "Failed to create webhook.");
        return;
      }
      router.push("/integrations/webhook");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">New webhook endpoint</h1>

      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-5">
        <div className="space-y-2">
          <div className="text-xs text-white/60">Name</div>
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs text-white/60">URL</div>
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
            placeholder="https://example.com/webhook"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>

        {err ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
            {err}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 transition"
        >
          {busy ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
}
