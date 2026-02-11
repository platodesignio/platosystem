import { ReactNode } from "react";

export const metadata = {
  title: "Plato System",
  description: "AI Execution & Cost Control Platform"
};

export default function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#000" }}>
        {children}
      </body>
    </html>
  );
}
