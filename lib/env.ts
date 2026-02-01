// lib/env.ts
import dotenv from "dotenv";
import path from "path";

// Only load .env.local in development
// In production (Render, Vercel, etc), use platform environment variables
if (process.env.NODE_ENV !== "production") {
  const envPath = path.join(process.cwd(), ".env.local");
  dotenv.config({ path: envPath });
}

export const ENV = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  /** Image generation model; use v1beta-capable model (e.g. gemini-2.0-flash-exp-image-generation or gemini-2.5-flash-image) */
  GEMINI_IMAGE_MODEL: process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-exp-image-generation",
  MONGODB_URI: process.env.MONGODB_URI || "",
  /** DB name must match your MongoDB Atlas db exactly (case-sensitive). Default: SquidAI */
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || "SquidAI",
};

if (process.env.NODE_ENV !== "production") {
  console.log("🔑 [ENV] GEMINI:", ENV.GEMINI_API_KEY ? "Loaded" : "Missing");
  console.log("🔑 [ENV] MONGODB:", ENV.MONGODB_URI ? "Loaded" : "Missing");
}
