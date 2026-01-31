"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const ClientProviders = dynamic(
  () => import("./client-providers").then((m) => ({ default: m.ClientProviders })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black antialiased" aria-hidden="true" />
    ),
  }
);

/**
 * Wraps the app in client providers (Session, Auth, ChatHistory) only on the client.
 * Prevents prerender errors with next-auth SessionProvider + React 19.
 */
export function DynamicProviders({ children }: { children: ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}
