'use client';

import { motion } from 'framer-motion';
import { Question, GroupId } from '@/lib/types';
import { GROUP_COLORS } from '@/lib/gameUtils';

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
  const showResult = selectedAnswer !== null;

  const handleAnswer = (option: 'A' | 'B' | 'C' | 'D') => {
    if (selectedAnswer) return;
    onAnswer(option);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-2xl"
      >
        {/* Quiz Card - Premium design with depth */}
        <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div
            className="h-1.5"
            style={{
              background: colors.bg.includes('blue')
                ? 'linear-gradient(90deg, #3b82f6, #06b6d4)'
                : colors.bg.includes('green')
                ? 'linear-gradient(90deg, #10b981, #34d399)'
                : colors.bg.includes('purple')
                ? 'linear-gradient(90deg, #a855f7, #ec4899)'
                : 'linear-gradient(90deg, #f97316, #fb923c)',
            }}
          />

          {/* Card content */}
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`text-sm font-bold ${colors.text} flex items-center gap-2`}
              >
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                Group {currentGroup}
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-xs font-medium text-white/50"
              >
                Question #{question.id}
              </motion.div>
            </div>

            {/* Question */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <h2 className="text-2xl font-bold text-white leading-tight">
                {question.question}
              </h2>
            </motion.div>

            {/* Answer options */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              {(['A', 'B', 'C', 'D'] as const).map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === question.correctAnswer;
                
                let bgClass = 'bg-white/5 hover:bg-white/10 border-white/20';
                let borderClass = 'border-white/20';

                if (showResult) {
                  if (isSelected && isCorrect) {
                    bgClass = 'bg-green-500/30 border-green-400';
                    borderClass = 'border-green-400';
                  } else if (isSelected && !isCorrect) {
                    bgClass = 'bg-red-500/30 border-red-400';
                    borderClass = 'border-red-400';
                  } else if (isCorrectAnswer && !isCorrect) {
                    bgClass = 'bg-green-500/20 border-green-400/50';
                    borderClass = 'border-green-400/50';
                  }
                }

                return (
                  <motion.button
                    key={option}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={!selectedAnswer ? { scale: 1.02, x: 4 } : {}}
                    whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                    onClick={() => handleAnswer(option)}
                    disabled={!!selectedAnswer}
                    className={`
                      relative p-4 rounded-xl border-2 transition-all duration-300
                      ${bgClass} ${borderClass}
                      ${!selectedAnswer ? 'cursor-pointer' : 'cursor-default'}
                      ${isSelected ? 'ring-2 ring-white/50' : ''}
                      backdrop-blur-sm
                      disabled:cursor-not-allowed
                      text-left
                    `}
                  >
                    {/* Hover glow effect */}
                    {!selectedAnswer && (
                      <motion.div
                        className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                        style={{
                          background: `radial-gradient(circle at center, ${
                            colors.bg.includes('blue')
                              ? 'rgba(59, 130, 246, 0.2)'
                              : colors.bg.includes('green')
                              ? 'rgba(16, 185, 129, 0.2)'
                              : colors.bg.includes('purple')
                              ? 'rgba(168, 85, 247, 0.2)'
                              : 'rgba(249, 115, 22, 0.2)'
                          }, transparent)`,
                        }}
                      />
                    )}

                    <div className="flex items-center gap-3 relative z-10">
                      {/* Option letter */}
                      <div
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black
                          ${showResult && isSelected && isCorrect ? 'bg-green-500 text-white' : ''}
                          ${showResult && isSelected && !isCorrect ? 'bg-red-500 text-white' : ''}
                          ${showResult && isCorrectAnswer && !isCorrect ? 'bg-green-500/50 text-white' : ''}
                          ${!showResult ? 'bg-white/10 text-white' : ''}
                        `}
                      >
                        {option}
                      </div>

                      {/* Option text */}
                      <div className="flex-1 text-base font-medium text-white">
                        {question.options[option]}
                      </div>

                      {/* Result icons */}
                      {showResult && isSelected && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="text-2xl"
                        >
                          {isCorrect ? '✓' : '✗'}
                        </motion.div>
                      )}
                      {showResult && isCorrectAnswer && !isSelected && !isCorrect && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="text-lg"
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>

                    {/* Shake animation for wrong answer */}
                    {showResult && isSelected && !isCorrect && (
                      <motion.div
                        animate={{ x: [-4, 4, -4, 4, 0] }}
                        transition={{ duration: 0.4 }}
                        className="absolute inset-0"
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Free Pass button */}
            {freePassAvailable && !selectedAnswer && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onUseFreePass}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-black text-sm shadow-lg transition-all"
              >
                🎫 USE FREE PASS
              </motion.button>
            )}

            {/* Result message */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  text-center py-2 px-4 rounded-lg font-bold text-sm
                  ${isCorrect ? 'text-green-300' : 'text-red-300'}
                `}
              >
                {isCorrect ? '🎉 Correct! Getting reward...' : '❌ Wrong answer! -10 points'}
              </motion.div>
            )}
          </div>

          {/* Bottom gradient accent */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  );
}
