import { NextResponse } from 'next/server';
import { generateSummary } from '@/lib/api/openai';
import { supabaseServer } from '@/lib/supabase/server';

interface SummaryRequestBody {
  subject?: string;
  week?: string;
  text: string;
  user_id?: string;
  file_name?: string;
  file_type?: string;
}

export async function POST(req: Request) {
  try {
    const { subject, week, text, user_id, file_name, file_type } = (await req.json()) as SummaryRequestBody;

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      );
    }

    // Azure OpenAI로 요약 생성
    const result = await generateSummary(text, subject, week);
    
    // 사용자 ID가 있으면 데이터베이스에 저장
    if (user_id) {
      try {
        const weekNumber = week ? parseInt(week) : null;
        
        const { data: savedSummary, error: saveError } = await supabaseServer
          .from('summaries')
          .insert({
            user_id,
            subject: subject || '기타',
            week_number: weekNumber,
            original_text: text,
            summary_content: result.summary,
            summary_style: 'simple',
            file_name: file_name || null,
            file_type: file_type || null
          })
          .select()
          .single();

        if (saveError) {
          console.error('Database save error:', saveError);
          // 저장 실패해도 요약 결과는 반환
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // DB 오류가 있어도 요약 결과는 반환
      }
    }
    
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
