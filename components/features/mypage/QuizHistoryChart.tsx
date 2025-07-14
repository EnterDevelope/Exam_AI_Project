'use client'

interface QuizScore {
  date: string
  score: number
  subject: string
}

interface QuizHistoryChartProps {
  scores: QuizScore[]
  className?: string
}

export default function QuizHistoryChart({ scores, className = '' }: QuizHistoryChartProps) {
  // Mock 데이터 생성 (실제로는 props로 받은 데이터 사용)
  const mockScores = scores.length > 0 ? scores : [
    { date: '2024-01-01', score: 85, subject: '웹 개발' },
    { date: '2024-01-03', score: 92, subject: '웹 개발' },
    { date: '2024-01-05', score: 78, subject: '알고리즘' },
    { date: '2024-01-07', score: 95, subject: '웹 개발' },
    { date: '2024-01-09', score: 88, subject: '데이터베이스' },
    { date: '2024-01-11', score: 91, subject: '웹 개발' },
    { date: '2024-01-13', score: 87, subject: '알고리즘' },
  ]

  const maxScore = Math.max(...mockScores.map(s => s.score))
  const minScore = Math.min(...mockScores.map(s => s.score))

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">퀴즈 점수 추이</h3>
      
      <div className="relative h-64">
        {/* Y축 라벨 */}
        <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500 w-8">
          <span>100</span>
          <span>80</span>
          <span>60</span>
          <span>40</span>
          <span>20</span>
          <span>0</span>
        </div>
        
        {/* 차트 영역 */}
        <div className="ml-8 h-full relative">
          {/* 그리드 라인 */}
          <div className="absolute inset-0 grid grid-rows-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-gray-100"></div>
            ))}
          </div>
          
          {/* 점수 라인 */}
          <svg className="absolute inset-0 w-full h-full">
            <polyline
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              points={mockScores.map((score, index) => {
                const x = (index / (mockScores.length - 1)) * 100
                const y = 100 - ((score.score - minScore) / (maxScore - minScore)) * 100
                return `${x}%,${y}%`
              }).join(' ')}
            />
            
            {/* 점수 포인트 */}
            {mockScores.map((score, index) => {
              const x = (index / (mockScores.length - 1)) * 100
              const y = 100 - ((score.score - minScore) / (maxScore - minScore)) * 100
              const isHighScore = score.score >= 90
              
              return (
                <g key={index}>
                  <circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="4"
                    fill={isHighScore ? "#10B981" : "#3B82F6"}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={`${x}%`}
                    y={`${y - 10}%`}
                    textAnchor="middle"
                    className="text-xs font-medium"
                    fill={isHighScore ? "#10B981" : "#3B82F6"}
                  >
                    {score.score}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        
        {/* X축 라벨 */}
        <div className="ml-8 mt-2 flex justify-between text-xs text-gray-500">
          {mockScores.map((score, index) => (
            <span key={index} className="transform -rotate-45 origin-left">
              {new Date(score.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
            </span>
          ))}
        </div>
      </div>
      
      {/* 범례 */}
      <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">일반 점수</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">90점 이상</span>
        </div>
      </div>
    </div>
  )
} 