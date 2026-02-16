// app/(app)/settings/profile/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type MeRes = {
  ok?: boolean;
  error?: string;
  user?: { id: string; email: string; name: string | null; createdAt: string };
  workspace?: { id: string; name: string; slug: string };
};

export default function ProfileSettingsPage() {
  const [busy, setBusy] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<MeRes | null>(null);

  const created = useMemo(() => {
    const c = data?.user?.createdAt;
    if (!c) return null;
    return c.slice(0, 10);
  }, [data]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setBusy(true);
      setErr(null);
      try {
        const res = await fetch("/api/auth/me", { method: "GET" });
        const j = (await res.json().catch(() => ({}))) as MeRes;
        if (!res.ok) {
          if (!cancelled) setErr(j.error || "Failed to load profile.");
          return;
        }
        if (!cancelled) setData(j);
      } catch {
        if (!cancelled) setErr("Network error.");
      } finally {
        if (!cancelled) setBusy(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-sm text-white/60">Account and workspace context.</p>
      </section>

      <section className="max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-8">
        {busy ? (
          <div className="text-sm text-white/60">Loading…</div>
        ) : err ? (
          <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
            {err}
          </div>
        ) : (
          <div className="space-y-8">
            <Row label="Email" value={data?.user?.email || "-"} />
            <Row label="Name" value={data?.user?.name || "-"} />
            <Row label="Created" value={created || "-"} />
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="text-sm font-medium">Workspace</div>
              <Row label="Name" value={data?.workspace?.name || "-"} />
              <Row label="Slug" value={data?.workspace?.slug || "-"} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="text-xs text-white/60">{label}</div>
      <div className="text-sm text-white/80">{value}</div>
    </div>
  );
}
