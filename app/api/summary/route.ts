import { NextResponse } from 'next/server';
import { generateSummary } from '@/lib/api/openai';

interface SummaryRequestBody {
  subject?: string;
  week?: string;
  text: string;
}

export async function POST(req: Request) {
  try {
    const { subject, week, text } = (await req.json()) as SummaryRequestBody;

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      );
    }

    // Azure OpenAI로 요약 생성
    const result = await generateSummary(text, subject, week);
    
    return NextResponse.json({
      summary: result.summary,
      keywords: result.keywords
    });
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { error: '요약 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
