"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [usage, setUsage] =
    useState<any>(null);
  const [history, setHistory] =
    useState<any[]>([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      const u = await fetch(
        "/api/usage",
        { credentials: "include" }
      );
      const h = await fetch(
        "/api/history",
        { credentials: "include" }
      );

      setUsage(await u.json());
      setHistory(await h.json());
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard</h2>

      <h3>Monthly Usage</h3>
      <pre>
        {JSON.stringify(
          usage,
          null,
          2
        )}
      </pre>

      <h3>Recent Executions</h3>
      <pre>
        {JSON.stringify(
          history,
          null,
          2
        )}
      </pre>

      <a href="/apikeys">
        Manage API Keys
      </a>
      <br />
      <a href="/execute">
        Run Model
      </a>
    </div>
  );
}
