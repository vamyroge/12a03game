export interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export type GroupId = 1 | 2 | 3 | 4;

export interface GroupScore {
  groupId: GroupId;
  score: number;
}

export type RewardType = 
  | { type: 'points'; value: number }
  | { type: 'freePass' }
  | { type: 'doubleNext' }
  | { type: 'openExtra' };

export type GamePhase = 
  | 'PLAYING'
  | 'QUESTION'
  | 'ANSWER_RESULT'
  | 'REWARD'
  | 'LUCKY_WHEEL'
  | 'CHEST'
  | 'FINISHED';

export type WheelSegment = 'CLAPPING_HAND' | 'BIG_CHEST';

export interface GameState {
  phase: GamePhase;
  currentGroup: GroupId;
  currentTileIndex: number | null;
  openedTiles: Set<number>;
  scores: Record<GroupId, number>;
  questions: Question[];
  secretImageUrl: string | null;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
  currentReward: RewardType | null;
  luckyWheelUnlocked: boolean;
  luckyWheelSpinCount: number;
  turnCount: number;
  doubleNextReward: boolean;
  freePassAvailable: boolean;
}
