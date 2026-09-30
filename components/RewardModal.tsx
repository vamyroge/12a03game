'use client';

import { motion } from 'framer-motion';
import { RewardType, GroupId } from '@/lib/types';
import { formatReward, getRewardIcon, GROUP_COLORS } from '@/lib/gameUtils';
import { useEffect, useState } from 'react';
import { sounds } from '@/lib/audio';

interface RewardModalProps {
  reward: RewardType;
  currentGroup: GroupId;
  onClose: () => void;
}

export default function RewardModal({ reward, currentGroup, onClose }: RewardModalProps) {
  const colors = GROUP_COLORS[currentGroup];

  // Generate stable random values for particles
  const [particles] = useState(() => {
    return Array.from({ length: 20 }).map(() => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
    }));
  });

  useEffect(() => {
    if (reward.type === 'points' && reward.value > 0) {
      sounds.scoreIncrease();
    } else if (reward.type === 'points' && reward.value < 0) {
      sounds.scoreDecrease();
    } else {
      sounds.unlock();
    }

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [reward, onClose]);

  const isNegative = reward.type === 'points' && reward.value < 0;

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
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: 'spring', damping: 15 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: isNegative ? [0, -10, 10, -10, 0] : [0, 5, -5, 5, 0],
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
          className="text-9xl mb-6"
        >
          {getRewardIcon(reward)}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-7xl font-black mb-4 ${
            isNegative ? 'text-red-400' : colors.text
          }`}
        >
          {formatReward(reward)}
        </motion.div>

        {reward.type === 'points' && (
          <div className="text-4xl font-bold text-white/80">
            {reward.value > 0 ? 'POINTS!' : 'POINTS'}
          </div>
        )}

        {reward.type === 'freePass' && (
          <div className="text-4xl font-bold text-yellow-300">
            Skip one question!
          </div>
        )}

        {reward.type === 'doubleNext' && (
          <div className="text-4xl font-bold text-purple-300">
            Next reward x2!
          </div>
        )}

        {reward.type === 'openExtra' && (
          <div className="text-4xl font-bold text-blue-300">
            Reveal extra tile!
          </div>
        )}

        {/* Particles */}
        {!isNegative && (
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
                transition={{ duration: 1.5, delay: i * 0.05 }}
                className={`absolute left-1/2 top-1/2 w-4 h-4 ${colors.bg} rounded-full`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
