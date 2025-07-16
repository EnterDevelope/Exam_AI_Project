'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useReviewStore } from '@/store/review';
import { useAuthStore } from '@/store/auth';
import { fetchWrongList, postReviewFeedback, completeReview } from '@/lib/api/quizzes';
import { Question, QuizFeedback } from '@/types/quiz';
import ReviewHeader from '@/components/features/quiz/ReviewHeader';
import WrongListDrawer from '@/components/features/quiz/WrongListDrawer';
import BottomBar from '@/components/features/quiz/BottomBar';
import QuizCard from '@/components/features/quiz/QuizCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBanner from '@/components/common/ErrorBanner';
import type { WrongQuestion } from '@/types/quiz';

export default function ReviewClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  
  const { user, session } = useAuthStore();
  const token = session?.access_token;
  const {
    queue,
    currentIdx,
    answers,
    mode,
    setQueue,
    setCurrentIdx,
    setAnswer,
    next,
    prev,
    reset,
    setMode,
    setSessionId
  } = useReviewStore();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wrongGroups, setWrongGroups] = useState<Record<string, WrongQuestion[]>>({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 인증 확인
  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
      return;
    }
  }, [user, token, router]);

  // 오답 목록 로드
  useEffect(() => {
    const loadWrongList = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetchWrongList(sessionId || undefined) as { questions: WrongQuestion[] };
        const questions: WrongQuestion[] = response.questions || [];
        
        if (questions.length === 0) {
          setError('복습할 오답이 없습니다.');
          return;
        }

        // 개념별 그룹핑
        const groups = questions.reduce((acc, question) => {
          const concept = question.concept || '기타';
          if (!acc[concept]) {
            acc[concept] = [];
          }
          acc[concept].push(question);
          return acc;
        }, {} as Record<string, WrongQuestion[]>);

        setWrongGroups(groups);
        
        // 랜덤 셔플하여 큐에 설정
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        setQueue(shuffledQuestions);
        
        if (sessionId) {
          setSessionId(sessionId);
        }
        
        setMode('answering');
      } catch (err) {
        console.error('오답 목록 로드 오류:', err);
        setError('오답 목록을 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && token) {
      loadWrongList();
    }
  }, [user, token, sessionId, setQueue, setMode, setSessionId]);

  // 현재 문제
  const currentQuestion = queue[currentIdx];

  // 진행률 계산
  const progress = queue.length > 0 ? ((currentIdx + 1) / queue.length) * 100 : 0;

  // 정답 확인
  const handleCheckAnswer = async () => {
    if (!currentQuestion || !currentAnswer.trim()) return;

    try {
      setIsSubmitting(true);
      
      const isCorrect = currentAnswer === currentQuestion.correct_answer;
      
      // 답변 저장
      setAnswer(currentQuestion.id, isCorrect, currentQuestion.concept);
      
      // 피드백 요청
      const feedbackData = await postReviewFeedback({
        questionId: currentQuestion.id,
        userAnswer: currentAnswer,
        isCorrect,
        sessionId: sessionId || undefined
      });
      
      setFeedback(feedbackData);
      setMode('feedback');
      
      // 정답이면 0.3초 후 자동 다음
      if (isCorrect) {
        setTimeout(() => {
          handleNext();
        }, 300);
      }
    } catch (err) {
      console.error('정답 확인 오류:', err);
      setError('정답을 확인하는데 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 다음 문제
  const handleNext = () => {
    if (currentIdx < queue.length - 1) {
      next();
      setCurrentAnswer('');
      setFeedback(null);
      setMode('answering');
    } else {
      // 복습 완료
      handleComplete();
    }
  };

  // 복습 완료
  const handleComplete = async () => {
    try {
      const correctAnswers = Object.values(answers).filter(a => a.isCorrect).length;
      const concepts = [
        ...new Set(
          Object.values(answers)
            .map(a => a.concept)
            .filter((c): c is string => !!c)
        )
      ];
      
      await completeReview({
        sessionId: sessionId || undefined,
        totalQuestions: queue.length,
        correctAnswers,
        concepts
      });

      setMode('complete');
      
      // 3초 후 마이페이지로 이동
      setTimeout(() => {
        router.push('/mypage');
      }, 3000);
    } catch (err) {
      console.error('복습 완료 오류:', err);
      setError('복습 완료 처리에 실패했습니다.');
    }
  };

  // 문제 선택
  const handleQuestionPick = (questionId: string) => {
    const questionIndex = queue.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      setCurrentIdx(questionIndex);
      setCurrentAnswer('');
      setFeedback(null);
      setMode('answering');
      setIsDrawerOpen(false);
    }
  };

  // 나가기 처리
  const handleExit = () => {
    reset();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (mode === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">복습 완료!</h2>
          <p className="text-gray-600 mb-4">
            정답률: {Math.round((Object.values(answers).filter(a => a.isCorrect).length / queue.length) * 100)}%
          </p>
          <p className="text-sm text-gray-500">
            마이페이지로 이동합니다...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ReviewHeader
        progress={progress}
        onExit={handleExit}
      />
      
      <div className="flex h-screen pt-20 pb-24">
        {/* 드로어 */}
        <WrongListDrawer
          groups={wrongGroups}
          currentQuestionId={currentQuestion?.id}
          onPick={handleQuestionPick}
          isOpen={isDrawerOpen}
          onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        />
        
        {/* 메인 패널 */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-4 max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {mode === 'answering' && (
                    <QuizCard
                      question={currentQuestion}
                      mode="review"
                      userAnswer={currentAnswer}
                      onAnswerChange={setCurrentAnswer}
                      onSubmit={handleCheckAnswer}
                      isSubmitting={isSubmitting}
                    />
                  )}
                  
                  {mode === 'feedback' && feedback && (
                    <div className="space-y-4">
                      <QuizCard
                        question={currentQuestion}
                        mode="review"
                        userAnswer={currentAnswer}
                        onAnswerChange={setCurrentAnswer}
                        onSubmit={handleCheckAnswer}
                        isSubmitting={isSubmitting}
                        showCorrectAnswer
                      />
                      
                      <motion.div
                        className={`p-4 rounded-lg border ${
                          feedback.isCorrect
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          {feedback.isCorrect ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                          <span className={`font-medium ${
                            feedback.isCorrect ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {feedback.isCorrect ? '정답입니다!' : '틀렸습니다.'}
                          </span>
                        </div>
                        
                        {feedback.explanation && (
                          <div className="prose prose-sm max-w-none">
                            <div 
                              className="text-gray-700"
                              dangerouslySetInnerHTML={{ __html: feedback.explanation }}
                            />
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      <BottomBar
        onPrev={prev}
        onNext={handleNext}
        onCheckAnswer={handleCheckAnswer}
        isFirst={currentIdx === 0}
        isLast={currentIdx === queue.length - 1}
        mode={mode}
        hasAnswer={!!currentAnswer.trim()}
      />
      
      {/* 모바일 드로어 토글 버튼 */}
      <button
        onClick={() => setIsDrawerOpen(!isDrawerOpen)}
        className="fixed top-20 left-4 z-30 lg:hidden bg-white rounded-full p-2 shadow-lg border border-gray-200"
        aria-label="오답 목록"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
} 