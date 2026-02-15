// app/(app)/budgets/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBudgetPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [threshold, setThreshold] = useState("80");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;

    setBusy(true);
    setErr(null);

    try {
      const res = await fetch("/api/budgets", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          amountUsd: Number(amount),
          thresholdPct: Number(threshold)
        })
      });

      if (!res.ok) {
        const j = await res.json();
        setErr(j.error || "Failed to create budget.");
        return;
      }

      router.push("/budgets");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-md space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">New Budget</h1>

      <form
        onSubmit={onSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <Field label="Name">
          <input
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm focus:border-white/30 outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Field>

        <Field label="Amount (USD)">
          <input
            type="number"
            step="0.01"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm focus:border-white/30 outline-none"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Field>

        <Field label="Threshold (%)">
          <input
            type="number"
            min="1"
            max="100"
            className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm focus:border-white/30 outline-none"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
        </Field>

        {err && (
          <div className="text-sm text-white/70 bg-black/40 p-3 rounded-xl border border-white/10">
            {err}
          </div>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-white text-black text-sm py-2 hover:bg-white/90 transition"
        >
          {busy ? "Creating…" : "Create Budget"}
        </button>
      </form>
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
