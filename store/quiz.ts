import { create } from 'zustand';
import { Question } from '@/types/quiz';

interface QuizState {
  questions: Question[];
  currentIndex: number;
  userAnswers: string[];
  correctAnswers: number;
  isCompleted: boolean;
  
  // Actions
  setQuestions: (questions: Question[]) => void;
  setCurrentIndex: (index: number) => void;
  setUserAnswer: (index: number, answer: string) => void;
  setCorrectAnswers: (count: number) => void;
  setIsCompleted: (completed: boolean) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  questions: [],
  currentIndex: 0,
  userAnswers: [],
  correctAnswers: 0,
  isCompleted: false,

  setQuestions: (questions) => set({ 
    questions, 
    userAnswers: new Array(questions.length).fill(''),
    currentIndex: 0,
    correctAnswers: 0,
    isCompleted: false
  }),

  setCurrentIndex: (index) => set({ currentIndex: index }),

  setUserAnswer: (index, answer) => set((state) => {
    const newUserAnswers = [...state.userAnswers];
    newUserAnswers[index] = answer;
    return { userAnswers: newUserAnswers };
  }),

  setCorrectAnswers: (count) => set({ correctAnswers: count }),

  setIsCompleted: (completed) => set({ isCompleted: completed }),

  reset: () => set({
    questions: [],
    currentIndex: 0,
    userAnswers: [],
    correctAnswers: 0,
    isCompleted: false
  })
})); 