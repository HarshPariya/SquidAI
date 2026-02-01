// Saves one chat message to MongoDB (user or assistant)
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextauth";

export async function POST(req: NextRequest) {
  if (!ENV.MONGODB_URI) return NextResponse.json({ ok: true });

  try {
    const body = await req.json();
    const { sessionId, role, content } = body;
    if (!sessionId || !role || content == null) return NextResponse.json({ ok: true });

    // Determine authenticated user server-side (only save if authenticated)
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;
    const userEmail = session?.user?.email as string | undefined;
    if (!userId) return NextResponse.json({ ok: true });

    const { saveChatMessage } = await import("@/lib/mongodb");
    await saveChatMessage({
      sessionId: String(sessionId),
      ...(userId && { userId: String(userId) }),
      ...(userEmail && { userEmail: String(userEmail) }),
      role: role === "model" ? "model" : "user",
      content: typeof content === "string" ? content : String(content),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
