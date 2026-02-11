"use client";

import { useState } from "react";

type Usage = {
  monthlyLimit: number;
  used: number;
  remaining: number;
  maxTokensPerReq: number;
};

export default function ExecutePage() {
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [result, setResult] = useState("");
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(false);

  async function execute() {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          prompt
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Execution failed");
        setLoading(false);
        return;
      }

      setResult(data.content);

      // 実行後に使用状況を更新
      const usageRes = await fetch("/api/usage");
      const usageData = await usageRes.json();
      setUsage(usageData);
    } catch (error) {
      console.error(error);
      alert("Unexpected error occurred");
    }

    setLoading(false);
  }

  return (
    <div>
      <h1>AI Execute</h1>

      <div style={{ marginBottom: 20 }}>
        <label style={{ marginRight: 10 }}>Model:</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="gpt-4o-mini">gpt-4o-mini</option>
          <option value="gpt-4o">gpt-4o</option>
        </select>
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={6}
        style={{
          width: "100%",
          padding: 12,
          fontSize: 14
        }}
        placeholder="Enter your prompt..."
      />

      <div style={{ marginTop: 20 }}>
        <button
          onClick={execute}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Executing..." : "Execute"}
        </button>
      </div>

      {usage && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#eee"
          }}
        >
          <strong>Remaining:</strong>{" "}
          ${usage.remaining.toFixed(4)} / ${usage.monthlyLimit.toFixed(2)}
        </div>
      )}

      {result && (
        <div
          style={{
            marginTop: 30,
            padding: 20,
            backgroundColor: "#f5f5f5"
          }}
        >
          <h2>Result</h2>
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
