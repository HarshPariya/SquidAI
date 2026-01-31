"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SquidAICoreProps {
    status: "idle" | "thinking" | "speaking" | "error";
    className?: string;
}

export function SquidAICore({ status, className }: SquidAICoreProps) {
    return (
        <div className={cn("relative flex items-center justify-center overflow-visible bg-transparent", className)}>
            {/* Animated Triangle Core */}
            <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                className="absolute"
                style={{ overflow: 'visible', background: 'transparent' }}
                preserveAspectRatio="xMidYMid meet"
                initial={false}
                animate={{ rotate: status === 'thinking' ? [0, 12, 0] : [0, 360] }}
                transition={{ duration: status === 'thinking' ? 6 : 14, repeat: Infinity, ease: 'linear' }}
            >
                <defs>
                    <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f472b6" />
                            <stop offset="100%" stopColor="#f43f5e" />
                        </linearGradient>
                    <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        {status === 'error' ? (
                            <>
                                <stop offset="0%" stopColor="#ff7a88" />
                                <stop offset="100%" stopColor="#ffb199" />
                            </>
                        ) : status === 'thinking' ? (
                            <>
                                <stop offset="0%" stopColor="#c084fc" />
                                <stop offset="100%" stopColor="#7c3aed" />
                            </>
                        ) : (
                            <>
                                <stop offset="0%" stopColor="#67e8f9" />
                                <stop offset="100%" stopColor="#06b6d4" />
                            </>
                        )}
                    </linearGradient>
                    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g filter="url(#softGlow)">
                    {/* single triangle core (big, animated, with halo) */}
                    <motion.polygon
                        points="50,8 92,80 8,80"
                        fill="url(#pinkGrad)"
                        initial={{ scale: 0.98, opacity: 0.95, rotate: -6 }}
                        animate={{
                            rotate: status === 'thinking' ? [ -6, 6, -6 ] : [ -6, 14, -6 ],
                            scale: status === 'speaking' ? [1, 1.06, 1] : [0.995, 1.01, 0.995],
                            opacity: [0.9, 1, 0.9]
                        }}
                        transition={{ duration: status === 'speaking' ? 0.6 : 6, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* subtle inner stroke for definition */}
                    <motion.polygon
                        points="50,14 86,76 14,76"
                        fill="none"
                        stroke="rgba(255,255,255,0.18)"
                        strokeWidth={1.2}
                        initial={{ opacity: 0.9 }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* glowing halo */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="44"
                        fill="none"
                        stroke="url(#triGrad)"
                        strokeOpacity={0.06}
                        strokeWidth={8}
                        initial={{ r: 42, opacity: 0.05 }}
                        animate={{ r: [42, 50, 42], opacity: [0.04, 0.14, 0.04] }}
                        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                </g>
            </motion.svg>

            {/* removed orbiting nodes for a cleaner, triangular mark */}

            {/* Label fallback (keeps original container semantics) */}
            <div className={cn(
                "absolute inset-0 flex items-center justify-center pointer-events-none",
            )} />
        </div>
    );
}
