import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface DataStreamProps {
    index: number;
}

export function DataStream({ index }: DataStreamProps) {
    const streamData = useMemo(() => {
        const rand = (offset: number) => {
            const x = Math.sin(index * 97 + offset) * 10000;
            return x - Math.floor(x);
        };

        const characters = '01';
        const streamLength = 10 + rand(1) * 10;
        const content = Array.from({ length: Math.floor(streamLength) }, (_, i) =>
            characters[Math.floor(rand(10 + i) * characters.length)]
        ).join('');

        return {
            streamContent: content,
            left: `${(10 + (index * 15) % 90).toFixed(4)}%`,
            duration: Number((3 + rand(2) * 4).toFixed(4)),
            delay: Number((rand(3) * 2).toFixed(4))
        };
    }, [index]);

    if (!streamData) return null;

    return (
        <motion.div
            className="fixed top-0 font-mono text-xs text-cyan-400/20 whitespace-nowrap pointer-events-none"
            style={{ left: streamData.left }}
            initial={{ y: -100, opacity: 0 }}
            animate={{
                y: ['0vh', '110vh'],
                opacity: [0, 0.6, 0],
            }}
            transition={{
                duration: streamData.duration,
                repeat: Infinity,
                delay: streamData.delay,
                ease: 'linear',
            }}
        >
            {streamData.streamContent.split('').map((char, i) => (
                <div key={i}>{char}</div>
            ))}
        </motion.div>
    );
}
