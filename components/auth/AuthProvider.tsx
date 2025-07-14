'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuthStore } from '@/store/auth'
import { onAuthStateChange, authUtils } from '@/lib/supabase/auth'
import type { AuthUser, AuthSession } from '@/lib/supabase/auth'
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AuthContextType {
  user: AuthUser | null
  session: AuthSession
  isLoading: boolean
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUpWithEmail: (email: string, password: string, userData?: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
  signInWithProvider: (provider: 'google') => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const {
    user,
    session,
    isLoading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    setUser,
    setSession,
    clearError,
    initialize
  } = useAuthStore()

  useEffect(() => {
    // 초기 인증 상태 로드
    initialize()

    // 인증 상태 변경 리스너 설정
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN' && session) {
        setSession(session)
        if (session.user) {
          // 카카오 사용자 처리 (이메일이 없는 경우)
          if (session.user.app_metadata?.provider === 'kakao') {
            await authUtils.handleKakaoUser(session.user)
          }
          setUser(session.user as AuthUser)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setSession(session)
        if (session.user) {
          setUser(session.user as AuthUser)
        }
      }
    })

    // 클린업
    return () => {
      subscription.unsubscribe()
    }
  }, [initialize, setUser, setSession])

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    error,
    signInWithEmail,
    signUpWithEmail,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  )
}

// 인증 컨텍스트 사용 훅
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 