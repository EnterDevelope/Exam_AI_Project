import { NextResponse } from 'next/server';
import type { SummaryData, QuizData } from '@/types';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '파일이 필요합니다.' },
        { status: 400 }
      );
    }

    // 1. 과목명 감지
    const subject = await detectSubject(file);
    
    // 2. 요약 생성
    const summary = await generateSummary(file, subject);
    
    // 3. 퀴즈 생성
    const quiz = await generateQuiz(summary);

    return NextResponse.json({
      summary,
      quiz,
    });
  } catch (error) {
    console.error('Summary-Quiz generation failed:', error);
    return NextResponse.json(
      { error: '요약 및 퀴즈 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

async function detectSubject(file: File) {
  // TODO: Implement subject detection
  throw new Error('Not implemented');
}

async function generateSummary(file: File, subject: string): Promise<SummaryData> {
  // TODO: Implement summary generation
  throw new Error('Not implemented');
}

async function generateQuiz(summary: SummaryData): Promise<QuizData> {
  // TODO: Implement quiz generation
  throw new Error('Not implemented');
} 