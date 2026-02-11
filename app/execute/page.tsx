"use client";

import { useState } from "react";

export default function Execute() {
  const [prompt, setPrompt] =
    useState("");
  const [result, setResult] =
    useState<any>(null);
  const [loading, setLoading] =
    useState(false);

  async function run() {
    setLoading(true);
    const res = await fetch(
      "/api/execute",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          model: "gpt-4o-mini",
          prompt
        })
      }
    );

    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Execute Model</h2>

      <textarea
        rows={6}
        cols={60}
        value={prompt}
        onChange={(e) =>
          setPrompt(e.target.value)
        }
      />

      <br />
      <button onClick={run}>
        {loading
          ? "Running..."
          : "Run"}
      </button>

      {result && (
        <pre>
          {JSON.stringify(
            result,
            null,
            2
          )}
        </pre>
      )}
    </div>
  );
}
