import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CapabilityCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
    index: number;
}

export function CapabilityCard({ icon: Icon, title, description, index }: CapabilityCardProps) {
    const [dataPoints, setDataPoints] = useState<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints((prev) => {
                const newPoints = [...prev, Math.random() * 100];
                return newPoints.slice(-20);
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="relative group"
        >
            <div
                className="relative p-6 rounded-lg border border-cyan-500/30 bg-black/40 backdrop-blur-xl overflow-hidden"
                style={{
                    boxShadow: '0 0 20px rgba(6, 182, 212, 0.1), inset 0 0 20px rgba(6, 182, 212, 0.05)',
                }}
            >
                {/* Hover glow effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                        boxShadow: 'inset 0 0 40px rgba(6, 182, 212, 0.2)',
                    }}
                />

                {/* Animated border on hover */}
                <motion.div
                    className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
                    animate={{
                        background: [
                            'linear-gradient(0deg, rgba(6, 182, 212, 0.3) 0%, transparent 50%, transparent 100%)',
                            'linear-gradient(180deg, rgba(6, 182, 212, 0.3) 0%, transparent 50%, transparent 100%)',
                        ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Mini data visualization */}
                <div className="absolute top-4 right-4 flex gap-0.5 h-8 items-end opacity-30">
                    {dataPoints.slice(-10).map((point, i) => (
                        <motion.div
                            key={i}
                            className="w-1 bg-cyan-400 rounded-t"
                            style={{ height: `${point * 0.3}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${point * 0.3}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <motion.div
                        className="w-12 h-12 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                        <Icon className="w-6 h-6 text-cyan-400" />
                    </motion.div>

                    {/* Changed font-['Rajdhani'] to font-rajdhani via CSS variable */}
                    <h3 className="text-xl font-bold text-white mb-2 font-rajdhani">{title}</h3>
                    <p className="text-cyan-100/60 text-sm">{description}</p>

                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mt-4">
                        <motion.div
                            className="w-2 h-2 rounded-full bg-green-400"
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{ boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}
                        />
                        <span className="text-xs text-green-400 font-mono">OPERATIONAL</span>
                    </div>
                </div>

                {/* Scan line effect */}
                <motion.div
                    className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{
                        y: [0, 200],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </div>
        </motion.div>
    );
}
