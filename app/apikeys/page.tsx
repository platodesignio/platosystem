"use client";

import { useEffect, useState } from "react";

type ApiKeyItem = {
  id: string;
  name: string;
  createdAt: string;
};

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKeyItem[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchKeys() {
    const res = await fetch("/api/apikeys");
    const data = await res.json();

    if (res.ok) {
      setKeys(data);
    }
  }

  useEffect(() => {
    fetchKeys();
  }, []);

  async function createKey() {
    if (!newKeyName.trim()) return;

    setLoading(true);
    setGeneratedKey(null);

    const res = await fetch("/api/apikeys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: newKeyName })
    });

    const data = await res.json();

    if (res.ok) {
      setGeneratedKey(data.apiKey);
      setNewKeyName("");
      await fetchKeys();
    } else {
      alert(data.error || "Failed to create key");
    }

    setLoading(false);
  }

  async function deleteKey(id: string) {
    if (!confirm("Delete this API key?")) return;

    const res = await fetch("/api/apikeys", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      await fetchKeys();
    } else {
      const data = await res.json();
      alert(data.error || "Delete failed");
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>API Keys</h1>

      <div style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Key name"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />
        <button
          onClick={createKey}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer"
          }}
        >
          {loading ? "Creating..." : "Create Key"}
        </button>
      </div>

      {generatedKey && (
        <div
          style={{
            marginBottom: 30,
            padding: 15,
            backgroundColor: "#ffeeba"
          }}
        >
          <strong>New API Key:</strong>
          <div
            style={{
              marginTop: 10,
              wordBreak: "break-all",
              fontFamily: "monospace"
            }}
          >
            {generatedKey}
          </div>
          <div style={{ marginTop: 10, fontSize: 12 }}>
            This key will only be shown once. Save it securely.
          </div>
        </div>
      )}

      <h2>Existing Keys</h2>

      <table
        border={1}
        cellPadding={10}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((key) => (
            <tr key={key.id}>
              <td>{key.name}</td>
              <td>
                {new Date(key.createdAt).toLocaleString()}
              </td>
              <td>
                <button
                  onClick={() => deleteKey(key.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#c82333",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {keys.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No API keys created
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
