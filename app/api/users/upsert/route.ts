// Saves or updates a user in MongoDB when they login or register
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";

export async function POST(req: NextRequest) {
  if (!ENV.MONGODB_URI) return NextResponse.json({ ok: true });

  try {
    const body = await req.json();
    const { id, email, name } = body;
    if (!id || !email) return NextResponse.json({ ok: true });

    const { saveUser } = await import("@/lib/mongodb");
    await saveUser({
      id: String(id),
      email: String(email),
      ...(name != null && { name: String(name) }),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
