import { motion } from 'framer-motion';
import Link from 'next/link';
import { Circle, Square, Triangle } from 'lucide-react';
import Glass from '@/components/ui/Glass';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-14 sm:pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-10 left-4 sm:top-20 sm:left-20 text-pink-500 opacity-20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Circle className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32" size={120} strokeWidth={2} />
        </motion.div>
        
        <motion.div
          className="absolute top-20 right-8 sm:top-40 sm:right-32 text-red-500 opacity-20"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Triangle className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24" size={100} strokeWidth={2} />
        </motion.div>
        
        <motion.div
          className="absolute bottom-16 left-1/4 sm:bottom-32 text-pink-500 opacity-20"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Square className="w-12 h-12 sm:w-18 sm:h-18 md:w-24 md:h-24" size={90} strokeWidth={2} />
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-4 sm:bottom-20 sm:right-20 text-red-500 opacity-20"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Circle className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20" size={80} strokeWidth={2} />
        </motion.div>
        {/* Removed previous central combined shapes; radar SVG will be used instead */}

        {/* Side cluster shapes (left/right) */}
        <motion.div
          className="absolute left-2 sm:left-6 top-1/3 pointer-events-none hidden sm:block"
          animate={{ x: [0, -18, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ opacity: 0.12 }}
        >
          <Triangle className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 text-pink-500" size={120} strokeWidth={1} />
        </motion.div>

        <motion.div
          className="absolute right-2 sm:right-8 bottom-1/3 pointer-events-none hidden sm:block"
          animate={{ x: [0, 18, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ opacity: 0.12 }}
        >
          <Square className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 text-red-500" size={140} strokeWidth={1} />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 z-10 text-center relative">
        {/* Centered radar behind the title (scaled, subtle) */}
        <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10">
          <svg className="w-[320px] h-[320px] sm:w-[520px] sm:h-[520px] md:w-[720px] md:h-[720px] lg:w-[820px] lg:h-[820px]" viewBox="0 0 820 820" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="rgHero" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#ff7ab6" stopOpacity="0.16" />
                <stop offset="60%" stopColor="#ff4b6e" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="410" cy="410" r="200" fill="url(#rgHero)" />

            {[220, 320, 420].map((r, idx) => (
              <circle
                key={r}
                cx="410"
                cy="410"
                r={r}
                stroke="#ff5a95"
                strokeOpacity={idx === 0 ? 0.16 : 0.10}
                strokeWidth={idx === 0 ? 2 : 1}
              />
            ))}

            <g transform="translate(410,410)">
              <motion.g
                animate={{ rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360] }}
                transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
              >
                <line x1="-410" y1="0" x2="-140" y2="0" stroke="#ff6d9f" strokeOpacity="0.05" strokeWidth="2" />
                <line x1="140" y1="0" x2="410" y2="0" stroke="#ff6d9f" strokeOpacity="0.05" strokeWidth="2" />
                <line x1="0" y1="-410" x2="0" y2="-140" stroke="#ff6d9f" strokeOpacity="0.05" strokeWidth="2" />
                <line x1="0" y1="140" x2="0" y2="410" stroke="#ff6d9f" strokeOpacity="0.05" strokeWidth="2" />
              </motion.g>
            </g>

            {/* orbiting dots */}
            <g transform="translate(410,410)">
              {[
                { r: 220, count: 6, color: '#6ee7ff' },
                { r: 320, count: 5, color: '#7dd3fc' },
                { r: 420, count: 4, color: '#f472b6' }
              ].map(({ r, count, color }, ringIdx) => (
                <motion.g
                  key={ringIdx}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 14 + ringIdx * 4, repeat: Infinity, ease: 'linear' }}
                >
                  {Array.from({ length: count }).map((_, i) => {
                    const angle = (i / count) * Math.PI * 2;
                    const x = Math.round(Math.cos(angle) * r);
                    const y = Math.round(Math.sin(angle) * r);
                    return (
                      <motion.circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={6}
                        fill={color}
                        style={{ filter: 'blur(2px)' }}
                        animate={{ opacity: [0.06, 0.9, 0.06], scale: [0.9, 1.15, 0.9] }}
                        transition={{ duration: 2 + (i % 3) * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                      />
                    );
                  })}
                </motion.g>
              ))}
            </g>
          </svg>
        </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
          <motion.div
            className="inline-block mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(236, 72, 153, 0.5)",
                "0 0 40px rgba(239, 68, 68, 0.8)",
                "0 0 20px rgba(236, 72, 153, 0.5)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-red-500 to-pink-500">
              SquidAI
            </h1>
          </motion.div>
        </motion.div>

        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Your next-generation AI assistant powered by advanced neural networks. 
          <span className="text-pink-500"> Chat. Create. Conquer.</span>
        </motion.p>

        <motion.div
          className="flex gap-3 sm:gap-4 justify-center flex-wrap px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/chat"
              className="px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base bg-linear-to-r from-pink-500 to-red-500 rounded-lg text-white relative overflow-hidden group touch-manipulation min-h-11 inline-block"
              aria-label="Start chatting with SquidAI"
            >
              <span className="relative z-10">Start Chatting</span>
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-red-500 to-pink-500 opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>

          {/* Removed "View Features" per user request */}
        </motion.div>

        {/* Floating Stats */}
        <motion.div
          className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto px-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { label: 'Enterprise Integrations', value: '50+' },
            { label: 'Multi-Language Support', value: '25+' },
            { label: 'Response Time', value: '<10s' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-lg p-4 sm:p-6"
              whileHover={{ scale: 1.03 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.08 }}
            >
              <Glass className="p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl md:text-4xl text-pink-500 mb-2 font-semibold">{stat.value}</div>
                <div className="text-sm sm:text-base text-gray-400">{stat.label}</div>
              </Glass>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

