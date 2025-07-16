import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Question } from '@/types/quiz';
import type { ReviewState } from '@/types/quiz';

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      queue: [],
      currentIdx: 0,
      answers: {},
      mode: 'answering',
      sessionId: undefined,

      setQueue: (questions) => set({ queue: questions, currentIdx: 0 }),
      
      setCurrentIdx: (idx) => set({ currentIdx: idx }),
      
      setAnswer: (qid, isCorrect, concept) => set((state) => ({
        answers: {
          ...state.answers,
          [qid]: { isCorrect, concept }
        }
      })),
      
      next: () => set((state) => ({
        currentIdx: Math.min(state.currentIdx + 1, state.queue.length - 1)
      })),
      
      prev: () => set((state) => ({
        currentIdx: Math.max(state.currentIdx - 1, 0)
      })),
      
      reset: () => set({
        queue: [],
        currentIdx: 0,
        answers: {},
        mode: 'answering',
        sessionId: undefined
      }),
      
      setMode: (mode) => set({ mode }),
      
      setSessionId: (sessionId) => set({ sessionId })
    }),
    {
      name: 'review-session',
      partialize: (state) => ({
        queue: state.queue,
        currentIdx: state.currentIdx,
        answers: state.answers,
        mode: state.mode,
        sessionId: state.sessionId
      })
    }
  )
); 