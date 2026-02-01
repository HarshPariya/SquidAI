// lib/load-env.ts
import dotenv from "dotenv";

// Only load .env.local in development, not in production (Render, Vercel, etc)
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

if (process.env.NODE_ENV !== "production") {
  console.log("🔍 ENV Loaded Keys:", Object.keys(process.env).filter(k => k.includes("GEMINI")));
  console.log("🔑 GEMINI_API_KEY Exists:", !!process.env.GEMINI_API_KEY);
}

export const ENV = {
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GEMINI_MODEL: process.env.GEMINI_MODEL || "gemini-2.5-flash",
};
