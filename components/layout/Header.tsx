import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full py-4 px-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 group align-middle">
          <img src="/logo_01.png" alt="Exam.Ai 로고" className="h-12 w-auto object-contain align-middle scale-150" />
        </Link>
        <nav className="flex items-center gap-4 ml-8">
          <Link href="/summary" className="text-base font-medium text-gray-700 hover:text-brand transition-colors">요약</Link>
          {/* 추후: <Link href="/quiz" ...>퀴즈</Link> <Link href="/mypage" ...>마이페이지</Link> 등 확장 가능 */}
        </nav>
        <span className="ml-auto text-sm text-gray-400 font-medium tracking-wide">AI 요약노트</span>
      </div>
    </header>
  );
} 