'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface LearningItem {
  id: string;
  type: 'summary' | 'quiz';
  title: string;
  progress: number;
  score?: number;
  lastUpdated: string;
}

interface LearningProgressGridProps {
  items: LearningItem[];
}

export default function LearningProgressGrid({ items }: LearningProgressGridProps) {
  const router = useRouter();

  const handleContinue = (item: LearningItem) => {
    if (item.type === 'summary') {
      router.push(`/summary?id=${item.id}`);
    } else {
      router.push(`/quiz?id=${item.id}`);
    }
  };

  const getTypeBadge = (type: 'summary' | 'quiz') => {
    const config = {
      summary: {
        label: '요약',
        color: 'bg-blue-100 text-blue-800'
      },
      quiz: {
        label: '퀴즈',
        color: 'bg-purple-100 text-purple-800'
      }
    };

    const config_ = config[type];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config_.color}`}>
        {config_.label}
      </span>
    );
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    return 'text-blue-600';
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
        <div className="text-gray-400 text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          진행 중인 학습이 없습니다
        </h3>
        <p className="text-gray-600 mb-6">
          새 요약을 시작해서 학습을 시작해보세요!
        </p>
        <button
          onClick={() => router.push('/summary?page=upload')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
        >
          새 요약 시작하기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">진행 중인 학습</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.slice(0, 3).map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              {getTypeBadge(item.type)}
              <div className="text-right">
                {item.type === 'quiz' && item.score && (
                  <div className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {item.score}점
                  </div>
                )}
                {item.type === 'summary' && (
                  <div className="text-sm text-gray-500">
                    {item.progress}%
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {item.title}
            </h3>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>진행률</span>
                <span className={getProgressColor(item.progress)}>{item.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(item.progress).replace('text-', 'bg-')}`}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                최근 업데이트: {item.lastUpdated}
              </span>
              <button
                onClick={() => handleContinue(item)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
              >
                {item.type === 'summary' ? '이어 학습하기' : '다시 도전하기'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 