'use client'

import { useRouter } from 'next/navigation'

interface Summary {
  id: string
  subject: string
  week: string
  title: string
  createdAt: string
  status: 'completed' | 'in_progress'
  summaryLength: number
}

interface SummaryCardProps {
  summary: Summary
}

export default function SummaryCard({ summary }: SummaryCardProps) {
  const router = useRouter()

  const handleClick = () => {
    // 요약 뷰어로 이동 (실제로는 요약 상세 페이지로 이동)
    router.push(`/summary/${summary.id}`)
  }

  const getStatusColor = (status: string) => {
    return status === 'completed' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'
  }

  const getStatusText = (status: string) => {
    return status === 'completed' ? '완료' : '진행 중'
  }

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {summary.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {summary.subject}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {summary.week}
            </span>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(summary.status)}`}>
          {getStatusText(summary.status)}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>요약 길이</span>
          <span className="font-medium">{summary.summaryLength.toLocaleString()}자</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>생성일</span>
          <span className="font-medium">
            {new Date(summary.createdAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">클릭하여 상세보기</span>
          <svg 
            className="w-4 h-4 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7" 
            />
          </svg>
        </div>
      </div>
    </div>
  )
} 