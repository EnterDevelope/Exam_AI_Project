'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import type { Question } from '@/types/quiz';

interface QuizFeedbackCardProps {
  question: Question;
  userAnswer: string;
  isCorrect: boolean;
}

export default function QuizFeedbackCard({
  question,
  userAnswer,
  isCorrect
}: QuizFeedbackCardProps) {
  const [showExplanation, setShowExplanation] = useState(false);

  return (
    <div className={clsx(
      'bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300',
      isCorrect 
        ? 'border-green-200 bg-green-50' 
        : 'border-red-200 bg-red-50'
    )}>
      {/* 결과 헤더 */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className={clsx(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isCorrect 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          )}>
            {isCorrect ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div>
            <h3 className={clsx(
              'text-lg font-semibold',
              isCorrect ? 'text-green-800' : 'text-red-800'
            )}>
              {isCorrect ? '정답입니다!' : '오답입니다'}
            </h3>
            <p className="text-sm text-gray-600">
              {isCorrect ? '잘 풀었습니다!' : '다시 한번 확인해보세요'}
            </p>
          </div>
        </div>
      </div>

      {/* 답안 비교 */}
      <div className="space-y-4 mb-6">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">내 답안</h4>
          <div className="bg-gray-100 rounded-lg p-3">
            <span className="text-gray-900">{userAnswer || '(답안 없음)'}</span>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">정답</h4>
          <div className={clsx(
            'rounded-lg p-3',
            isCorrect ? 'bg-green-100' : 'bg-red-100'
          )}>
            <span className={clsx(
              'font-medium',
              isCorrect ? 'text-green-800' : 'text-red-800'
            )}>
              {question.correct_answer}
            </span>
          </div>
        </div>
      </div>

      {/* 해설 */}
      {question.explanation && (
        <div className="border-t pt-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium text-gray-700">
              해설 보기
            </span>
            <svg
              className={clsx(
                'w-5 h-5 text-gray-500 transition-transform duration-200',
                showExplanation && 'rotate-180'
              )}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showExplanation && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* 객관식 보기 표시 */}
      {question.type === 'multiple' && question.options && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">보기</h4>
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={clsx(
                  'flex items-center p-3 rounded-lg border-2',
                  option === question.correct_answer
                    ? 'border-green-300 bg-green-50'
                    : option === userAnswer && !isCorrect
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-gray-50'
                )}
              >
                <div className={clsx(
                  'w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center',
                  option === question.correct_answer
                    ? 'border-green-500 bg-green-500'
                    : option === userAnswer && !isCorrect
                    ? 'border-red-500 bg-red-500'
                    : 'border-gray-300'
                )}>
                  {option === question.correct_answer && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                  {option === userAnswer && !isCorrect && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <span className={clsx(
                  'text-sm',
                  option === question.correct_answer
                    ? 'text-green-800 font-medium'
                    : option === userAnswer && !isCorrect
                    ? 'text-red-800 font-medium'
                    : 'text-gray-700'
                )}>
                  {option}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 