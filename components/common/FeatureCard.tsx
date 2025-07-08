import React from 'react';
import Card from './Card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <Card className="flex flex-col items-start gap-3 min-w-[220px] bg-white">
      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-brand-light text-brand text-2xl mb-1">
        {icon || <span>🎓</span>}
      </div>
      <div className="font-semibold text-lg text-gray-900">{title}</div>
      <div className="text-sm text-gray-500 leading-relaxed">{description}</div>
    </Card>
  );
} 