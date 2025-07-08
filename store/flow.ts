import { create } from 'zustand';
import type { FlowState, FlowStep } from '@/types/flow';
import type { SummaryData, QuizData } from '@/types';

interface FlowStore extends FlowState {
  setStep: (step: FlowStep) => void;
  setSubject: (subject: string) => void;
  setRawText: (text: string) => void;
  setSummaryData: (data: SummaryData | null) => void;
  setQuizData: (data: QuizData | null) => void;
  setError: (error: string | null) => void;
  setProcessing: (isProcessing: boolean) => void;
  reset: () => void;
}

const initialState: FlowState = {
  currentStep: 'upload',
  subject: '',
  summaryStyle: 'simple',
  rawText: '',
  summaryData: null,
  quizData: null,
  error: null,
  isProcessing: false,
};

export const useFlowStore = create<FlowStore>()((set) => ({
  ...initialState,
  
  setStep: (step) => set({ currentStep: step }),
  setSubject: (subject) => set({ subject }),
  setRawText: (text) => set({ rawText: text }),
  setSummaryData: (data) => set({ summaryData: data }),
  setQuizData: (data) => set({ quizData: data }),
  setError: (error) => set({ error }),
  setProcessing: (isProcessing) => set({ isProcessing }),
  reset: () => set(initialState),
})); 