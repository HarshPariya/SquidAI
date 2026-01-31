// Test MongoDB connection — GET /api/mongodb-status to see why connection might fail
import { NextResponse } from "next/server";
import { ENV } from "@/lib/env";

export async function GET() {
  if (!ENV.MONGODB_URI) {
    return NextResponse.json({
      ok: false,
      error: "MONGODB_URI not set",
      fix: "Add MONGODB_URI to .env.local (see README or lib/mongodb.ts comment). If password has @, use %40.",
    }, { status: 200 });
  }

  try {
    const { MongoClient } = await import("mongodb");
    const client = new MongoClient(ENV.MONGODB_URI, {
      tls: true,
      serverSelectionTimeoutMS: 10000,
      tlsAllowInvalidCertificates: true,
    });
    await client.connect();
    await client.db("squidai").command({ ping: 1 });
    await client.close();
    return NextResponse.json({ ok: true, message: "Connected to MongoDB" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const fix =
      msg.includes("authentication") || msg.includes("auth")
        ? "Check username/password. If password contains @ # or ?, use URL encoding: @ → %40, # → %23, ? → %3F."
        : msg.includes("ENOTFOUND") || msg.includes("getaddrinfo")
          ? "Check cluster hostname (e.g. cluster0.xxxxx.mongodb.net) and internet."
          : msg.includes("timed out") || msg.includes("timeout")
            ? "Allow your IP in Atlas: Network Access → Add IP Address (or 0.0.0.0/0 for dev)."
            : "See Atlas dashboard and server logs.";
    return NextResponse.json({
      ok: false,
      error: msg,
      fix,
    }, { status: 200 });
  }
}
