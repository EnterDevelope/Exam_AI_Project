import React from 'react';

type FeatureCardProps = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm flex flex-col items-start gap-2 min-w-[220px]">
      <div className="w-10 h-10 bg-gray-200 rounded-md mb-2" />
      <div className="font-semibold text-base">{title}</div>
      <div className="text-sm text-gray-500 line-clamp-2">{description}</div>
    </div>
  );
} 