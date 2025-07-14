import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST() {
  try {
    // 다른 이메일로 테스트용 사용자 생성
    const testUser = {
      email: 'student@university.ac.kr',
      name: '대학생 사용자'
    }

    const { data, error } = await supabaseServer
      .from('users')
      .insert(testUser)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: '테스트 사용자 생성에 실패했습니다.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '대학생 테스트 사용자 생성 성공!',
      user: data,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Test user creation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '테스트 사용자 생성 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 