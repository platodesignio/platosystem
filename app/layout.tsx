import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Plato System",
  description: "AI Cost Control Platform"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}
      </body>
    </html>
  );
}
