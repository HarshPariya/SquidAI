import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Warn if production is still using localhost (causes "This site can't be reached" after Google sign-in)
const authUrl = process.env.NEXTAUTH_URL ?? "";
if (process.env.NODE_ENV === "production" && (authUrl.includes("localhost") || !authUrl)) {
  console.warn(
    "[NextAuth] NEXTAUTH_URL must be your production URL (e.g. https://squidai.onrender.com), not localhost. " +
      "Set it in Render → Environment, then redeploy. Current NEXTAUTH_URL:",
    authUrl || "(empty)"
  );
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
