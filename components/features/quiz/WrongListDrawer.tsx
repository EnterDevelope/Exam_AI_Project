'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { WrongQuestion } from '@/types/quiz';

interface WrongListDrawerProps {
  groups: Record<string, WrongQuestion[]>;
  currentQuestionId?: string;
  onPick: (questionId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function WrongListDrawer({ 
  groups, 
  currentQuestionId, 
  onPick, 
  isOpen, 
  onToggle 
}: WrongListDrawerProps) {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const concepts = Object.keys(groups);
  const totalWrongCount = Object.values(groups).reduce((sum, questions) => 
    sum + questions.reduce((qSum, q) => qSum + q.wrong_count, 0), 0
  );

  return (
    <>
      {/* 모바일 오버레이 */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* 드로어 */}
      <motion.div
        className={`fixed lg:relative lg:block z-50 h-full bg-white border-r border-gray-200 w-80 max-w-[80vw] ${
          isOpen ? 'block' : 'hidden'
        }`}
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">오답 목록</h2>
              <button
                onClick={onToggle}
                className="lg:hidden text-gray-500 hover:text-gray-700"
                aria-label="닫기"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              총 {totalWrongCount}개 오답
            </p>
          </div>

          {/* 개념별 필터 */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedConcept(null)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedConcept === null
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              {concepts.map((concept) => (
                <button
                  key={concept}
                  onClick={() => setSelectedConcept(concept)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedConcept === concept
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {concept}
                </button>
              ))}
            </div>
          </div>

          {/* 오답 목록 */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {concepts
                .filter(concept => !selectedConcept || concept === selectedConcept)
                .map((concept) => (
                  <div key={concept} className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center justify-between">
                      <span>{concept}</span>
                      <span className="text-xs text-gray-500">
                        {groups[concept].reduce((sum, q) => sum + q.wrong_count, 0)}개
                      </span>
                    </h3>
                    
                    <div className="space-y-1">
                      {groups[concept].map((question) => (
                        <motion.button
                          key={question.id}
                          onClick={() => onPick(question.id)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            currentQuestionId === question.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start justify-between">
                            <p className="text-sm text-gray-900 line-clamp-2 flex-1">
                              {question.question}
                            </p>
                            <div className="flex items-center space-x-2 ml-2">
                              <span className="text-xs text-red-600 font-medium">
                                {question.wrong_count}회
                              </span>
                              {question.wrong_count >= 3 && (
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(question.last_wrong_at).toLocaleDateString()}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
} 