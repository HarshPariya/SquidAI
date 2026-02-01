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
  let baseUrl = process.env.NEXTAUTH_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000";
  baseUrl = normalizeAuthUrl(baseUrl);
  return baseUrl;
}

const baseUrl = getBaseUrl();

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          redirect_uri: `${baseUrl}/api/auth/callback/google`,
        },
      },
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
