import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = supabaseServer(cookieStore)
    // 기존 사용자 목록 조회
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message,
          details: '사용자 목록 조회에 실패했습니다.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: '사용자 목록 조회 성공!',
      users: data,
      count: data?.length || 0,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('User list error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '사용자 목록 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies()
    const supabase = supabaseServer(cookieStore)
    // 기존 사용자 확인
    const { data: existingUsers } = await supabase
      .from('users')
      .select('email')
      .eq('email', 'test@example.com')

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({
        success: true,
        message: '이미 테스트 사용자가 존재합니다.',
        user: existingUsers[0],
        timestamp: new Date().toISOString()
      })
    }

    // 테스트용 사용자 생성
    const testUser = {
      email: 'test@example.com',
      name: '테스트 사용자'
    }

    const { data, error } = await supabase
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
      message: '테스트 사용자 생성 성공!',
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