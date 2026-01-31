"use client";

/**
 * Next.js global error boundary. Replaces the root layout when an error occurs in it.
 * Must define its own <html> and <body>. Must be a Client Component.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: 8, color: "#6b7280" }}>An unexpected error occurred.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 16,
              padding: "8px 16px",
              background: "#f43f5e",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
