import { motion } from 'framer-motion';
import Link from 'next/link';
import { Brain, Zap, Shield, MessageSquare, Languages, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Advanced Reasoning',
    description: 'Powered by cutting-edge LLM technology for intelligent, context-aware conversations.',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: Zap,
    title: 'Instant Responses',
    description: 'Get lightning-fast answers with sub-second response times for seamless interaction.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: MessageSquare,
    title: 'Natural Conversations',
    description: 'Engage in human-like dialogue that understands context and nuance perfectly.',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: Languages,
    title: 'Multi-Language',
    description: 'Communicate in 100+ languages with native-level fluency and accuracy.',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Sparkles,
    title: 'Creative Generation',
    description: 'Generate code, content, images, and solutions with creative AI capabilities.',
    color: 'from-pink-500 to-red-500'
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your conversations are encrypted and protected with enterprise-grade security.',
    color: 'from-red-500 to-pink-500'
  }
];

export function Features() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-black via-red-950/10 to-black">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-3 sm:mb-4">
            POWERFUL FEATURES
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
            Everything you need in an AI assistant
          </p>
          <Link href="/chat">
            <motion.span
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg text-white font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageSquare size={20} />
              Start chatting
            </motion.span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="relative group"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative bg-gradient-to-br from-black to-red-950/20 border border-pink-500/30 rounded-xl p-4 sm:p-6 md:p-8 h-full overflow-hidden group-hover:border-pink-500 transition-colors">
                  {/* Animated background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-red-500/5 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div
                      className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 sm:mb-6`}
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(236, 72, 153, 0.3)',
                          '0 0 40px rgba(239, 68, 68, 0.5)',
                          '0 0 20px rgba(236, 72, 153, 0.3)'
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Icon size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
                    </motion.div>

                    <h3 className="text-lg sm:text-xl md:text-2xl text-white mb-2 sm:mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400">
                      {feature.description}
                    </p>
                  </div>

                  {/* Corner decoration */}
                  <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-t-2 border-r-2 border-pink-500/20 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-b-2 border-l-2 border-red-500/20 rounded-bl-xl" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

