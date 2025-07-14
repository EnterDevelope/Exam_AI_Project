'use client'

import { useState, useEffect } from 'react'
import KpiCard from './KpiCard'
import LearningHeatmap from './LearningHeatmap'
import QuizHistoryChart from './QuizHistoryChart'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBanner from '@/components/common/ErrorBanner'

interface LearningStats {
  totalSummaries: number
  totalQuizzes: number
  averageScore: number
  maxScore: number
  heatmapData: Array<{ date: string; count: number }>
  quizScores: Array<{ date: string; score: number; subject: string }>
}

export default function OverviewTab() {
  const [stats, setStats] = useState<LearningStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/stats')
        
        if (!response.ok) {
          throw new Error('통계 데이터 조회에 실패했습니다.')
        }
        
        const data = await response.json()
        
        setStats({
          totalSummaries: data.totalSummaries,
          totalQuizzes: data.totalQuizzes,
          averageScore: data.averageScore,
          maxScore: data.maxScore,
          heatmapData: data.heatmapData,
          quizScores: data.quizScores
        })
      } catch (err) {
        setError('통계 데이터를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

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

  if (!stats) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* KPI 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="총 요약 수"
          value={stats.totalSummaries}
          delta={{ value: 15, isPositive: true }}
          icon="📝"
        />
        <KpiCard
          label="총 퀴즈 수"
          value={stats.totalQuizzes}
          delta={{ value: 8, isPositive: true }}
          icon="❓"
        />
        <KpiCard
          label="평균 점수"
          value={`${stats.averageScore}점`}
          delta={{ value: 5, isPositive: true }}
          icon="📊"
        />
        <KpiCard
          label="최고 점수"
          value={`${stats.maxScore}점`}
          delta={{ value: 2, isPositive: true }}
          icon="🏆"
        />
      </div>

      {/* 차트 및 히트맵 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuizHistoryChart scores={stats.quizScores} />
        <LearningHeatmap data={stats.heatmapData} />
      </div>

      {/* 약점 개념 태그 클라우드 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">약점 개념 TOP 5</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { concept: 'JavaScript 비동기', count: 8, difficulty: 'hard' },
            { concept: 'React Hooks', count: 6, difficulty: 'medium' },
            { concept: 'CSS Grid', count: 5, difficulty: 'easy' },
            { concept: 'SQL JOIN', count: 4, difficulty: 'medium' },
            { concept: 'Git Branch', count: 3, difficulty: 'easy' },
          ].map((item, index) => (
            <span
              key={index}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                item.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}
            >
              {item.concept} ({item.count}회)
            </span>
          ))}
        </div>
      </div>
    </div>
  )
} 