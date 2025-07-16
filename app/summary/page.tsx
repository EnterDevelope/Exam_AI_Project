'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFlowStore } from '@/store/flow';
import SummaryResultView from '@/components/features/summary/SummaryResultView';
import QuizCard from '@/components/features/quiz/QuizCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBanner from '@/components/common/ErrorBanner';
import FileUploader from '@/components/common/FileUploader';
import type { WrongAnswer } from '@/types/quiz';
import { useAuth } from '@/components/auth/AuthProvider';

export default function SummaryPage() {
  const router = useRouter();
  const auth = useAuth();
  if (!auth) {
    throw new Error('useAuth() returned undefined! Context 연결 문제');
  }
  const { user, isLoading } = useAuth();
  console.log('[SummaryPage] useAuth:', { user, isLoading });
  console.log('SummaryPage 렌더링됨', { user, isLoading, pathname: typeof window !== 'undefined' ? window.location.pathname : '', search: typeof window !== 'undefined' ? window.location.search : '' });
  const summaryData = useFlowStore((s) => s.summaryData);
  const quizData = useFlowStore((s) => s.quizData);
  const currentStep = useFlowStore((s) => s.currentStep);
  const setQuizData = useFlowStore((s) => s.setQuizData);

  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGetQuiz = async () => {
    if (!summaryData) return;
    try {
      setLoadingId('quiz');
      setError(null);
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: summaryData.content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '퀴즈 생성 실패');
      setQuizData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  };

  const handleWrong = async ({ questionId, userAnswer }: { questionId: string; userAnswer: string }) => {
    const question = quizData?.questions.find((q) => q.id === questionId);
    if (!quizData || !question || !summaryData) return;
    setWrongAnswers((prev) => [
      ...prev,
      {
        quiz_id: '',
        user_id: user?.id ?? '',
        question_index: quizData.questions.findIndex(q => q.id === questionId),
        user_answer: userAnswer,
        correct_answer: question.correct_answer,
        explanation: '',
      }
    ]);
    try {
      setLoadingId(questionId);
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: question.question,
          userAnswer,
          correctAnswer: question.correct_answer,
          summary: summaryData.content,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedbacks((f) => ({ ...f, [questionId]: data.explanation }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  // 인증 체크
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/login?next=/summary');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    console.log('SummaryPage: isLoading true, 스피너만 렌더링');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    console.log('SummaryPage: user 없음, null 반환');
    return null;
  }

  if (!summaryData) {
    console.log('SummaryPage: summaryData 없음, 업로드 안내만 렌더링');
    return (
      <div className="max-w-lg mx-auto py-16 text-center space-y-6">
        <p className="text-lg text-gray-700 font-semibold">
          요약 데이터가 없습니다.<br />파일을 업로드해 주세요.
        </p>
        <FileUploader />
      </div>
    );
  }

  console.log('SummaryPage: 메인 콘텐츠 렌더링', { user, isLoading });
  return (
    <div className="space-y-6">
      {error && <ErrorBanner message={error} />}
      <div className="grid lg:grid-cols-10 gap-8">
        <div className="lg:col-span-7">
          <SummaryResultView summary={summaryData.content} />
        </div>
        <div className="lg:col-span-3">
          {!quizData ? (
            <div className="space-y-4">
              <button className="btn-primary w-full" onClick={handleGetQuiz} disabled={!!loadingId}>
                퀴즈 생성하기
              </button>
              {loadingId === 'quiz' && <LoadingSpinner />}
            </div>
          ) : (
            <div>
              {quizData.questions.map((q) => (
                <div key={q.id} className="mb-4">
                  <QuizCard question={q} onWrong={handleWrong} />
                  {loadingId === q.id && <LoadingSpinner />}
                  {feedbacks[q.id] && (
                    <p className="text-sm text-gray-600 mt-1">해설: {feedbacks[q.id]}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {quizData && (
        <div className="flex gap-2 justify-end pt-4">
          <button className="btn-secondary">전체 요약+퀴즈 PDF로 저장</button>
          <button className="btn-primary" onClick={() => router.push('/quiz/review')}>
            오답 복습 모드로 전환
          </button>
        </div>
      )}
    </div>
  );
}
