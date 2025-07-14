'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/components/auth/AuthProvider'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function LoginPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isSignup, setIsSignup] = useState(false)

  useEffect(() => {
    // 이미 로그인된 사용자는 리다이렉트
    if (!isLoading && user) {
      const next = searchParams.get('next') || '/'
      router.push(next)
    }
  }, [user, isLoading, router, searchParams])

  const handleAuthSuccess = () => {
    const next = searchParams.get('next') || '/'
    router.push(next)
  }

  const handleSwitchToSignup = () => {
    setIsSignup(true)
  }

  const handleSwitchToLogin = () => {
    setIsSignup(false)
  }

  // 로딩 중이거나 이미 로그인된 경우
  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {isSignup ? (
          <SignupForm 
            onSuccess={handleAuthSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        ) : (
          <LoginForm 
            onSuccess={handleAuthSuccess}
            onSwitchToSignup={handleSwitchToSignup}
          />
        )}
      </div>
    </div>
  )
} 