import type { Database } from './supabase';

// DB Row 타입만 남기고, 인증 관련 커스텀 타입은 모두 삭제
export type UserProfile = Database['public']['Tables']['users']['Row']; 