import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/gemini";
import { ENV } from "@/lib/env";

export async function POST(req: NextRequest) {
  try {
    if (!ENV.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key missing — set GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required (e.g. 'a BMW car')" },
        { status: 400 }
      );
    }

    const result = await generateImage(prompt);
    return NextResponse.json({
      imageBase64: result.imageBase64,
      mimeType: result.mimeType,
      text: result.text,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
