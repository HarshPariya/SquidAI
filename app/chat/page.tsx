"use client";

import { useRouter } from "next/navigation";
import { ChatInterface } from "@/components/ChatInterface";

export default function ChatPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black">
      <ChatInterface onClose={() => router.push("/")} />
    </div>
  );
}
