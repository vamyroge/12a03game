// Background music system for the game
let isMusicEnabled = false;

// Create a simple upbeat melody using Web Audio API
export const createBackgroundMusic = () => {
  try {
    const AudioContextClass = window.AudioContext
      || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return null;

    const audioContext = new AudioContextClass();
    const musicBuffer: { oscillator: OscillatorNode; gainNode: GainNode }[] = [];

    const playNote = (frequency: number, startTime: number, duration: number, volume: number = 0.05) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0, audioContext.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + startTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + startTime + duration);

      oscillator.start(audioContext.currentTime + startTime);
      oscillator.stop(audioContext.currentTime + startTime + duration);

      return { oscillator, gainNode };
    };

    // Simple upbeat melody pattern (C major scale based)
    const melody = [
      { freq: 523.25, time: 0, duration: 0.3 },    // C5
      { freq: 659.25, time: 0.4, duration: 0.3 },  // E5
      { freq: 783.99, time: 0.8, duration: 0.3 },  // G5
      { freq: 659.25, time: 1.2, duration: 0.3 },  // E5
      { freq: 523.25, time: 1.6, duration: 0.3 },  // C5
      { freq: 587.33, time: 2.0, duration: 0.3 },  // D5
      { freq: 659.25, time: 2.4, duration: 0.6 },  // E5
      { freq: 523.25, time: 3.2, duration: 0.3 },  // C5
    ];

    melody.forEach(note => {
      musicBuffer.push(playNote(note.freq, note.time, note.duration));
    });

    // Loop every 4 seconds
    const loopInterval = setInterval(() => {
      if (isMusicEnabled) {
        melody.forEach(note => {
          playNote(note.freq, note.time, note.duration);
        });
      }
    }, 4000);

    return {
      stop: () => {
        clearInterval(loopInterval);
        musicBuffer.forEach(({ oscillator }) => {
          try {
            oscillator.stop();
          } catch {
            // Already stopped
          }
        });
      },
      audioContext,
    };
  } catch (error) {
    console.warn('Background music creation failed:', error);
    return null;
  }
};

// Music state management
let musicInstance: { stop: () => void; audioContext: AudioContext } | null = null;

export const startBackgroundMusic = () => {
  if (!isMusicEnabled) {
    isMusicEnabled = true;
    
    if (!musicInstance) {
      musicInstance = createBackgroundMusic();
    }
  }
};

export const stopBackgroundMusic = () => {
  isMusicEnabled = false;
  
  if (musicInstance) {
    musicInstance.stop();
    musicInstance = null;
  }
};

export const toggleBackgroundMusic = () => {
  if (isMusicEnabled) {
    stopBackgroundMusic();
  } else {
    startBackgroundMusic();
  }
  return isMusicEnabled;
};

export const isMusicPlaying = () => isMusicEnabled;
