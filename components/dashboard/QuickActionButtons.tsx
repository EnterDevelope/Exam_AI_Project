'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function QuickActionButtons() {
  const router = useRouter();

  const handleNewSummary = () => {
    router.push('/summary?page=upload');
  };

  const handleReviewWrong = () => {
    router.push('/quiz/review?mode=wrongOnly');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleNewSummary}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl p-6 shadow-lg transition-colors duration-200"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">+</span>
          </div>
          <span className="text-lg font-semibold">새 요약 시작</span>
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleReviewWrong}
        className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 rounded-2xl p-6 shadow-lg transition-colors duration-200"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-lg">🔄</span>
          </div>
          <span className="text-lg font-semibold">오답 복습</span>
        </div>
      </motion.button>
    </div>
  );
} 