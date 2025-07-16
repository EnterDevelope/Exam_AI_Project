export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export interface SummaryRequest {
  file: File;
  userId: string;
}

export interface SummaryResponse {
  id: string;
  content: string;
  createdAt: string;
}

export interface QuizRequest {
  summaryId: string;
  userId: string;
}

export interface QuizResponse {
  id: string;
  questions: Question[];
  createdAt: string;
}

import type { Question } from './quiz';

export interface FeedbackRequest {
  quizId: string;
  answers: Record<string, string>;
  userId: string;
}

export interface FeedbackResponse {
  score: number;
  feedback: Record<string, string>;
  correctAnswers: Record<string, string>;
} 