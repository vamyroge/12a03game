'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface CelebrationModalProps {
  result: 'CLAPPING_HAND' | 'BIG_CHEST';
  onClose: () => void;
}

export default function CelebrationModal({ result, onClose }: CelebrationModalProps) {
  // Generate stable confetti
  const [confetti] = useState(() => {
    const colors = ['#FFD700', '#FF1493', '#00CED1', '#32CD32'];
    return Array.from({ length: 50 }).map(() => ({
      x: (Math.random() - 0.5) * 800,
      y: (Math.random() - 0.5) * 800,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * 4)],
      delay: Math.random() * 0.3,
    }));
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        onClick={onClose}
        className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold transition-all hover:scale-110 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        ×
      </motion.button>

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: 'spring', damping: 12 }}
        className="text-center relative"
      >
        {result === 'CLAPPING_HAND' ? (
          <>
            {/* Clapping Hand */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, -8, 8, -8, 0],
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              👏👏👏
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black text-yellow-300 drop-shadow-lg mb-3"
            >
              CLAPPING HAND!
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white/80"
            >
              Everyone clap! 🎉
            </motion.div>
          </>
        ) : (
          <>
            {/* Big Chest announcement */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🎁
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg mb-3"
            >
              BIG CHEST!
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-white/80"
            >
              Opening the treasure... ✨
            </motion.div>
          </>
        )}

        {/* Confetti burst */}
        <div className="absolute inset-0 pointer-events-none">
          {confetti.map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: item.x,
                y: item.y,
                opacity: 0,
                rotate: item.rotate,
                scale: 0,
              }}
              transition={{ duration: 2, delay: item.delay }}
              className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>

        {/* Light rays */}
        {result === 'BIG_CHEST' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 2, opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                className="absolute left-1/2 top-1/2 w-1 h-40 bg-gradient-to-t from-yellow-400 to-transparent origin-bottom"
                style={{
                  transform: `rotate(${i * 30}deg) translateX(-50%)`,
                }}
              />
            ))}
          </div>
        )}

        {/* Glow effect */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-3xl -z-10"
        />
      </motion.div>
    </motion.div>
  );
}
