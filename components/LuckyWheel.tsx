'use client';

import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { sounds } from '@/lib/audio';

interface LuckyWheelProps {
  unlocked: boolean;
  spinCount: number;
  onSpin: (result: 'CLAPPING_HAND' | 'BIG_CHEST') => void;
}

export default function LuckyWheel({ unlocked, spinCount, onSpin }: LuckyWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [showBigWheel, setShowBigWheel] = useState(false);
  const controls = useAnimation();

  const handleSpin = async () => {
    if (spinning || !unlocked || spinCount >= 2) return;

    setSpinning(true);

    // Determine result
    const result = spinCount === 0 ? 'CLAPPING_HAND' : 'BIG_CHEST';
    const targetRotation = spinCount === 0 ? 1800 + 9 : 1800 + 189; // Different angles

    // Play tick sounds during spin
    const tickInterval = setInterval(() => {
      sounds.wheelTick();
    }, 100);

    // Spin animation
    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: 4,
        ease: [0.45, 0, 0.15, 1],
      },
    });

    clearInterval(tickInterval);

    setTimeout(() => {
      if (result === 'BIG_CHEST') {
        sounds.jackpot();
      } else {
        sounds.clap();
      }
      onSpin(result);
      setSpinning(false);
      setShowBigWheel(false);
    }, 500);
  };

  const handleJoinIn = () => {
    sounds.click();
    setShowBigWheel(true);
  };

  const handleCloseBigWheel = () => {
    if (!spinning) {
      sounds.click();
      setShowBigWheel(false);
    }
  };

  return (
    <>
      {/* Small Icon in Corner */}
      <div className="fixed bottom-8 right-8 z-40">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Small Wheel Icon */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="relative w-20 h-20 cursor-pointer"
            onClick={unlocked && spinCount < 2 ? handleJoinIn : undefined}
          >
            {/* Lock overlay */}
            {!unlocked && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center border-4 border-white/30 shadow-xl">
                <div className="text-center">
                  <div className="text-3xl">🔒</div>
                </div>
              </div>
            )}

            {/* Unlocked Icon */}
            {unlocked && spinCount < 2 && (
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center border-4 border-yellow-300 shadow-2xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-4xl"
                >
                  🎰
                </motion.div>
              </motion.div>
            )}

            {/* Completed */}
            {spinCount >= 2 && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-4 border-green-300 shadow-xl">
                <div className="text-3xl">✓</div>
              </div>
            )}

            {/* Glow effect when unlocked */}
            {unlocked && spinCount < 2 && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-lg -z-10"
              />
            )}
          </motion.div>

          {/* JOIN IN Button */}
          {unlocked && spinCount < 2 && (
            <motion.button
              initial={{ scale: 0, y: -20 }}
              animate={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinIn}
              className="mt-3 w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-sm font-black py-2 px-4 rounded-lg shadow-lg transition-all"
            >
              JOIN IN
            </motion.button>
          )}

          {spinCount >= 2 && (
            <div className="mt-3 w-full bg-green-500/20 border-2 border-green-500 text-green-300 text-center text-xs font-bold py-1 px-2 rounded-lg">
              DONE
            </div>
          )}
        </motion.div>
      </div>

      {/* Big Wheel Modal */}
      <AnimatePresence>
        {showBigWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseBigWheel}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              {!spinning && (
                <button
                  onClick={handleCloseBigWheel}
                  className="absolute -top-12 right-0 text-white/80 hover:text-white text-4xl font-bold transition-colors z-10"
                >
                  ×
                </button>
              )}

              {/* Big Wheel */}
              <div className="relative w-[600px] h-[600px] max-w-[90vw] max-h-[90vw]">
                {/* Glow effect */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-8 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-3xl"
                />

                {/* Wheel */}
                <motion.div
                  animate={controls}
                  className="relative w-full h-full rounded-full border-[16px] border-yellow-400 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-900 to-pink-900"
                  style={{ rotate: 0 }}
                >
                  {/* Segments */}
                  {Array.from({ length: 20 }).map((_, i) => {
                    const isBigChest = i === 10; // One segment is big chest
                    const rotation = (i * 360) / 20;
                    const bgColor = isBigChest
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                      : i % 2 === 0
                      ? 'bg-red-500'
                      : 'bg-white';

                    return (
                      <div
                        key={i}
                        className={`absolute left-1/2 top-1/2 origin-bottom ${bgColor}`}
                        style={{
                          width: '4px',
                          height: '50%',
                          transform: `rotate(${rotation}deg) translateX(-50%)`,
                        }}
                      >
                        <div
                          className="absolute top-8 left-1/2 -translate-x-1/2 text-4xl font-bold"
                          style={{ transform: 'rotate(90deg)' }}
                        >
                          {isBigChest ? '🎁' : '👏'}
                        </div>
                      </div>
                    );
                  })}

                  {/* Center circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-8 border-white shadow-2xl flex items-center justify-center">
                      <div className="text-6xl">🎰</div>
                    </div>
                  </div>
                </motion.div>

                {/* Pointer */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20">
                  <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[32px] border-transparent border-t-yellow-400 drop-shadow-2xl" />
                </div>
              </div>

              {/* Spin Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpin}
                disabled={spinning}
                className={`mt-8 w-full ${
                  spinning
                    ? 'bg-gray-500'
                    : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
                } text-white text-3xl font-black py-6 px-12 rounded-2xl shadow-2xl transition-all disabled:cursor-not-allowed`}
              >
                {spinning ? '🎰 SPINNING...' : spinCount === 0 ? '🎰 SPIN NOW' : '🎰 SPIN AGAIN'}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
