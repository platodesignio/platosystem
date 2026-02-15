// app/(auth)/verify-email/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ApiError = { error?: string };

export default function VerifyEmailPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const token = useMemo(() => sp.get("token") || "", [sp]);

  const [state, setState] = useState<"idle" | "verifying" | "ok" | "err">("idle");
  const [msg, setMsg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!token) {
        setState("err");
        setMsg("Verification token missing.");
        return;
      }
      setState("verifying");
      setMsg("Verifying…");

      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token })
        });
        const j = (await res.json().catch(() => ({}))) as ApiError & { ok?: boolean };

        if (!res.ok) {
          if (!cancelled) {
            setState("err");
            setMsg(j.error || "Verification failed.");
          }
          return;
        }

        if (!cancelled) {
          setState("ok");
          setMsg("Email verified. Redirecting to dashboard…");
        }

        setTimeout(() => {
          if (!cancelled) {
            router.push("/dashboard");
            router.refresh();
          }
        }, 700);
      } catch {
        if (!cancelled) {
          setState("err");
          setMsg("Network error.");
        }
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-glow">
      <div className="px-8 py-12">
        <div className="text-xs text-white/60 tracking-wide">Plato System</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Verify email</h1>
        <p className="mt-3 text-sm text-white/60 leading-relaxed">{msg}</p>

        <div className="mt-8 flex items-center gap-3">
          <div
            className={[
              "h-2.5 w-2.5 rounded-full",
              state === "verifying" ? "bg-white/70" : state === "ok" ? "bg-white" : state === "err" ? "bg-white/30" : "bg-white/40"
            ].join(" ")}
          />
          <div className="text-xs text-white/50">
            {state === "verifying" ? "Processing" : state === "ok" ? "Verified" : state === "err" ? "Failed" : "Ready"}
          </div>
        </div>

        <div className="mt-10 flex gap-3">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-black/30 px-5 py-2.5 text-sm text-white/70 hover:text-white hover:border-white/30 transition"
          >
            Go to login
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-white/90 transition"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
