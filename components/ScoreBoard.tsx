'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { GroupId } from '@/lib/types';
import { GROUP_COLORS } from '@/lib/gameUtils';
import { useEffect } from 'react';

interface ScoreBoardProps {
  scores: Record<GroupId, number>;
  currentGroup: GroupId;
}

function AnimatedScore({ score }: { score: number }) {
  const springValue = useSpring(0, { damping: 20, stiffness: 100 });
  const display = useTransform(springValue, (latest) => Math.round(latest));

  useEffect(() => {
    springValue.set(score);
  }, [score, springValue]);

  return (
    <motion.span className="tabular-nums">
      {display}
    </motion.span>
  );
}

export default function ScoreBoard({ scores, currentGroup }: ScoreBoardProps) {
  const sortedGroups = ([1, 2, 3, 4] as GroupId[]).sort((a, b) => scores[b] - scores[a]);

  return (
    <div className="w-full max-w-xl">
      {/* Compact scoreboard - reduced by 15% */}
      <div className="grid grid-cols-4 gap-1.5">
        {([1, 2, 3, 4] as GroupId[]).map((groupId) => {
          const colors = GROUP_COLORS[groupId];
          const isActive = currentGroup === groupId;
          const rank = sortedGroups.indexOf(groupId) + 1;

          return (
            <motion.div
              key={groupId}
              layout
              animate={
                isActive
                  ? {
                      scale: [1, 1.05, 1],
                      y: [0, -4, 0],
                    }
                  : { scale: 1, y: 0 }
              }
              transition={
                isActive
                  ? { duration: 0.5, repeat: Infinity }
                  : { duration: 0.3 }
              }
              className={`
                relative rounded-lg p-2 backdrop-blur-sm
                ${isActive ? 'ring-2 ring-white shadow-lg' : 'shadow-md'}
                transition-all duration-300
              `}
              style={{
                background: isActive
                  ? `linear-gradient(135deg, ${colors.bg.replace('bg-', 'rgb(var(--')}500)) 0%, ${colors.bg.replace('bg-', 'rgb(var(--')}700)) 100%)`
                  : 'rgba(255, 255, 255, 0.05)',
                borderWidth: '1px',
                borderColor: isActive ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Rank badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-[10px] font-black text-white shadow-lg"
              >
                {rank}
              </motion.div>

              {/* Glow effect when active */}
              {isActive && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-xl blur-lg -z-10"
                  style={{
                    background: colors.bg.includes('blue')
                      ? 'rgba(59, 130, 246, 0.5)'
                      : colors.bg.includes('green')
                      ? 'rgba(34, 197, 94, 0.5)'
                      : colors.bg.includes('purple')
                      ? 'rgba(168, 85, 247, 0.5)'
                      : 'rgba(249, 115, 22, 0.5)',
                  }}
                />
              )}

              {/* Group label */}
              <div className="text-[10px] font-bold text-white/70 mb-0.5">
                Group {groupId}
              </div>

              {/* Score with counting animation */}
              <div className="text-xl font-black text-white">
                <AnimatedScore score={scores[groupId]} />
              </div>

              {/* Current turn indicator */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[9px] font-bold text-yellow-300 mt-0.5"
                >
                  YOUR TURN
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Leader indicator */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-2 text-center"
      >
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
          <span className="text-[10px] text-white/60">Leader:</span>
          <span className={`text-xs font-bold ${GROUP_COLORS[sortedGroups[0]].text}`}>
            Group {sortedGroups[0]}
          </span>
          <span className="text-xs font-black text-white">
            {scores[sortedGroups[0]]} pts
          </span>
        </div>
      </motion.div>
    </div>
  );
}
