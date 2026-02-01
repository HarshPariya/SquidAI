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
const COLLECTION_CHAT_SESSIONS = "chat_sessions";

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

// Chat sessions stored per user (if userId provided)
export async function getUserSessions(userId?: string): Promise<any[]> {
  const db = await getMongoDb();
  if (!db) return [];
  try {
    const collection = db.collection(COLLECTION_CHAT_SESSIONS);
    if (userId) {
      const sessions = await collection.find({ userId }).toArray();
      // map to plain sessions array
      return sessions.map(s => s.session);
    }
    // If no userId provided, return all sessions (not recommended)
    const all = await collection.find({}).toArray();
    return all.map(s => s.session);
  } catch (err) {
    console.error('[MongoDB] getUserSessions error:', err);
    return [];
  }
}

export async function upsertUserSession(userId: string | undefined, session: any): Promise<void> {
  const db = await getMongoDb();
  if (!db) return;
  try {
    const collection = db.collection(COLLECTION_CHAT_SESSIONS);
    if (!userId) return;
    await collection.updateOne(
      { userId, 'session.id': session.id },
      { $set: { userId, session } },
      { upsert: true }
    );
  } catch (err) {
    console.error('[MongoDB] upsertUserSession error:', err);
  }
}

export async function addMessageToUserSession(userId: string | undefined, sessionId: string, message: any): Promise<void> {
  const db = await getMongoDb();
  if (!db) return;
  try {
    const collection = db.collection(COLLECTION_CHAT_SESSIONS);
    if (!userId) return;
    await collection.updateOne(
      { userId, 'session.id': sessionId },
      { $push: { 'session.messages': message }, $set: { 'session.updatedAt': Date.now() } }
    );
  } catch (err) {
    console.error('[MongoDB] addMessageToUserSession error:', err);
  }
}

export async function deleteUserSession(userId: string | undefined, sessionId: string): Promise<void> {
  const db = await getMongoDb();
  if (!db) return;
  try {
    const collection = db.collection(COLLECTION_CHAT_SESSIONS);
    if (!userId) return;
    await collection.deleteOne({ userId, 'session.id': sessionId });
  } catch (err) {
    console.error('[MongoDB] deleteUserSession error:', err);
  }
}
