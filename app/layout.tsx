import Link from "next/link";
import { ReactNode } from "react";

export default function AppLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-zinc-950 text-white">

      {/* ===== Sidebar ===== */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">

        <div className="p-6 text-xl font-bold border-b border-zinc-800">
          Plato System
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <Link
            href="/app/dashboard"
            className="block px-4 py-3 rounded-lg hover:bg-zinc-800 transition"
          >
            Dashboard
          </Link>

          <Link
            href="/app/execute"
            className="block px-4 py-3 rounded-lg hover:bg-zinc-800 transition"
          >
            Execute
          </Link>

          <Link
            href="/app/apikeys"
            className="block px-4 py-3 rounded-lg hover:bg-zinc-800 transition"
          >
            API Keys
          </Link>

          <Link
            href="/app/usage"
            className="block px-4 py-3 rounded-lg hover:bg-zinc-800 transition"
          >
            Usage
          </Link>

        </nav>

        <div className="p-4 border-t border-zinc-800">

          <Link
            href="/app/settings"
            className="block px-4 py-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition text-sm"
          >
            Settings
          </Link>

        </div>

      </aside>

      {/* ===== Main Content ===== */}
      <main className="flex-1 p-8">
        {children}
      </main>

    </div>
  );
}
