import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -20%, rgba(37,99,235,0.4), transparent 50%), linear-gradient(to bottom, #0f172a, #000)",
        color: "white",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Navbar */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "24px 60px"
        }}
      >
        <div
          style={{
            fontSize: "20px",
            fontWeight: 600,
            letterSpacing: "0.5px"
          }}
        >
          Plato System
        </div>

        <div style={{ display: "flex", gap: "24px" }}>
          <Link
            href="/login"
            style={{
              color: "#aaa",
              textDecoration: "none"
            }}
          >
            Login
          </Link>

          <Link
            href="/register"
            style={{
              background: "#2563eb",
              padding: "10px 20px",
              borderRadius: "8px",
              color: "white",
              textDecoration: "none"
            }}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 40px"
        }}
      >
        <h1
          style={{
            fontSize: "64px",
            fontWeight: 700,
            lineHeight: "1.1",
            marginBottom: "30px"
          }}
        >
          Control Your AI Costs
          <br />
          <span style={{ color: "#3b82f6" }}>
            With Precision
          </span>
        </h1>

        <p
          style={{
            maxWidth: "700px",
            color: "#aaa",
            fontSize: "18px",
            marginBottom: "50px"
          }}
        >
          Execute models. Track token usage.
          Visualize spending. 
          Stop runaway API costs before they happen.
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            href="/register"
            style={{
              padding: "16px 40px",
              background: "#2563eb",
              borderRadius: "12px",
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              boxShadow:
                "0 0 40px rgba(37,99,235,0.4)"
            }}
          >
            Start Free
          </Link>

          <Link
            href="/login"
            style={{
              padding: "16px 40px",
              background: "#111",
              border: "1px solid #333",
              borderRadius: "12px",
              color: "white",
              textDecoration: "none",
              fontSize: "18px"
            }}
          >
            Login
          </Link>
        </div>
      </main>

      {/* Feature Section */}
      <section
        style={{
          padding: "100px 60px",
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "40px"
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #222",
            padding: "40px",
            borderRadius: "16px"
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              color: "#3b82f6"
            }}
          >
            Real-Time Execution
          </h3>
          <p style={{ color: "#aaa" }}>
            Send prompts to GPT models and instantly
            see token usage and cost impact.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #222",
            padding: "40px",
            borderRadius: "16px"
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              color: "#3b82f6"
            }}
          >
            Cost Intelligence
          </h3>
          <p style={{ color: "#aaa" }}>
            Monitor monthly spending and eliminate
            unnecessary API consumption.
          </p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid #222",
            padding: "40px",
            borderRadius: "16px"
          }}
        >
          <h3
            style={{
              marginBottom: "20px",
              color: "#3b82f6"
            }}
          >
            Centralized Control
          </h3>
          <p style={{ color: "#aaa" }}>
            Manage keys, executions, and limits from
            one unified dashboard.
          </p>
        </div>
      </section>
    </div>
  );
}
