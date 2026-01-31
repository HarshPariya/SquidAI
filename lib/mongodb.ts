/**
 * MongoDB connection and helpers for SquidAI.
 * Set MONGODB_URI in .env.local. If your password contains @, use %40 instead (e.g. Harsh@2005 → Harsh%402005).
 */
import { MongoClient, Db } from "mongodb";
import { ENV } from "@/lib/env";

const getDbName = () => ENV.MONGODB_DB_NAME;
const COLLECTION_SEARCHES = "user_searches";
const COLLECTION_CHAT_MESSAGES = "chat_messages";
const COLLECTION_USERS = "users";

let cachedDb: Db | null = null;

/** Options: TLS + shorter timeout; tlsAllowInvalidCertificates fixes "tlsv1 alert internal error" on Windows */
const MONGO_OPTIONS = {
  tls: true,
  serverSelectionTimeoutMS: 10000,
  tlsAllowInvalidCertificates: true,
};

export async function getMongoDb(): Promise<Db | null> {
  if (!ENV.MONGODB_URI) return null;
  if (cachedDb) return cachedDb;

  try {
    const client = new MongoClient(ENV.MONGODB_URI, MONGO_OPTIONS);
    await client.connect();
    cachedDb = client.db(getDbName());
    return cachedDb;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[MongoDB] Connection error:", msg);
    return null;
  }
}

export interface UserSearchDoc {
  query: string;
  userId?: string;
  userEmail?: string;
  sessionId?: string;
  createdAt: Date;
}

export interface ChatMessageDoc {
  sessionId: string;
  userId?: string;
  userEmail?: string;
  role: "user" | "model";
  content: string;
  createdAt: Date;
}

export interface UserDoc {
  id: string;
  email: string;
  name?: string;
  lastLoginAt?: Date;
  createdAt: Date;
}

export async function saveUserSearch(doc: Omit<UserSearchDoc, "createdAt">): Promise<void> {
  const db = await getMongoDb();
  if (!db) return;

  try {
    const collection = db.collection<UserSearchDoc>(COLLECTION_SEARCHES);
    await collection.insertOne({
      ...doc,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[MongoDB] saveUserSearch error:", err);
  }
}

export async function saveChatMessage(doc: Omit<ChatMessageDoc, "createdAt">): Promise<void> {
  const db = await getMongoDb();
  if (!db) return;

  try {
    const collection = db.collection<ChatMessageDoc>(COLLECTION_CHAT_MESSAGES);
    await collection.insertOne({
      ...doc,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[MongoDB] saveChatMessage error:", err);
  }
}

export async function saveUser(doc: Omit<UserDoc, "createdAt" | "lastLoginAt">): Promise<void> {
  const db = await getMongoDb();
  if (!db) return;

  try {
    const collection = db.collection<UserDoc>(COLLECTION_USERS);
    const now = new Date();
    await collection.updateOne(
      { email: doc.email },
      {
        $set: {
          id: doc.id,
          email: doc.email,
          name: doc.name,
          lastLoginAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );
  } catch (err) {
    console.error("[MongoDB] saveUser error:", err);
  }
}
