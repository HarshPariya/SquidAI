"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/** NextAuth redirects here on auth errors (pages.error). Shows a clear checklist for Render. */
export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get("error") ?? "Configuration";
  const isConfig = error === "Configuration" || error === "AccessDenied";
  const isNoSecret = error === "Configuration" || isConfig;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="max-w-lg w-full rounded-2xl border border-pink-500/30 bg-zinc-900/80 p-8">
        <h1 className="text-2xl font-bold text-pink-500 mb-2">Authentication error</h1>
        <p className="text-gray-400 mb-6">
          {isConfig
            ? "There is a problem with the server configuration. Add the env vars below in Render → Environment, then redeploy."
            : `Error: ${error}`}
        </p>
        {isNoSecret && (
          <p className="text-amber-400/90 text-sm font-medium mb-4 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
            If you see <code className="bg-zinc-800 px-1 rounded">NO_SECRET</code> in Render logs: add <strong>NEXTAUTH_SECRET</strong> in Render → Environment (see below), Save, then redeploy.
          </p>
        )}

        <div className="space-y-4 text-sm">
          <p className="font-semibold text-gray-300">On Render → your service → Environment, set:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li><strong className="text-gray-300">NEXTAUTH_SECRET</strong> — required. Run <code className="bg-zinc-800 px-1 rounded">openssl rand -base64 32</code> in a terminal and paste the result (fixes NO_SECRET errors)</li>
            <li><strong className="text-gray-300">NEXTAUTH_URL</strong> — <code className="bg-zinc-800 px-1 rounded text-pink-400">https://squidai.onrender.com</code> (your actual Render URL)</li>
            <li><strong className="text-gray-300">AUTH_TRUST_HOST</strong> — <code className="bg-zinc-800 px-1 rounded">true</code></li>
            <li><strong className="text-gray-300">GOOGLE_CLIENT_ID</strong> and <strong className="text-gray-300">GOOGLE_CLIENT_SECRET</strong> — from Google Cloud Console</li>
          </ul>

          <p className="font-semibold text-gray-300 pt-2">In Google Cloud Console:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>APIs & Services → Credentials → your OAuth 2.0 Client</li>
            <li>Under <strong className="text-gray-300">Authorized redirect URIs</strong>, add: <br />
              <code className="bg-zinc-800 px-1 rounded text-pink-400 block mt-1 break-all">https://squidai.onrender.com/api/auth/callback/google</code>
            </li>
          </ul>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-pink-500 text-white font-medium hover:bg-pink-600 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 rounded-lg border border-pink-500 text-pink-500 font-medium hover:bg-pink-500/10 transition-colors"
          >
            Try sign in again
          </Link>
        </div>
      </div>
    </div>
  );
}
