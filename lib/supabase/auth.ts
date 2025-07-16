'use client';
import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import type { UserProfile } from '@/types/auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Supabase 클라이언트는 반드시 클라이언트에서만 생성/사용해야 합니다.
if (typeof window !== 'undefined') {
  supabase.auth.getSession().then((res) => {
    console.log('[supabase.auth.getSession()]', res);
  });
}

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
  async signUpWithEmail(email: string, password: string, userData?: Partial<UserProfile>) {
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
  async signInWithProvider(provider: 'google' | 'kakao') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: provider === 'kakao' ? {
          scope: 'profile_nickname profile_image',
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
  async updateProfile(updates: Partial<UserProfile>) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    })
    return { data, error }
  },
}

// 인증 상태 변경 리스너 (공식 시그니처)
export const onAuthStateChange = (callback: (event: AuthChangeEvent, session: Session | null) => void) => {
  return supabase.auth.onAuthStateChange(callback);
} 