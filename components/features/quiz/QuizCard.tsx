'use client';
import { useState } from 'react';
import type { Question } from '@/types';

interface Props {
  question: Question;
  onWrong: (payload: { questionId: string; userAnswer: string }) => void;
}

export default function QuizCard({ question, onWrong }: Props) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const isMultiple = question.type === 'multiple';

  const handleSubmit = async () => {
    if (!answer) return;
    if (answer !== question.answer) {
      onWrong({ questionId: question.id, userAnswer: answer });
    }
    setFeedback(answer === question.answer ? '정답입니다!' : `오답입니다. 정답: ${question.answer}`);
  };

  return (
    <div className="border p-4 rounded mb-4">
      <p className="font-medium mb-2">{question.question}</p>
      {isMultiple ? (
        <ul className="space-y-2">
          {question.options?.map((opt) => (
            <li key={opt}>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name={question.id}
                  value={opt}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={!!feedback}
                />
                {opt}
              </label>
            </li>
          ))}
        </ul>
      ) : (
        <input
          type="text"
          className="input-field"
          onChange={(e) => setAnswer(e.target.value)}
          disabled={!!feedback}
        />
      )}
      {!feedback ? (
        <button className="btn-primary mt-2" onClick={handleSubmit} disabled={!answer}>
          제출
        </button>
      ) : (
        <p className="mt-2 text-sm text-gray-600">{feedback}</p>
      )}
    </div>
  );
}
