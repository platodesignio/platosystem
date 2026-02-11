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

  const isActive = (path: string) =>
    pathname === path
      ? "bg-blue-600"
      : "hover:bg-gray-800";

  return (
    <div className="min-h-screen flex bg-black text-white">

      {/* Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col">

        <div className="text-xl font-bold mb-10">
          Plato
        </div>

        <nav className="space-y-3 flex-1">

          <Link
            href="/app/dashboard"
            className={`block px-4 py-2 rounded ${isActive("/app/dashboard")}`}
          >
            Dashboard
          </Link>

          <Link
            href="/app/execute"
            className={`block px-4 py-2 rounded ${isActive("/app/execute")}`}
          >
            Execute
          </Link>

          <Link
            href="/app/apikeys"
            className={`block px-4 py-2 rounded ${isActive("/app/apikeys")}`}
          >
            API Keys
          </Link>

          <Link
            href="/app/usage"
            className={`block px-4 py-2 rounded ${isActive("/app/usage")}`}
          >
            Usage
          </Link>

          <Link
            href="/app/settings"
            className={`block px-4 py-2 rounded ${isActive("/app/settings")}`}
          >
            Settings
          </Link>

        </nav>

      </div>

      {/* Content */}
      <div className="flex-1 p-10">
        {children}
      </div>

    </div>
  );
}

