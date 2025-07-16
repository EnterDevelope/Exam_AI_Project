import type { Database } from './supabase';

export type AuthUser = Database['public']['Tables']['users']['Row'];

export type SupabaseAuthUser = {
  id: string;
  email: string | null;
  app_metadata: any;
  user_metadata: any;
  created_at?: string;
  updated_at?: string;
  // 필요시 Supabase Auth User의 다른 필드도 추가
};

export type AuthSession = {
  access_token: string;
  token_type: string;
  user: SupabaseAuthUser;
  expires_in: number;
  refresh_token: string;
  provider_token?: string;
  provider_refresh_token?: string;
  expires_at?: number;
}; // 실제 세부 구조는 Supabase SDK에 맞게 필요시 수정

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  error: string | null;
}

export type AuthProvider = 'google'; 