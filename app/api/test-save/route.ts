import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST() {
  try {
    // 실제 생성된 사용자 ID 사용
    const testSummary = {
      user_id: '0ac96e34-aec5-4951-ba76-3bdd6730d7e2', // 실제 생성된 사용자 ID
      subject: '테스트 과목',
      week_number: 1,
      original_text: '이것은 테스트용 원본 텍스트입니다.',
      summary_content: '테스트용 요약 내용입니다.',
      summary_style: 'simple',
      file_name: 'test.pdf',
      file_type: 'pdf'
    }

    const { data, error } = await supabaseServer
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
      message: '테스트 데이터 저장 성공!',
      data: data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test save error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '테스트 데이터 저장 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 