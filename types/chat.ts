export interface ChatMessage {
    role: 'user' | 'model'; // 'model' matches existing code (was 'assistant' in req, but 'model' is used in ChatInterface)
    text: string;           // 'text' matches existing code (was 'content' in req)
    timestamp: string;      // ISO string for storage, converted to Date in UI
}

export interface ChatSession {
    id: string;
    title: string;
    createdAt: number;
    updatedAt: number;
    messages: ChatMessage[];
}

export type ChatStorageMode = 'demo' | 'local';

export interface ChatHistoryContextType {
    sessions: ChatSession[];
    activeSessionId: string | null;
    storageMode: ChatStorageMode;
    isLoading: boolean;

    createSession: (initialMessage?: string) => Promise<string>;
    setActiveSession: (id: string) => void;
    addMessageToSession: (sessionId: string, message: ChatMessage) => Promise<void>;
    updateSessionTitle: (sessionId: string, newTitle: string) => Promise<void>;
    deleteSession: (sessionId: string) => Promise<void>;
    clearAllSessions: () => Promise<void>;
}
