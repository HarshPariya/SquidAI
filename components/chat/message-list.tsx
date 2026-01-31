import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage, ChatMessageProps } from "./chat-message";
import { cn } from "@/lib/utils";
import { useAutoScroll } from "@/hooks/use-auto-scroll";
import { ArrowDown } from "lucide-react";

interface MessageListProps {
    messages: ChatMessageProps[];
    className?: string;
}

export function MessageList({ messages, className }: MessageListProps) {
    const {
        scrollRef,
        showScrollButton,
        scrollToBottom,
        handleScroll
    } = useAutoScroll<HTMLDivElement>([messages], { smooth: true });

    return (
        <div className="relative flex-1 min-h-0 overflow-hidden flex flex-col">
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                data-lenis-prevent="true" // CRITICAL logic to stop Lenis hijacking
                className={cn(
                    "flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-cyan-900/50 scrollbar-track-transparent",
                    className
                )}
                style={{
                    scrollbarGutter: 'stable',
                    overscrollBehavior: 'contain',
                    overflowAnchor: 'none' // We handle sticking manually
                }}
            >
                {messages.map((msg, index) => (
                    <ChatMessage
                        key={index} // safe for append-only
                        {...msg}
                    />
                ))}

                {/* Spacer to ensure we can scroll past the last message a bit */}
                <div className="h-4 w-full" />
            </div>

            {/* Jump to bottom button */}
            <AnimatePresence>
                {showScrollButton && (
                    <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => scrollToBottom()}
                        className="absolute bottom-6 right-6 p-2 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/80 backdrop-blur-sm shadow-lg z-10 transition-colors"
                    >
                        <ArrowDown size={20} />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
