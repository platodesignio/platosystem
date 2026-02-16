// app/(app)/settings/api-keys/ui.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type KeyRow = {
  id: string;
  name: string;
  scope: "INGEST" | "READ" | "ADMIN";
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

type CreateRes = { ok?: boolean; error?: string; apiKey?: string; id?: string };

export default function ApiKeysClient({ initialKeys }: { initialKeys: KeyRow[] }) {
  const router = useRouter();
  const [keys, setKeys] = useState<KeyRow[]>(initialKeys);
  const [name, setName] = useState("");
  const [scope, setScope] = useState<KeyRow["scope"]>("INGEST");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);

  const activeCount = useMemo(() => keys.filter((k) => !k.revokedAt).length, [keys]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setErr(null);
    setCreated(null);

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name, scope })
      });

      const j = (await res.json().catch(() => ({}))) as CreateRes;
      if (!res.ok) {
        setErr(j.error || "Failed to create key.");
        return;
      }

      if (j.apiKey) setCreated(j.apiKey);
      setName("");
      setScope("INGEST");

      router.refresh();
      const listRes = await fetch("/api/api-keys", { method: "GET" });
      if (listRes.ok) {
        const list = (await listRes.json().catch(() => ({}))) as { ok?: boolean; keys?: KeyRow[] };
        if (list.keys) setKeys(list.keys);
      }
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string) {
    if (busy) return;
    setBusy(true);
    setErr(null);
    setCreated(null);

    try {
      const res = await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setErr(j.error || "Failed to revoke.");
        return;
      }
      router.refresh();
      const listRes = await fetch("/api/api-keys", { method: "GET" });
      if (listRes.ok) {
        const list = (await listRes.json().catch(() => ({}))) as { ok?: boolean; keys?: KeyRow[] };
        if (list.keys) setKeys(list.keys);
      }
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="text-sm font-medium">Create key</div>
          <div className="mt-2 text-sm text-white/60 leading-relaxed">
            Keys are hashed in storage. Only the plaintext key is shown once after creation.
          </div>

          <form onSubmit={create} className="mt-8 space-y-5">
            <Field label="Name">
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ingestion key"
                required
              />
            </Field>

            <Field label="Scope">
              <select
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                value={scope}
                onChange={(e) => setScope(e.target.value as KeyRow["scope"])}
              >
                <option value="INGEST">INGEST</option>
                <option value="READ">READ</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </Field>

            {err ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
                {err}
              </div>
            ) : null}

            {created ? (
              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="text-xs text-white/60">New API key</div>
                <div className="mt-2 font-mono text-sm text-white/80 break-all">{created}</div>
                <div className="mt-2 text-xs text-white/45">
                  Copy now. This secret will not be shown again.
                </div>
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

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Keys</div>
            <div className="text-xs text-white/50">Active: {activeCount}</div>
          </div>

          <div className="mt-6 rounded-2xl border border-white
