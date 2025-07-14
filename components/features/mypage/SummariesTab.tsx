'use client'

import { useState, useEffect } from 'react'
import SummaryCard from './SummaryCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBanner from '@/components/common/ErrorBanner'

interface Summary {
  id: string
  subject: string
  week: string
  title: string
  createdAt: string
  status: 'completed' | 'in_progress'
  summaryLength: number
}

export default function SummariesTab() {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const url = selectedSubject === 'all' 
          ? '/api/summaries'
          : `/api/summaries?subject=${encodeURIComponent(selectedSubject)}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error('요약 목록 조회에 실패했습니다.')
        }
        
        const data = await response.json()
        setSummaries(data)
      } catch (err) {
        setError('요약 목록을 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummaries()
  }, [selectedSubject])

  // 과목별 필터링
  const filteredSummaries = selectedSubject === 'all' 
    ? summaries 
    : summaries.filter(summary => summary.subject === selectedSubject)

  // 고유한 과목 목록 추출
  const subjects = ['all', ...Array.from(new Set(summaries.map(s => s.subject)))]

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
        <h2 className="text-xl font-semibold text-gray-900">요약 목록</h2>
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
        </div>
      </div>

      {/* 요약 카드 그리드 */}
      {filteredSummaries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">요약이 없습니다</h3>
          <p className="text-gray-600">첫 번째 요약을 만들어보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSummaries.map((summary) => (
            <SummaryCard key={summary.id} summary={summary} />
          ))}
        </div>
      )}

      {/* 통계 정보 */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{summaries.length}</div>
            <div className="text-sm text-gray-600">총 요약 수</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {summaries.filter(s => s.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">완료된 요약</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(summaries.reduce((acc, s) => acc + s.summaryLength, 0) / 1000 * 10) / 10}k
            </div>
            <div className="text-sm text-gray-600">총 요약 길이</div>
          </div>
        </div>
      </div>
    </div>
  )
} 