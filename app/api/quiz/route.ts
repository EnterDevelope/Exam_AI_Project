import { NextResponse } from 'next/server';
import { mcpClient } from '@/lib/api/client';

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

    const { data } = await mcpClient.post('/quiz', { summary });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Quiz API error:', error);
    return NextResponse.json(
      { error: '퀴즈 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
