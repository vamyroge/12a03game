'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, GroupId, GamePhase, RewardType } from '@/lib/types';
import { getRandomReward, getRandomPointReward } from '@/lib/gameUtils';
import { sounds, resumeAudioContext } from '@/lib/audio';
import { QUIZ_CONFIG } from '@/data/quizData';

import ScoreBoard from '@/components/ScoreBoard';
import PuzzleGrid from '@/components/PuzzleGrid';
import QuestionModal from '@/components/QuestionModal';
import RewardModal from '@/components/RewardModal';
import LuckyWheel from '@/components/LuckyWheel';
import TreasureChest from '@/components/TreasureChest';
import CelebrationModal from '@/components/CelebrationModal';
import AudioControls from '@/components/AudioControls';
import MusicControl from '@/components/MusicControl';
import GameControls from '@/components/GameControls';

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('PLAYING');
  const [imageUrl] = useState<string>(QUIZ_CONFIG.secretImage);
  const [questions] = useState<Question[]>(QUIZ_CONFIG.questions as Question[]);
  const [currentGroup, setCurrentGroup] = useState<GroupId>(1);
  const [currentTileIndex, setCurrentTileIndex] = useState<number | null>(null);
  const [openedTiles, setOpenedTiles] = useState<Set<number>>(new Set());
  const [revealingTiles, setRevealingTiles] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<GroupId, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [wrongAnswerPenalty, setWrongAnswerPenalty] = useState<5 | 10>(10);
  const [currentReward, setCurrentReward] = useState<RewardType | null>(null);
  const [doubleNextAwarded, setDoubleNextAwarded] = useState(false);
  const [luckyWheelUnlocked, setLuckyWheelUnlocked] = useState(false);
  const [luckyWheelSpinCount, setLuckyWheelSpinCount] = useState(0);
  const [wheelResult, setWheelResult] = useState<'CLAPPING_HAND' | 'BIG_CHEST' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Background particles for depth
  const [particles] = useState(() => {
    return Array.from({ length: 30 }).map(() => ({
      x1: Math.random() * 1920,
      x2: Math.random() * 1920,
      y1: Math.random() * 1080,
      y2: Math.random() * 1080,
      duration: 4 + Math.random() * 3,
      size: 1 + Math.random() * 2,
    }));
  });

  useEffect(() => {
    // Initialize audio on first user interaction
    const initAudio = () => {
      resumeAudioContext();
      document.removeEventListener('click', initAudio);
    };
    document.addEventListener('click', initAudio);
    return () => document.removeEventListener('click', initAudio);
  }, []);

  const handleTileClick = (index: number) => {
    if (openedTiles.has(index) || phase !== 'PLAYING') return;

    setCurrentTileIndex(index);
    const reward = getRandomReward();
    setCurrentReward(reward);
    setDoubleNextAwarded(false);

    if (reward.type === 'freePass') {
      setPhase('REWARD');
      return;
    }

    setPhase('QUESTION');
    sounds.click();
  };

  const handleAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (currentTileIndex === null) return;

    const question = questions[currentTileIndex];
    const correct = answer === question.correctAnswer;

    setSelectedAnswer(answer);
    setIsCorrect(correct);
    setWrongAnswerPenalty(10);

    if (correct) {
      sounds.correct();
    } else {
      sounds.wrong();
    }

    setTimeout(() => {
      setPhase('ANSWER_RESULT');

      setTimeout(() => {
        if (correct) {
          if (currentReward?.type === 'openExtra') {
            const extraTiles = Array.from({ length: 20 }, (_, i) => i).filter(
              (i) => !openedTiles.has(i) && i !== currentTileIndex
            );
            if (extraTiles.length > 0) {
              const extraTile = extraTiles[Math.floor(Math.random() * extraTiles.length)];
              setRevealingTiles([currentTileIndex, extraTile]);
              setPhase('EXTRA_REVEAL');

              setTimeout(() => {
                setOpenedTiles((prev) => new Set([...prev, currentTileIndex, extraTile]));
                setRevealingTiles([]);
                sounds.reveal();
                revealTileAndNextTurn();
              }, 1800);
              return;
            }
            revealTileAndNextTurn();
          } else {
            if (currentReward?.type === 'doubleNext') {
              const doubledPoints = getRandomPointReward();
              applyReward({ ...doubledPoints, value: doubledPoints.value * 2 });
              setDoubleNextAwarded(true);
              setCurrentReward(currentReward);
            }
            setPhase('REWARD');
          }
        } else {
          setCurrentReward(null);
          setScores((prev) => ({
            ...prev,
            [currentGroup]: prev[currentGroup] - 10,
          }));
          sounds.scoreDecrease();

          revealTileAndNextTurn();
        }
      }, 1500);
    }, 1000);
  };

  const handleUseFreePass = () => {
    // Kept for compatibility with the question modal; passes normally get
    // consumed automatically when the tile is clicked.
    setPhase('ANSWER_RESULT');
    setIsCorrect(true);
    sounds.unlock();

    setTimeout(() => {
      revealTileAndNextTurn();
    }, 1500);
  };

  const applyReward = (reward: RewardType) => {
    if (reward.type === 'points') {
      setScores((prev) => ({
        ...prev,
        [currentGroup]: prev[currentGroup] + reward.value,
      }));

      if (reward.value > 0) {
        sounds.scoreIncrease();
      } else {
        sounds.scoreDecrease();
      }
    }
  };

  const revealTileAndNextTurn = () => {
    if (currentTileIndex !== null) {
      setOpenedTiles((prev) => new Set([...prev, currentTileIndex]));
      sounds.reveal();
    }

    setSelectedAnswer(null);
    setIsCorrect(null);
    setWrongAnswerPenalty(10);
    setCurrentTileIndex(null);

    const nextGroup = (currentGroup % 4) + 1 as GroupId;
    setCurrentGroup(nextGroup);
    sounds.turnChange();

    setPhase('PLAYING');
  };

  const handleRewardClose = () => {
    if (!currentReward) return;

    if (currentReward.type === 'freePass') {
      applyReward({ type: 'points', value: 10 });
      setCurrentReward(null);
      revealTileAndNextTurn();
      return;
    }

    if (currentReward.type === 'doubleNext' && doubleNextAwarded) {
      setDoubleNextAwarded(false);
      setCurrentReward(null);
      revealTileAndNextTurn();
      return;
    }

    if (currentReward.type === 'doubleNext' || currentReward.type === 'openExtra') {
      setPhase('QUESTION');
      sounds.click();
      return;
    }

    applyReward(currentReward);
    setCurrentReward(null);
    revealTileAndNextTurn();
  };

  const handleOpenAll = () => {
    const unopenedTiles = Array.from({ length: 20 }, (_, i) => i).filter((i) => !openedTiles.has(i));

    unopenedTiles.forEach((tile, index) => {
      setTimeout(() => {
        setOpenedTiles((prev) => new Set([...prev, tile]));
        sounds.reveal();
      }, index * 100);
    });

    setTimeout(() => {
      setLuckyWheelUnlocked(true);
      sounds.unlock();
    }, unopenedTiles.length * 100 + 500);
  };

  const handleWheelSpin = (result: 'CLAPPING_HAND' | 'BIG_CHEST') => {
    setLuckyWheelSpinCount((prev) => prev + 1);
    setWheelResult(result);
    setPhase('LUCKY_WHEEL');
  };

  const handleCelebrationClose = () => {
    if (wheelResult === 'BIG_CHEST') {
      setPhase('CHEST');
    } else {
      setPhase('PLAYING');
    }
    setWheelResult(null);
  };

  const handleChestClose = () => {
    setPhase('PLAYING');
  };

  const handleReset = () => {
    setPhase('PLAYING');
    setCurrentGroup(1);
    setCurrentTileIndex(null);
    setOpenedTiles(new Set());
    setRevealingTiles([]);
    setScores({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setSelectedAnswer(null);
    setIsCorrect(null);
    setWrongAnswerPenalty(10);
    setCurrentReward(null);
    setDoubleNextAwarded(false);
    setLuckyWheelUnlocked(false);
    setLuckyWheelSpinCount(0);
    setWheelResult(null);
  };

  const currentQuestion = currentTileIndex !== null ? questions[currentTileIndex] : null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dark base keeps the colorful game UI and text readable. */}
      <div className="fixed inset-0 bg-[#080d24]" />

      {/* Ambient light blobs - colorful and energetic */}
      <div className="fixed inset-0 opacity-25">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl"
        />
      </div>

      {/* Subtle floating particles */}
      <div className="fixed inset-0 opacity-40 pointer-events-none">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{ 
              width: particle.size, 
              height: particle.size,
               background: 'linear-gradient(135deg, #67e8f9, #c084fc)',
            }}
            animate={{
              x: [particle.x1, particle.x2],
              y: [particle.y1, particle.y2],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 gap-6">
        {/* Header - 50% scale */}
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-black text-center bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-amber-200 bg-clip-text text-transparent drop-shadow-lg"
        >
          WHO IS THIS?
        </motion.h1>

        {/* ScoreBoard - compact */}
        <ScoreBoard scores={scores} currentGroup={currentGroup} />

        {/* Puzzle Grid */}
        {imageUrl && (
          <PuzzleGrid
            imageUrl={imageUrl}
            openedTiles={openedTiles}
            revealingTiles={revealingTiles}
            onTileClick={handleTileClick}
            disabled={phase !== 'PLAYING'}
          />
        )}

        {/* Active power-ups indicator */}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(phase === 'QUESTION' || phase === 'ANSWER_RESULT') && currentQuestion && (
          <QuestionModal
            question={currentQuestion}
            currentGroup={currentGroup}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            wrongAnswerPenalty={wrongAnswerPenalty}
            freePassAvailable={false}
            onUseFreePass={handleUseFreePass}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'REWARD' && currentReward && (
          <RewardModal
            reward={currentReward}
            currentGroup={currentGroup}
            onClose={handleRewardClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'LUCKY_WHEEL' && wheelResult && (
          <CelebrationModal result={wheelResult} onClose={handleCelebrationClose} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'CHEST' && <TreasureChest onClose={handleChestClose} />}
      </AnimatePresence>

      {/* UI Controls */}
      <LuckyWheel
        unlocked={luckyWheelUnlocked}
        spinCount={luckyWheelSpinCount}
        onSpin={handleWheelSpin}
      />

      <GameControls
        onOpenAll={handleOpenAll}
        onReset={handleReset}
        openAllEnabled={phase === 'PLAYING'}
      />

      <AudioControls
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />

      <MusicControl />
    </div>
  );
}
