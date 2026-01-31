"use client";

export default function GlobalErrorPage() {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: 8, color: "#6b7280" }}>An unexpected error occurred while building the site.</p>
        </div>
      </body>
    </html>
  );
}
