"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          credentials: "include", // ★重要
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Login failed"
        );
      }

      // ログイン成功 → ダッシュボードへ
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(
        err.message ||
          "Login error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <form
        onSubmit={handleLogin}
        style={{
          width: 320,
          display: "flex",
          flexDirection: "column",
          gap: 16
        }}
      >
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Logging in..."
            : "Login"}
        </button>

        {error && (
          <div
            style={{
              color: "red",
              fontSize: 14
            }}
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
