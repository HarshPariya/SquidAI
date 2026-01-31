import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { FloatingNode } from './floating-node';

export function NeuralCore() {
    const particles = useMemo(
        () => {
            const rand = (offset: number) => {
                const x = Math.sin(42 + offset) * 10000;
                return x - Math.floor(x);
            };

            return Array.from({ length: 30 }, (_, i) => ({
                id: i,
                angle: Number((rand(i + 1) * 360).toFixed(4)),
                distance: Number((150 + rand(i + 101) * 100).toFixed(4)),
                speed: Number((0.5 + rand(i + 201) * 1).toFixed(4)),
            }));
        },
        []
    );

    return (
        <div className="relative w-[500px] h-[500px] flex items-center justify-center">
            {/* Floating Blockchain Nodes */}
            {Array.from({ length: 8 }).map((_, i) => (
                <FloatingNode key={i} index={i} totalNodes={8} distance={280} />
            ))}

            {/* Outer Blockchain Ring */}
            <motion.div
                className="absolute w-[450px] h-[450px] rounded-full border-2 border-green-400/30"
                style={{
                    boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), inset 0 0 20px rgba(34, 197, 94, 0.1)',
                }}
                animate={{
                    rotate: 360,
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {/* Blockchain Nodes */}
                {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <motion.div
                        key={angle}
                        className="absolute w-3 h-3 rounded-full bg-green-400"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-225px)`,
                            boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)',
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                        }}
                    />
                ))}
            </motion.div>

            {/* Middle Ring */}
            <motion.div
                className="absolute w-[350px] h-[350px] rounded-full border-2 border-cyan-400/40"
                style={{
                    boxShadow: '0 0 30px rgba(34, 211, 238, 0.4), inset 0 0 30px rgba(34, 211, 238, 0.2)',
                }}
                animate={{
                    rotate: -360,
                }}
                transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {/* Connection Lines */}
                {[0, 90, 180, 270].map((angle) => (
                    <div
                        key={angle}
                        className="absolute w-0.5 h-[175px] bg-gradient-to-b from-cyan-400/60 to-transparent"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
                        }}
                    />
                ))}
            </motion.div>

            {/* Inner Ring */}
            <motion.div
                className="absolute w-[250px] h-[250px] rounded-full border border-cyan-500/50"
                style={{
                    boxShadow: '0 0 40px rgba(6, 182, 212, 0.5), inset 0 0 40px rgba(6, 182, 212, 0.3)',
                }}
                animate={{
                    rotate: 360,
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                    },
                    scale: {
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    },
                }}
            />

            {/* Core Pulse */}
            <motion.div
                className="absolute w-[150px] h-[150px] rounded-full bg-gradient-radial from-cyan-500/40 via-cyan-600/20 to-transparent"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.6, 0.9, 0.6],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Central Core */}
            <motion.div
                className="absolute w-[100px] h-[100px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-600"
                style={{
                    boxShadow: '0 0 60px rgba(6, 182, 212, 0.8), 0 0 100px rgba(6, 182, 212, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.3)',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {/* Core inner glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
            </motion.div>

            {/* Energy Particles */}
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-1 h-1 rounded-full bg-cyan-400"
                    style={{
                        top: '50%',
                        left: '50%',
                        boxShadow: '0 0 4px rgba(34, 211, 238, 0.8)',
                    }}
                    animate={{
                        x: [
                            0,
                            Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
                            Math.cos((particle.angle * Math.PI) / 180) * particle.distance * 1.5,
                        ],
                        y: [
                            0,
                            Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
                            Math.sin((particle.angle * Math.PI) / 180) * particle.distance * 1.5,
                        ],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3 / particle.speed,
                        repeat: Infinity,
                        ease: 'easeOut',
                    }}
                />
            ))}

            {/* Connecting Lines to Nodes */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.div
                    key={`line-${angle}`}
                    className="absolute w-[1px] h-[200px] bg-gradient-to-b from-cyan-400/0 via-cyan-400/30 to-cyan-400/0"
                    style={{
                        top: '50%',
                        left: '50%',
                        transformOrigin: 'top center',
                        transform: `translate(-50%, 0) rotate(${angle}deg)`,
                    }}
                    animate={{
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    );
}
