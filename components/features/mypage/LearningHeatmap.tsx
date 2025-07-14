'use client'

interface HeatmapData {
  date: string
  count: number
}

interface LearningHeatmapProps {
  data: HeatmapData[]
  className?: string
}

export default function LearningHeatmap({ data, className = '' }: LearningHeatmapProps) {
  // 간단한 히트맵 구현 (react-calendar-heatmap 대신 CSS Grid 사용)
  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-gray-100'
    if (count <= 2) return 'bg-green-200'
    if (count <= 4) return 'bg-green-300'
    if (count <= 6) return 'bg-green-400'
    return 'bg-green-500'
  }

  // 최근 7주간의 데이터 생성 (Mock)
  const generateWeekData = () => {
    const weeks = []
    const today = new Date()
    
    for (let week = 6; week >= 0; week--) {
      const weekData = []
      for (let day = 0; day < 7; day++) {
        const date = new Date(today)
        date.setDate(date.getDate() - (week * 7 + day))
        const dateStr = date.toISOString().split('T')[0]
        const existingData = data.find(d => d.date === dateStr)
        weekData.push({
          date: dateStr,
          count: existingData?.count || 0
        })
      }
      weeks.push(weekData)
    }
    return weeks
  }

  const weekData = generateWeekData()

  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">학습 히트맵</h3>
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-sm text-gray-600">학습 세션</span>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
        </div>
        <span className="text-sm text-gray-600">0-1-2-3-4+</span>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weekData.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-rows-7 gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={dayIndex}
                className={`w-3 h-3 rounded-sm ${getColorClass(day.count)}`}
                title={`${day.date}: ${day.count} 세션`}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>7주 전</span>
        <span>오늘</span>
      </div>
    </div>
  )
} 