// app/layout.tsx
import "@/styles/globals.css";
import { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "Plato System",
  description: "AI Usage & Cost Control Platform",
  metadataBase: new URL(process.env.APP_URL || "http://localhost:3000")
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-black text-white antialiased selection:bg-white selection:text-black">
        <div className="min-h-screen flex flex-col">
          <header className="sticky top-0 z-50 border-b border-white/10 bg-black/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
              <a href="/" className="text-lg font-semibold tracking-tight">
                Plato System
              </a>
              <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
                <a href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </a>
                <a href="/usage" className="hover:text-white transition">
                  Usage
                </a>
                <a href="/budgets" className="hover:text-white transition">
                  Budgets
                </a>
                <a href="/alerts" className="hover:text-white transition">
                  Alerts
                </a>
                <a href="/billing" className="hover:text-white transition">
                  Billing
                </a>
              </nav>
              <div className="flex items-center gap-4">
                <a
                  href="/login"
                  className="text-sm text-white/70 hover:text-white transition"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="text-sm px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition"
                >
                  Get Started
                </a>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
            © {new Date().getFullYear()} Plato System. All rights reserved.
          </footer>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
