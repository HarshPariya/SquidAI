// Separate route for saving searches — MongoDB loaded only at runtime (dynamic import) to avoid Turbopack symlink crash
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

export async function POST(req: NextRequest) {
  if (!ENV.MONGODB_URI) {
    return NextResponse.json({ ok: true }); // no-op, don't fail client
  }
  try {
    const body = await req.json();
    const { query, sessionId } = body;
    if (!query) return NextResponse.json({ ok: true });

    // Determine authenticated user server-side
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    const userEmail = session?.user?.email as string | undefined;
    if (!userId) return NextResponse.json({ ok: true }); // only save for authenticated users

    const { saveUserSearch } = await import("@/lib/mongodb");
    await saveUserSearch({
      query: typeof query === "string" ? query : String(query),
      ...(userId && { userId }),
      ...(userEmail && { userEmail }),
      ...(sessionId && { sessionId }),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // never fail the client
  }
}
