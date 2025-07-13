import { NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/api/openai';

interface QuizRequestBody {
  summary: string;
}

export async function POST(req: Request) {
  try {
    const { summary } = (await req.json()) as QuizRequestBody;

    if (!summary) {
      return NextResponse.json(
        { error: 'summary is required' },
        { status: 400 }
      );
    }

    // Azure OpenAI로 퀴즈 생성
    const result = await generateQuiz(summary);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json(
      { error: '퀴즈 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
