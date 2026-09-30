'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Question, GroupId } from '@/lib/types';
import { GROUP_COLORS } from '@/lib/gameUtils';
import { sounds } from '@/lib/audio';
import { useState } from 'react';

interface QuestionModalProps {
  question: Question;
  currentGroup: GroupId;
  onAnswer: (answer: 'A' | 'B' | 'C' | 'D') => void;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  freePassAvailable: boolean;
  onUseFreePass: () => void;
}

export default function QuestionModal({
  question,
  currentGroup,
  onAnswer,
  selectedAnswer,
  isCorrect,
  freePassAvailable,
  onUseFreePass,
}: QuestionModalProps) {
  const colors = GROUP_COLORS[currentGroup];
  const options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (answer: 'A' | 'B' | 'C' | 'D') => {
    if (answered) return;
    setAnswered(true);
    sounds.click();
    onAnswer(answer);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-8"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 max-w-5xl w-full border-4 border-white/20 shadow-2xl"
      >
        {/* Group indicator */}
        <div className={`text-center mb-8 ${colors.text}`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-4xl font-black"
          >
            GROUP {currentGroup}
          </motion.div>
        </div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 rounded-2xl p-8 mb-8"
        >
          <div className="text-white text-3xl font-bold text-center leading-relaxed">
            {question.question}
          </div>
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          {options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = question.correctAnswer === option;
            const showResult = selectedAnswer !== null;

            let bgClass = 'bg-white/10 hover:bg-white/20';
            let borderClass = 'border-white/30';
            const textClass = 'text-white';

            if (showResult) {
              if (isSelected && isCorrect) {
                bgClass = 'bg-green-500';
                borderClass = 'border-green-300';
              } else if (isSelected && !isCorrect) {
                bgClass = 'bg-red-500';
                borderClass = 'border-red-300';
              } else if (isCorrectAnswer && !isCorrect) {
                bgClass = 'bg-green-500/50';
                borderClass = 'border-green-300';
              }
            }

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleAnswer(option)}
                disabled={answered}
                whileHover={!answered ? { scale: 1.03 } : {}}
                whileTap={!answered ? { scale: 0.97 } : {}}
                className={`${bgClass} ${textClass} border-4 ${borderClass} rounded-2xl p-8 text-left transition-all disabled:cursor-not-allowed`}
              >
                <span className="text-3xl font-black mr-4">{option}.</span>
                <span className="text-2xl font-bold">{question.options[option]}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Result indicator */}
        <AnimatePresence>
          {selectedAnswer !== null && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              {isCorrect ? (
                <div className="text-6xl font-black text-green-400">
                  ✓ CORRECT!
                </div>
              ) : (
                <div className="text-6xl font-black text-red-400">
                  ✗ WRONG!
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Free Pass */}
        {freePassAvailable && !answered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center"
          >
            <button
              onClick={() => {
                sounds.unlock();
                onUseFreePass();
              }}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-2xl font-black py-4 px-12 rounded-xl transition-all transform hover:scale-105"
            >
              🎫 USE FREE PASS
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
