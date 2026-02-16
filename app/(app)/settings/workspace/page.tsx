// app/(app)/settings/workspace/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type WsRes = {
  ok?: boolean;
  error?: string;
  workspace?: { id: string; name: string; slug: string };
};

export default function WorkspaceSettingsPage() {
  const router = useRouter();
  const [busyLoad, setBusyLoad] = useState(true);
  const [busySave, setBusySave] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setBusyLoad(true);
      setErr(null);
      try {
        const res = await fetch("/api/workspace/current", { method: "GET" });
        const j = (await res.json().catch(() => ({}))) as WsRes;
        if (!res.ok) {
          if (!cancelled) setErr(j.error || "Failed to load workspace.");
          return;
        }
        if (!cancelled) {
          setName(j.workspace?.name || "");
          setSlug(j.workspace?.slug || "");
        }
      } catch {
        if (!cancelled) setErr("Network error.");
      } finally {
        if (!cancelled) setBusyLoad(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (busySave) return;
    setBusySave(true);
    setErr(null);
    setOk(null);

    try {
      const res = await fetch("/api/workspace/current", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, slug })
      });
      const j = (await res.json().catch(() => ({}))) as WsRes;
      if (!res.ok) {
        setErr(j.error || "Failed to save.");
        return;
      }
      setOk("Saved.");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusySave(false);
    }
  }

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Workspace</h1>
        <p className="mt-2 text-sm text-white/60">Workspace identity used across reports, billing, and audit logs.</p>
      </section>

      <section className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8">
        {busyLoad ? (
          <div className="text-sm text-white/60">Loading…</div>
        ) : (
          <form onSubmit={save} className="space-y-6">
            <Field label="Workspace name">
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Field>

            <Field label="Workspace slug">
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </Field>

            {err ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
                {err}
              </div>
            ) : null}

            {ok ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
                {ok}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={busySave}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 transition"
            >
              {busySave ? "Saving…" : "Save"}
            </button>
          </form>
        )}
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
