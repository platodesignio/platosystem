// app/(auth)/login/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ApiError = { error?: string };

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const nextPath = useMemo(() => sp.get("next") || "/dashboard", [sp]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as ApiError;
        setErr(j.error || "Login failed.");
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glow">
      <div className="px-8 pt-10 pb-8">
        <div className="mb-8">
          <div className="text-xs text-white/60 tracking-wide">Plato System</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-2 text-sm text-white/60 leading-relaxed">
            Access your workspace dashboard, usage intelligence, budgets, alerts, and exports.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <Field label="Email">
            <input
              autoComplete="email"
              inputMode="email"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/25"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>

          <Field label="Password">
            <input
              autoComplete="current-password"
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/25"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          {err ? (
            <div className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/75">
              {err}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-glow"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>

          <div className="flex items-center justify-between pt-2 text-xs text-white/55">
            <a className="hover:text-white transition" href="/reset-password">
              Forgot password
            </a>
            <a className="hover:text-white transition" href="/signup">
              Create account
            </a>
          </div>
        </form>
      </div>

      <div className="px-8 pb-10">
        <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-white/55 leading-relaxed">
          By signing in, you agree to the service terms and privacy policy.
        </div>
      </div>
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
