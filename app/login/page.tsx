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
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      setRedirecting(true);
      const next = searchParams.get('next') || '/';
      router.replace(next);
    }
  }, [isLoading, user, searchParams, router]);

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

  // 로딩 중
  if (isLoading || redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    )
  }

  // 이미 로그인된 경우(리다이렉트 대기)
  if (user) {
    return null;
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