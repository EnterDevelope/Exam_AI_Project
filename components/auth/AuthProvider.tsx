'use client'

import { createContext, useContext, useEffect, ReactNode } from 'react'
import { useAuthStore } from '@/store/auth'
import { onAuthStateChange, authUtils } from '@/lib/supabase/auth'
import type { Session, User } from '@supabase/supabase-js';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  error: string | null
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUpWithEmail: (email: string, password: string, userData?: any) => Promise<{ success: boolean; error?: string }>
  signInWithProvider: (provider: 'google') => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: any) => Promise<{ success: boolean; error?: string }>
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
        setUser(session.user ?? null)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setSession(null)
      } else if (event === 'TOKEN_REFRESHED' && session) {
        setSession(session)
        setUser(session.user ?? null)
      }
    })

    // cleanup
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
      {children}
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