import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TerminalTextProps {
    lines: string[];
    delay?: number;
}

export function TerminalText({ lines, delay = 0 }: TerminalTextProps) {
    const [displayedLines, setDisplayedLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [currentCharIndex, setCurrentCharIndex] = useState(0);

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            if (currentLineIndex < lines.length) {
                const line = lines[currentLineIndex];

                if (currentCharIndex < line.length) {
                    const charTimeout = setTimeout(() => {
                        setCurrentText((prev) => prev + line[currentCharIndex]);
                        setCurrentCharIndex((prev) => prev + 1);
                    }, 30 + Math.random() * 30);

                    return () => clearTimeout(charTimeout);
                } else {
                    const lineTimeout = setTimeout(() => {
                        setDisplayedLines((prev) => [...prev, currentText]);
                        setCurrentText('');
                        setCurrentCharIndex(0);
                        setCurrentLineIndex((prev) => prev + 1);
                    }, 300);

                    return () => clearTimeout(lineTimeout);
                }
            }
        }, delay);

        return () => clearTimeout(startTimeout);
    }, [currentLineIndex, currentCharIndex, lines, delay, currentText]);

    return (
        <div className="font-mono text-sm space-y-1">
            {displayedLines.map((line, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400"
                >
                    <span className="text-green-500/60">&gt; </span>
                    {line}
                </motion.div>
            ))}
            {currentText && (
                <div className="text-green-400">
                    <span className="text-green-500/60">&gt; </span>
                    {currentText}
                    <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="inline-block w-2 h-4 bg-green-400 ml-1"
                    />
                </div>
            )}
        </div>
    );
}
