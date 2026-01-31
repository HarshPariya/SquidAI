// lib/gemini.ts
import { ENV } from "./env";

const FETCH_TIMEOUT_MS = 60_000;

export interface ChatHistoryMessage {
  role: "user" | "model";
  parts: string;
}

export interface ImagePart {
  mimeType: string;
  data: string; // base64
}

export async function streamGeminiResponse(
  history: ChatHistoryMessage[],
  msg: string,
  images?: ImagePart[]
) {
  if (!ENV.GEMINI_API_KEY) throw new Error("Gemini key missing in env");

  const lastMessageParts: Array<{ text: string } | { inline_data: { mime_type: string; data: string } }> = [
    { text: msg }
  ];
  if (images && images.length > 0) {
    for (const img of images) {
      lastMessageParts.unshift({
        inline_data: { mime_type: img.mimeType, data: img.data }
      });
    }
  }

  const contents = [
    { role: "user", parts: [{ text: "You are SquidAI, a coding assistant. You can understand and answer questions about images when the user attaches them." }] },
    ...history.map(m => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.parts }]
    })),
    { role: "user", parts: lastMessageParts }
  ];

  const url =
    `https://generativelanguage.googleapis.com/v1/models/` +
    `${ENV.GEMINI_MODEL}:streamGenerateContent?key=${ENV.GEMINI_API_KEY}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents }),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);
    const isNetwork =
      message === "fetch failed" ||
      message === "Failed to fetch" ||
      message.includes("ECONNREFUSED") ||
      message.includes("ENOTFOUND") ||
      message.includes("ETIMEDOUT") ||
      message.includes("network") ||
      (err instanceof Error && err.name === "AbortError");
    if (isNetwork) {
      throw new Error(
        "Could not reach Gemini API. Check: 1) GEMINI_API_KEY in .env.local, 2) internet/firewall, 3) https://ai.google.dev/ for key validity. Restart dev server after changing .env.local."
      );
    }
    throw err;
  }
  clearTimeout(timeoutId);

  if (!res.ok) {
    const body = await res.text();
    let detail = body;
    try {
      const j = JSON.parse(body);
      detail = j?.error?.message || j?.message || body;
    } catch {
      // use body as-is
    }
    throw new Error(`Gemini API error (${res.status}): ${detail}`);
  }

  // We will produce a ReadableStream that emits only the textual parts
  // extracted from Gemini's responses. Handle both streaming NDJSON/event
  // formats and non-streaming JSON array payloads.
  const contentType = res.headers.get("content-type") || "";
  const encoder = new TextEncoder();

  // Helper: extract candidate text from Gemini JSON object
  const extractTextFromObject = (obj: unknown): string[] => {
    const out: string[] = [];
    try {
      if (Array.isArray(obj)) {
        for (const el of obj) out.push(...extractTextFromObject(el));
        return out;
      }

      const o = obj as Record<string, unknown>;
      // Newer Gemini responses put text under candidates[].content.parts[].text
      if (o.candidates && Array.isArray(o.candidates)) {
        for (const cand of o.candidates) {
          const c = cand as Record<string, unknown>;
          const content = c.content ?? c.output ?? cand;
          const cont = content as { parts?: unknown[] } | undefined;
          if (cont?.parts && Array.isArray(cont.parts)) {
            for (const p of cont.parts) {
              const part = p as { text?: string };
              if (typeof part.text === "string") out.push(part.text);
            }
          }
        }
      }

      // Some responses may carry a direct 'text' field
      if (typeof o.text === "string") out.push(o.text);
    } catch {
      // ignore parse errors here
    }
    return out;
  };

  // If response is application/json and not streaming, read full text and stream parts
  if (contentType.includes("application/json")) {
    const full = await res.text();
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(full);
    } catch {
      // Not JSON, fall back to raw text passthrough
      return new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(full));
          controller.close();
        }
      });
    }

    const parts = extractTextFromObject(parsed);
    return new ReadableStream({
      async start(controller) {
        try {
          for (const p of parts) {
            controller.enqueue(encoder.encode(p));
            // yield to event loop so client gets chunks progressively
            await new Promise((r) => setTimeout(r, 0));
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      }
    });
  }

  // Otherwise attempt to parse a streaming body (NDJSON / event stream)
  if (!res.body) throw new Error("Empty body from Gemini");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      let buf = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });

          // Try splitting by newline to handle NDJSON or SSE-like chunks
          const lines = buf.split(/\r?\n/);
          // keep last partial line in buffer
          buf = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Some streams prefix with 'data: '
            const jsonText = trimmed.startsWith('data:') ? trimmed.replace(/^data:\s*/, '') : trimmed;
            try {
              const obj = JSON.parse(jsonText);
              const parts = extractTextFromObject(obj);
              for (const p of parts) controller.enqueue(encoder.encode(p));
            } catch {
              // Not a JSON line — forward raw text
              controller.enqueue(encoder.encode(trimmed));
            }
          }
        }

        // flush remaining buffer
        if (buf.trim()) {
          const remaining = buf.trim();
          try {
            const obj = JSON.parse(remaining);
            const parts = extractTextFromObject(obj);
            for (const p of parts) controller.enqueue(encoder.encode(p));
          } catch {
            controller.enqueue(encoder.encode(remaining));
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel(reason) {
      reader.cancel(reason);
    }
  });
}

/** Image generation model (Gemini image gen) — overridable via ENV.GEMINI_IMAGE_MODEL */

export interface GenerateImageResult {
  imageBase64: string;
  mimeType: string;
  text?: string;
}

/** Parse "Please retry in X.XXs" from Gemini error message; returns ms to wait or 0 */
function parseRetryAfterSeconds(errorMessage: string): number {
  const match = errorMessage.match(/[Rr]etry in ([\d.]+)s/);
  if (!match) return 0;
  const sec = parseFloat(match[1]);
  return Number.isFinite(sec) && sec > 0 ? Math.ceil(sec * 1000) : 0;
}

/**
 * Generate an image from a text prompt using Gemini image generation.
 * Uses the same GEMINI_API_KEY as chat. Retries once after 429 if the API suggests a delay.
 */
export async function generateImage(prompt: string, isRetry = false): Promise<GenerateImageResult> {
  if (!ENV.GEMINI_API_KEY) throw new Error("Gemini key missing in env");

  // Image generation requires v1beta; v1 does not support responseModalities/responseMimeType
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${ENV.GEMINI_IMAGE_MODEL}:generateContent?key=${ENV.GEMINI_API_KEY}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseModalities: ["TEXT", "IMAGE"],
    },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90_000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("fetch") || message.includes("network") || (err instanceof Error && err.name === "AbortError")) {
      throw new Error("Could not reach Gemini API for image generation. Check GEMINI_API_KEY and network.");
    }
    throw err;
  }
  clearTimeout(timeoutId);

  const data = await res.json().catch(() => ({})) as Record<string, unknown>;

  if (!res.ok) {
    const errMsg = (data?.error as { message?: string })?.message || res.statusText;

    // 429 quota/rate limit: retry once after suggested delay, or throw friendly message
    if (res.status === 429 && !isRetry) {
      const waitMs = parseRetryAfterSeconds(errMsg);
      if (waitMs > 0 && waitMs <= 120_000) {
        await new Promise((r) => setTimeout(r, waitMs));
        return generateImage(prompt, true);
      }
    }

    if (res.status === 429) {
      throw new Error(
        "Rate limit exceeded (quota). Wait about 30 seconds and try again, or check your plan and billing: https://ai.google.dev/gemini-api/docs/rate-limits"
      );
    }

    throw new Error(`Gemini image API error (${res.status}): ${errMsg}`);
  }

  const candidates = data?.candidates as Array<{ content?: { parts?: unknown[] } }> | undefined;
  if (!Array.isArray(candidates) || !candidates[0]?.content?.parts?.length) {
    throw new Error("No image in Gemini response. The model may not support image generation with your API key or region.");
  }

  const parts = candidates[0].content!.parts!;
  let imageBase64 = "";
  let mimeType = "image/png";
  let text = "";

  for (const part of parts) {
    const p = part as { text?: string; inlineData?: { mimeType?: string; data?: string }; inline_data?: { mime_type?: string; data?: string } };
    if (p.inlineData?.data) {
      imageBase64 = p.inlineData.data;
      mimeType = p.inlineData.mimeType || mimeType;
    } else if (p.inline_data?.data) {
      imageBase64 = p.inline_data.data;
      mimeType = p.inline_data.mime_type || mimeType;
    } else if (typeof p.text === "string") {
      text += p.text;
    }
  }

  if (!imageBase64) {
    throw new Error("No image data in response. Try a different prompt or check model availability.");
  }

  return { imageBase64, mimeType, text: text.trim() || undefined };
}
