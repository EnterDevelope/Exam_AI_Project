import { NextResponse } from 'next/server';
import { mcpClient } from '@/lib/api/client';

interface FeedbackRequestBody {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  summary: string;
}

export async function POST(req: Request) {
  try {
    const { question, userAnswer, correctAnswer, summary } =
      (await req.json()) as FeedbackRequestBody;

    if (!question || !userAnswer || !correctAnswer || !summary) {
      return NextResponse.json(
        { error: 'invalid request' },
        { status: 400 }
      );
    }

    const { data } = await mcpClient.post('/feedback', {
      question,
      userAnswer,
      correctAnswer,
      summary,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: '해설 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
