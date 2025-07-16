'use client';

import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import type { Question } from '@/types/quiz';
import type { QuizCardProps } from '@/types/quiz';

export default function QuizCard({ 
  question, 
  index, 
  total, 
  onAnswerSubmit, 
  userAnswer,
  mode = 'quiz',
  onAnswerChange,
  onSubmit,
  isSubmitting = false,
  showCorrectAnswer = false
}: QuizCardProps) {
  const [answer, setAnswer] = useState(userAnswer || '');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isMultiple = question.type === 'multiple';

  useEffect(() => {
    setAnswer(userAnswer || '');
    setIsSubmitted(false);
  }, [question, userAnswer]);

  useEffect(() => {
    if (onAnswerChange) {
      onAnswerChange(answer);
    }
  }, [answer, onAnswerChange]);

  const handleOptionSelect = (selectedAnswer: string) => {
    if (isSubmitted && mode === 'quiz') return;
    setAnswer(selectedAnswer);
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    
    if (mode === 'quiz') {
      setIsSubmitted(true);
      onAnswerSubmit?.(answer.trim());
    } else if (mode === 'review') {
      onSubmit?.();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitted) {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border">
      {/* 문제 헤더 */}
      <div className="mb-6">
        {mode === 'quiz' && index !== undefined && total !== undefined && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              문제 {index + 1} / {total}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {isMultiple ? '객관식' : '단답형'}
            </span>
          </div>
        )}
        {mode === 'review' && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">
              복습 모드
            </span>
            <span className="text-sm font-medium text-gray-500">
              {isMultiple ? '객관식' : '단답형'}
            </span>
          </div>
        )}
        <h2 className="text-lg font-semibold text-gray-900 leading-relaxed">
          {question.question}
        </h2>
      </div>

              {/* 답안 입력 영역 */}
      <div className="space-y-4">
        {isMultiple ? (
          <div className="space-y-3">
            {question.options?.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className={clsx(
                  'flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200',
                  answer === option
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300',
                  (isSubmitted && mode === 'quiz') && 'cursor-not-allowed',
                  showCorrectAnswer && option === question.correct_answer && 'border-green-500 bg-green-50',
                  showCorrectAnswer && answer === option && option !== question.correct_answer && 'border-red-500 bg-red-50'
                )}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answer === option}
                  onChange={() => handleOptionSelect(option)}
                  disabled={isSubmitted && mode === 'quiz'}
                  className="sr-only"
                />
                <div className="flex items-center w-full">
                  <div className={clsx(
                    'w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center',
                    answer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300',
                    showCorrectAnswer && option === question.correct_answer && 'border-green-500 bg-green-500',
                    showCorrectAnswer && answer === option && option !== question.correct_answer && 'border-red-500 bg-red-500'
                  )}>
                    {answer === option && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                    {showCorrectAnswer && option === question.correct_answer && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-900">{option}</span>
                  {showCorrectAnswer && option === question.correct_answer && (
                    <span className="ml-auto text-green-600 font-medium">정답</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isSubmitted && mode === 'quiz'}
              placeholder="답안을 입력하세요"
              className={clsx(
                'w-full px-4 py-3 border-2 rounded-lg text-gray-900 placeholder-gray-500 transition-all duration-200',
                'focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200',
                (isSubmitted && mode === 'quiz') && 'bg-gray-50 cursor-not-allowed',
                showCorrectAnswer && answer === question.correct_answer && 'border-green-500 bg-green-50',
                showCorrectAnswer && answer !== question.correct_answer && 'border-red-500 bg-red-50'
              )}
            />
            {showCorrectAnswer && (
              <div className="text-sm text-gray-600">
                정답: <span className="font-medium text-green-600">{question.correct_answer}</span>
              </div>
            )}
          </div>
        )}

        {/* 제출 버튼 */}
        {mode === 'quiz' && !isSubmitted && (
          <button
            onClick={handleSubmit}
            disabled={!answer.trim()}
            className={clsx(
              'w-full py-3 px-6 rounded-lg font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              answer.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            답안 제출
          </button>
        )}

        {mode === 'review' && !showCorrectAnswer && (
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSubmitting}
            className={clsx(
              'w-full py-3 px-6 rounded-lg font-medium transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              answer.trim() && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            )}
          >
            {isSubmitting ? '확인 중...' : '정답 확인'}
          </button>
        )}

        {/* 제출 완료 상태 */}
        {mode === 'quiz' && isSubmitted && (
          <div className="text-center py-3">
            <span className="text-sm text-gray-600">
              답안이 제출되었습니다
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
