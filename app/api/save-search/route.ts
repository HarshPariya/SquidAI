// Separate route for saving searches — MongoDB loaded only at runtime (dynamic import) to avoid Turbopack symlink crash
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";

export async function POST(req: NextRequest) {
  if (!ENV.MONGODB_URI) {
    return NextResponse.json({ ok: true }); // no-op, don't fail client
  }
  try {
    const body = await req.json();
    const { query, userId, userEmail, sessionId } = body;
    if (!query) return NextResponse.json({ ok: true });

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
