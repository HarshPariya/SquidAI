
"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface HoloCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onDragEnter" | "onDragLeave" | "onDragOver" | "onDrop"> {
    children: React.ReactNode;
    active?: boolean;
}

export function HoloCard({ children, className, active, ...props }: HoloCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "relative rounded-xl border border-cyan-500/20 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300",
                "shadow-[0_0_15px_rgba(6,182,212,0.1)]",
                active && "border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.2)]",
                className
            )}
            {...props}
        >
            {/* Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline pointer-events-none" />

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-500 opacity-50" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan-500 opacity-50" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyan-500 opacity-50" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-500 opacity-50" />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
}
