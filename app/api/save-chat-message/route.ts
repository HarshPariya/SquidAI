// Saves one chat message to MongoDB (user or assistant)
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";

export async function POST(req: NextRequest) {
  if (!ENV.MONGODB_URI) return NextResponse.json({ ok: true });

  try {
    const body = await req.json();
    const { sessionId, userId, userEmail, role, content } = body;
    if (!sessionId || !role || content == null) return NextResponse.json({ ok: true });

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
