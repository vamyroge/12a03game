'use client';

import { motion } from 'framer-motion';
import { sounds } from '@/lib/audio';

interface GameControlsProps {
  onOpenAll: () => void;
  onReset: () => void;
  openAllEnabled: boolean;
}

export default function GameControls({ onOpenAll, onReset, openAllEnabled }: GameControlsProps) {
  const handleOpenAll = () => {
    sounds.unlock();
    onOpenAll();
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the game?')) {
      sounds.click();
      onReset();
    }
  };

  return (
    <div className="fixed top-8 left-8 z-40 flex gap-4">
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpenAll}
        disabled={!openAllEnabled}
        className={`${
          openAllEnabled
            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600'
            : 'bg-gray-500'
        } text-white text-xl font-black py-3 px-8 rounded-xl shadow-lg transition-all disabled:cursor-not-allowed disabled:opacity-50`}
      >
        🔓 OPEN ALL
      </motion.button>

      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleReset}
        className="bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-300 text-xl font-bold py-3 px-8 rounded-xl transition-all"
      >
        🔄 RESET
      </motion.button>
    </div>
  );
}
