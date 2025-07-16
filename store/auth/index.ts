import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authUtils } from '@/lib/supabase/auth';
import type { AuthState, AuthUser, AuthSession, AuthProvider } from '@/types/auth';

interface AuthStore extends AuthState {
  // 액션들
  signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUpWithEmail: (email: string, password: string, userData?: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
  signInWithProvider: (provider: AuthProvider) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ success: boolean; error?: string }>
  setUser: (user: AuthUser | null) => void
  setSession: (session: AuthSession | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  initialize: () => Promise<void>
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  error: null
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 이메일/비밀번호 로그인
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
              user: data.user as AuthUser,
              session: data.session,
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

      // 이메일/비밀번호 회원가입
      signUpWithEmail: async (email: string, password: string, userData?: Partial<AuthUser>) => {
        set({ isLoading: true, error: null })
        
        try {
          const { data, error } = await authUtils.signUpWithEmail(email, password, userData)
          
          if (error) {
            set({ error: error.message, isLoading: false })
            return { success: false, error: error.message }
          }

          if (data.user && data.session) {
            set({
              user: data.user as AuthUser,
              session: data.session,
              isLoading: false,
              error: null
            })
            return { success: true }
          }

          set({ isLoading: false })
          return { success: true } // 이메일 확인이 필요한 경우
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.'
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      // 소셜 로그인
      signInWithProvider: async (provider: AuthProvider) => {
        set({ isLoading: true, error: null })
        
        try {
          const { data, error } = await authUtils.signInWithProvider(provider)
          
          if (error) {
            set({ error: error.message, isLoading: false })
            return { success: false, error: error.message }
          }

          // OAuth는 리다이렉트되므로 여기서는 성공으로 처리
          set({ isLoading: false })
          return { success: true }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '소셜 로그인 중 오류가 발생했습니다.'
          set({ error: errorMessage, isLoading: false })
          return { success: false, error: errorMessage }
        }
      },

      // 로그아웃
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

      // 비밀번호 재설정
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

      // 비밀번호 업데이트
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

      // 프로필 업데이트
      updateProfile: async (updates: Partial<AuthUser>) => {
        set({ isLoading: true, error: null })
        
        try {
          const { data, error } = await authUtils.updateProfile(updates)
          
          if (error) {
            set({ error: error.message, isLoading: false })
            return { success: false, error: error.message }
          }

          if (data.user) {
            set({
              user: data.user as AuthUser,
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

      // 상태 설정 액션들
      setUser: (user: AuthUser | null) => set({ user }),
      setSession: (session: AuthSession | null) => set({ session }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setError: (error: string | null) => set({ error }),
      clearError: () => set({ error: null }),

      // 초기화
      initialize: async () => {
        set({ isLoading: true })
        try {
          console.log('AuthStore: initialize() called');
          const { data: { session }, error } = await authUtils.getSession()
          console.log('AuthStore: getSession result', session, error);

          if (error) {
            console.error('Session error:', error)
            set({ isLoading: false })
            return
          }

          if (session?.user) {
            const { user, error: userError } = await authUtils.getUser()
            console.log('AuthStore: getUser result', user, userError);

            if (userError) {
              console.error('User error:', userError)
              set({ isLoading: false })
              return
            }

            set({
              user: user as AuthUser,
              session,
              isLoading: false,
              error: null
            })
          } else {
            set({
              user: null,
              session: null,
              isLoading: false,
              error: null
            })
          }
        } catch (error) {
          console.error('Auth initialization error:', error)
          set({ isLoading: false })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session
      }),
      skipHydration: true
    }
  )
) 