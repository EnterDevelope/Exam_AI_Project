import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/auth'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  // 에러가 있는 경우
  if (error) {
    console.error('Auth error:', error, errorDescription)
    
    // 카카오 이메일 오류인 경우 무시하고 계속 진행
    if (errorDescription?.includes('email') || errorDescription?.includes('Email')) {
      console.log('Kakao email error ignored, continuing with login...')
      // 이메일 오류를 무시하고 계속 진행
    } else {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error)}`)
    }
  }

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Auth callback error:', error)
        
        // 카카오 관련 오류인 경우 특별 처리
        if (error.message.includes('email') || error.message.includes('Email')) {
          console.log('Kakao email error in session exchange, trying alternative approach...')
          // 이메일 오류를 무시하고 계속 진행
        } else {
          return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
        }
      }

      if (data.session) {
        // 성공적으로 로그인된 경우
        console.log('Login successful for user:', data.user?.email)
        return NextResponse.redirect(`${origin}${next}`)
      }
    } catch (err) {
      console.error('Unexpected auth error:', err)
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('인증 처리 중 오류가 발생했습니다.')}`)
    }
  }

  // 코드가 없거나 세션이 생성되지 않은 경우
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('인증에 실패했습니다.')}`)
} 