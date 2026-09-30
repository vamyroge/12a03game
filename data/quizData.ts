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
  secretImage: '/quiz/characters/mystery-person.jpg',
  
  // 20 Questions for the puzzle game
  questions: [
    {
      id: 1,
      question: "What does 'break the ice' mean?",
      options: {
        A: "To physically break ice",
        B: "To make people feel more relaxed",
        C: "To interrupt someone",
        D: "To start a fight"
      },
      correctAnswer: "B"
    },
    {
      id: 2,
      question: "Which word means 'a short presentation'?",
      options: {
        A: "Pitch",
        B: "Catch",
        C: "Throw",
        D: "Pass"
      },
      correctAnswer: "A"
    },
    {
      id: 3,
      question: "What is a synonym for 'enthusiastic'?",
      options: {
        A: "Bored",
        B: "Tired",
        C: "Eager",
        D: "Lazy"
      },
      correctAnswer: "C"
    },
    {
      id: 4,
      question: "'To give a presentation' can also be said as:",
      options: {
        A: "To make a speech",
        B: "To do a talk",
        C: "To deliver a presentation",
        D: "All of the above"
      },
      correctAnswer: "D"
    },
    {
      id: 5,
      question: "What does 'audience engagement' mean?",
      options: {
        A: "Paying the audience",
        B: "Making the audience participate",
        C: "Ignoring the audience",
        D: "Dismissing the audience"
      },
      correctAnswer: "B"
    },
    {
      id: 6,
      question: "Which is NOT a presentation skill?",
      options: {
        A: "Eye contact",
        B: "Clear voice",
        C: "Mumbling",
        D: "Body language"
      },
      correctAnswer: "C"
    },
    {
      id: 7,
      question: "What does 'Q&A' stand for?",
      options: {
        A: "Quiet and Angry",
        B: "Questions and Answers",
        C: "Quick and Active",
        D: "Quality and Accuracy"
      },
      correctAnswer: "B"
    },
    {
      id: 8,
      question: "'To wrap up' means:",
      options: {
        A: "To start",
        B: "To continue",
        C: "To conclude",
        D: "To pause"
      },
      correctAnswer: "C"
    },
    {
      id: 9,
      question: "Which phrase shows confidence?",
      options: {
        A: "I think maybe...",
        B: "I'm not sure but...",
        C: "I strongly believe...",
        D: "Perhaps possibly..."
      },
      correctAnswer: "C"
    },
    {
      id: 10,
      question: "What is 'body language'?",
      options: {
        A: "Written language",
        B: "Sign language",
        C: "Non-verbal communication",
        D: "Foreign language"
      },
      correctAnswer: "C"
    },
    {
      id: 11,
      question: "'To elaborate' means:",
      options: {
        A: "To explain in more detail",
        B: "To skip details",
        C: "To summarize quickly",
        D: "To change topic"
      },
      correctAnswer: "A"
    },
    {
      id: 12,
      question: "Which is good for opening a presentation?",
      options: {
        A: "A relevant question",
        B: "Reading from notes",
        C: "Looking at the floor",
        D: "Speaking very quietly"
      },
      correctAnswer: "A"
    },
    {
      id: 13,
      question: "What does 'visual aid' mean?",
      options: {
        A: "Help from audience",
        B: "Slides or images to support presentation",
        C: "Eye glasses",
        D: "Stage lighting"
      },
      correctAnswer: "B"
    },
    {
      id: 14,
      question: "'Articulate' means:",
      options: {
        A: "Speaking unclearly",
        B: "Speaking clearly and effectively",
        C: "Speaking quietly",
        D: "Not speaking at all"
      },
      correctAnswer: "B"
    },
    {
      id: 15,
      question: "What should you do during a presentation?",
      options: {
        A: "Turn your back to audience",
        B: "Maintain eye contact",
        C: "Speak in monotone",
        D: "Rush through slides"
      },
      correctAnswer: "B"
    },
    {
      id: 16,
      question: "'Persuasive' means:",
      options: {
        A: "Boring",
        B: "Confusing",
        C: "Convincing",
        D: "Uncertain"
      },
      correctAnswer: "C"
    },
    {
      id: 17,
      question: "What does 'to address an audience' mean?",
      options: {
        A: "To write down addresses",
        B: "To speak to a group",
        C: "To send mail",
        D: "To ignore people"
      },
      correctAnswer: "B"
    },
    {
      id: 18,
      question: "Which is a transition phrase?",
      options: {
        A: "Moving on to...",
        B: "Hello everyone",
        C: "Thank you",
        D: "My name is"
      },
      correctAnswer: "A"
    },
    {
      id: 19,
      question: "'To summarize' means:",
      options: {
        A: "To add more details",
        B: "To give a brief overview",
        C: "To change the subject",
        D: "To ask questions"
      },
      correctAnswer: "B"
    },
    {
      id: 20,
      question: "What is 'stage fright'?",
      options: {
        A: "Fear of heights",
        B: "Fear of speaking in public",
        C: "Fear of darkness",
        D: "Fear of animals"
      },
      correctAnswer: "B"
    }
  ]
};
