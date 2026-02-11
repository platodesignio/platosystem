import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, rgba(59,130,246,0.4), transparent 40%), #000",
        color: "white",
        fontFamily:
          "ui-sans-serif, system-ui, -apple-system",
        overflowX: "hidden"
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
            fontSize: "22px",
            fontWeight: 600,
            letterSpacing: "1px"
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
              background:
                "linear-gradient(90deg, #2563eb, #4f46e5)",
              padding: "10px 20px",
              borderRadius: "10px",
              color: "white",
              textDecoration: "none",
              boxShadow:
                "0 0 20px rgba(59,130,246,0.5)"
            }}
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 40px 60px"
        }}
      >
        <h1
          style={{
            fontSize: "68px",
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: "30px"
          }}
        >
          The Future of
          <br />
          <span
            style={{
              background:
                "linear-gradient(90deg,#3b82f6,#8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}
          >
            AI Cost Control
          </span>
        </h1>

        <p
          style={{
            maxWidth: "750px",
            color: "#aaa",
            fontSize: "18px",
            marginBottom: "50px"
          }}
        >
          Execute GPT models with precision. 
          Monitor token consumption in real time. 
          Eliminate waste before it compounds.
        </p>

        <div style={{ display: "flex", gap: "20px" }}>
          <Link
            href="/register"
            style={{
              padding: "16px 40px",
              background:
                "linear-gradient(90deg,#2563eb,#4f46e5)",
              borderRadius: "14px",
              color: "white",
              textDecoration: "none",
              fontSize: "18px",
              boxShadow:
                "0 0 40px rgba(59,130,246,0.4)"
            }}
          >
            Launch Now
          </Link>

          <Link
            href="/login"
            style={{
              padding: "16px 40px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid #222",
              borderRadius: "14px",
              color: "white",
              textDecoration: "none",
              fontSize: "18px"
            }}
          >
            Login
          </Link>
        </div>
      </main>

      {/* Future Dashboard Mock */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "80px 40px 120px"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            background:
              "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid #222",
            borderRadius: "20px",
            padding: "40px",
            boxShadow:
              "0 0 60px rgba(59,130,246,0.2)"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "40px"
            }}
          >
            <div>
              <h3
                style={{
                  marginBottom: "10px",
                  fontSize: "20px"
                }}
              >
                Monthly Usage
              </h3>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 600,
                  color: "#3b82f6"
                }}
              >
                $142.31
              </div>
            </div>

            <div>
              <h3
                style={{
                  marginBottom: "10px",
                  fontSize: "20px"
                }}
              >
                Tokens Used
              </h3>
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: 600,
                  color: "#8b5cf6"
                }}
              >
                3,241,220
              </div>
            </div>
          </div>

          <div
            style={{
              height: "6px",
              background: "#111",
              borderRadius: "4px",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                width: "72%",
                height: "100%",
                background:
                  "linear-gradient(90deg,#3b82f6,#8b5cf6)"
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
