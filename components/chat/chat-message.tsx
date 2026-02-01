import { User, Copy, Check } from "lucide-react";
import type { ComponentProps, CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type CodeProps = ComponentProps<"code"> & { inline?: boolean };

export interface ChatMessageProps {
    role: "user" | "model";
    text: string;
    timestamp: Date | string;
}

const CopyButton = ({ text }: { text: string }) => {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            className="absolute top-2 right-2 p-1 rounded-md bg-white/10 hover:bg-white/20 text-zinc-400 transition-colors"
            title="Copy Code"
        >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        </button>
    )
}

export function ChatMessage({ role, text, timestamp }: ChatMessageProps) {
    const timeDisplay = timestamp instanceof Date
        ? timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={cn(
                "flex gap-4 max-w-4xl mx-auto w-full",
                role === "user" ? "flex-row-reverse" : ""
            )}
        >
            {/* Avatar */}
            <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-[0_0_10px_currentColor]",
                role === "user"
                    ? "bg-violet-950/50 border-violet-500/50 text-violet-300"
                    : "bg-pink-950/50 border-pink-500/50 text-pink-300"
            )}>
                {role === "user" ? (
                    <User size={14} />
                ) : (
                    /* SquidAI Glowing Squid Logo */
                    <svg
                        viewBox="0 0 100 100"
                        className="w-4 h-4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Squid head/body */}
                        <circle cx="50" cy="35" r="15" fill="currentColor" />
                        {/* Left eye */}
                        <circle cx="44" cy="33" r="2" fill="#fff" />
                        <circle cx="44" cy="33" r="1" fill="#000" />
                        {/* Right eye */}
                        <circle cx="56" cy="33" r="2" fill="#fff" />
                        <circle cx="56" cy="33" r="1" fill="#000" />
                        {/* Tentacles */}
                        <path d="M 38 48 Q 35 58 37 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M 50 52 Q 50 62 48 72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                        <path d="M 62 48 Q 65 58 63 68" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                    </svg>
                )}
            </div>

            {/* Content */}
            <div className={cn(
                "flex-1 max-w-[85%]",
                role === "user" ? "text-right" : "text-left"
            )}>
                <div className={cn(
                    "inline-block text-sm p-4 rounded-2xl backdrop-blur-sm border shadow-sm",
                    role === "user"
                        ? "bg-violet-900/10 border-violet-500/20 text-violet-100 rounded-tr-none"
                        : "bg-pink-950/10 border-pink-500/20 text-pink-50 rounded-tl-none shadow-[0_0_15px_rgba(236,72,153,0.05)] w-full"
                )}>
                    {role === "model" ? (
                        <div className="markdown-prose">
                            <ReactMarkdown
                                components={{
                                    code({ inline, className, children, ...props }: CodeProps) {
                                        const match = /language-(\w+)/.exec(className || "");
                                        const codeString = String(children).replace(/\n$/, "");
                                        return !inline && match ? (
                                            <div className="relative rounded-lg overflow-hidden my-3 border border-pink-500/20 shadow-lg group text-left">
                                                <div className="bg-black/80 px-4 py-2 text-[10px] text-pink-500 font-mono border-b border-pink-500/10 flex items-center justify-between uppercase tracking-wider">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                                                        <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                                                        <div className="w-2 h-2 rounded-full bg-green-500/50" />
                                                        <span className="ml-2">{match[1]}</span>
                                                    </div>
                                                </div>
                                                <CopyButton text={codeString} />
                                                <SyntaxHighlighter
                                                    style={vscDarkPlus as Record<string, CSSProperties>}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    customStyle={{ margin: 0, borderRadius: 0, background: 'rgba(0,0,0,0.6)', fontSize: '12px' }}
                                                >
                                                    {codeString}
                                                </SyntaxHighlighter>
                                            </div>
                                        ) : (
                                            <code className="bg-pink-950/30 border border-pink-500/20 px-1 py-0.5 rounded text-pink-300 font-mono text-xs" {...props}>
                                                {children}
                                            </code>
                                        );
                                    },
                                }}
                            >
                                {text}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
                    )}
                </div>
                <div className="mt-1 text-[10px] text-zinc-500 font-mono opacity-50 px-1">
                    {timeDisplay}
                </div>
            </div>
        </motion.div>
    );
}
