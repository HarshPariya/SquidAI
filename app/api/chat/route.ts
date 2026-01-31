// app/api/chat/route.ts — no MongoDB import here to avoid Turbopack symlink crash on Windows
import { NextRequest, NextResponse } from "next/server";
import { streamGeminiResponse } from "@/lib/gemini";
import { ENV } from "@/lib/env";

let last = 0;
const CD = 5000; // cooldown ms

export async function POST(req: NextRequest) {
  try {
    if (!ENV.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "⛔ API key missing — set GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const now = Date.now();
    if (now - last < CD) {
      return NextResponse.json(
        { error: `⏳ Cooldown — wait ${(CD - (now - last)) / 1000}s` },
        { status: 429 }
      );
    }
    last = now;

    const body = await req.json();
    const { history, message, images } = body;
    if (!message && (!images || images.length === 0)) {
      return NextResponse.json({ error: "Message or images required" }, { status: 400 });
    }

    const stream = await streamGeminiResponse(
      history || [],
      message || "What do you see in these images? Please describe or answer any question about them.",
      images
    );
    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const hint =
      msg.includes("GEMINI_API_KEY") || msg.includes("reach Gemini")
        ? "Check GEMINI_API_KEY in .env.local, verify at https://ai.google.dev/, then restart the dev server."
        : undefined;
    return NextResponse.json(
      { error: `❌ Error: ${msg}`, hint },
      { status: msg.includes("API key") ? 500 : 503 }
    );
  }
}
