'use client';

import { motion } from 'framer-motion';

interface BottomBarProps {
  onPrev: () => void;
  onNext: () => void;
  onCheckAnswer?: () => void;
  isFirst: boolean;
  isLast: boolean;
  mode: 'answering' | 'feedback' | 'complete';
  hasAnswer: boolean;
}

export default function BottomBar({
  onPrev,
  onNext,
  onCheckAnswer,
  isFirst,
  isLast,
  mode,
  hasAnswer
}: BottomBarProps) {
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 safe-area-bottom"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isFirst
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">이전</span>
        </button>

        <div className="flex items-center space-x-3">
          {mode === 'answering' && onCheckAnswer && (
            <button
              onClick={onCheckAnswer}
              disabled={!hasAnswer}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                hasAnswer
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              정답 확인
            </button>
          )}

          {mode === 'feedback' && (
            <button
              onClick={onNext}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {isLast ? '복습 완료' : '다음 문제'}
            </button>
          )}
        </div>

        <button
          onClick={onNext}
          disabled={isLast && mode === 'answering'}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            isLast && mode === 'answering'
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <span className="text-sm font-medium">
            {isLast ? '완료' : '다음'}
          </span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
} 