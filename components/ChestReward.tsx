'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { sounds } from '@/lib/audio';

interface ChestRewardProps {
  onClose: () => void;
}

export default function ChestReward({ onClose }: ChestRewardProps) {
  const [phase, setPhase] = useState<'anticipation' | 'shaking' | 'opening' | 'opened'>('anticipation');

  useEffect(() => {
    // Enhanced chest opening sequence with longer animation
    
    // Phase 1: Anticipation (500ms)
    const timer1 = setTimeout(() => {
      setPhase('shaking');
      sounds.chestOpen();
    }, 500);

    // Phase 2: Shaking (1500ms)
    const timer2 = setTimeout(() => {
      setPhase('opening');
    }, 2000);

    // Phase 3: Opening (1000ms)
    const timer3 = setTimeout(() => {
      setPhase('opened');
      sounds.celebration();
    }, 3000);

    // Phase 4: Close after showing reward (3000ms)
    const timer4 = setTimeout(() => {
      onClose();
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onClose]);

  // Generate stable random values for confetti
  const [confetti] = useState(() => {
    const colors = ['#FFD700', '#FF69B4', '#9370DB', '#00CED1'];
    return Array.from({ length: 50 }).map(() => ({
      x: (Math.random() - 0.5) * 600,
      y: -Math.random() * 500 - 150,
      rotate: Math.random() * 360,
      color: colors[Math.floor(Math.random() * 4)],
    }));
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50"
    >
      <div className="relative">
        {/* Chest - 50% smaller than original */}
        <motion.div
          initial={{ scale: 0.5, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          className="relative"
        >
          {/* Phase 1: Anticipation */}
          {phase === 'anticipation' && (
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 0.5, repeat: 1 }}
              className="text-[180px] leading-none"
            >
              🎁
            </motion.div>
          )}

          {/* Phase 2: Shaking with glow */}
          {phase === 'shaking' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.15, 1.1, 1.15, 1],
                  rotate: [0, -8, 8, -8, 8, -5, 5, 0],
                  y: [0, -5, 5, -5, 0]
                }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="text-[180px] leading-none relative z-10"
              >
                🎁
              </motion.div>
            </>
          )}

          {/* Phase 3: Opening */}
          {phase === 'opening' && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5, 1.3], opacity: [0.5, 1, 0.7] }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full blur-3xl"
              />
              <motion.div
                animate={{
                  scale: [1, 1.4, 1.2],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="text-[180px] leading-none relative z-10"
              >
                🎁
              </motion.div>
            </>
          )}

          {/* Phase 4: Opened with burst effect */}
          {phase === 'opened' && (
            <>
              {/* Burst effect */}
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 4, opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-full blur-3xl"
              />

              {/* Opened chest */}
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-[180px] leading-none relative z-10"
              >
                🎁
              </motion.div>

              {/* Reward - scaled proportionally */}
              <motion.div
                initial={{ y: 80, opacity: 0, scale: 0 }}
                animate={{ y: -40, opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', damping: 10 }}
                className="absolute -top-32 left-1/2 -translate-x-1/2 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, 5, -5, 5, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-[120px] leading-none mb-3"
                >
                  👏👏👏
                </motion.div>
                <div className="text-4xl font-black text-yellow-300 whitespace-nowrap drop-shadow-lg">
                  BIGGER CLAPPING HAND!
                </div>
                <div className="text-xl font-bold text-white/80 mt-3">
                  Everyone clap louder! 🎉
                </div>
              </motion.div>

              {/* Confetti particles - adjusted for smaller size */}
              <div className="absolute inset-0 pointer-events-none">
                {confetti.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                      x: item.x,
                      y: item.y,
                      opacity: 0,
                      scale: 0,
                      rotate: item.rotate,
                    }}
                    transition={{ duration: 2, delay: i * 0.02 }}
                    className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />
                ))}
              </div>

              {/* Rays - adjusted for smaller size */}
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.5, opacity: [0, 1, 0] }}
                  transition={{ duration: 1, delay: 0.2, repeat: Infinity }}
                  className="absolute left-1/2 top-1/2 w-2 h-32 bg-gradient-to-t from-yellow-400 to-transparent origin-bottom"
                  style={{
                    transform: `rotate(${i * 30}deg) translateX(-50%)`,
                  }}
                />
              ))}
            </>
          )}
        </motion.div>

        {/* Light glow - adjusted for smaller size */}
        {phase === 'opened' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 3, opacity: 0.3 }}
            className="absolute inset-0 bg-yellow-300 rounded-full blur-3xl -z-10"
          />
        )}
      </div>
    </motion.div>
  );
}
