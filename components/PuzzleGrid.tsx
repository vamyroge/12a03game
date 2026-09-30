'use client';

import { motion } from 'framer-motion';
import { sounds } from '@/lib/audio';

interface PuzzleGridProps {
  imageUrl: string;
  openedTiles: Set<number>;
  onTileClick: (index: number) => void;
  disabled: boolean;
}

export default function PuzzleGrid({ imageUrl, openedTiles, onTileClick, disabled }: PuzzleGridProps) {
  return (
    <div className="grid grid-cols-4 gap-2 w-full max-w-3xl mx-auto aspect-square">
      {Array.from({ length: 16 }, (_, i) => {
        const row = Math.floor(i / 4);
        const col = i % 4;
        const isOpen = openedTiles.has(i);

        return (
          <motion.div
            key={i}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
              if (!disabled && !isOpen) {
                sounds.click();
                onTileClick(i);
              }
            }}
            whileHover={!isOpen && !disabled ? { scale: 1.05 } : {}}
            whileTap={!isOpen && !disabled ? { scale: 0.95 } : {}}
          >
            {/* Background image piece */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${imageUrl})`,
                backgroundSize: '400% 400%',
                backgroundPosition: `${col * 33.333}% ${row * 33.333}%`,
              }}
            />
            
            {/* Overlay */}
            {!isOpen && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center border-2 border-white/20"
              >
                <span className="text-5xl font-black text-white/80">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </motion.div>
            )}

            {/* Reveal animation */}
            {isOpen && (
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute inset-0 border-2 border-yellow-400/50 shadow-lg shadow-yellow-400/30"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
