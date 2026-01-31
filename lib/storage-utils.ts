import fs from 'fs/promises';
import path from 'path';
import { ChatSession } from '@/types/chat';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'chats.json');

async function ensureDataDir() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
}

export async function getSessions(): Promise<ChatSession[]> {
    try {
        await ensureDataDir();
        try {
            const data = await fs.readFile(FILE_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (readError) {
            // If file doesn't exist or is empty/invalid, return empty array
            console.warn('Chat sessions file not found or invalid, starting fresh.', readError);
            return [];
        }
    } catch (error) {
        console.error('Error reading chat sessions:', error);
        return [];
    }
}

export async function saveSessions(sessions: ChatSession[]): Promise<boolean> {
    try {
        await ensureDataDir();
        await fs.writeFile(FILE_PATH, JSON.stringify(sessions, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error('Error saving chat sessions:', error);
        return false;
    }
}
