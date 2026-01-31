
"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
    return (
        <div className="fixed inset-0 z-[-1] bg-black overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"
            />

            {/* Radial Gradient Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.5, 0.3]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-900/20 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-900/20 rounded-full blur-[120px]"
            />

            {/* Floating Particles (Simulated via CSS) */}
            <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at center, white 1px, transparent 1px)`,
                    backgroundSize: '24px 24px'
                }}
            />
        </div>
    );
}
