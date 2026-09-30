'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface AudioControlsProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function AudioControls({ soundEnabled, onToggleSound }: AudioControlsProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggleSound}
      className="fixed top-8 right-8 z-40 bg-white/10 backdrop-blur-lg hover:bg-white/20 rounded-full p-4 border-2 border-white/20 transition-all"
    >
      <div className="text-3xl">
        {soundEnabled ? '🔊' : '🔇'}
      </div>
    </motion.button>
  );
}
