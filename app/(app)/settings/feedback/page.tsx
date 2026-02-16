// app/(app)/settings/feedback/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

type Res = { ok?: boolean; error?: string; id?: string; runId?: string };

export default function FeedbackPage() {
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [res, setRes] = useState<Res | null>(null);

  const runId = useMemo(() => {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
    return `run_${Math.random().toString(16).slice(2)}_${Date.now()}`;
  }, []);

  useEffect(() => {
    setRes(null);
  }, [pathname]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setRes(null);

    try {
      const payload = {
        runId,
        pagePath: pathname,
        message,
        context: {
          reporterEmail: email || null,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
          ts: new Date().toISOString()
        }
      };

      const r = await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });

      const j = (await r.json().catch(() => ({}))) as Res;
      if (!r.ok) {
        setRes({ error: j.error || "Failed to submit." });
        return;
      }

      setRes(j);
      setMessage("");
    } catch {
      setRes({ error: "Network error." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Feedback</h1>
        <p className="mt-2 text-sm text-white/60">
          Submit feedback linked to a runId for traceability and debugging.
        </p>
      </section>

      <section className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8">
        <div className="text-xs text-white/60">runId</div>
        <div className="mt-2 font-mono text-sm text-white/80 break-all">{runId}</div>
        <div className="mt-2 text-xs text-white/45">
          Include this runId in screenshots or support conversations. It is stored together with your message.
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <Field label="Email (optional)">
            <input
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              inputMode="email"
            />
          </Field>

          <Field label="Message">
            <textarea
              className="min-h-[140px] w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What should be improved, what broke, what you expected, and what you saw."
              required
            />
          </Field>

          {res?.error ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
              {res.error}
            </div>
          ) : null}

          {res?.ok ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
              Submitted. Stored as feedback id {res.id}. runId {res.runId}.
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 transition"
          >
            {busy ? "Sending…" : "Send feedback"}
          </button>
        </form>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-white/60">{label}</div>
      {children}
    </div>
  );
}
