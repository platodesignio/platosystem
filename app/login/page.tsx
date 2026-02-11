"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [error, setError] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
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
          data.error
        );
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button style={styles.primary}>
          {loading
            ? "Loading..."
            : "Login"}
        </button>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
      </form>
    </AuthLayout>
  );
}

/* Shared Components */

function AuthLayout({
  title,
  children
}: any) {
  return (
    <div style={styles.center}>
      <div style={styles.card}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Input(props: any) {
  return (
    <input
      {...props}
      required
      style={styles.input}
    />
  );
}

const styles: any = {
  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  card: {
    width: 380,
    padding: 32,
    background: "#1a1a1f",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 16
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #333",
    background: "#222",
    color: "#fff"
  },
  primary: {
    padding: 12,
    background: "#4f46e5",
    border: "none",
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer"
  },
  error: {
    marginTop: 10,
    color: "#ff4d4f"
  }
};
