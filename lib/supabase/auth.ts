import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// 인증 관련 타입
export type AuthUser = Database['public']['Tables']['users']['Row']
export type AuthSession = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']

// 인증 상태 타입
export interface AuthState {
  user: AuthUser | null
  session: AuthSession
  isLoading: boolean
  error: string | null
}

// 소셜 로그인 제공자 타입
export type AuthProvider = 'google' // 'kakao' 임시 제거

// 인증 관련 유틸리티 함수들
export const authUtils = {
  // 이메일/비밀번호로 로그인
  async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // 이메일/비밀번호로 회원가입
  async signUpWithEmail(email: string, password: string, userData?: Partial<AuthUser>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // 소셜 로그인
  async signInWithProvider(provider: AuthProvider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: provider === 'kakao' ? {
          // 카카오 로그인 시 이메일 없이 닉네임만으로 로그인
          scope: 'profile_nickname profile_image',
          // 이메일 요청하지 않음
          prompt: 'select_account'
        } : undefined
      }
    })
    return { data, error }
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // 현재 세션 가져오기
  async getSession() {
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },

  // 사용자 정보 가져오기
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // 비밀번호 재설정 이메일 발송
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  },

  // 비밀번호 업데이트
  async updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  },

  // 사용자 프로필 업데이트
  async updateProfile(updates: Partial<AuthUser>) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    return { data, error }
  },

  // 카카오 사용자 정보 처리 (이메일이 없는 경우)
  async handleKakaoUser(user: any) {
    if (user.app_metadata?.provider === 'kakao') {
      const kakaoId = user.user_metadata?.provider_id || user.id
      const nickname = user.user_metadata?.name || user.user_metadata?.nickname || '카카오 사용자'
      
      // 이메일이 없는 경우 임시 이메일 생성
      if (!user.email) {
        const tempEmail = `kakao_${kakaoId}@temp.kakao.com`
        
        // 사용자 메타데이터 업데이트
        const { error } = await supabase.auth.updateUser({
          data: {
            email: tempEmail,
            name: nickname,
            provider: 'kakao',
            kakao_id: kakaoId
          }
        })
        
        if (error) {
          console.error('Kakao user update error:', error)
        }
      }
    }
  }
}

// 인증 상태 변경 리스너
export const onAuthStateChange = (callback: (event: string, session: AuthSession) => void) => {
  return supabase.auth.onAuthStateChange(callback)
} 