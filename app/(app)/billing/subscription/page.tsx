// app/(app)/billing/subscription/page.tsx
"use client";

import { useState } from "react";

type ApiRes = { ok?: boolean; error?: string; url?: string };

export default function SubscriptionPage() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function openPortal() {
    if (busy) return;
    setBusy(true);
    setErr(null);

    try {
      const res = await fetch("/api/billing/stripe/portal", { method: "POST" });
      const j = (await res.json().catch(() => ({}))) as ApiRes;

      if (!res.ok) {
        setErr(j.error || "Failed to open billing portal.");
        return;
      }

      if (j.url) window.location.href = j.url;
      else setErr("No portal URL returned.");
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Subscription</h1>
        <p className="mt-2 text-sm text-white/60">
          Manage your plan via Stripe Billing Portal.
        </p>
      </section>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 max-w-xl space-y-6">
        <div className="text-sm text-white/60">
          This product uses Stripe Billing to manage subscriptions, invoices, and payment methods.
        </div>

        {err ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
            {err}
          </div>
        ) : null}

        <button
          onClick={openPortal}
          disabled={busy}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 transition"
        >
          {busy ? "Opening…" : "Open Stripe portal"}
        </button>
      </div>
    </div>
  );
}
