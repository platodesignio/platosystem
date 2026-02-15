// app/(marketing)/layout.tsx
import { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-24 pb-32">{children}</main>
    </div>
  );
}
