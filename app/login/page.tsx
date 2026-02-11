"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] =
    useState<string>("");
  const [password, setPassword] =
    useState<string>("");
  const [error, setError] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState<boolean>(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Login failed"
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(
        err.message ||
          "Unexpected error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.center}>
      <div style={styles.card}>
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement>
            ) =>
              setEmail(
                e.target.value
              )
            }
            style={styles.input}
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement>
            ) =>
              setPassword(
                e.target.value
              )
            }
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.primary}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Login"}
          </button>

          {error && (
            <div style={styles.error}>
              {error}
            <
