'use client';

import { motion } from 'framer-motion';

interface AnalyticsPreviewProps {
  weeklyProgress: number[];
  heatmapData: Record<string, number>;
}

export default function AnalyticsPreview({ weeklyProgress, heatmapData }: AnalyticsPreviewProps) {
  const weekdays = ['월', '화', '수', '목', '금', '토', '일'];

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-200';
    if (count === 2) return 'bg-green-300';
    if (count === 3) return 'bg-green-400';
    return 'bg-green-500';
  };

  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = heatmapData[dateStr] || 0;
      data.push({ date: dateStr, count });
    }
    
    return data;
  };

  const heatmapData_ = generateHeatmapData();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">학습 통계</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 주간 학습 진도 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">주간 학습 진도</h3>
          <div className="space-y-3">
            {weekdays.map((day, index) => (
              <div key={day} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-8">{day}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${weeklyProgress[index]}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-3 bg-blue-600 rounded-full"
                  />
                </div>
                <span className="text-sm text-gray-600 w-8 text-right">
                  {weeklyProgress[index]}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 학습 빈도 히트맵 */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">학습 빈도 (최근 30일)</h3>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekdays.map((day) => (
              <div key={day} className="text-xs text-gray-500 text-center">
                {day}
              </div>
            ))}
            {heatmapData_.map((item, index) => (
              <div
                key={item.date}
                className={`w-6 h-6 rounded-sm ${getHeatmapColor(item.count)}`}
                title={`${item.date}: ${item.count}회 학습`}
              />
            ))}
          </div>
          
          {/* 범례 */}
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-600">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
              <span>0회</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-200 rounded-sm"></div>
              <span>1회</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
              <span>2-3회</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span>4회+</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 