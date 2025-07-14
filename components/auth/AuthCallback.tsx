'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/auth'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      // URL에서 해시 프래그먼트 추출
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const error = params.get('error')

      if (error) {
        console.error('Auth error:', error)
        router.push(`/login?error=${encodeURIComponent(error)}`)
        return
      }

      if (accessToken && refreshToken) {
        try {
          // 세션 설정
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('Session setting error:', error)
            router.push(`/login?error=${encodeURIComponent(error.message)}`)
            return
          }

          if (data.session) {
            console.log('Login successful for user:', data.user?.email)
            router.push('/')
            return
          }
        } catch (err) {
          console.error('Unexpected auth error:', err)
          router.push(`/login?error=${encodeURIComponent('인증 처리 중 오류가 발생했습니다.')}`)
          return
        }
      }

      // 토큰이 없는 경우
      router.push(`/login?error=${encodeURIComponent('인증 토큰을 찾을 수 없습니다.')}`)
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  )
} 