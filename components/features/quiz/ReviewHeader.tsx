'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface ReviewHeaderProps {
  progress: number;
  timeLeft?: number;
  onExit: () => void;
}

export default function ReviewHeader({ progress, timeLeft, onExit }: ReviewHeaderProps) {
  const router = useRouter();
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowExitModal(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExit = () => {
    onExit();
    router.push('/mypage');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <motion.header 
        className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowExitModal(true)}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="나가기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">복습 진행률</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
          </div>

          {timeLeft !== undefined && (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>

        {/* 진행률 바 */}
        <div className="mt-3 max-w-4xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.header>

      {/* 나가기 확인 모달 */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              복습을 종료하시겠습니까?
            </h3>
            <p className="text-gray-600 mb-6">
              현재 진행률은 저장됩니다. 나중에 다시 이어서 복습할 수 있습니다.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowExitModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                계속하기
              </button>
              <button
                onClick={handleExit}
                className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                종료하기
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
} 