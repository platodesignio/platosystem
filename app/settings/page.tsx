"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleLogout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "/api/auth/logout",
        {
          method: "POST"
        }
      );

      if (!res.ok) {
        throw new Error(
          "Logout failed"
        );
      }

      router.push("/login");
    } catch (err) {
      setError(
        "Logout failed"
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    const confirmDelete =
      window.confirm(
        "This action cannot be undone. Delete account?"
      );

    if (!confirmDelete) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "/api/account/delete",
        {
          method: "DELETE"
        }
      );

      if (!res.ok) {
        throw new Error(
          "Delete failed"
        );
      }

      router.push("/register");
    } catch (err) {
      setError(
        "Account deletion failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10 text-white">
      <h1 className="text-3xl font-bold mb-8">
        Settings
      </h1>

      {error && (
        <div className="bg-red-600 p-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6">

        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl mb-4">
            Session
          </h2>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            {loading
              ? "Processing..."
              : "Logout"}
          </button>
        </div>

        <div className="bg-zinc-900 p-6 rounded-xl border border-red-900">
          <h2 className="text-xl mb-4 text-red-400">
            Danger Zone
          </h2>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-lg"
          >
            {loading
              ? "Processing..."
              : "Delete Account"}
          </button>
        </div>

      </div>
    </div>
  );
}
