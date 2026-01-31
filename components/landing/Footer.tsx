"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Circle, Square, Triangle, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer id="site-footer" className="relative py-8 sm:py-12 md:py-16 px-4 sm:px-6 border-t border-pink-500/20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Circle className="absolute top-4 left-4 sm:top-10 sm:left-10 text-pink-500 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" size={60} />
        <Triangle className="absolute top-4 right-8 sm:top-10 sm:right-20 text-red-500 w-6 h-6 sm:w-10 sm:h-10 md:w-12 md:h-12" size={50} />
        <Square className="absolute bottom-4 left-1/3 sm:bottom-10 text-pink-500 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" size={40} />

        {/* Additional footer accents */}
        <div className="absolute right-6 bottom-6 flex flex-col gap-6 items-end">
          <motion.div animate={{ rotate: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity }}>
            <Triangle size={42} strokeWidth={3} className="text-pink-700/60" />
          </motion.div>
          <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 5.5, repeat: Infinity }}>
            <Square size={48} strokeWidth={3} className="text-pink-700/55" />
          </motion.div>
        </div>

        <div className="absolute left-6 bottom-8 flex flex-col gap-6">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 6.2, repeat: Infinity }}>
            <Circle size={44} strokeWidth={3} className="text-pink-700/55" />
          </motion.div>
          <motion.div animate={{ rotate: [-6, 6, -6] }} transition={{ duration: 7, repeat: Infinity }}>
            <Square size={34} strokeWidth={3} className="text-pink-700/50" />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-10 md:mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <motion.h3
              className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 mb-3 sm:mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(236, 72, 153, 0.5)",
                  "0 0 30px rgba(239, 68, 68, 0.7)",
                  "0 0 20px rgba(236, 72, 153, 0.5)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              SquidAI
            </motion.h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 max-w-md">
              Your intelligent AI companion for conversations, creativity, and problem-solving.
              Experience the future of artificial intelligence today.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {[
                { icon: Github, href: "https://github.com/HarshPariya", label: "GitHub" },
                { icon: Twitter, href: "https://x.com/harshpariya_01", label: "X (Twitter)" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/harsh-pariya/", label: "LinkedIn" },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-pink-500/20 to-red-500/20 border border-pink-500/30 rounded-lg flex items-center justify-center text-pink-500 hover:border-pink-500 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={16} className="sm:w-5 sm:h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm sm:text-base mb-3 sm:mb-4">Product</h4>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { name: "Features", href: "/features" },
                { name: "Capabilities", href: "/capabilities" },
                { name: "API Access", href: "/api-access" },
              ].map((item) => (
                <li key={item.name}>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={item.href}
                      className="text-xs sm:text-sm text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm sm:text-base mb-3 sm:mb-4">Company</h4>
            <ul className="space-y-1 sm:space-y-2">
              {[
                { name: "About", href: "/about" },
                { name: "Blog", href: "/blog" },
                { name: "Careers", href: "/careers" },
                { name: "Support", href: "/support" },
              ].map((item) => (
                <li key={item.name}>
                  <motion.div whileHover={{ x: 5 }}>
                    <Link
                      href={item.href}
                      className="text-xs sm:text-sm text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Made by */}
        <div className="pt-6 sm:pt-8 border-t border-pink-500/20 mb-6 sm:mb-8">
          <p className="text-gray-300 text-sm sm:text-base font-medium mb-2">
            This is made by{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500 font-semibold">
              Harsh Pariya
            </span>
          </p>
          <p className="text-gray-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Developer who loves creating new things and turning imagination into reality. Currently building with the MERN stack, sharing tech insights on LinkedIn, and exploring React, Node.js, and modern web tools.· Reach out:{" "}
            <a
              href="mailto:harshpariya195@outlook.com"
              className="text-pink-500 hover:text-pink-400 transition-colors"
            > 
              harshpariya195@outlook.com
            </a>
            {" · "}
            <a
              href="https://github.com/HarshPariya"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 transition-colors"
            >
              GitHub
            </a>
            {" · "}
            <a
              href="https://www.linkedin.com/in/harsh-pariya/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 transition-colors"
            >
              LinkedIn
            </a>
            {" · "}
            <a
              href="https://x.com/harshpariya_01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 transition-colors"
            >
              X
            </a>
            {" · "}
            <a
              href="https://www.instagram.com/_harshpariya_01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-500 hover:text-pink-400 transition-colors"
            >
              Instagram
            </a>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t border-pink-500/20 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">© 2026 SquidAI. All rights reserved.</p>
          <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm justify-center sm:justify-end">
            {[{ name: "Privacy Policy", href: "/privacy-policy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Cookie Policy", href: "/cookie-policy" }].map((item) => (
              <motion.div key={item.name} whileHover={{ y: -2 }}>
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-pink-500 transition-colors"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
