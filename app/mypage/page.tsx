'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TabNav from '@/components/features/mypage/TabNav'
import OverviewTab from '@/components/features/mypage/OverviewTab'
import SummariesTab from '@/components/features/mypage/SummariesTab'
import QuizzesTab from '@/components/features/mypage/QuizzesTab'
import SettingsTab from '@/components/features/mypage/SettingsTab'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBanner from '@/components/common/ErrorBanner'
import { useAuth } from '@/components/auth/AuthProvider';

type TabType = 'overview' | 'summaries' | 'quizzes' | 'settings'

export default function MyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user, isLoading } = useAuth();
  console.log('[MyPage] useAuth:', { user, isLoading });
  if (!user) {
    throw new Error('useAuth() returned undefined! Context 연결 문제');
  }
  console.log('MyPage useAuth:', {
    user,
    isLoading: authLoading,
    userType: typeof user,
    userString: JSON.stringify(user),
    isUserNull: user === null,
    isUserUndefined: user === undefined
  });

  // URL 파라미터에서 탭 확인
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType
    if (tab && ['overview', 'summaries', 'quizzes', 'settings'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // 탭 변경 핸들러
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    router.push(`/mypage?tab=${tab}`)
  }

  // 탭별 컴포넌트 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />
      case 'summaries':
        return <SummariesTab />
      case 'quizzes':
        return <QuizzesTab />
      case 'settings':
        return <SettingsTab />
      default:
        return <OverviewTab />
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login?next=/mypage');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    console.log('MyPage: authLoading true, 스피너만 렌더링');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    console.log('MyPage: user 없음, null 반환');
    return null;
  }

  console.log('MyPage: 메인 콘텐츠 렌더링', { user, authLoading });
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorBanner message={error} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">마이페이지</h1>
              <p className="text-gray-600 mt-1">학습 현황과 설정을 관리하세요</p>
            </div>
            <nav className="flex space-x-4">
              <button
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                홈
              </button>
              <button
                onClick={() => router.push('/summary')}
                className="text-gray-600 hover:text-gray-900"
              >
                요약
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <TabNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderTabContent()}
      </main>
    </div>
  )
} 