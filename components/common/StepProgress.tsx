'use client';

import { motion } from 'framer-motion';

interface StepProgressProps {
  current: number;
  total: number;
  className?: string;
}

export default function StepProgress({ current, total, className = '' }: StepProgressProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          진행률
        </span>
        <span className="text-sm text-gray-500">
          {current} / {total}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className="bg-blue-600 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
} 