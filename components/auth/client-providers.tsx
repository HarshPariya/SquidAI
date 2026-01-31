"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { AuthProvider } from "@/components/auth/auth-context";
import { ChatHistoryProvider } from "@/components/chat/chat-history-context";
import { ReactNode } from "react";

/**
 * All client-side providers (Session, Auth, ChatHistory).
 * Loaded with ssr: false from layout to avoid "Cannot read properties of null (reading 'useState')"
 * during static prerender (React 19 + next-auth compatibility).
 */
export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <AuthProvider>
        <ChatHistoryProvider>
          {children}
        </ChatHistoryProvider>
      </AuthProvider>
    </NextAuthSessionProvider>
  );
}
