import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Question } from '@/types/quiz';
import type { QuizState } from '@/types/quiz';

const initialState = {
  subject: '',
  week: '',
  summaryContent: '',
  currentQuestionIndex: 0,
  userAnswers: [],
  correctAnswers: 0,
  totalQuestions: 0,
  isCompleted: false,
  questions: null,
  isLoading: false,
  error: null,
};

export const useQuizStore = create<QuizState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setQuizData: (data) => set({
        subject: data.subject,
        week: data.week,
        summaryContent: data.summaryContent,
      }),
      
      setQuestions: (questions) => set({
        questions,
        totalQuestions: questions?.length || 0,
        userAnswers: new Array(questions?.length || 0).fill(''),
        currentQuestionIndex: 0,
        correctAnswers: 0,
        isCompleted: false,
      }),
      
      setCurrentQuestionIndex: (index) => set({
        currentQuestionIndex: index,
      }),
      
      setUserAnswer: (questionIndex, answer) => {
        const { userAnswers, questions } = get()
        const newAnswers = [...userAnswers]
        newAnswers[questionIndex] = answer
        
        // 정답 확인
        const currentQuestion = questions?.[questionIndex]
        const isCorrect = currentQuestion && answer === currentQuestion.answer
        
        set({
          userAnswers: newAnswers,
          correctAnswers: isCorrect 
            ? get().correctAnswers + 1 
            : get().correctAnswers,
        })
      },
      
      setCorrectAnswers: (count) => set({
        correctAnswers: count,
      }),
      
      setCompleted: (completed) => set({
        isCompleted: completed,
      }),
      
      setLoading: (loading) => set({
        isLoading: loading,
      }),
      
      setError: (error) => set({
        error,
      }),
      
      resetQuiz: () => set(initialState),
    }),
    {
      name: 'quiz-storage',
      partialize: (state) => ({
        subject: state.subject,
        week: state.week,
        summaryContent: state.summaryContent,
        questions: state.questions,
        userAnswers: state.userAnswers,
        correctAnswers: state.correctAnswers,
        totalQuestions: state.totalQuestions,
        currentQuestionIndex: state.currentQuestionIndex,
        isCompleted: state.isCompleted,
      }),
    }
  )
) 