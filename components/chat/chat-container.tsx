"use client";

import { useState, useRef, useEffect } from "react";
import { useChatHistory } from "@/components/chat/chat-history-context";
import { HoloCard } from "@/components/ui/holo-card";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { ChatMessageProps } from "./chat-message";

export function ChatContainer({ onStatusChange }: { onStatusChange?: (status: "idle" | "thinking" | "speaking") => void }) {
  const { sessions, activeSessionId, createSession, addMessageToSession } =
    useChatHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [streamingQueue, setStreamingQueue] = useState("");
  const [displayedStreaming, setDisplayedStreaming] = useState("");

  const cooldownRef = useRef(false);
  const requestInFlight = useRef(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const storedMessages: ChatMessageProps[] = activeSession
    ? activeSession.messages.map((m) => ({
        role: m.role,
        text: m.text,
        timestamp: m.timestamp,
      }))
    : [
        {
          role: "model",
          text: "Initial systems check complete. **SquidAI** remains ready to serve.",
          timestamp: new Date().toISOString(),
        },
      ];

  const displayMessages = [...storedMessages];

  if (displayedStreaming) {
    displayMessages.push({
      role: "model",
      text: displayedStreaming,
      timestamp: new Date().toISOString(),
    });
  }

  const sendMessage = async (text: string) => {
    if (requestInFlight.current || cooldownRef.current) return;

    requestInFlight.current = true;
    setIsLoading(true);
    cooldownRef.current = true;
    setStreamingQueue("");
    setDisplayedStreaming("");
    onStatusChange?.("thinking");

    let sid = activeSessionId;
    if (!sid) sid = await createSession(text);

    await addMessageToSession(sid, {
      role: "user",
      text,
      timestamp: new Date().toISOString(),
    });

    try {
      const historyBase = sessions.find((s) => s.id === sid);
      const h = historyBase
        ? historyBase.messages.slice(-4).map((m) => ({
            role: m.role,
            parts: m.text,
          }))
        : [];

      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: h, message: text }),
      });

      if (!r.ok) {
        let errorText = "AI not responding. Try again.";
        let hint = "";
        try {
          const data = await r.json();
          if (data?.error) errorText = data.error;
          if (data?.hint) hint = `\n\n**Troubleshooting:** ${data.hint}`;
        } catch {
          // use default
        }
        await addMessageToSession(sid, {
          role: "model",
          text: `⚠️ **Error (${r.status}):** ${errorText}${hint}`,
          timestamp: new Date().toISOString(),
        });
        return;
      }
      if (!r.body) {
        await addMessageToSession(sid, {
          role: "model",
          text: "⚠️ AI returned no content. Try again.",
          timestamp: new Date().toISOString(),
        });
        return;
      }

      onStatusChange?.("speaking");

      const reader = r.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        full += chunk;
        setStreamingQueue((prev) => prev + chunk);
      }

      // wait a short time for consumer to render
      const start = Date.now();
      while (displayedStreaming.length < full.length && Date.now() - start < 5000) {
        await new Promise((r) => setTimeout(r, 50));
      }

      setStreamingQueue("");

      await addMessageToSession(sid, {
        role: "model",
        text: full,
        timestamp: new Date().toISOString(),
      });
    } finally {
      onStatusChange?.("idle");
      setIsLoading(false);
      requestInFlight.current = false;
      setTimeout(() => (cooldownRef.current = false), 2000);
    }
  };

  // Typing consumer for chat-container
  const queueRef = useRef("");
  useEffect(() => {
    queueRef.current = streamingQueue;
  }, [streamingQueue]);

  useEffect(() => {
    if (!streamingQueue) return;
    let cancelled = false;
    const consume = async () => {
      while (!cancelled && queueRef.current.length > 0) {
        const nextChar = queueRef.current.charAt(0);
        queueRef.current = queueRef.current.slice(1);
        setDisplayedStreaming((prev) => prev + nextChar);
        await new Promise((r) => setTimeout(r, 20));
      }
    };
    consume();
    return () => { cancelled = true; };
  }, [streamingQueue]);

  return (
    <HoloCard className="h-full border-none shadow-none bg-transparent overflow-hidden">
      <div className="flex flex-col h-full overflow-hidden">
        <MessageList messages={displayMessages} className="flex-1 min-h-0" />
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </HoloCard>
  );
}
