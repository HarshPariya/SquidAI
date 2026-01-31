import React from "react";

export const dynamic = "force-static";

export default function GlobalError() {
  return (
    <div style={{ minHeight: "100vh" }} className="flex items-center justify-center p-8">
      <div>
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">An unexpected error occurred while building the site.</p>
      </div>
    </div>
  );
}
