'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { GroupId } from '@/lib/types';
import { GROUP_COLORS } from '@/lib/gameUtils';

interface ScoreBoardProps {
  scores: Record<GroupId, number>;
  currentGroup: GroupId;
}

export default function ScoreBoard({ scores, currentGroup }: ScoreBoardProps) {
  const groups: GroupId[] = [1, 2, 3, 4];

  return (
    <div className="grid grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
      {groups.map((groupId) => {
        const isCurrent = groupId === currentGroup;
        const colors = GROUP_COLORS[groupId];

        return (
          <motion.div
            key={groupId}
            animate={{
              scale: isCurrent ? 1.05 : 1,
              y: isCurrent ? -8 : 0,
            }}
            className={`${
              isCurrent ? 'bg-white/20' : 'bg-white/10'
            } backdrop-blur-lg rounded-2xl p-6 border-2 ${
              isCurrent ? 'border-white' : 'border-white/20'
            } transition-all shadow-xl ${isCurrent ? colors.glow : ''}`}
          >
            <div className="text-center">
              <div className={`text-2xl font-bold ${colors.text} mb-2`}>
                GROUP {groupId}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={scores[groupId]}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="text-5xl font-black text-white"
                >
                  {scores[groupId]}
                </motion.div>
              </AnimatePresence>
              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 text-sm font-bold text-yellow-300"
                >
                  ▶ YOUR TURN
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
