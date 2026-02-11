"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      // 成功時 dashboard へ
      router.push("/dashboard");
    } catch (err) {
      setError("Unexpected error occurred");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 30,
        backgroundColor: "#f5f5f5"
      }}
    >
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 20 }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: 8,
              marginTop: 5
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            style={{
              width: "100%",
              padding: 8,
              marginTop: 5
            }}
          />
        </div>

        {error && (
          <div
            style={{
              marginBottom: 15,
              color: "red"
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 0",
            backgroundColor: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
