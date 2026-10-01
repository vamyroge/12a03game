'use client';

import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { sounds } from '@/lib/audio';

interface LuckyWheelProps {
  unlocked: boolean;
  spinCount: number;
  onSpin: (result: 'CLAPPING_HAND' | 'BIG_CHEST') => void;
}

function UnlockParticles() {
  const [particles] = useState(() => {
    return Array.from({ length: 50 }).map((_, i) => {
      const angle = (i / 50) * Math.PI * 2;
      const distance = 200 + Math.random() * 300;
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        color: ['#FFD700', '#FF69B4', '#9370DB', '#00CED1'][i % 4],
      };
    });
  });

  return (
    <div className="absolute inset-0">
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
          transition={{ duration: 1.5, delay: i * 0.01 }}
          className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
          style={{
            backgroundColor: particle.color,
          }}
        />
      ))}
    </div>
  );
}

export default function LuckyWheel({ unlocked, spinCount, onSpin }: LuckyWheelProps) {
  const [spinning, setSpinning] = useState(false);
  const [showBigWheel, setShowBigWheel] = useState(false);
  const [showUnlockCelebration, setShowUnlockCelebration] = useState(false);
  const controls = useAnimation();
  const hasShownUnlock = useRef(false);

  // Major unlock moment - only trigger once
  useEffect(() => {
    if (unlocked && !hasShownUnlock.current) {
      hasShownUnlock.current = true;
      setShowUnlockCelebration(true);
      sounds.unlock(); // Play sound once when unlocking

      // Hide celebration after 2 seconds
      const hideTimer = setTimeout(() => {
        setShowUnlockCelebration(false);
      }, 2000);

      return () => clearTimeout(hideTimer);
    }
  }, [unlocked]);

  const handleSpin = async () => {
    if (spinning || !unlocked || spinCount >= 2) return;

    setSpinning(true);

    // Determine result
    const result = spinCount === 0 ? 'CLAPPING_HAND' : 'BIG_CHEST';
    
    // Calculate target rotation to land on correct segment
    const segmentAngle = 360 / 20; // 20 equal segments
    const targetSegment = result === 'BIG_CHEST' ? 10 : 5; // Different segments
    const segmentCenter = targetSegment * segmentAngle - 81;
    const landingRotation = ((-90 - segmentCenter) % 360 + 360) % 360;
    const targetRotation = (spinCount + 1) * 1800 + landingRotation;

    // Play tick sounds during spin
    const tickInterval = setInterval(() => {
      sounds.wheelTick();
    }, 100);

    // Spin animation with proper easing
    await controls.start({
      rotate: targetRotation,
      transition: {
        duration: 4,
        ease: [0.33, 1, 0.68, 1], // Custom easing for deceleration
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
      <div className="fixed bottom-4 right-4 z-40">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Small Wheel Icon - 50% scale */}
          <motion.div
            whileHover={unlocked && spinCount < 2 ? { scale: 1.1 } : {}}
            className="relative w-16 h-16 cursor-pointer"
            onClick={unlocked && spinCount < 2 ? handleJoinIn : undefined}
          >
            {/* Lock overlay */}
            {!unlocked && (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center border-2 border-white/20 shadow-lg">
                <div className="text-center">
                  <div className="text-2xl">🔒</div>
                </div>
              </div>
            )}

            {/* Unlocked Icon */}
            {unlocked && spinCount < 2 && (
              <motion.div
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-full flex items-center justify-center border-2 border-yellow-300 shadow-xl"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-3xl"
                >
                  🎰
                </motion.div>
              </motion.div>
            )}

            {/* Completed */}
            {spinCount >= 2 && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-2 border-green-300 shadow-lg">
                <div className="text-2xl">✓</div>
              </div>
            )}

            {/* Glow effect when unlocked */}
            {unlocked && spinCount < 2 && (
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-md -z-10"
              />
            )}
          </motion.div>

          {/* JOIN IN Button */}
          {unlocked && spinCount < 2 && !showUnlockCelebration && (
            <motion.button
              initial={{ scale: 0, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleJoinIn}
              className="mt-2 w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white text-xs font-black py-1.5 px-3 rounded-lg shadow-lg transition-all"
            >
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                JOIN IN
              </motion.span>
            </motion.button>
          )}

          {spinCount >= 2 && (
            <div className="mt-2 w-full bg-green-500/20 border border-green-500 text-green-300 text-center text-[10px] font-bold py-1 px-2 rounded-lg">
              DONE
            </div>
          )}
        </motion.div>
      </div>

      {/* UNLOCK CELEBRATION - Major moment */}
      <AnimatePresence>
        {showUnlockCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          >
            {/* Background flash */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-yellow-400"
            />

            {/* Central celebration */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 10 }}
              className="relative z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 3 }}
                className="text-8xl mb-4"
              >
                🤖
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-black text-yellow-300 text-center drop-shadow-lg"
              >
                MARK ZUCKERBERG
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-black text-white text-center mt-2"
              >
                UNLOCKED!
              </motion.div>
            </motion.div>

            {/* Particles burst */}
            <UnlockParticles />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big Wheel Modal */}
      <AnimatePresence>
        {showBigWheel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={handleCloseBigWheel}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              {!spinning && (
                <button
                  onClick={handleCloseBigWheel}
                  className="absolute -top-12 right-0 text-white/70 hover:text-white text-3xl font-bold transition-colors z-10"
                >
                  ×
                </button>
              )}

              {/* Big Wheel Container - 50% scale (320px) */}
              <div className="relative w-80 h-80">
                {/* Glow effect */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 rounded-full blur-2xl"
                />

                {/* Wheel outer ring */}
                <div className="absolute inset-0 rounded-full border-8 border-yellow-400 shadow-2xl" />

                {/* Wheel rotating part */}
                <motion.div
                  animate={controls}
                  className="absolute inset-2 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
                  style={{ rotate: 0 }}
                >
                  {/* Draw 20 segments with dividers */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                    <defs>
                      {/* Gradient for segments */}
                      <radialGradient id="segmentGradient">
                        <stop offset="0%" stopColor="#374151" />
                        <stop offset="100%" stopColor="#1f2937" />
                      </radialGradient>
                    </defs>
                    
                    {/* Draw 20 segments */}
                    {Array.from({ length: 20 }).map((_, i) => {
                      const isBigChest = i === 10;
                      const startAngle = (i * 360) / 20 - 90; // Start from top
                      const endAngle = ((i + 1) * 360) / 20 - 90;
                      
                      // Convert to radians
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      
                      // Calculate path for pizza slice
                      const x1 = 100 + 100 * Math.cos(startRad);
                      const y1 = 100 + 100 * Math.sin(startRad);
                      const x2 = 100 + 100 * Math.cos(endRad);
                      const y2 = 100 + 100 * Math.sin(endRad);
                      
                      return (
                        <g key={i}>
                          {/* Segment slice */}
                          <path
                            d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                            fill={isBigChest ? '#fbbf24' : i % 2 === 0 ? '#ef4444' : '#ffffff'}
                            stroke="#000000"
                            strokeWidth="1"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Icons positioned correctly in each segment */}
                  {Array.from({ length: 20 }).map((_, i) => {
                    const isBigChest = i === 10;
                    const segmentCenter = (i + 0.5) * (360 / 20) - 90;
                    const angleInRadians = (segmentCenter * Math.PI) / 180;
                    // Keep the icon near the rim while leaving enough padding inside the slice.
                    const iconRadius = 43;
                    const left = 50 + Math.cos(angleInRadians) * iconRadius;
                    const top = 50 + Math.sin(angleInRadians) * iconRadius;
                    
                    return (
                      <div
                        key={i}
                        className="absolute text-2xl leading-none"
                        style={{
                          left: `${left}%`,
                          top: `${top}%`,
                          transform: 'translate(-50%, -50%)',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        }}
                      >
                        {isBigChest ? '🎁' : '👏'}
                      </div>
                    );
                  })}

                  {/* Center circle */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                      <div className="text-4xl">🎰</div>
                    </div>
                  </div>
                </motion.div>

                {/* Center hub */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                    <div className="text-4xl">🎰</div>
                  </div>
                </div>

                {/* Pointer at top */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20">
                  <div 
                    className="w-0 h-0 drop-shadow-xl"
                    style={{
                      borderLeft: '16px solid transparent',
                      borderRight: '16px solid transparent',
                      borderTop: '24px solid #fbbf24',
                    }}
                  />
                </div>
              </div>

              {/* Spin Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSpin}
                disabled={spinning}
                className={`mt-6 w-full ${
                  spinning
                    ? 'bg-gray-500'
                    : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
                } text-white text-2xl font-black py-4 px-8 rounded-xl shadow-xl transition-all disabled:cursor-not-allowed`}
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
