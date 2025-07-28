import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = supabaseServer(cookieStore)
    
    // 간단한 연결 테스트
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: 'Supabase 연결에 실패했습니다.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase 연결 성공!',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Supabase test error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Supabase 연결 테스트 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 