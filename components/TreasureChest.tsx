'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { sounds } from '@/lib/audio';

interface TreasureChestProps {
  onClose: () => void;
}

type ChestState = 'idle' | 'hover' | 'opening' | 'revealing' | 'opened';

function ChestParticles() {
  const [particles] = useState(() => {
    return Array.from({ length: 40 }).map((_, i) => {
      const angle = (i / 40) * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: ['#FFD700', '#FF69B4', '#9370DB', '#00CED1'][i % 4],
      };
    });
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 1.5, delay: i * 0.02 }}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
          style={{
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  );
}

export default function TreasureChest({ onClose }: TreasureChestProps) {
  const [state, setState] = useState<ChestState>('idle');

  const handleChestClick = () => {
    if (state !== 'idle' && state !== 'hover') return;
    
    setState('opening');
    sounds.chestOpen();

    // Phase 1-3: Opening animation (2.5s total)
    setTimeout(() => {
      setState('revealing');
      sounds.celebration();
    }, 2500);

    // Phase 4: Close after reward shown
    setTimeout(() => {
      setState('opened');
      onClose();
    }, 5500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="relative flex flex-col items-center">
        {/* Click to Open CTA */}
        <AnimatePresence>
          {state === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute -top-16 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl font-black text-yellow-300 drop-shadow-lg"
              >
                CLICK TO OPEN
              </motion.div>
              <div className="text-sm text-white/60 mt-1">Tap the chest!</div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Treasure Chest SVG - 50% scale (192px width) */}
        <motion.div
          className="relative cursor-pointer"
          onHoverStart={() => state === 'idle' && setState('hover')}
          onHoverEnd={() => state === 'hover' && setState('idle')}
          onClick={handleChestClick}
          animate={
            state === 'idle'
              ? { y: [0, -8, 0], scale: 1 }
              : state === 'hover'
              ? { y: -12, scale: 1.05 }
              : state === 'opening'
              ? {
                  scale: [1, 1.1, 1.05, 1.1, 1],
                  rotate: [0, -3, 3, -3, 0],
                }
              : { scale: 1 }
          }
          transition={
            state === 'idle'
              ? { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              : state === 'opening'
              ? { duration: 2.5 }
              : { duration: 0.3 }
          }
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={
              state === 'hover'
                ? { opacity: 0.6, scale: 1.3 }
                : state === 'opening'
                ? { opacity: [0.3, 0.8, 1], scale: [1.2, 1.5, 1.8] }
                : state === 'revealing'
                ? { opacity: 1, scale: 2 }
                : { opacity: 0.3, scale: 1.2 }
            }
            style={{
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.6), transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Chest SVG */}
          <svg
            width="192"
            height="160"
            viewBox="0 0 192 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10"
          >
            {/* Chest Body - Wooden texture */}
            <rect x="20" y="60" width="152" height="90" rx="8" fill="#8B4513" />
            <rect x="24" y="64" width="144" height="82" rx="6" fill="#A0522D" />
            
            {/* Wood grain effect */}
            <path d="M30 70 L30 140" stroke="#654321" strokeWidth="2" opacity="0.3" />
            <path d="M50 70 L50 140" stroke="#654321" strokeWidth="2" opacity="0.3" />
            <path d="M70 70 L70 140" stroke="#654321" strokeWidth="2" opacity="0.3" />
            <path d="M90 70 L90 140" stroke="#654321" strokeWidth="2" opacity="0.3" />
            <path d="M110 70 L110 140" stroke="#654321" strokeWidth="2" opacity="0.3" />
            <path d="M130 70 L130 140" stroke="#654321" strokeWidth="2" opacity="0.3" />
            <path d="M150 70 L150 140" stroke="#654321" strokeWidth="2" opacity="0.3" />
            <path d="M162 70 L162 140" stroke="#654321" strokeWidth="2" opacity="0.3" />

            {/* Metal bands */}
            <rect x="20" y="70" width="152" height="6" fill="#4A4A4A" />
            <rect x="20" y="70" width="152" height="3" fill="#6B6B6B" />
            <rect x="20" y="110" width="152" height="6" fill="#4A4A4A" />
            <rect x="20" y="110" width="152" height="3" fill="#6B6B6B" />
            <rect x="20" y="144" width="152" height="6" fill="#4A4A4A" />
            <rect x="20" y="144" width="152" height="3" fill="#6B6B6B" />

            {/* Corner metal details */}
            <circle cx="30" cy="73" r="4" fill="#4A4A4A" />
            <circle cx="162" cy="73" r="4" fill="#4A4A4A" />
            <circle cx="30" cy="113" r="4" fill="#4A4A4A" />
            <circle cx="162" cy="113" r="4" fill="#4A4A4A" />
            <circle cx="30" cy="147" r="4" fill="#4A4A4A" />
            <circle cx="162" cy="147" r="4" fill="#4A4A4A" />

            {/* Lock */}
            <motion.g
              animate={
                state === 'opening'
                  ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }
                  : state === 'revealing'
                  ? { y: 10, opacity: 0 }
                  : {}
              }
            >
              <circle cx="96" cy="120" r="12" fill="#DAA520" />
              <circle cx="96" cy="120" r="10" fill="#FFD700" />
              <rect x="94" y="120" width="4" height="16" fill="#DAA520" rx="2" />
            </motion.g>

            {/* Lid - Animated */}
            <motion.g
              animate={
                state === 'revealing' || state === 'opened'
                  ? { rotate: -70, y: -20, x: -40 }
                  : {}
              }
              style={{ originX: '20px', originY: '60px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Lid curved top */}
              <path
                d="M 20 60 Q 96 20, 172 60 L 172 75 L 20 75 Z"
                fill="#8B4513"
              />
              <path
                d="M 24 62 Q 96 26, 168 62 L 168 72 L 24 72 Z"
                fill="#A0522D"
              />

              {/* Lid metal band */}
              <ellipse cx="96" cy="60" rx="76" ry="8" fill="#4A4A4A" />
              <ellipse cx="96" cy="59" rx="76" ry="6" fill="#6B6B6B" />

              {/* Lid decorations */}
              <circle cx="60" cy="50" r="3" fill="#4A4A4A" />
              <circle cx="96" cy="40" r="3" fill="#4A4A4A" />
              <circle cx="132" cy="50" r="3" fill="#4A4A4A" />
            </motion.g>

            {/* Inner glow when opening */}
            <AnimatePresence>
              {(state === 'revealing' || state === 'opened') && (
                <motion.rect
                  x="30"
                  y="60"
                  width="132"
                  height="30"
                  fill="url(#innerGlow)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>

            {/* Gradient definitions */}
            <defs>
              <radialGradient id="innerGlow">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFA500" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Light burst when opening */}
        <AnimatePresence>
          {state === 'revealing' && (
            <>
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.8), transparent 60%)',
                }}
              />
              {/* Light rays */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 2, opacity: [0, 1, 0] }}
                  transition={{ duration: 1, delay: 0.2, repeat: 2 }}
                  className="absolute w-1 h-24 bg-gradient-to-t from-yellow-400 to-transparent origin-bottom"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 30}deg) translateX(-50%)`,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Reward reveal */}
        <AnimatePresence>
          {state === 'revealing' && (
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0 }}
              animate={{ y: -60, opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, type: 'spring', damping: 10 }}
              className="absolute top-0 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="text-7xl mb-2"
              >
                👏👏👏
              </motion.div>
              <div className="text-3xl font-black text-yellow-300 drop-shadow-lg whitespace-nowrap">
                BIGGER CLAPPING HAND!
              </div>
              <div className="text-base font-bold text-white/80 mt-2">
                Everyone clap louder! 🎉
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particles */}
        <AnimatePresence>
          {state === 'revealing' && <ChestParticles />}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
