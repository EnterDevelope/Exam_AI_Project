'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CTAButton from '@/components/common/CTAButton'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import type { QuizResult } from '@/types/quiz'

export default function QuizResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 로컬 스토리지에서 결과 가져오기 (실제로는 URL 파라미터나 상태 관리 사용)
    const storedResult = localStorage.getItem('quiz-result')
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    }
    setIsLoading(false)
  }, [])

  const handleReviewWrongAnswers = () => {
    router.push('/quiz/review')
  }

  const handleGoToMyPage = () => {
    router.push('/mypage')
  }

  const handleNewQuiz = () => {
    router.push('/summary')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            결과를 찾을 수 없습니다
          </h1>
          <CTAButton onClick={() => router.push('/summary')}>
            새 퀴즈 시작하기
          </CTAButton>
        </div>
      </div>
    )
  }

  const { correctAnswers, totalQuestions, accuracy, wrongAnswersCount } = result

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            퀴즈 완료!
          </h1>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 결과 요약 */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <div className="relative inline-flex items-center justify-center w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    stroke={accuracy >= 80 ? '#10b981' : accuracy >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * (1 - accuracy / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-in-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {accuracy}%
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {accuracy >= 80 ? '훌륭합니다!' : accuracy >= 60 ? '잘 했습니다!' : '더 노력해보세요!'}
            </h2>
            <p className="text-gray-600">
              {correctAnswers}개 정답 / {totalQuestions}개 문제
            </p>
          </div>

          {/* 상세 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {correctAnswers}
              </div>
              <div className="text-sm text-green-700">정답</div>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                {wrongAnswersCount}
              </div>
              <div className="text-sm text-red-700">오답</div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {totalQuestions}
              </div>
              <div className="text-sm text-blue-700">총 문제</div>
            </div>
          </div>

          {/* 피드백 메시지 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-3">학습 피드백</h3>
            {accuracy >= 80 ? (
              <p className="text-gray-700">
                정말 잘 이해하고 계시네요! 이번 주차 내용을 충분히 습득하셨습니다.
                다음 주차도 이렇게 열심히 해보세요!
              </p>
            ) : accuracy >= 60 ? (
              <p className="text-gray-700">
                기본적인 내용은 잘 이해하고 계시지만, 몇 가지 부분에서 더 보완이 필요합니다.
                오답 노트를 통해 부족한 부분을 복습해보세요.
              </p>
            ) : (
              <p className="text-gray-700">
                이번 주차 내용을 다시 한번 꼼꼼히 복습해보세요.
                오답 노트를 활용하여 취약한 부분을 집중적으로 학습하시면 도움이 될 것입니다.
              </p>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-4">
            {wrongAnswersCount > 0 && (
              <CTAButton
                variant="primary"
                onClick={handleReviewWrongAnswers}
                className="w-full"
              >
                📌 오답 복습 모드로 이동 ({wrongAnswersCount}개)
              </CTAButton>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CTAButton
                variant="ghost"
                onClick={handleGoToMyPage}
                className="w-full"
              >
                📚 마이페이지로 이동
              </CTAButton>
              
              <CTAButton
                variant="ghost"
                onClick={handleNewQuiz}
                className="w-full"
              >
                ✨ 새 퀴즈 시작하기
              </CTAButton>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 