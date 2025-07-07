export interface QuizData {
  id: string;
  questions: Question[];
  createdAt: string;
  summaryId: string;
  prompt?: string;
}

export interface Question {
  id: string;
  type: 'multiple' | 'short';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  relatedHighlightId?: string;
}

export interface QuizResult {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  wrongAnswers: WrongAnswer[];
  timeSpent: number;
}

export interface WrongAnswer {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
} 