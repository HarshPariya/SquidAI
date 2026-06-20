// app/api/transcribe/route.ts — Audio transcription via Gemini (fallback for browsers without Web Speech API)
import { NextRequest, NextResponse } from "next/server";
import { ENV } from "@/lib/env";

const FETCH_TIMEOUT_MS = 30_000;

export async function POST(req: NextRequest) {
  try {
    if (!ENV.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "API key missing — set GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { audio, mimeType } = body as { audio?: string; mimeType?: string };

    if (!audio || !mimeType) {
      return NextResponse.json(
        { error: "audio (base64) and mimeType are required" },
        { status: 400 }
      );
    }

    // Use Gemini to transcribe audio — it natively supports audio input
    const url =
      `https://generativelanguage.googleapis.com/v1/models/` +
      `${ENV.GEMINI_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { inline_data: { mime_type: mimeType, data: audio } },
              {
                text: "Transcribe the audio exactly as spoken. Return ONLY the transcribed text, nothing else. If the audio is empty, silent, or unintelligible, return an empty string.",
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0,
          maxOutputTokens: 1024,
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errBody = await res.text();
      let detail = errBody;
      try {
        const j = JSON.parse(errBody);
        detail = j?.error?.message || detail;
      } catch {
        // use body as-is
      }
      return NextResponse.json(
        { error: `Gemini error (${res.status}): ${detail}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    // Extract text from Gemini response
    let transcript = "";
    const candidates = data?.candidates;
    if (Array.isArray(candidates)) {
      for (const cand of candidates) {
        const parts = cand?.content?.parts;
        if (Array.isArray(parts)) {
          for (const part of parts) {
            if (typeof part.text === "string") {
              transcript += part.text;
            }
          }
        }
      }
    }

    return NextResponse.json({ transcript: transcript.trim() });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
