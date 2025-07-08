import { NextResponse } from 'next/server';
import { mcpClient } from '@/lib/api/client';

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

    const { data } = await mcpClient.post('/summary', { subject, week, text });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Summary API error:', error);
    return NextResponse.json(
      { error: '요약 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}
