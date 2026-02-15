// app/(auth)/layout.tsx
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black" />
      </div>
      <main className="relative z-10 px-6 py-16">
        <div className="mx-auto w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
