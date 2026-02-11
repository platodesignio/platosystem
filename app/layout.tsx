export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background:
            "linear-gradient(180deg,#0d0d0f,#141419)",
          color: "#fff",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
        {children}
      </body>
    </html>
  );
}
