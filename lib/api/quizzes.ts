import { client } from './client';
import { Question, QuizFeedback, QuizResult } from '@/types/quiz';

// 복습 모드 API 함수들
export const fetchWrongList = async (sessionId?: string) => {
  const params = sessionId ? `?sessionId=${sessionId}` : '';
  const response = await client.get(`/api/quizzes/wrong${params}`);
  return response.data;
};

export const postReviewFeedback = async (data: {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  sessionId?: string;
}) => {
  const response = await client.post('/api/quiz/feedback', data);
  return response.data as QuizFeedback;
};

export const completeReview = async (data: {
  sessionId?: string;
  totalQuestions: number;
  correctAnswers: number;
  concepts: string[];
}) => {
  const response = await client.put('/api/quizzes/review-complete', data);
  return response.data;
}; 