import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { generateSummary } from '@/lib/api/openai'

interface SummaryRequestBody {
  subject: string
  week: string
  text: string
  user_id?: string
  file_name?: string
  file_type?: string
}

export async function POST(req: Request) {
  try {
    const { subject, week, text, file_name, file_type } = (await req.json()) as SummaryRequestBody

    if (!text) {
      return NextResponse.json(
        { error: 'text is required' },
        { status: 400 }
      )
    }

    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // 인증된 사용자 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    // Azure OpenAI로 요약 생성
    const result = await generateSummary(text, subject, week)
    
    // 데이터베이스에 저장
    try {
      const weekNumber = week ? parseInt(week) : null
      
      const { data: savedSummary, error: saveError } = await supabase
        .from('summaries')
        .insert({
          user_id: user.id,
          subject: subject || '기타',
          week_number: weekNumber,
          original_text: text,
          summary_content: result.summary,
          summary_style: 'simple',
          file_name: file_name || null,
          file_type: file_type || null
        })
        .select()
        .single()

      if (saveError) {
        console.error('Database save error:', saveError)
        // 저장 실패해도 요약 결과는 반환
      }
    } catch (dbError) {
      console.error('Database error:', dbError)
      // DB 오류가 있어도 요약 결과는 반환
    }
    
    return NextResponse.json({
      summary: result.summary,
      keywords: result.keywords
    })
  } catch (error) {
    console.error('Summary API error:', error)
    return NextResponse.json(
      { error: '요약 생성에 실패했습니다.' },
      { status: 500 }
    )
  }
}
