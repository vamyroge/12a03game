import questionData from './questions.json';

/**
 * Quiz Data Configuration
 * 
 * This file contains all quiz questions and the secret image path.
 * Edit this file to change questions or the secret image.
 * 
 * Requirements:
 * - Exactly 20 questions
 * - All options (A, B, C, D) must be present
 * - correctAnswer must be "A", "B", "C", or "D"
 * - Image must be in /public directory
 */

export interface QuizQuestion {
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

export interface QuizConfig {
  secretImage: string;
  questions: QuizQuestion[];
}

/**
 * Default quiz configuration
 * 
 * To change the secret image:
 * 1. Place your image in /public/quiz/characters/
 * 2. Update the secretImage path below
 * 
 * Example: secretImage: '/quiz/characters/your-image.jpg'
 */
export const QUIZ_CONFIG: QuizConfig = {
  // Secret image path (relative to /public)
  secretImage: '/quiz/characters/anhmoi3.png',
  
  // Questions are maintained in the JSON file so the quiz content is easy to replace.
  questions: questionData.map((item) => ({
    id: item.id,
    question: item.question,
    options: {
      A: item.options[0],
      B: item.options[1],
      C: item.options[2],
      D: item.options[3],
    },
    correctAnswer: ['A', 'B', 'C', 'D'][item.correctAnswer] as QuizQuestion['correctAnswer'],
  })),
};
