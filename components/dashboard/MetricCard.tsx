'use client';

import { motion } from 'framer-motion';

interface MetricCardProps {
  label: string;
  value: string | number;
  delta?: number;
  trend?: 'up' | 'down' | 'neutral';
  unit?: string;
  isDate?: boolean;
}

export default function MetricCard({ 
  label, 
  value, 
  delta, 
  trend = 'neutral', 
  unit = '', 
  isDate = false 
}: MetricCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↗';
      case 'down':
        return '↘';
      default:
        return '';
    }
  };

  const formatValue = () => {
    if (isDate) {
      return value;
    }
    return `${value}${unit}`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.15 }}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{label}</h3>
        {trend !== 'neutral' && delta && (
          <div className={`flex items-center text-sm font-medium ${getTrendColor()}`}>
            <span className="mr-1">{getTrendIcon()}</span>
            <span>{delta > 0 ? `+${delta}` : delta}%</span>
          </div>
        )}
      </div>
      
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">
          {formatValue()}
        </span>
      </div>
    </motion.div>
  );
} 