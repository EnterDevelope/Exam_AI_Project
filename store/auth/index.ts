'use client';
// Zustand 인증 store는 반드시 클라이언트에서만 사용해야 합니다.
// 컴포넌트에서는 useAuthStore((s) => s.user)와 같이 selector를 사용하세요.
import { create } from 'zustand'
import { authUtils } from '@/lib/supabase/auth';
import type { Session, User } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';

interface AuthStore {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUpWithEmail: (email: string, password: string, userData?: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  signInWithProvider: (provider: 'google') => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  initialize: () => Promise<void>;
}

const initialState = {
  user: null,
  session: null,
  isLoading: true,
  error: null
}

export const useAuthStore = create<AuthStore>()(
  (set, get) => ({
    ...initialState,
    signInWithEmail: async (email: string, password: string) => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await authUtils.signInWithEmail(email, password)
        if (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
        if (data.user && data.session) {
          set({
            user: data.user as User,
            session: data.session as Session,
            isLoading: false,
            error: null
          })
          return { success: true }
        }
        set({ isLoading: false })
        return { success: false, error: '로그인에 실패했습니다.' }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '로그인 중 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    },
    signUpWithEmail: async (email: string, password: string, userData?: Partial<UserProfile>) => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await authUtils.signUpWithEmail(email, password, userData)
        if (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
        if (data.user && data.session) {
          set({
            user: data.user as User,
            session: data.session as Session,
            isLoading: false,
            error: null
          })
          return { success: true }
        }
        set({ isLoading: false })
        return { success: true }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    },
    signInWithProvider: async (provider: 'google') => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await authUtils.signInWithProvider(provider)
        if (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
        set({ isLoading: false })
        return { success: true }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '소셜 로그인 중 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    },
    signOut: async () => {
      set({ isLoading: true, error: null })
      try {
        const { error } = await authUtils.signOut()
        if (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
        set({
          user: null,
          session: null,
          isLoading: false,
          error: null
        })
        return { success: true }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '로그아웃 중 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    },
    resetPassword: async (email: string) => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await authUtils.resetPassword(email)
        if (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
        set({ isLoading: false })
        return { success: true }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '비밀번호 재설정 중 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    },
    updatePassword: async (password: string) => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await authUtils.updatePassword(password)
        if (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
        set({ isLoading: false })
        return { success: true }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '비밀번호 업데이트 중 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    },
    updateProfile: async (updates: Partial<UserProfile>) => {
      set({ isLoading: true, error: null })
      try {
        const { data, error } = await authUtils.updateProfile(updates)
        if (error) {
          set({ error: error.message, isLoading: false })
          return { success: false, error: error.message }
        }
        if (data.user) {
          set({
            user: data.user as User,
            isLoading: false,
            error: null
          })
        }
        set({ isLoading: false })
        return { success: true }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : '프로필 업데이트 중 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
        return { success: false, error: errorMessage }
      }
    },
    setUser: (user: User | null) => set({ user }),
    setSession: (session: Session | null) => set({ session }),
    setLoading: (isLoading: boolean) => set({ isLoading }),
    setError: (error: string | null) => set({ error }),
    clearError: () => set({ error: null }),
    initialize: async () => {
      set({ isLoading: true })
      try {
        const { data: { session }, error } = await authUtils.getSession()
        if (error) {
          set({ isLoading: false })
          return
        }
        if (session?.user) {
          const { user, error: userError } = await authUtils.getUser()
          if (userError) {
            set({ isLoading: false })
            return
          }
          set({
            user: user as User,
            session: session as Session,
            isLoading: false,
          })
        } else {
          set({
            user: null,
            session: null,
            isLoading: false,
          })
        }
      } catch (error) {
        set({ isLoading: false })
      }
    },
  })
) 