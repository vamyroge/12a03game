'use client';

import { motion } from 'framer-motion';

interface PuzzleGridProps {
  imageUrl: string;
  openedTiles: Set<number>;
  onTileClick: (index: number) => void;
  disabled: boolean;
}

export default function PuzzleGrid({ imageUrl, openedTiles, onTileClick, disabled }: PuzzleGridProps) {
  const GRID_COLS = 5;
  const GRID_ROWS = 4;
  const TOTAL_TILES = GRID_COLS * GRID_ROWS; // 20 tiles

  return (
    <div className="relative">
      {/* Main puzzle container - 50% scale */}
      <div 
        className="relative w-[400px] h-[320px] mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-white/10"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Grid overlay */}
        <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 gap-0.5 bg-black/20 p-0.5">
          {Array.from({ length: TOTAL_TILES }).map((_, index) => {
            const isOpen = openedTiles.has(index);

            return (
              <motion.button
                key={index}
                onClick={() => !disabled && !isOpen && onTileClick(index)}
                disabled={disabled || isOpen}
                initial={{ opacity: 1 }}
                animate={{ opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.3 }}
                className={`
                  relative overflow-hidden rounded-sm
                  ${!isOpen ? 'cursor-pointer hover:opacity-80' : 'cursor-default pointer-events-none'}
                  ${!isOpen && !disabled ? 'hover:scale-105' : ''}
                  transition-all duration-200
                `}
                style={{
                  backgroundColor: isOpen ? 'transparent' : 'rgba(10, 1, 24, 0.95)',
                  backgroundImage: !isOpen
                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)'
                    : 'none',
                }}
              >
                {!isOpen && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="text-white/40 text-xs font-bold"
                    >
                      {index + 1}
                    </motion.div>
                  </div>
                )}

                {/* Hover glow effect */}
                {!isOpen && !disabled && (
                  <motion.div
                    className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.4), transparent)',
                    }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Corner decorations */}
        <div className="absolute top-1 left-1 w-4 h-4 border-l-2 border-t-2 border-purple-400/50 rounded-tl" />
        <div className="absolute top-1 right-1 w-4 h-4 border-r-2 border-t-2 border-purple-400/50 rounded-tr" />
        <div className="absolute bottom-1 left-1 w-4 h-4 border-l-2 border-b-2 border-purple-400/50 rounded-bl" />
        <div className="absolute bottom-1 right-1 w-4 h-4 border-r-2 border-b-2 border-purple-400/50 rounded-br" />
      </div>

      {/* Progress indicator */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
          <div className="text-xs font-medium text-white/70">Progress:</div>
          <div className="text-sm font-bold text-purple-400">
            {openedTiles.size} / {TOTAL_TILES}
          </div>
        </div>
      </div>
    </div>
  );
}
