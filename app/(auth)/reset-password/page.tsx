// app/(auth)/reset-password/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type ApiError = { error?: string };

export default function ResetPasswordPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const token = useMemo(() => sp.get("token") || "", [sp]);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const isConfirmFlow = Boolean(token);

  async function requestReset(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    setOk(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email })
      });
      const j = (await res.json().catch(() => ({}))) as ApiError & { ok?: boolean };
      if (!res.ok) {
        setErr(j.error || "Request failed.");
        return;
      }
      setOk("If the account exists, a reset link has been sent.");
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmReset(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErr(null);
    setOk(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      const j = (await res.json().catch(() => ({}))) as ApiError & { ok?: boolean };
      if (!res.ok) {
        setErr(j.error || "Reset failed.");
        return;
      }
      setOk("Password updated. Redirecting to login…");
      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 700);
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glow">
      <div className="px-8 pt-10 pb-10">
        <div className="text-xs text-white/60 tracking-wide">Plato System</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-white/60 leading-relaxed">
          {isConfirmFlow ? "Set a new password for your account." : "Request a password reset link by email."}
        </p>

        <form onSubmit={isConfirmFlow ? confirmReset : requestReset} className="mt-8 space-y-5">
          {isConfirmFlow ? (
            <Field label="New password">
              <input
                autoComplete="new-password"
                type="password"
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-white/25"
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
              />
            </Field>
          ) : (
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
          )}

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
            {busy ? "Processing…" : isConfirmFlow ? "Update password" : "Send reset link"}
          </button>

          <div className="pt-2 text-xs text-white/55">
            <a className="hover:text-white transition" href="/login">
              Back to login
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
