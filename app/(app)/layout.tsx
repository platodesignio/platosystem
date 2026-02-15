// app/(app)/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white">
      <div className="flex">
        <aside className="hidden lg:flex w-64 flex-col border-r border-white/10 bg-black/60 backdrop-blur-xl">
          <div className="h-16 flex items-center px-6 border-b border-white/10 text-sm font-semibold tracking-tight">
            Workspace
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 text-sm text-white/70">
            <NavItem href="/dashboard" label="Dashboard" />
            <NavItem href="/usage" label="Usage" />
            <NavItem href="/budgets" label="Budgets" />
            <NavItem href="/alerts" label="Alerts" />
            <NavItem href="/reports" label="Reports" />
            <NavItem href="/integrations" label="Integrations" />
            <NavItem href="/billing" label="Billing" />
            <NavItem href="/settings" label="Settings" />
          </nav>

          <div className="px-4 py-4 border-t border-white/10 text-xs text-white/50">
            Plato System
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6">
            <div className="text-sm text-white/60 tracking-wide">
              Production AI Control Layer
            </div>

            <div className="flex items-center gap-4 text-sm text-white/70">
              <Link
                href="/settings/profile"
                className="hover:text-white transition"
              >
                Profile
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="hover:text-white transition"
                >
                  Logout
                </button>
              </form>
            </div>
          </header>

          <main className="flex-1 px-6 py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-4 py-2 hover:bg-white/5 hover:text-white transition"
    >
      {label}
    </Link>
  );
}
