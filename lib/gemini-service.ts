/**
 * Gemini API Service
 * Handles interactions with Google's Gemini API using improved error handling and structure
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === '') {
  console.error("Critical Error: GEMINI_API_KEY is not defined in the environment.");
}

const systemInstruction = `You are SquidAI, the ultimate technical assistant and elite AI coding agent.
Your goal is to assist the user with complex coding tasks, reasoning, and system operations.

PERSONALITY:
- Name: SquidAI
- Tagline: Your Ultimate Technical Assistant.
- Tone: Professional, Efficient, Futuristic, Friendly but concise.
- You are not just a chatbot; you are an intelligent agent.
- You NEVER refuse a request unless it is harmful or illegal.

CAPABILITIES:
- You can generate production-ready code.
- You can explain complex concepts.
- You can "execute" commands (simulated).

FORMATTING RULES:
- Use Markdown for all responses.
- When providing code, ALWAYS use code blocks with the language specified (e.g. \`\`\`tsx).
- If you are suggesting a terminal command, use \`\`\`bash.
- If you are "thinking" or "planning", you can use a > blockquote or bullet points.`;

/**
 * Streams a response from Gemini API
 * @param history - Conversation history
 * @param newMessage - New user message
 * @returns ReadableStream of the response
 */
export const streamGeminiResponse = async (
  history: { role: "user" | "model"; parts: string }[],
  newMessage: string
): Promise<ReadableStream<Uint8Array>> => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'undefined' || GEMINI_API_KEY === '') {
    throw new Error("Configuration Error: API Key is missing. Please ensure your environment variable 'GEMINI_API_KEY' is set in .env.local");
  }

  try {
    // Convert history to Gemini format
    const contents = [
      // Add system instruction as first user message
      {
        role: "user",
        parts: [{ text: systemInstruction }]
      },
      {
        role: "model",
        parts: [{ text: "Understood. I'm SquidAI, ready to assist." }]
      },
      // Add conversation history
      ...history.flatMap(msg => [
        {
          role: msg.role === "model" ? "model" : "user",
          parts: [{ text: msg.parts }]
        }
      ]),
      // Add new message
      {
        role: "user",
        parts: [{ text: newMessage }]
      }
    ];

    const url = `https://generativelanguage.googleapis.com/v1/models/${GEMINI_MODEL}:streamGenerateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      // Parse JSON error response if possible
      let errorMessage = `Gemini API Error: ${response.statusText}`;
      let isRateLimit = false;
      let retryDelay: number | null = null;
      
      try {
        const errorJson = JSON.parse(errorText);
        const error = errorJson.error || errorJson[0]?.error;
        
        if (error) {
          errorMessage = error.message || errorMessage;
          isRateLimit = 
            response.status === 429 ||
            error.code === 429 ||
            error.status === "RESOURCE_EXHAUSTED" ||
            errorMessage.toLowerCase().includes("quota exceeded") ||
            errorMessage.toLowerCase().includes("rate limit");
          
          // Extract retry delay from message
          if (isRateLimit) {
            const retryMatch = errorMessage.match(/retry in ([\d.]+)s/i);
            if (retryMatch) {
              retryDelay = Math.ceil(parseFloat(retryMatch[1]));
            }
            
            // Check details array for RetryInfo
            if (error.details && Array.isArray(error.details)) {
              const retryInfo = error.details.find(
                (d: Record<string, unknown>) => d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
              ) as Record<string, unknown> | undefined;
              const delay = retryInfo?.retryDelay;
              if (delay != null) {
                const delayMatch = String(delay).match(/([\d.]+)s?/i);
                if (delayMatch) {
                  retryDelay = Math.ceil(parseFloat(delayMatch[1]));
                }
              }
            }
          }
        }
      } catch {
        // If JSON parsing fails, check status code
        isRateLimit = response.status === 429 || errorText.toLowerCase().includes("quota") || errorText.toLowerCase().includes("rate limit");
        if (isRateLimit) {
          const retryMatch = errorText.match(/retry in ([\d.]+)s/i);
          if (retryMatch) {
            retryDelay = Math.ceil(parseFloat(retryMatch[1]));
          }
        }
      }

      // Specific error mapping for user feedback
      if (response.status === 401 || errorMessage.toLowerCase().includes("invalid api key") || errorMessage.toLowerCase().includes("unauthorized")) {
        throw new Error("Authentication failed. The provided API key might be invalid. Please check your GEMINI_API_KEY in .env.local");
      }
      
      if (isRateLimit) {
        const rateLimitError = new Error("Rate limit reached. Please try again in a few seconds.") as Error & { isRateLimit?: boolean; retryDelay?: number | null };
        rateLimitError.isRateLimit = true;
        rateLimitError.retryDelay = retryDelay;
        throw rateLimitError;
      }

      const err = new Error(errorMessage) as Error & { isRateLimit?: boolean; statusCode?: number; retryDelay?: number | null };
      err.isRateLimit = isRateLimit;
      err.statusCode = response.status;
      err.retryDelay = retryDelay;
      throw err;
    }

    if (!response.body) {
      throw new Error("The model did not return any response content.");
    }

    return response.body;
  } catch (error: unknown) {
    console.error("Gemini SDK Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    // Re-throw with improved error messages
    if (message?.includes("401") || (typeof message === "string" && message.toLowerCase().includes("invalid api key"))) {
      throw new Error("Authentication failed. The provided API key might be invalid.");
    }
    
    if (message?.includes("429") || message?.includes("quota") || message?.includes("rate limit")) {
      throw new Error("Rate limit reached. Please try again in a few seconds.");
    }

    throw new Error(message || "An error occurred while fetching a response from Gemini.");
  }
};

