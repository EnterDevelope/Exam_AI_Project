import '../styles/globals.css';
import type { Metadata } from 'next';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Exam.Ai - AI 요약노트',
  description: 'AI 기반 요약/퀴즈로 대학생 시험 대비를 혁신하다',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-sans bg-gradient-to-b from-brand-light to-white min-h-screen text-gray-900">
        <Header />
        <main className="max-w-5xl mx-auto px-6 py-12 min-h-[75vh]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
} 