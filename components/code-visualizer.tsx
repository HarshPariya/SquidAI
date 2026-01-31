"use client";

import { useEffect, useState, useCallback } from "react";
import { Terminal, Wifi, Shield, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { HoloCard } from "@/components/ui/holo-card";
import { useAutoScroll } from "@/hooks/use-auto-scroll";

type Log = {
    id: string;
    type: "info" | "success" | "warning" | "error" | "code";
    message: string;
    timestamp: string;
    module: string;
};

export function CodeVisualizer() {
    const [logs, setLogs] = useState<Log[]>(() => [
        { id: '1', type: 'info', message: 'BIOS Check... OK', timestamp: new Date().toLocaleTimeString(), module: 'SYS' },
        { id: '2', type: 'info', message: 'Neural Link Established', timestamp: new Date().toLocaleTimeString(), module: 'NET' },
        { id: '3', type: 'success', message: 'SquidAI Protocol v2.5 Online', timestamp: new Date().toLocaleTimeString(), module: 'CORE' },
    ]);

    // Use the same smart scroll hook for the terminal
    const { scrollRef } = useAutoScroll<HTMLDivElement>([logs], { offset: 20 });

    const addLog = useCallback((type: Log["type"], message: string, module: string = "SYS") => {
        setLogs((prev) => [
            ...prev.slice(-30), // Keep only last 30 logs for performance
            {
                id: Math.random().toString(36).substring(7),
                type,
                message,
                timestamp: new Date().toLocaleTimeString(),
                module,
            },
        ]);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const ambientMessages = [
                { msg: "Analyzing context vector...", mod: "AI" },
                { msg: "Memory heap optimized", mod: "MEM" },
                { msg: "Encrypting output stream", mod: "SEC" },
                { msg: "Ping: 14ms", mod: "NET" },
            ];

            if (Math.random() > 0.5) {
                const randomLog = ambientMessages[Math.floor(Math.random() * ambientMessages.length)];
                addLog("info", randomLog.msg, randomLog.mod);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [addLog]);

    return (
        <HoloCard className="h-full flex flex-col font-mono text-[10px] sm:text-xs">
            {/* Header */}
            <div className="h-8 border-b border-cyan-500/20 flex items-center justify-between px-3 bg-cyan-950/10 backdrop-blur-md">
                <div className="flex items-center gap-2 text-cyan-400">
                    <Terminal size={12} />
                </div>
                <div className="flex gap-3">
                    <Cpu size={12} className="text-cyan-600 animate-pulse" />
                    <Wifi size={12} className="text-cyan-600" />
                    <Shield size={12} className="text-cyan-600" />
                </div>
            </div>

            {/* Terminal Output */}
            <div
                ref={scrollRef}
                data-lenis-prevent="true"
                className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-none font-mono"
            >
                <AnimatePresence initial={false}>
                    {logs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex gap-2 text-cyan-100/80 hover:bg-cyan-500/5 px-1 rounded transition-colors"
                        >
                            <span className="text-cyan-700 w-14 shrink-0 opacity-50">{log.timestamp.split(' ')[0]}</span>
                            <span className={cn(
                                "w-12 shrink-0 font-bold",
                                log.type === 'info' && "text-cyan-500",
                                log.type === 'success' && "text-green-500",
                                log.type === 'error' && "text-red-500",
                            )}>
                                [{log.module}]
                            </span>
                            <span className="truncate">{log.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer Status Line */}
            <div className="px-3 py-1 border-t border-cyan-500/20 bg-black/20 text-cyan-600 flex justify-between uppercase tracking-widest text-[9px]">
                <span>RAM: 42%</span>
                <span>CPU: 12%</span>
                <span>UPTIME: 03:14:15</span>
            </div>
        </HoloCard>
    );
}
