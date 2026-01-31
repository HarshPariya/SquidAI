import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bot, User, MessageSquare } from 'lucide-react';

const messages = [
  {
    role: 'user',
    content: 'What can you help me with?',
    delay: 0
  },
  {
    role: 'assistant',
    content: 'I can assist with coding, creative writing, problem-solving, language translation, image analysis, and much more. How can I help you today?',
    delay: 0.5
  },
  {
    role: 'user',
    content: 'Write a Python function to calculate fibonacci numbers',
    delay: 1
  },
  {
    role: 'assistant',
    content: `def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n\n# Optimized with memoization\ndef fib_memo(n, memo={}):\n    if n in memo:\n        return memo[n]\n    if n <= 1:\n        return n\n    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)\n    return memo[n]`,
    delay: 1.5,
    isCode: true
  }
];

export function ChatDemo() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-3 sm:mb-4">
            SEE IT IN ACTION
          </h2>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl">
            Real conversations with SquidAI
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-black to-red-950/20 border-2 border-pink-500/50 rounded-2xl p-4 sm:p-6 md:p-8 glass"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Chat header */}
          <div className="flex items-center gap-2 sm:gap-3 pb-4 sm:pb-6 border-b border-pink-500/20 mb-4 sm:mb-6">
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(236, 72, 153, 0.5)',
                  '0 0 30px rgba(239, 68, 68, 0.7)',
                  '0 0 20px rgba(236, 72, 153, 0.5)'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Bot size={20} className="sm:w-6 sm:h-6 text-white" />
            </motion.div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base md:text-lg text-white truncate">SquidAI Assistant</h3>
              <p className="text-xs sm:text-sm text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="space-y-4 sm:space-y-6 max-h-[300px] sm:max-h-[400px] md:max-h-[500px] overflow-y-auto pr-2">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: message.delay }}
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-br from-gray-700 to-gray-800' 
                    : 'bg-gradient-to-br from-pink-500 to-red-500'
                }`}>
                  {message.role === 'user' ? (
                    <User size={16} className="sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Bot size={16} className="sm:w-5 sm:h-5 text-white" />
                  )}
                </div>

                <motion.div
                  className={`max-w-[75%] sm:max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                      : 'bg-gradient-to-br from-pink-500/10 to-red-500/10 border-pink-500/30'
                  } border rounded-2xl p-3 sm:p-4`}
                  whileHover={{ scale: 1.02 }}
                >
                  {message.isCode ? (
                    <pre className="text-xs sm:text-sm text-gray-300 overflow-x-auto">
                      <code>{message.content}</code>
                    </pre>
                  ) : (
                    <p className="text-xs sm:text-sm md:text-base text-gray-300">{message.content}</p>
                  )}
                </motion.div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center flex-shrink-0">
                <Bot size={20} className="text-white" />
              </div>
              <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/30 rounded-2xl p-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-pink-500 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Input area - CTA to live chat */}
          <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-pink-500/20">
            <Link href="/chat" className="block">
              <motion.div
                className="flex items-center justify-center gap-2 w-full py-3 sm:py-4 bg-gradient-to-r from-pink-500/20 to-red-500/20 border border-pink-500/50 rounded-lg text-pink-400 hover:text-pink-300 hover:border-pink-500 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageSquare size={18} className="sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base font-medium">Start chatting — try it live</span>
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

