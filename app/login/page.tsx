"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  async function handleLogin() {
    setError(null);

    const res = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      }
    );

    if (!res.ok) {
      setError(
        "Invalid credentials"
      );
      return;
    }

    router.push("/app/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">

      <div className="bg-zinc-900 p-10 rounded-2xl w-full max-w-md border border-zinc-800">

        <h1 className="text-2xl font-bold mb-6">
          Login
        </h1>

        {error && (
          <div className="bg-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full mb-4 p-3 bg-zinc-800 rounded-lg"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full mb-6 p-3 bg-zinc-800 rounded-lg"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg"
        >
          Login
        </button>

      </div>

    </div>
  );
}
