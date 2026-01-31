import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ChatInputProps {
    onSend: (message: string) => void;
    disabled?: boolean;
    className?: string; // Allow extending styles
}

export function ChatInput({ onSend, disabled, className }: ChatInputProps) {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || disabled) return;

        onSend(input.trim());
        setInput("");
    };

    return (
        <div className={cn("p-4 bg-gradient-to-t from-black via-black/80 to-transparent", className)}>
            <form
                onSubmit={handleSubmit}
                className="relative max-w-4xl mx-auto flex items-end gap-2"
            >
                <div className="relative flex-1 group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Initialize query..."
                        className="relative bg-black border-zinc-800 text-cyan-100 placeholder:text-zinc-600 min-h-[50px] pl-4 pr-12 rounded-lg focus-visible:ring-0 focus-visible:border-cyan-500/50 transition-all font-mono"
                        disabled={disabled}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={disabled || !input.trim()}
                    size="icon"
                    className="h-[50px] w-[50px] bg-cyan-900/20 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </form>
        </div>
    );
}
