'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CelebrationModalProps {
  result: 'CLAPPING_HAND' | 'BIG_CHEST';
  onClose: () => void;
}

export default function CelebrationModal({ result, onClose }: CelebrationModalProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  // Generate stable random values for confetti
  const [confetti] = useState(() => {
    const colors = ['#FFD700', '#FF1493', '#00CED1', '#32CD32'];
    return Array.from({ length: 30 }).map(() => ({
      x: (Math.random() - 0.5) * 600,
      y: (Math.random() - 0.5) * 600,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * 4)],
    }));
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 10 }}
        className="text-center"
      >
        {result === 'CLAPPING_HAND' ? (
          <>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-9xl mb-6"
            >
              👏👏👏
            </motion.div>
            <div className="text-7xl font-black text-yellow-300 mb-4">
              CLAPPING HAND!
            </div>
            <div className="text-4xl font-bold text-white/80">
              Everyone clap! 🎉
            </div>
          </>
        ) : (
          <>
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-9xl mb-6"
            >
              🎁
            </motion.div>
            <div className="text-7xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
              BIG CHEST!
            </div>
            <div className="text-4xl font-bold text-white/80">
              Opening the treasure... ✨
            </div>
          </>
        )}

        {/* Confetti */}
        <div className="absolute inset-0 pointer-events-none">
          {confetti.map((item, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: item.x,
                y: item.y,
                opacity: 0,
                rotate: item.rotate,
              }}
              transition={{ duration: 2, delay: i * 0.03 }}
              className="absolute left-1/2 top-1/2 w-4 h-4 rounded-full"
              style={{
                backgroundColor: item.color,
              }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
