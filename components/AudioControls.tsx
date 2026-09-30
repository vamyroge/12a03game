'use client';

import { motion } from 'framer-motion';

interface AudioControlsProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function AudioControls({ soundEnabled, onToggleSound }: AudioControlsProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggleSound}
      className="fixed top-4 left-4 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-lg hover:bg-white/20 transition-all"
      title={soundEnabled ? 'Mute' : 'Unmute'}
    >
      {soundEnabled ? '🔊' : '🔇'}
    </motion.button>
  );
}
