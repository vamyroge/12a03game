'use client';

import { motion } from 'framer-motion';

interface GameControlsProps {
  onOpenAll: () => void;
  onReset: () => void;
  openAllEnabled: boolean;
}

export default function GameControls({ onOpenAll, onReset, openAllEnabled }: GameControlsProps) {
  return (
    <div className="fixed top-4 right-4 z-30 flex flex-col gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onOpenAll}
        disabled={!openAllEnabled}
        className={`
          px-4 py-2 rounded-lg font-bold text-xs backdrop-blur-sm border transition-all
          ${
            openAllEnabled
              ? 'bg-purple-500/20 border-purple-400 text-purple-300 hover:bg-purple-500/30'
              : 'bg-gray-500/20 border-gray-500 text-gray-400 cursor-not-allowed'
          }
        `}
      >
        OPEN ALL
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="px-4 py-2 rounded-lg font-bold text-xs bg-red-500/20 border border-red-400 text-red-300 hover:bg-red-500/30 backdrop-blur-sm transition-all"
      >
        RESET
      </motion.button>
    </div>
  );
}
