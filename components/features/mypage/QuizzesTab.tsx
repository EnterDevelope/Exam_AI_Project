'use client'

import { useState, useEffect } from 'react'
import QuizHistoryChart from './QuizHistoryChart'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBanner from '@/components/common/ErrorBanner'

interface QuizHistory {
  id: string
  subject: string
  week: string
  score: number
  totalQuestions: number
  correctAnswers: number
  completedAt: string
  wrongAnswersCount: number
}

export default function QuizzesTab() {
  const [quizzes, setQuizzes] = useState<QuizHistory[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const params = new URLSearchParams()
        if (selectedSubject !== 'all') params.append('subject', selectedSubject)
        if (selectedPeriod !== 'all') params.append('period', selectedPeriod)
        
        const url = `/api/quizzes${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('퀴즈 히스토리 조회에 실패했습니다.')
        }
        
        const data = await response.json()
        setQuizzes(data)
      } catch (err) {
        setError('퀴즈 히스토리를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuizzes()
  }, [selectedSubject, selectedPeriod])

  // 필터링된 퀴즈 목록
  const filteredQuizzes = quizzes.filter(quiz => {
    const subjectMatch = selectedSubject === 'all' || quiz.subject === selectedSubject
    const periodMatch = selectedPeriod === 'all' || true // 기간 필터 로직 추가 가능
    return subjectMatch && periodMatch
  })

  // 고유한 과목 목록 추출
  const subjects = ['all', ...Array.from(new Set(quizzes.map(q => q.subject)))]

  // 통계 계산
  const totalQuizzes = quizzes.length
  const averageScore = Math.round(quizzes.reduce((acc, q) => acc + q.score, 0) / totalQuizzes)
  const maxScore = Math.max(...quizzes.map(q => q.score))
  const perfectScores = quizzes.filter(q => q.score === 100).length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <ErrorBanner message={error} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 필터 및 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">퀴즈 히스토리</h2>
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">과목:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {subjects.map(subject => (
              <option key={subject} value={subject}>
                {subject === 'all' ? '전체' : subject}
              </option>
            ))}
          </select>
          <label className="text-sm font-medium text-gray-700">기간:</label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="week">최근 1주</option>
            <option value="month">최근 1개월</option>
            <option value="quarter">최근 3개월</option>
          </select>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalQuizzes}</div>
          <div className="text-sm text-gray-600">총 퀴즈 수</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{averageScore}점</div>
          <div className="text-sm text-gray-600">평균 점수</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{maxScore}점</div>
          <div className="text-sm text-gray-600">최고 점수</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{perfectScores}</div>
          <div className="text-sm text-gray-600">만점 횟수</div>
        </div>
      </div>

      {/* 차트 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <QuizHistoryChart scores={quizzes.map(q => ({
          date: q.completedAt,
          score: q.score,
          subject: q.subject
        }))} />
      </div>

      {/* 퀴즈 목록 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">최근 퀴즈 결과</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredQuizzes.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <div className="text-gray-400 text-4xl mb-2">❓</div>
              <p className="text-gray-600">퀴즈 기록이 없습니다</p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{quiz.subject}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600">{quiz.week}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(quiz.completedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      quiz.score >= 90 ? 'text-green-600' :
                      quiz.score >= 80 ? 'text-blue-600' :
                      quiz.score >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {quiz.score}점
                    </div>
                    <div className="text-sm text-gray-600">
                      {quiz.correctAnswers}/{quiz.totalQuestions} 정답
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 