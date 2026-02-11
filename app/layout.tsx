"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function AppLayout({
  children
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const linkStyle = (path: string) =>
    `block px-4 py-3 rounded-lg transition ${
      pathname === path
        ? "bg-blue-600"
        : "hover:bg-zinc-800"
    }`;

  return (
    <div className="min-h-screen flex bg-zinc-950 text-white">

      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">

        <div className="p-6 text-xl font-bold border-b border-zinc-800">
          Plato System
        </div>

        <nav className="flex-1 p-4 space-y-2">

          <Link
            href="/app/dashboard"
            className={linkStyle(
              "/app/dashboard"
            )}
          >
            Dashboard
          </Link>

          <Link
            href="/app/execute"
            className={linkStyle(
              "/app/execute"
            )}
          >
            Execute
          </Link>

          <Link
            href="/app/apikeys"
            className={linkStyle(
              "/app/apikeys"
            )}
          >
            API Keys
          </Link>

          <Link
            href="/app/usage"
            className={linkStyle(
              "/app/usage"
            )}
          >
            Usage
          </Link>

          <Link
            href="/app/settings"
            className={linkStyle(
              "/app/settings"
            )}
          >
            Settings
          </Link>

        </nav>

      </aside>

      {/* Main */}
      <main className="flex-1 p-10">
        {children}
      </main>

    </div>
  );
}
