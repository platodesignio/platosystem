// app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ApiError = { error?: string };

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    setOk(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: name || null, email, password })
      });

      const j = (await res.json().catch(() => ({}))) as ApiError & { ok?: boolean; requiresEmailVerification?: boolean };
      if (!res.ok) {
        setErr(j.error || "Signup failed.");
        return;
      }

      if (j.requiresEmailVerification) {
        setOk("Account created. Check your email to verify and then sign in.");
        return;
      }

      setOk("Account created. Redirecting…");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glow">
      <div className="px-8 pt-10 pb-10">
        <div className="mb-8">
          <div className="text-xs text-white/60 tracking-wide">Plato System</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-2 text-sm text-white/60 leading-relaxed">
            Build a workspace, ingest usage, enforce budgets, trigger alerts, and export reports.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <Field label="Name (optional)">
            <input
              autoComplete="name"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/25"
              placeholder="Kei"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

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
              autoComplete="new-password"
              type="password"
              className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/25"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
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
            disabled={busy}
            className="w-full rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed transition shadow-glow"
          >
            {busy ? "Creating…" : "Create account"}
          </button>

          <div className="pt-2 text-xs text-white/55">
            Already have an account?{" "}
            <a className="hover:text-white transition" href="/login">
              Sign in
            </a>
          </div>
        </form>
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
