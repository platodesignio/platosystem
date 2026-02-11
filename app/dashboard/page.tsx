"use client";

import { useEffect, useState } from "react";

type Usage = {
  monthly: {
    used: number;
    totalTokens: number;
    executionCount: number;
  };
};

type HistoryItem = {
  id: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalCost: number;
  createdAt: string;
};

export default function Dashboard() {
  const [usage, setUsage] =
    useState<Usage | null>(null);
  const [history, setHistory] =
    useState<HistoryItem[]>([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function load() {
      try {
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
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={styles.center}>
        Loading...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Dashboard
      </h1>

      {/* Monthly Stats */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Monthly Usage
        </h2>

        <div style={styles.statsGrid}>
          <StatBox
            label="Total Cost (USD)"
            value={`$${usage?.monthly.used.toFixed(
              4
            )}`}
          />
          <StatBox
            label="Total Tokens"
            value={
              usage?.monthly.totalTokens
            }
          />
          <StatBox
            label="Executions"
            value={
              usage?.monthly.executionCount
            }
          />
        </div>
      </div>

      {/* History Table */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>
          Recent Executions
        </h2>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Model</th>
                <th>Prompt</th>
                <th>Completion</th>
                <th>Cost (USD)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    style={{
                      textAlign:
                        "center",
                      padding: 20,
                      opacity: 0.6
                    }}
                  >
                    No executions yet
                  </td>
                </tr>
              )}

              {history.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.model}
                  </td>
                  <td>
                    {
                      item.promptTokens
                    }
                  </td>
                  <td>
                    {
                      item.completionTokens
                    }
                  </td>
                  <td>
                    $
                    {item.totalCost.toFixed(
                      6
                    )}
                  </td>
                  <td>
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={styles.links}>
        <a href="/execute">
          Run Model
        </a>
        <a href="/apikeys">
          API Keys
        </a>
      </div>
    </div>
  );
}

/* ------------------ UI Components ------------------ */

function StatBox({
  label,
  value
}: {
  label: string;
  value: any;
}) {
  return (
    <div style={styles.statBox}>
      <div style={styles.statLabel}>
        {label}
      </div>
      <div style={styles.statValue}>
        {value}
      </div>
    </div>
  );
}

/* ------------------ Styles ------------------ */

const styles: any = {
  container: {
    padding: 40,
    minHeight: "100vh",
    background:
      "linear-gradient(180deg,#0f0f0f,#141414)",
    color: "#fff",
    fontFamily:
      "system-ui, sans-serif"
  },
  center: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111",
    color: "#fff"
  },
  title: {
    fontSize: 32,
    marginBottom: 30,
    letterSpacing: 1
  },
  card: {
    background: "#1a1a1a",
    padding: 24,
    borderRadius: 12,
    marginBottom: 30,
    boxShadow:
      "0 0 20px rgba(0,0,0,0.4)"
  },
  cardTitle: {
    marginBottom: 20
  },
  statsGrid: {
    display: "flex",
    gap: 20,
    flexWrap: "wrap"
  },
  statBox: {
    flex: 1,
    minWidth: 150,
    background: "#222",
    padding: 20,
    borderRadius: 10
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7
  },
  statValue: {
    fontSize: 22,
    marginTop: 8
  },
  tableWrapper: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse"
  },
  links: {
    display: "flex",
    gap: 20,
    marginTop: 20
  }
};
