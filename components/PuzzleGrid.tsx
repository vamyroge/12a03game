'use client';

import { AnimatePresence, motion } from 'framer-motion';

interface PuzzleGridProps {
  imageUrl: string;
  openedTiles: Set<number>;
  revealingTiles: number[];
  onTileClick: (index: number) => void;
  disabled: boolean;
}

export default function PuzzleGrid({ imageUrl, openedTiles, revealingTiles, onTileClick, disabled }: PuzzleGridProps) {
  const GRID_COLS = 5;
  const GRID_ROWS = 4;
  const TOTAL_TILES = GRID_COLS * GRID_ROWS; // 20 tiles

  return (
    <div className="relative">
      {/* Main puzzle container - increased by 25% (500x400 from 400x320) */}
      <div 
        className="relative w-[500px] h-[400px] mx-auto rounded-xl overflow-hidden shadow-2xl border-2 border-white/20"
      >
        <AnimatePresence>
          {revealingTiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -18, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.9 }}
              className="absolute left-1/2 top-3 z-20 -translate-x-1/2 rounded-full border border-cyan-300/70 bg-slate-950/90 px-5 py-2 text-center shadow-[0_0_30px_rgba(34,211,238,0.65)] backdrop-blur-sm"
            >
              <div className="text-lg font-black tracking-widest text-cyan-200">🔓 OPEN EXTRA</div>
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                Opening 2 tiles
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keep the unrevealed image hidden beneath the puzzle tiles. */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 grid grid-cols-5 grid-rows-4 bg-black/20">
          {Array.from({ length: TOTAL_TILES }).map((_, index) => {
            const isOpen = openedTiles.has(index);
            const isRevealing = revealingTiles.includes(index);

            return (
              <motion.button
                key={index}
                onClick={() => !disabled && !isOpen && onTileClick(index)}
                disabled={disabled || isOpen}
                initial={{ opacity: 1 }}
                animate={isOpen
                  ? { opacity: 0 }
                  : isRevealing
                  ? { opacity: [1, 0.65, 1], scale: [1, 1.08, 1], rotate: [0, -2, 2, 0] }
                  : { opacity: 1 }}
                transition={isRevealing ? { duration: 0.8, repeat: 1 } : { duration: 0.3 }}
                className={`
                  relative overflow-hidden rounded-sm
                  ${!isOpen ? 'cursor-pointer hover:brightness-125' : 'cursor-default pointer-events-none'}
                  transition-all duration-200
                `}
                style={{
                  backgroundColor: isOpen ? 'transparent' : 'rgb(10, 1, 24)',
                  backgroundImage: !isOpen
                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)'
                    : 'none',
                }}
              >
                {isRevealing && (
                  <motion.div
                    className="absolute inset-0 z-10 rounded-sm border-2 border-cyan-200"
                    animate={{ opacity: [0.25, 1, 0.25], boxShadow: ['0 0 8px rgba(34,211,238,.3)', '0 0 28px rgba(34,211,238,1)', '0 0 8px rgba(34,211,238,.3)'] }}
                    transition={{ duration: 0.8, repeat: 1 }}
                  />
                )}
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
