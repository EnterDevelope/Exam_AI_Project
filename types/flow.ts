import type { SummaryData } from './summary';
import type { QuizData } from './quiz';

export type FlowStep =
  | 'upload'      // 파일 업로드 단계
  | 'processing'  // 처리 중 단계
  | 'summary'     // 요약 결과 단계
  | 'quiz'        // 퀴즈 단계
  | 'review'      // 복습 단계
  | 'complete';   // 완료 단계

export type SummaryStyle = 'simple' | 'detailed';

export interface FlowState {
  currentStep: FlowStep;
  subject: string;
  summaryStyle: SummaryStyle;
  rawText: string;
  summaryData: SummaryData | null;
  quizData: QuizData | null;
  error: string | null;
  isProcessing: boolean;
}
