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
  const isNegative = reward.type === 'points' && reward.value < 0;

  // Generate particles
  const [particles] = useState(() => {
    return Array.from({ length: 30 }).map(() => ({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 400,
      delay: Math.random() * 0.5,
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
    }, 2500);

    return () => clearTimeout(timer);
  }, [reward, onClose]);

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
        className="relative"
      >
        {/* Reward card */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border-2 border-white/30 p-8 shadow-2xl min-w-[320px]">
          {/* Glow effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl blur-xl -z-10"
            style={{
              background: isNegative
                ? 'rgba(239, 68, 68, 0.5)'
                : colors.bg.includes('blue')
                ? 'rgba(59, 130, 246, 0.5)'
                : colors.bg.includes('green')
                ? 'rgba(16, 185, 129, 0.5)'
                : colors.bg.includes('purple')
                ? 'rgba(168, 85, 247, 0.5)'
                : 'rgba(249, 115, 22, 0.5)',
            }}
          />

          {/* Group indicator */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`text-xs font-bold ${colors.text} text-center mb-3`}
          >
            Group {currentGroup}
          </motion.div>

          {/* Reward icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.5 }}
            className="text-center mb-4"
          >
            <motion.div
              animate={
                !isNegative
                  ? { rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }
                  : { rotate: [0, -5, 5, -5, 0] }
              }
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-7xl inline-block"
            >
              {getRewardIcon(reward)}
            </motion.div>
          </motion.div>

          {/* Reward text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div
              className={`text-4xl font-black mb-2 ${
                isNegative ? 'text-red-400' : 'text-yellow-300'
              }`}
            >
              {formatReward(reward)}
            </div>

            {/* Description */}
            {reward.type === 'points' && (
              <div className="text-base font-bold text-white/80">
                {reward.value > 0 ? 'Points earned!' : 'Points lost!'}
              </div>
            )}

            {reward.type === 'freePass' && (
              <div className="text-base font-bold text-yellow-300">
                Skip next question!
              </div>
            )}

            {reward.type === 'doubleNext' && (
              <div className="text-base font-bold text-purple-300">
                Next reward ×2!
              </div>
            )}

            {reward.type === 'openExtra' && (
              <div className="text-base font-bold text-blue-300">
                Bonus tile revealed!
              </div>
            )}
          </motion.div>

          {/* Particles for positive rewards */}
          {!isNegative && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
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
                  transition={{ duration: 1.5, delay: particle.delay }}
                  className={`absolute left-1/2 top-1/2 w-2 h-2 rounded-full`}
                  style={{
                    backgroundColor: colors.bg.includes('blue')
                      ? '#3b82f6'
                      : colors.bg.includes('green')
                      ? '#10b981'
                      : colors.bg.includes('purple')
                      ? '#a855f7'
                      : '#f97316',
                  }}
                />
              ))}
            </div>
          )}

          {/* Progress indicator */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.5, ease: 'linear' }}
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-b-2xl origin-left"
          />
        </div>

        {/* Light rays for big rewards */}
        {!isNegative && reward.type === 'points' && reward.value >= 30 && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1.5, opacity: [0, 0.6, 0] }}
                transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                className="absolute left-1/2 top-1/2 w-1 h-32 bg-gradient-to-t from-yellow-400 to-transparent origin-bottom"
                style={{
                  transform: `rotate(${i * 30}deg) translateX(-50%)`,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
