import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    
    // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
    const tempUserId = '0ac96e34-aec5-4951-ba76-3bdd6730d7e2'

    // 기본 쿼리 구성
    let query = supabaseServer
      .from('summaries')
      .select('id, subject, week_number, summary_content, file_name, created_at')
      .eq('user_id', tempUserId)
      .order('created_at', { ascending: false })

    // 과목 필터 적용
    if (subject && subject !== 'all') {
      query = query.eq('subject', subject)
    }

    const { data: summaries, error } = await query

    if (error) {
      console.error('Summaries query error:', error)
      return NextResponse.json(
        { error: '요약 목록 조회에 실패했습니다.', details: error.message },
        { status: 500 }
      )
    }

    // 응답 데이터 변환
    const formattedSummaries = summaries?.map(summary => ({
      id: summary.id,
      subject: summary.subject || '미분류',
      week: summary.week_number ? `${summary.week_number}주차` : '1주차',
      title: summary.file_name || '제목 없음',
      createdAt: summary.created_at,
      status: 'completed' as const, // 현재는 모든 요약이 완료된 것으로 간주
      summaryLength: summary.summary_content ? summary.summary_content.length : 0
    })) || []

    return NextResponse.json(formattedSummaries)

  } catch (error) {
    console.error('Summaries API error:', error)
    return NextResponse.json(
      { error: '요약 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 