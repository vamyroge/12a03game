'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { toggleBackgroundMusic } from '@/lib/backgroundMusic';

export default function MusicControl() {
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Wait for first user interaction
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      document.removeEventListener('click', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  const handleToggle = () => {
    if (hasInteracted) {
      const newState = toggleBackgroundMusic();
      setMusicEnabled(newState);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={handleToggle}
      className="fixed top-4 left-16 z-30 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-lg hover:bg-white/20 transition-all"
      title={musicEnabled ? 'Mute Music' : 'Play Music'}
    >
      {musicEnabled ? '🎵' : '🎵'}
      {!musicEnabled && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-0.5 bg-red-500 rotate-45 rounded-full" />
        </div>
      )}
    </motion.button>
  );
}
