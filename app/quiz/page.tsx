'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QuizCard from '@/components/features/quiz/QuizCard'
import QuizFeedbackCard from '@/components/features/quiz/QuizFeedbackCard'
import StepProgress from '@/components/common/StepProgress'
import CTAButton from '@/components/common/CTAButton'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBanner from '@/components/common/ErrorBanner'
import { useQuizStore } from '@/store/quiz'
import type { QuizData } from '@/types/quiz'

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)

  const { subject, week, summaryContent } = useQuizStore()

  // 퀴즈 데이터 가져오기
  useEffect(() => {
    // 개발 환경에서 Mock 데이터 사용
    if (process.env.NODE_ENV === 'development' && !summaryContent) {
      const mockData: QuizData = {
        questions: [
          {
            id: '1',
            type: 'multiple',
            question: 'JavaScript에서 배열을 생성하는 방법이 아닌 것은?',
            options: ['Array()', '[]', 'new Array()', 'array()'],
            correct_answer: 'Array',
            explanation: 'JavaScript에서 배열을 생성하는 방법은 [], Array(), new Array() 등이 있습니다. array()는 올바른 방법이 아닙니다.'
          },
          {
            id: '2',
            type: 'multiple',
            question: 'HTML과 CSS의 관계는?',
            options: ['HTML이 CSS를 포함한다', 'CSS가 HTML을 포함한다', '둘 다', '서로 독립적이다'],
            correct_answer: '둘 다',
            explanation: 'HTML은 구조를, CSS는 스타일을 담당하지만 서로 연관되어 있습니다.'
          },
          {
            id: '3',
            type: 'short',
            question: '웹 페이지에서 이미지를 표시하는 HTML 태그는?',
            correct_answer: 'img',
            explanation: 'HTML에서 이미지를 표시하는 태그는 <img>입니다.'
          }
        ]
      };
      
      setQuizData(mockData);
      return;
    }

    if (!summaryContent) {
      router.push('/summary')
      return
    }

    const generateQuiz = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: summaryContent,
            subject,
            week
          }),
        })

        if (!response.ok) {
          throw new Error('퀴즈 생성에 실패했습니다.')
        }

        const data = await response.json()
        setQuizData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '퀴즈 생성 중 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    generateQuiz()
  }, [summaryContent, subject, week, router])

  // 답안 제출 처리
  const handleAnswerSubmit = async (answer: string) => {
    if (!quizData) return

    const newAnswers = [...userAnswers]
    newAnswers[currentQuestionIndex] = answer
    setUserAnswers(newAnswers)

    // 즉시 채점 모드
    setShowFeedback(true)

    // 정답 확인
    const currentQuestion = quizData.questions[currentQuestionIndex]
          if (answer === currentQuestion.correct_answer) {
      setCorrectAnswers(prev => prev + 1)
    }
  }

  // 다음 문제로 이동
  const handleNext = () => {
    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowFeedback(false)
    } else {
      // 마지막 문제 완료
      setIsCompleted(true)
    }
  }

  // 이전 문제로 이동
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
      setShowFeedback(false)
    }
  }

  // 퀴즈 결과 저장
  const handleComplete = async () => {
    if (!quizData) return

    try {
      const response = await fetch('/api/quiz/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questions: quizData.questions,
          userAnswers,
          correctAnswers,
          totalQuestions: quizData.questions.length,
          subject,
          week
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // 결과를 로컬 스토리지에 저장
        localStorage.setItem('quiz-result', JSON.stringify({
          quizId: result.quizId,
          correctAnswers: result.correctAnswers,
          totalQuestions: result.totalQuestions,
          accuracy: result.accuracy,
          wrongAnswersCount: result.wrongAnswersCount
        }))
        
        // 결과 페이지로 이동
        router.push('/quiz/result')
      }
    } catch (err) {
      console.error('퀴즈 결과 저장 실패:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorBanner message={error} />
      </div>
    )
  }

  if (!quizData) {
    return null
  }

  const currentQuestion = quizData.questions[currentQuestionIndex]
  const totalQuestions = quizData.questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 전역 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                {subject} {week ? `${week}주차` : ''} 퀴즈
              </h1>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                홈
              </button>
              <button
                onClick={() => router.push('/mypage')}
                className="text-gray-600 hover:text-gray-900"
              >
                마이페이지
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 퀴즈 헤더 영역 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {currentQuestionIndex + 1} / {totalQuestions}
              </span>
              <StepProgress current={currentQuestionIndex + 1} total={totalQuestions} />
            </div>
            <div className="text-sm text-gray-600">
              정답률: {Math.round((correctAnswers / (currentQuestionIndex + 1)) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 문제 카드 */}
          <div>
            <QuizCard
              question={currentQuestion}
              index={currentQuestionIndex}
              total={totalQuestions}
              onAnswerSubmit={handleAnswerSubmit}
              userAnswer={userAnswers[currentQuestionIndex]}
            />
          </div>

          {/* 정답/해설 패널 */}
          {showFeedback && (
            <div>
              <QuizFeedbackCard
                question={currentQuestion}
                userAnswer={userAnswers[currentQuestionIndex]}
                isCorrect={userAnswers[currentQuestionIndex] === currentQuestion.correct_answer}
              />
            </div>
          )}
        </div>
      </main>

      {/* 하단 내비게이션 바 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <CTAButton
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                이전
              </CTAButton>
              <CTAButton
                variant="ghost"
                onClick={handleNext}
                disabled={!showFeedback}
              >
                다음
              </CTAButton>
            </div>
            
            <div className="flex space-x-3">
              {isCompleted ? (
                <CTAButton
                  variant="primary"
                  onClick={handleComplete}
                >
                  퀴즈 완료
                </CTAButton>
              ) : (
                <CTAButton
                  variant="ghost"
                  onClick={() => router.push('/mypage')}
                >
                  저장 후 종료
                </CTAButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 