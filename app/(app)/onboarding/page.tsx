// app/(app)/onboarding/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type MeRes = {
  ok?: boolean;
  error?: string;
  workspace?: { id: string; name: string; slug: string };
  user?: { email: string };
};

type WsRes = {
  ok?: boolean;
  error?: string;
  workspace?: { id: string; name: string; slug: string };
};

type KeyRes = {
  ok?: boolean;
  error?: string;
  apiKey?: string;
};

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceSlug, setWorkspaceSlug] = useState("");

  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/auth/me", { method: "GET" });
        const j = (await res.json().catch(() => ({}))) as MeRes;
        if (!res.ok || !j.workspace) return;

        if (!cancelled) {
          setWorkspaceName(j.workspace.name);
          setWorkspaceSlug(j.workspace.slug);
        }
      } catch {
        /* ignore */
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const slugPreview = useMemo(() => {
    return workspaceSlug
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }, [workspaceSlug]);

  async function saveWorkspace() {
    if (busy) return;
    setBusy(true);
    setErr(null);

    try {
      const res = await fetch("/api/workspace/current", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: workspaceName,
          slug: slugPreview
        })
      });

      const j = (await res.json().catch(() => ({}))) as WsRes;

      if (!res.ok) {
        setErr(j.error || "Failed to save workspace.");
        return;
      }

      setStep(2);
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function createIngestKey() {
    if (busy) return;
    setBusy(true);
    setErr(null);

    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Default ingestion key",
          scope: "INGEST"
        })
      });

      const j = (await res.json().catch(() => ({}))) as KeyRes;

      if (!res.ok) {
        setErr(j.error || "Failed to create API key.");
        return;
      }

      if (j.apiKey) {
        setApiKey(j.apiKey);
        setStep(3);
      }
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  function finish() {
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-10">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight">
            Plato System Onboarding
          </h1>
          <p className="text-sm text-white/60">
            Configure your workspace and generate your first ingestion key.
          </p>
        </div>

        <Progress step={step} />

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-sm font-medium">Workspace setup</div>

              <Field label="Workspace name">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  required
                />
              </Field>

              <Field label="Workspace slug">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none focus:border-white/25"
                  value={workspaceSlug}
                  onChange={(e) => setWorkspaceSlug(e.target.value)}
                  required
                />
              </Field>

              <div className="text-xs text-white/45">
                Slug preview: {slugPreview}
              </div>

              {err && <ErrorBox message={err} />}

              <button
                onClick={saveWorkspace}
                disabled={busy}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 transition"
              >
                {busy ? "Saving…" : "Save & continue"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-sm font-medium">
                Create ingestion API key
              </div>

              <p className="text-sm text-white/60 leading-relaxed">
                This key is used by your backend or edge layer to send usage
                events to /api/usage/ingest. The secret will only be shown once.
              </p>

              {err && <ErrorBox message={err} />}

              <button
                onClick={createIngestKey}
                disabled={busy}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 transition"
              >
                {busy ? "Creating…" : "Create key"}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-sm font-medium">API key created</div>

              {apiKey && (
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <div className="text-xs text-white/60">
                    Ingestion API key
                  </div>
                  <div className="mt-2 font-mono text-sm text-white/80 break-all">
                    {apiKey}
                  </div>
                  <div className="mt-2 text-xs text-white/45">
                    Copy and store this securely. It will not be shown again.
                  </div>
                </div>
              )}

              <button
                onClick={finish}
                className="rounded-full bg-white px-6 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition"
              >
                Go to dashboard →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex-1 flex items-center">
          <div
            className={`h-8 w-8 flex items-center justify-center rounded-full text-xs ${
              s <= step
                ? "bg-white text-black"
                : "bg-white/10 text-white/60"
            }`}
          >
            {s}
          </div>
          {s < 3 && (
            <div
              className={`flex-1 h-px ${
                s < step ? "bg-white" : "bg-white/10"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-white/60">{label}</div>
      {children}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
      {message}
    </div>
  );
}
