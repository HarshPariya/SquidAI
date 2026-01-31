import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Play, Pause, RotateCcw, MessageSquare } from 'lucide-react';

export function AIShowcase() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Background glow - responsive, animation only */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[min(600px,90vw)] h-[min(600px,90vw)] bg-pink-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-4">
            CONVERSATION PREVIEW
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl">
            Experience intelligent AI-powered conversations
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Main showcase - animation only */}
          <motion.div
            className="relative bg-gradient-to-br from-black to-red-950/20 border-2 border-pink-500/50 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-12"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Neural network visualization - responsive height and coordinates */}
            <div className="relative min-h-[280px] sm:min-h-[320px] md:h-[400px] flex items-center justify-center aspect-square max-h-[400px] md:max-h-none md:aspect-auto">
              {/* Center node */}
              <motion.div
                className="absolute w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center z-20"
                animate={{
                  boxShadow: isPlaying ? [
                    '0 0 30px rgba(236, 72, 153, 0.6)',
                    '0 0 60px rgba(239, 68, 68, 0.8)',
                    '0 0 30px rgba(236, 72, 153, 0.6)'
                  ] : '0 0 30px rgba(236, 72, 153, 0.4)'
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-white text-lg sm:text-xl md:text-2xl">AI</span>
              </motion.div>

              {/* Orbiting nodes - radius scales with container via CSS var or relative units */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                const angle = (index * 45 * Math.PI) / 180;
                const radius = 150;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                  <motion.div
                    key={index}
                    className="absolute w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500/50 to-red-500/50 rounded-full border-2 border-pink-500"
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                    animate={isPlaying ? {
                      x: [0, x, 0],
                      y: [0, y, 0],
                      scale: [0.8, 1, 0.8],
                      opacity: [0.5, 1, 0.5]
                    } : {}}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                );
              })}

              {/* Connecting lines - SVG scales with container */}
              <svg className="absolute inset-0 w-full h-full min-w-[280px] min-h-[280px]" style={{ opacity: 0.3 }} viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                  const angle = (index * 45 * Math.PI) / 180;
                  const radius = 150;
                  const x = Math.cos(angle) * radius + 200;
                  const y = Math.sin(angle) * radius + 200;

                  return (
                    <motion.line
                      key={index}
                      x1="200"
                      y1="200"
                      x2={x}
                      y2={y}
                      stroke="url(#gradient-aishowcase)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={isPlaying ? { pathLength: [0, 1, 0] } : { pathLength: 0 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}
                <defs>
                  <linearGradient id="gradient-aishowcase" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Data flow indicators - animation only */}
              {isPlaying && (
                <>
                  {[0, 1, 2, 3].map((index) => (
                    <motion.div
                      key={`flow-${index}`}
                      className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-pink-500 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        x: [0, Math.cos((index * 90 * Math.PI) / 180) * 150],
                        y: [0, Math.sin((index * 90 * Math.PI) / 180) * 150],
                        opacity: [1, 0],
                        scale: [1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </>
              )}
            </div>

            {/* Controls - responsive, wrap on small screens */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <motion.button
                className="px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-white flex items-center gap-2 text-sm sm:text-base"
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? (
                  <>
                    <Pause size={18} className="shrink-0 sm:w-5 sm:h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={18} className="shrink-0 sm:w-5 sm:h-5" />
                    Play
                  </>
                )}
              </motion.button>

              <motion.button
                className="px-4 py-2.5 sm:px-6 sm:py-3 border-2 border-pink-500 rounded-lg text-pink-500 hover:bg-pink-500 hover:text-black transition-colors flex items-center gap-2 text-sm sm:text-base"
                onClick={() => {
                  setIsPlaying(false);
                  setTimeout(() => setIsPlaying(true), 100);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw size={18} className="shrink-0 sm:w-5 sm:h-5" />
                Reset
              </motion.button>

              <Link href="/chat">
                <motion.span
                  className="inline-flex px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-white items-center gap-2 cursor-pointer text-sm sm:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare size={18} className="shrink-0 sm:w-5 sm:h-5" />
                  Start chatting
                </motion.span>
              </Link>
            </div>

            {/* Stats - responsive grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12">
              {[
                { label: 'Response Time', value: '10s' },
                { label: 'Accuracy', value: '99.2%' },
                { label: 'Languages', value: '100+' },
                { label: 'Context', value: '128K' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-3 sm:p-4 bg-black/50 rounded-lg border border-pink-500/20"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-xl sm:text-2xl text-pink-500 mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional info cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <motion.div
              className="bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/30 rounded-xl p-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl text-pink-500 mb-3">Context-Aware AI</h3>
              <p className="text-gray-400">
                SquidAI remembers your conversation history and maintains context across multiple messages for coherent interactions.
              </p>
            </motion.div>

            <motion.div
              className="bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 rounded-xl p-6"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl text-red-500 mb-3">Multi-Modal Intelligence</h3>
              <p className="text-gray-400">
                Process text, analyze images, generate code, and create content - all in one powerful AI assistant.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
