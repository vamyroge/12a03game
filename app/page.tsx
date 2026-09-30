'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Question, GroupId, GamePhase, RewardType } from '@/lib/types';
import { getRandomReward } from '@/lib/gameUtils';
import { sounds, resumeAudioContext } from '@/lib/audio';
import { QUIZ_CONFIG } from '@/data/quizData';

import ScoreBoard from '@/components/ScoreBoard';
import PuzzleGrid from '@/components/PuzzleGrid';
import QuestionModal from '@/components/QuestionModal';
import RewardModal from '@/components/RewardModal';
import LuckyWheel from '@/components/LuckyWheel';
import ChestReward from '@/components/ChestReward';
import CelebrationModal from '@/components/CelebrationModal';
import AudioControls from '@/components/AudioControls';
import GameControls from '@/components/GameControls';

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('PLAYING');
  const [imageUrl] = useState<string>(QUIZ_CONFIG.secretImage);
  const [questions] = useState<Question[]>(QUIZ_CONFIG.questions as Question[]);
  const [currentGroup, setCurrentGroup] = useState<GroupId>(1);
  const [currentTileIndex, setCurrentTileIndex] = useState<number | null>(null);
  const [openedTiles, setOpenedTiles] = useState<Set<number>>(new Set());
  const [scores, setScores] = useState<Record<GroupId, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentReward, setCurrentReward] = useState<RewardType | null>(null);
  const [luckyWheelUnlocked, setLuckyWheelUnlocked] = useState(false);
  const [luckyWheelSpinCount, setLuckyWheelSpinCount] = useState(0);
  const [wheelResult, setWheelResult] = useState<'CLAPPING_HAND' | 'BIG_CHEST' | null>(null);
  const [doubleNextReward, setDoubleNextReward] = useState(false);
  const [freePassAvailable, setFreePassAvailable] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

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
    setPhase('QUESTION');
    sounds.click();
  };

  const handleAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (currentTileIndex === null) return;

    const question = questions[currentTileIndex];
    const correct = answer === question.correctAnswer;

    setSelectedAnswer(answer);
    setIsCorrect(correct);

    if (correct) {
      sounds.correct();
    } else {
      sounds.wrong();
    }

    setTimeout(() => {
      setPhase('ANSWER_RESULT');

      setTimeout(() => {
        if (correct) {
          const reward = getRandomReward();
          setCurrentReward(reward);
          setPhase('REWARD');
        } else {
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
    setFreePassAvailable(false);
    setPhase('ANSWER_RESULT');
    setIsCorrect(true);
    sounds.unlock();

    setTimeout(() => {
      revealTileAndNextTurn();
    }, 1500);
  };

  const applyReward = (reward: RewardType) => {
    if (reward.type === 'points') {
      const points = doubleNextReward ? reward.value * 2 : reward.value;
      setScores((prev) => ({
        ...prev,
        [currentGroup]: prev[currentGroup] + points,
      }));
      setDoubleNextReward(false);

      if (points > 0) {
        sounds.scoreIncrease();
      } else {
        sounds.scoreDecrease();
      }
    } else if (reward.type === 'freePass') {
      setFreePassAvailable(true);
    } else if (reward.type === 'doubleNext') {
      setDoubleNextReward(true);
    } else if (reward.type === 'openExtra') {
      const unopenedTiles = Array.from({ length: 16 }, (_, i) => i).filter(
        (i) => !openedTiles.has(i) && i !== currentTileIndex
      );
      if (unopenedTiles.length > 0) {
        const randomTile = unopenedTiles[Math.floor(Math.random() * unopenedTiles.length)];
        setOpenedTiles((prev) => new Set([...prev, randomTile]));
        sounds.reveal();
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
    setCurrentTileIndex(null);

    const nextGroup = (currentGroup % 4) + 1 as GroupId;
    setCurrentGroup(nextGroup);
    sounds.turnChange();

    setPhase('PLAYING');
  };

  const handleRewardClose = () => {
    if (currentReward) {
      applyReward(currentReward);
      setCurrentReward(null);
    }

    revealTileAndNextTurn();
  };

  const handleOpenAll = () => {
    const unopenedTiles = Array.from({ length: 16 }, (_, i) => i).filter((i) => !openedTiles.has(i));

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
    setScores({ 1: 0, 2: 0, 3: 0, 4: 0 });
    setSelectedAnswer(null);
    setIsCorrect(null);
    setCurrentReward(null);
    setLuckyWheelUnlocked(false);
    setLuckyWheelSpinCount(0);
    setWheelResult(null);
    setDoubleNextReward(false);
    setFreePassAvailable(false);
  };

  const currentQuestion = currentTileIndex !== null ? questions[currentTileIndex] : null;

  // Generate stable random values for background particles
  const [particles] = useState(() => {
    return Array.from({ length: 20 }).map(() => ({
      x1: Math.random() * 1920,
      x2: Math.random() * 1920,
      y1: Math.random() * 1080,
      y2: Math.random() * 1080,
      duration: 3 + Math.random() * 2,
    }));
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            animate={{
              x: [particle.x1, particle.x2],
              y: [particle.y1, particle.y2],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8 gap-12">
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-6xl font-black text-center bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
        >
          WHO IS THIS?
        </motion.h1>

        <ScoreBoard scores={scores} currentGroup={currentGroup} />

        {imageUrl && (
          <PuzzleGrid
            imageUrl={imageUrl}
            openedTiles={openedTiles}
            onTileClick={handleTileClick}
            disabled={phase !== 'PLAYING'}
          />
        )}

        <div className="flex gap-4">
          {doubleNextReward && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-purple-500/30 border-2 border-purple-400 text-purple-200 text-lg font-bold py-2 px-6 rounded-xl"
            >
              ✨ DOUBLE NEXT ACTIVE
            </motion.div>
          )}
          {freePassAvailable && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-yellow-500/30 border-2 border-yellow-400 text-yellow-200 text-lg font-bold py-2 px-6 rounded-xl"
            >
              🎫 FREE PASS AVAILABLE
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {phase === 'QUESTION' && currentQuestion && (
          <QuestionModal
            question={currentQuestion}
            currentGroup={currentGroup}
            onAnswer={handleAnswer}
            selectedAnswer={selectedAnswer}
            isCorrect={isCorrect}
            freePassAvailable={freePassAvailable}
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
        {phase === 'CHEST' && <ChestReward onClose={handleChestClose} />}
      </AnimatePresence>

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
    </div>
  );
}
