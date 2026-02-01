import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

interface CustomSession extends Session {
  user: Session["user"] & {
    id?: string;
  };
}

interface CustomToken extends JWT {
  id?: string;
}

function normalizeAuthUrl(url: string): string {
  if (!url) return url;
  const u = url.startsWith("http") ? url : `https://${url}`;
  return u.replace(/\/+$/, "");
}

function getBaseUrl(): string {
  // Always check environment at runtime, not build time
  // This ensures Render env vars are used, not .env.local
  if (typeof window !== "undefined") {
    // Client side - use window.location
    return window.location.origin;
  }
  
  // Server side - check env vars in priority order
  let baseUrl = process.env.NEXTAUTH_URL || process.env.RENDER_EXTERNAL_URL || process.env.VERCEL_URL;
  
  if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
    baseUrl = `https://${process.env.VERCEL_URL}`;
  }
  
  if (!baseUrl) {
    baseUrl = "http://localhost:3000";
  }
  
  baseUrl = normalizeAuthUrl(baseUrl);
  return baseUrl;
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      // Let NextAuth compute the redirect_uri automatically based on NEXTAUTH_URL
      // Don't override it - this was causing the localhost issue
    }),
  ],
  callbacks: {
    async jwt({ token, user }): Promise<CustomToken> {
      if (user) token.id = (user as any).id;
      return token as CustomToken;
    },
    async session({ session, token }): Promise<Session> {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl: callbackBaseUrl }) {
      if (url.startsWith("/")) return `${callbackBaseUrl}${url}`;
      try {
        if (new URL(url).origin === callbackBaseUrl) return url;
      } catch {
        // ignore
      }
      return callbackBaseUrl;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth-error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
