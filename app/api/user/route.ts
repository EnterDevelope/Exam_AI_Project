import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
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

    // 사용자 프로필 정보 가져오기
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Profile query error:', profileError)
      // 프로필이 없으면 기본 정보로 생성
      const { data: newProfile, error: createError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || '사용자'
        })
        .select()
        .single()

      if (createError) {
        console.error('Profile creation error:', createError)
        return NextResponse.json(
          { error: '사용자 프로필 생성에 실패했습니다.' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        id: newProfile.id,
        nickname: newProfile.name || '사용자',
        school: '대학교',
        major: '학과',
        email: newProfile.email,
        avatar: null,
        notificationPrefs: {
          wrongAnswerAlert: true,
          weeklyReport: false,
          newFeatureAlert: true
        }
      })
    }

    // 기존 프로필 정보 반환
    return NextResponse.json({
      id: profile.id,
      nickname: profile.name || '사용자',
      school: profile.school || '대학교',
      major: profile.major || '학과',
      email: profile.email,
      avatar: profile.avatar || null,
      notificationPrefs: profile.notification_prefs || {
        wrongAnswerAlert: true,
        weeklyReport: false,
        newFeatureAlert: true
      }
    })

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

    // 프로필 업데이트
    const { data: updatedProfile, error: updateError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        name: nickname,
        school,
        major,
        notification_prefs: notificationPrefs
      })
      .select()
      .single()

    if (updateError) {
      console.error('Profile update error:', updateError)
      return NextResponse.json(
        { error: '프로필 업데이트에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedProfile.id,
        nickname: updatedProfile.name,
        school: updatedProfile.school,
        major: updatedProfile.major,
        email: updatedProfile.email,
        avatar: updatedProfile.avatar,
        notificationPrefs: updatedProfile.notification_prefs
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