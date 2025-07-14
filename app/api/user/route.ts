import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
    const tempUserId = '0ac96e34-aec5-4951-ba76-3bdd6730d7e2'

    const { data: user, error } = await supabaseServer
      .from('users')
      .select('id, email')
      .eq('id', tempUserId)
      .single()

    if (error) {
      console.error('User query error:', error)
      return NextResponse.json(
        { error: '사용자 정보 조회에 실패했습니다.', details: error.message },
        { status: 500 }
      )
    }

    // 기본값 설정 (실제 users 테이블에는 기본 정보만 있음)
    const profile = {
      id: user.id,
      nickname: '테스트 사용자', // 임시 값
      school: '테스트 대학교', // 임시 값
      major: '컴퓨터공학과', // 임시 값
      email: user.email || 'user@example.com',
      avatar: null, // 임시 값
      notificationPrefs: {
        wrongAnswerAlert: true,
        weeklyReport: false,
        newFeatureAlert: true
      }
    }

    return NextResponse.json(profile)

  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json(
      { error: '사용자 정보 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { nickname, school, major, notificationPrefs } = body
    
    // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
    const tempUserId = '0ac96e34-aec5-4951-ba76-3bdd6730d7e2'

    // 업데이트할 데이터 구성 (실제로는 users 테이블에 기본 정보만 저장 가능)
    const updateData: any = {}
    
    // 현재는 실제 업데이트를 하지 않고 성공 응답만 반환
    console.log('Profile update requested:', { nickname, school, major, notificationPrefs })

    // 현재는 실제 업데이트를 하지 않고 성공 응답만 반환
    return NextResponse.json({
      success: true,
      user: {
        id: tempUserId,
        nickname: nickname || '테스트 사용자',
        school: school || '테스트 대학교',
        major: major || '컴퓨터공학과',
        email: 'test@example.com',
        avatar: null,
        notificationPrefs: notificationPrefs || {
          wrongAnswerAlert: true,
          weeklyReport: false,
          newFeatureAlert: true
        }
      }
    })

  } catch (error) {
    console.error('User update API error:', error)
    return NextResponse.json(
      { error: '사용자 정보 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 