import { motion } from 'framer-motion';

interface FloatingNodeProps {
    index: number;
    totalNodes: number;
    distance: number;
}

export function FloatingNode({ index, totalNodes, distance }: FloatingNodeProps) {
    const angle = (index / totalNodes) * 360;
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const y = Math.sin((angle * Math.PI) / 180) * distance;

    return (
        <motion.div
            className="absolute"
            style={{
                left: '50%',
                top: '50%',
            }}
            initial={{
                x: 0,
                y: 0,
                opacity: 0,
            }}
            animate={{
                x,
                y,
                opacity: 1,
            }}
            transition={{
                duration: 2,
                delay: index * 0.1,
                ease: 'easeOut',
            }}
        >
            <motion.div
                className="relative"
                animate={{
                    y: [0, -10, 0],
                }}
                transition={{
                    duration: 3 + index * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            >
                {/* Connection line back to center */}
                <svg
                    className="absolute"
                    style={{
                        left: '50%',
                        top: '50%',
                        width: distance,
                        height: distance,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none',
                    }}
                >
                    <motion.line
                        x1={distance / 2}
                        y1={distance / 2}
                        x2={distance / 2 - x}
                        y2={distance / 2 - y}
                        stroke="rgba(34, 211, 238, 0.2)"
                        strokeWidth="1"
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.1,
                        }}
                    />
                </svg>

                {/* Node */}
                <motion.div
                    className="w-3 h-3 rounded-full bg-cyan-400 relative"
                    style={{
                        boxShadow: '0 0 15px rgba(34, 211, 238, 0.8)',
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.15,
                    }}
                >
                    {/* Pulse ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-cyan-400"
                        animate={{
                            scale: [1, 2, 2],
                            opacity: [0.6, 0, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.15,
                        }}
                    />
                </motion.div>

                {/* Data packet */}
                <motion.div
                    className="absolute w-1 h-1 rounded-full bg-green-400"
                    style={{
                        left: '50%',
                        top: '50%',
                    }}
                    animate={{
                        x: [0, -x * 0.5],
                        y: [0, -y * 0.5],
                        opacity: [0, 1, 0],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.3 + 1,
                    }}
                />
            </motion.div>
        </motion.div>
    );
}
