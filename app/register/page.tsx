"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // 登録成功 → ダッシュボードへ
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#111",
        color: "#fff"
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: 360,
          padding: 32,
          borderRadius: 12,
          background: "#1c1c1c",
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        <h2 style={{ margin: 0 }}>Create Account</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #333",
            background: "#222",
            color: "#fff"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #333",
            background: "#222",
            color: "#fff"
          }}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "1px solid #333",
            background: "#222",
            color: "#fff"
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 10,
            borderRadius: 6,
            border: "none",
            background: "#4f46e5",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          {loading ? "Creating..." : "Register"}
        </button>

        {error && (
          <div
            style={{
              color: "#ff4d4f",
              fontSize: 14
            }}
          >
            {error}
          </div>
        )}

        <div style={{ fontSize: 14 }}>
          Already have an account?{" "}
          <a
            href="/login"
            style={{ color: "#4f46e5" }}
          >
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
