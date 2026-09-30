// Web Audio API sound effects
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
};

export const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (e) {
    console.warn('Audio playback failed:', e);
  }
};

export const sounds = {
  click: () => playTone(800, 0.1),
  
  correct: () => {
    playTone(523, 0.15, 'sine');
    setTimeout(() => playTone(659, 0.15, 'sine'), 100);
    setTimeout(() => playTone(784, 0.2, 'sine'), 200);
  },
  
  wrong: () => {
    playTone(200, 0.3, 'sawtooth');
  },
  
  scoreIncrease: () => {
    playTone(1000, 0.1, 'square');
  },
  
  scoreDecrease: () => {
    playTone(150, 0.2, 'sawtooth');
  },
  
  reveal: () => {
    playTone(600, 0.15);
    setTimeout(() => playTone(800, 0.1), 80);
  },
  
  turnChange: () => {
    playTone(400, 0.1);
    setTimeout(() => playTone(500, 0.1), 100);
  },
  
  unlock: () => {
    playTone(400, 0.1);
    setTimeout(() => playTone(500, 0.1), 100);
    setTimeout(() => playTone(600, 0.1), 200);
    setTimeout(() => playTone(800, 0.2), 300);
  },
  
  wheelTick: () => playTone(600, 0.05, 'square'),
  
  jackpot: () => {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        playTone(800 + i * 100, 0.1, 'square');
      }, i * 50);
    }
  },
  
  clap: () => {
    playTone(300, 0.1, 'square');
    setTimeout(() => playTone(350, 0.1, 'square'), 100);
  },
  
  chestOpen: () => {
    playTone(200, 0.2, 'sawtooth');
    setTimeout(() => playTone(400, 0.2), 200);
    setTimeout(() => playTone(800, 0.3), 400);
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => playTone(1000 + i * 200, 0.1), i * 80);
      }
    }, 700);
  },
  
  celebration: () => {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        playTone(400 + Math.random() * 800, 0.1, 'sine');
      }, i * 100);
    }
  },
};

export const resumeAudioContext = async () => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  } catch (e) {
    console.warn('Could not resume audio context:', e);
  }
};
