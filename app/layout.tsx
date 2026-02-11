import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";

export const metadata = {
  title: "Plato System",
  description: "AI Cost Control SaaS"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 32px",
            backgroundColor: "#111",
            color: "#fff"
          }}
        >
          <div style={{ fontWeight: 600 }}>
            <Link
              href="/"
              style={{
                color: "white",
                textDecoration: "none"
              }}
            >
              Plato
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20
            }}
          >
            <Link
              href="/"
              style={{
                color: "white",
                textDecoration: "none"
              }}
            >
              Execute
            </Link>

            <Link
              href="/dashboard"
              style={{
                color: "white",
                textDecoration: "none"
              }}
            >
              Dashboard
            </Link>

            <Link
              href="/apikeys"
              style={{
                color: "white",
                textDecoration: "none"
              }}
            >
              API Keys
            </Link>

            <form
              action="/api/auth/logout"
              method="POST"
              style={{ margin: 0 }}
            >
              <button
                type="submit"
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Logout
              </button>
            </form>
          </div>
        </nav>

        <main
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "40px 20px"
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
