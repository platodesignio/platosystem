// app/(app)/integrations/slack/page.tsx
"use client";

import { useState } from "react";

type ApiRes = { ok?: boolean; error?: string; message?: string };

export default function SlackIntegrationPage() {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg(null);

    try {
      const res = await fetch("/api/integrations/slack/connect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ webhookUrl })
      });
      const j = (await res.json().catch(() => ({}))) as ApiRes;
      if (!res.ok) {
        setMsg(j.error || "Failed to save.");
        return;
      }
      setMsg(j.message || "Saved.");
    } catch {
      setMsg("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Slack</h1>
        <p className="mt-2 text-sm text-white/60">
          Optional notifications. For a simple production setup, store an Incoming Webhook URL and deliver incident notifications.
        </p>
      </section>

      <form onSubmit={save} className="max-w-xl rounded-2xl border border-white/10 bg-white/5 p-8 space-y-5">
        <div className="space-y-2">
          <div className="text-xs text-white/60">Incoming Webhook URL</div>
          <input
            className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/25"
            placeholder="https://hooks.slack.com/services/…"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
          <div className="text-xs text-white/45">
            Stored server-side in workspace settings metadata, used by alert notifier when Slack is enabled in a rule.
          </div>
        </div>

        {msg ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
            {msg}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 transition"
        >
          {busy ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
