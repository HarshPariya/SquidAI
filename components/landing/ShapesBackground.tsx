"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Circle, Triangle, Square } from 'lucide-react';

export default function ShapesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      {/* Left / Right soft edge gradients using SquidAI pink */}
      <div
        className="absolute left-0 top-0 h-full w-1/3 min-w-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, rgba(244,114,182,0.20) 0%, rgba(244,63,94,0.06) 45%, transparent 100%)',
          filter: 'blur(60px)'
        }}
      />

      <div
        className="absolute right-0 top-0 h-full w-1/3 min-w-0 pointer-events-none"
        style={{
          background: 'linear-gradient(270deg, rgba(244,114,182,0.18) 0%, rgba(244,63,94,0.04) 45%, transparent 100%)',
          filter: 'blur(60px)'
        }}
      />
      {/* Large faint rotating ring / glow at top center - responsive */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 w-[min(520px,90vw)] h-[min(520px,90vw)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08, rotate: [0, 360, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        style={{ filter: 'blur(18px)' }}
      >
        <Circle className="w-full h-full text-pink-700" strokeWidth={2} />
      </motion.div>

      {/* Soft radial blob behind center-left - responsive */}
      <motion.div
        className="absolute left-1/3 top-20 sm:top-28 rounded-full w-[min(420px,80vw)] h-[min(420px,80vw)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06, scale: [1, 1.06, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(circle at 30% 30%, rgba(236,72,153,0.16), rgba(239,68,68,0.03))', filter: 'blur(28px)' }}
      />

      {/* Large triangle lower-left - responsive */}
      <motion.div
        className="absolute left-4 sm:left-8 bottom-20 sm:bottom-28 w-12 h-12 sm:w-14 sm:h-14 md:w-[220px] md:h-[220px] [&>svg]:w-full [&>svg]:h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06, rotate: [-6, 6, -6] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{ filter: 'blur(2px)' }}
      >
        <Triangle size={220} strokeWidth={2} className="text-pink-600" />
      </motion.div>

      {/* Medium square right - responsive */}
      <motion.div
        className="absolute right-4 sm:right-6 top-1/3 w-10 h-10 sm:w-12 sm:h-12 md:w-[200px] md:h-[200px] [&>svg]:w-full [&>svg]:h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.06, rotate: [0, 12, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Square size={200} strokeWidth={2} className="text-pink-600" />
      </motion.div>

      {/* Center radar-like SVG: concentric rings + orbiting dots - responsive */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(680px,95vw)] h-[min(680px,95vw)] max-w-full max-h-full">
        <svg className="w-full h-full" viewBox="0 0 680 680" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="rg" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#ff7ab6" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#ff4b6e" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* subtle center glow */}
          <circle cx="340" cy="340" r="120" fill="url(#rg)" />

          {/* concentric rings */}
          {[160, 220, 300, 360].map((r, idx) => (
            <circle
              key={r}
              cx="340"
              cy="340"
              r={r}
              stroke="#ff5a95"
              strokeOpacity={idx === 0 ? 0.25 : 0.12}
              strokeWidth={idx === 0 ? 2 : 1}
            />
          ))}

          {/* rotating crosshair lines */}
          <g transform="translate(340,340)">
            <motion.g
              animate={{ rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360] }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
            >
              <line x1="-340" y1="0" x2="-80" y2="0" stroke="#ff6d9f" strokeOpacity="0.06" strokeWidth="2" />
              <line x1="80" y1="0" x2="340" y2="0" stroke="#ff6d9f" strokeOpacity="0.06" strokeWidth="2" />
              <line x1="0" y1="-340" x2="0" y2="-80" stroke="#ff6d9f" strokeOpacity="0.06" strokeWidth="2" />
              <line x1="0" y1="80" x2="0" y2="340" stroke="#ff6d9f" strokeOpacity="0.06" strokeWidth="2" />
            </motion.g>
          </g>

          {/* orbiting dots at different radii and speeds */}
          {[
            { r: 160, count: 6, color: '#6ee7ff', dur: 9 },
            { r: 220, count: 5, color: '#7dd3fc', dur: 13 },
            { r: 300, count: 4, color: '#f472b6', dur: 18 }
          ].map(({ r, count, color, dur }, ringIdx) => (
            <g key={ringIdx} transform="translate(340,340)">
              <motion.g
                animate={{ rotate: [0, 360] }}
                transition={{ duration: dur, repeat: Infinity, ease: 'linear' }}
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
                      transition={{ duration: 2 + (i % 3) * 0.6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  );
                })}
              </motion.g>
            </g>
          ))}
        </svg>
      </div>

      {/* Decorative shapes left/right - responsive sizes */}
      <div className="absolute left-2 sm:left-4 top-6 flex flex-col gap-4 sm:gap-10 pointer-events-none">
        {[56, 48, 64, 42, 52].map((size, i) => (
          <motion.div
            key={`left-${i}`}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 [&>svg]:w-full [&>svg]:h-full"
            animate={{ y: [0, i % 2 === 0 ? 8 : -8, 0], rotate: i % 3 === 0 ? [0, 6, 0] : [0, 0] }}
            transition={{ duration: 6 + (i * 0.6), repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity: 0.12 }}
          >
            {i % 3 === 0 ? (
              <Triangle size={size} strokeWidth={3} className="text-pink-700/80" />
            ) : i % 3 === 1 ? (
              <Square size={size} strokeWidth={3} className="text-pink-700/65" />
            ) : (
              <Circle size={size} strokeWidth={3} className="text-pink-700/70" />
            )}
          </motion.div>
        ))}
      </div>

      <div className="absolute right-2 sm:right-4 top-6 flex flex-col gap-4 sm:gap-10 pointer-events-none">
        {[50, 60, 44, 56, 40].map((size, i) => (
          <motion.div
            key={`right-${i}`}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 [&>svg]:w-full [&>svg]:h-full"
            animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0], rotate: i % 2 === 0 ? [-6, 6, -6] : [0, 0] }}
            transition={{ duration: 5.5 + (i * 0.7), repeat: Infinity, ease: 'easeInOut' }}
            style={{ opacity: 0.11 }}
          >
            {i % 3 === 0 ? (
              <Square size={size} strokeWidth={3} className="text-pink-600/70" />
            ) : i % 3 === 1 ? (
              <Circle size={size} strokeWidth={3} className="text-pink-600/60" />
            ) : (
              <Triangle size={size} strokeWidth={3} className="text-pink-600/65" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
