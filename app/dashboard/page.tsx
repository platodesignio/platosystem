"use client";

import { useEffect, useState } from "react";

type ModelBreakdown = {
  model: string;
  _sum: {
    totalTokens: number | null;
    cost: number | null;
  };
  _count: number;
};

type Execution = {
  id: string;
  model: string;
  totalTokens: number;
  cost: number;
  createdAt: string;
};

type DashboardData = {
  limit: number;
  used: number;
  remaining: number;
  maxTokensPerReq: number;
  monthly: {
    executionCount: number;
    totalTokens: number;
    totalCost: number;
  };
  modelBreakdown: ModelBreakdown[];
  recentExecutions: Execution[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchDashboard() {
    const res = await fetch("/api/dashboard");
    const json = await res.json();

    if (res.ok) {
      setData(json);
    } else {
      alert(json.error || "Failed to load dashboard");
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  if (!data) {
    return <div style={{ padding: 40 }}>No data</div>;
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      {/* ===== 月間概要 ===== */}
      <div
        style={{
          marginBottom: 30,
          padding: 20,
          backgroundColor: "#f5f5f5"
        }}
      >
        <h2>Monthly Overview</h2>
        <p>
          Limit: ${data.limit.toFixed(2)}
        </p>
        <p>
          Used: ${data.used.toFixed(4)}
        </p>
        <p>
          Remaining: ${data.remaining.toFixed(4)}
        </p>
        <p>
          Executions: {data.monthly.executionCount}
        </p>
        <p>
          Total Tokens: {data.monthly.totalTokens}
        </p>
        <p>
          Max Tokens / Request: {data.maxTokensPerReq}
        </p>
      </div>

      {/* ===== モデル別内訳 ===== */}
      <div style={{ marginBottom: 40 }}>
        <h2>Model Breakdown</h2>
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Model</th>
              <th>Executions</th>
              <th>Total Tokens</th>
              <th>Total Cost</th>
            </tr>
          </thead>
          <tbody>
            {data.modelBreakdown.map((item) => (
              <tr key={item.model}>
                <td>{item.model}</td>
                <td>{item._count}</td>
                <td>{item._sum.totalTokens ?? 0}</td>
                <td>
                  $
                  {(item._sum.cost ?? 0).toFixed(4)}
                </td>
              </tr>
            ))}
            {data.modelBreakdown.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  No usage this month
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== 直近履歴 ===== */}
      <div>
        <h2>Recent Executions</h2>
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Model</th>
              <th>Tokens</th>
              <th>Cost</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.recentExecutions.map((item) => (
              <tr key={item.id}>
                <td>{item.model}</td>
                <td>{item.totalTokens}</td>
                <td>${item.cost.toFixed(4)}</td>
                <td>
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {data.recentExecutions.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                  No executions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
