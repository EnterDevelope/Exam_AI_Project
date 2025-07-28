import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = supabaseServer(cookieStore)
    
    // 먼저 사용자 목록에서 첫 번째 사용자 ID 가져오기
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1)

    if (userError || !users || users.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: '사용자를 찾을 수 없습니다.',
          details: '먼저 테스트 사용자를 생성해주세요.'
        },
        { status: 400 }
      )
    }

    const userId = users[0].id

    // 요약 데이터 저장
    const testSummary = {
      user_id: userId,
      subject: '동적 테스트 과목',
      week_number: 1,
      original_text: '이것은 동적으로 생성된 테스트용 원본 텍스트입니다.',
      summary_content: '동적으로 생성된 테스트용 요약 내용입니다.',
      summary_style: 'simple',
      file_name: 'dynamic-test.pdf',
      file_type: 'pdf'
    }

    const { data, error } = await supabase
      .from('summaries')
      .insert(testSummary)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: '데이터 저장에 실패했습니다.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '동적 테스트 데이터 저장 성공!',
      data: data,
      userId: userId,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Dynamic test save error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '동적 테스트 데이터 저장 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 