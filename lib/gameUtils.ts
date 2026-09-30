import { RewardType } from './types';

export const REWARD_POOL: RewardType[] = [
  { type: 'points', value: 10 },
  { type: 'points', value: 10 },
  { type: 'points', value: 20 },
  { type: 'points', value: 20 },
  { type: 'points', value: 30 },
  { type: 'points', value: 50 },
  { type: 'points', value: -10 },
  { type: 'points', value: -20 },
  { type: 'freePass' },
  { type: 'doubleNext' },
  { type: 'openExtra' },
];

export const getRandomReward = (): RewardType => {
  return REWARD_POOL[Math.floor(Math.random() * REWARD_POOL.length)];
};

export const GROUP_COLORS = {
  1: { bg: 'bg-blue-500', text: 'text-blue-500', glow: 'shadow-blue-500/50' },
  2: { bg: 'bg-green-500', text: 'text-green-500', glow: 'shadow-green-500/50' },
  3: { bg: 'bg-purple-500', text: 'text-purple-500', glow: 'shadow-purple-500/50' },
  4: { bg: 'bg-orange-500', text: 'text-orange-500', glow: 'shadow-orange-500/50' },
};

export const validateQuestions = (data: unknown): { valid: boolean; error?: string } => {
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Questions must be an array' };
  }

  if (data.length !== 16) {
    return { valid: false, error: `Must have exactly 16 questions (found ${data.length})` };
  }

  for (let i = 0; i < data.length; i++) {
    const q = data[i];
    
    if (!q.id || typeof q.id !== 'number') {
      return { valid: false, error: `Question ${i + 1}: Missing or invalid id` };
    }
    
    if (!q.question || typeof q.question !== 'string') {
      return { valid: false, error: `Question ${i + 1}: Missing or invalid question text` };
    }
    
    if (!q.options || typeof q.options !== 'object') {
      return { valid: false, error: `Question ${i + 1}: Missing options` };
    }
    
    if (!q.options.A || !q.options.B || !q.options.C || !q.options.D) {
      return { valid: false, error: `Question ${i + 1}: Must have options A, B, C, and D` };
    }
    
    if (!['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
      return { valid: false, error: `Question ${i + 1}: correctAnswer must be A, B, C, or D` };
    }
  }

  return { valid: true };
};

export const formatReward = (reward: RewardType): string => {
  if (reward.type === 'points') {
    return reward.value > 0 ? `+${reward.value}` : `${reward.value}`;
  }
  if (reward.type === 'freePass') return 'FREE PASS';
  if (reward.type === 'doubleNext') return 'DOUBLE NEXT';
  if (reward.type === 'openExtra') return 'OPEN EXTRA';
  return '';
};

export const getRewardIcon = (reward: RewardType): string => {
  if (reward.type === 'points') {
    return reward.value > 0 ? '🎁' : '💥';
  }
  if (reward.type === 'freePass') return '🎫';
  if (reward.type === 'doubleNext') return '✨';
  if (reward.type === 'openExtra') return '🔓';
  return '🎁';
};
