"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ChatSession, ChatMessage, ChatStorageMode, ChatHistoryContextType } from "@/types/chat";

const ChatHistoryContext = createContext<ChatHistoryContextType | undefined>(undefined);

export function ChatHistoryProvider({ children }: { children: React.ReactNode }) {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [storageMode, setStorageMode] = useState<ChatStorageMode>("demo");
    const [isLoading, setIsLoading] = useState(true);

    // Initialize: Check if API is available and load sessions
    useEffect(() => {
        const init = async () => {
            try {
                const res = await fetch("/api/sessions");
                if (res.ok) {
                    setStorageMode("local");
                    const data = await res.json();
                    setSessions(data.sessions || []);
                } else {
                    throw new Error("API not available");
                }
            } catch (error) {
                if (process.env.NODE_ENV !== "production") {
                    console.log("Switching to Demo Mode (LocalStorage)", error);
                }
                setStorageMode("demo");
                const localData = localStorage.getItem("SquidAI_chat_sessions");
                if (localData) {
                    try {
                        const parsed = JSON.parse(localData);
                        setSessions(parsed);
                    } catch (e) {
                        console.error("Failed to parse local storage", e);
                    }
                }
            } finally {
                setIsLoading(false);
            }
        };
        init();
    }, []);

    // Persist to storage whenever sessions change
    useEffect(() => {
        if (isLoading) return;

        if (storageMode === "demo") {
            localStorage.setItem("SquidAI_chat_sessions", JSON.stringify(sessions));
        }
        // For local mode, individual actions trigger API calls, so we don't sync on every state change here
        // to avoid race conditions or excessive writes, but we could add a debounce sync if needed.
        // Ideally, we update state optimistically and then confirm with API.
    }, [sessions, storageMode, isLoading]);


    const createSession = useCallback(async (initialMessage?: string) => {
        const newSession: ChatSession = {
            id: crypto.randomUUID(),
            title: initialMessage ? (initialMessage.length > 30 ? initialMessage.slice(0, 30) + "..." : initialMessage) : "New Chat",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            messages: [],
        };

        setSessions((prev) => [newSession, ...prev]);
        setActiveSessionId(newSession.id);

        if (storageMode === "local") {
            await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "create", session: newSession }),
            });
        }

        return newSession.id;
    }, [storageMode]);

    const addMessageToSession = useCallback(async (sessionId: string, message: ChatMessage) => {
        setSessions((prev) => {
            return prev.map(s => {
                if (s.id === sessionId) {
                    return {
                        ...s,
                        updatedAt: Date.now(),
                        messages: [...s.messages, message]
                    };
                }
                return s;
            }).sort((a, b) => b.updatedAt - a.updatedAt);
        });

        if (storageMode === "local") {
            await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "addMessage", sessionId, message }),
            });
        }
    }, [storageMode]);

    const updateSessionTitle = useCallback(async (sessionId: string, newTitle: string) => {
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, title: newTitle } : s));

        if (storageMode === "local") {
            await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "rename", sessionId, title: newTitle }),
            });
        }
    }, [storageMode]);

    const deleteSession = useCallback(async (sessionId: string) => {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (activeSessionId === sessionId) {
            setActiveSessionId(null);
        }

        if (storageMode === "local") {
            await fetch(`/api/sessions?id=${sessionId}`, { method: "DELETE" });
        }
    }, [activeSessionId, storageMode]);

    const clearAllSessions = useCallback(async () => {
        setSessions([]);
        setActiveSessionId(null);
        if (storageMode === "local") {
            await fetch(`/api/sessions?all=true`, { method: "DELETE" });
        }
    }, [storageMode]);

    return (
        <ChatHistoryContext.Provider
            value={{
                sessions,
                activeSessionId,
                storageMode,
                isLoading,
                createSession,
                setActiveSession,
                addMessageToSession,
                updateSessionTitle,
                deleteSession,
                clearAllSessions,
            }}
        >
            {children}
        </ChatHistoryContext.Provider>
    );

    function setActiveSession(id: string) {
        setActiveSessionId(id);
    }
}

export function useChatHistory() {
    const context = useContext(ChatHistoryContext);
    if (!context) {
        throw new Error("useChatHistory must be used within a ChatHistoryProvider");
    }
    return context;
}
