import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// On Render, use RENDER_EXTERNAL_URL when NEXTAUTH_URL is missing or still localhost (fixes redirect after Google sign-in)
// Always strip trailing slash so redirect_uri matches Google Console exactly (avoids Error 400: invalid_request)
function normalizeAuthUrl(url: string): string {
  if (!url) return url;
  const u = url.startsWith("http") ? url : `https://${url}`;
  return u.replace(/\/+$/, "");
}
const authUrl = process.env.NEXTAUTH_URL ?? "";
if (process.env.NODE_ENV === "production") {
  const renderUrl = process.env.RENDER_EXTERNAL_URL;
  if (renderUrl && (!authUrl || authUrl.includes("localhost"))) {
    process.env.NEXTAUTH_URL = normalizeAuthUrl(renderUrl);
  }
  if (process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = normalizeAuthUrl(process.env.NEXTAUTH_URL);
  }
  if (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost")) {
    console.warn(
      "[NextAuth] NEXTAUTH_URL must be your production URL (e.g. https://squidai.onrender.com). " +
        "Set it in Render → Environment, or it will use RENDER_EXTERNAL_URL. Current:",
      process.env.NEXTAUTH_URL || "(empty)"
    );
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/",
    error: "/auth-error",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
