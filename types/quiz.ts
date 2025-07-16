export type Question = {
  id: string
  type: 'multiple' | 'short'
  question: string
  options?: string[]
  correct_answer: string
  explanation?: string
  concept?: string
  answer: string;
};

export interface QuizData {
  questions: Question[]
}

export interface QuizResult {
  quizId: string
  correctAnswers: number
  totalQuestions: number
  accuracy: number
  wrongAnswersCount: number
}

export interface QuizCompleteRequest {
  questions: Question[]
  userAnswers: string[]
  correctAnswers: number
  totalQuestions: number
  subject: string
  week: string
}

export interface WrongAnswer {
  quiz_id: string
  user_id: string
  question_index: number
  user_answer: string
  correct_answer: string
  explanation?: string
}

export interface QuizFeedback {
  isCorrect: boolean
  explanation?: string
  correctAnswer?: string
}

export type WrongQuestion = Question & {
  userAnswer: string;
  wrong_count?: number;
  last_wrong_at?: string;
};

export interface QuizCardProps {
  question: Question;
  index?: number;
  total?: number;
  onAnswerSubmit?: (answer: string) => void;
  userAnswer?: string;
  mode?: 'quiz' | 'review';
  onAnswerChange?: (answer: string) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  showCorrectAnswer?: boolean;
  onWrong?: (args: { questionId: string; userAnswer: string }) => void | Promise<void>;
}

export type QuizState = {
  subject: string;
  week: string;
  summaryContent: string;
  currentQuestionIndex: number;
  userAnswers: string[];
  correctAnswers: number;
  totalQuestions: number;
  isCompleted: boolean;
  questions: Question[] | null;
  isLoading: boolean;
  error: string | null;
  setQuizData: (data: { subject: string; week: string; summaryContent: string }) => void;
  setQuestions: (questions: Question[] | null) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswer: (questionIndex: number, answer: string) => void;
  setCorrectAnswers: (count: number) => void;
  setCompleted: (completed: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetQuiz: () => void;
};

export type ReviewState = {
  queue: Question[];
  currentIdx: number;
  answers: Record<string, { isCorrect: boolean; concept?: string }>;
  mode: 'answering' | 'feedback' | 'complete';
  sessionId?: string;
  setQueue: (questions: Question[]) => void;
  setCurrentIdx: (idx: number) => void;
  setAnswer: (qid: string, isCorrect: boolean, concept?: string) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  setMode: (mode: 'answering' | 'feedback' | 'complete') => void;
  setSessionId: (sessionId: string) => void;
}; 