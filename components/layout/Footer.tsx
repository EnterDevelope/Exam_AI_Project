import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full py-6 px-4 border-t border-gray-100 bg-white/80 text-center text-sm text-gray-500 mt-8">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-1">
        <span>
          <span className="font-bold text-brand">Exam.Ai</span> © 2024. All rights reserved.
        </span>
        <span className="text-xs text-gray-400">에듀테크 혁신, AI 요약/퀴즈로 대학생 시험 대비를 더 스마트하게.</span>
      </div>
    </footer>
  );
} 