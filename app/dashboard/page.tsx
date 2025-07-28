'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import GreetingBanner from '@/components/dashboard/GreetingBanner';
import MetricCard from '@/components/dashboard/MetricCard';
import QuickActionButtons from '@/components/dashboard/QuickActionButtons';
import LearningProgressGrid from '@/components/dashboard/LearningProgressGrid';
import AnalyticsPreview from '@/components/dashboard/AnalyticsPreview';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBanner from '@/components/common/ErrorBanner';

interface DashboardData {
  averageScore: number;
  averageDelta: number;
  summaryCount: number;
  summaryDelta: number;
  lastStudyDate: string;
  inProgress: Array<{
    id: string;
    type: 'summary' | 'quiz';
    title: string;
    progress: number;
    score?: number;
    lastUpdated: string;
  }>;
  weeklyProgress: number[];
  heatmap: Record<string, number>;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // TODO: 실제 API 호출로 교체
        // const response = await fetch('/api/dashboard');
        // const data = await response.json();
        
        // 임시 목 데이터
        const mockData: DashboardData = {
          averageScore: 87,
          averageDelta: 5,
          summaryCount: 24,
          summaryDelta: 2,
          lastStudyDate: '2025-07-28',
          inProgress: [
            {
              id: 'sum_123',
              type: 'summary',
              title: '데이터 구조와 알고리즘',
              progress: 75,
              lastUpdated: '오늘'
            },
            {
              id: 'sum_124',
              type: 'summary',
              title: '머신러닝 기초 개념',
              progress: 40,
              lastUpdated: '어제'
            },
            {
              id: 'quiz_987',
              type: 'quiz',
              title: '네트워크 보안 개론',
              progress: 100,
              score: 85,
              lastUpdated: '3일 전'
            }
          ],
          weeklyProgress: [0, 4, 12, 0, 8, 0, 0],
          heatmap: {
            '2025-07-01': 2,
            '2025-07-02': 4,
            '2025-07-03': 1,
            '2025-07-04': 3,
            '2025-07-05': 2,
            '2025-07-06': 0,
            '2025-07-07': 1
          }
        };
        
        setDashboardData(mockData);
      } catch (err) {
        setError('대시보드 데이터를 불러오는데 실패했습니다.');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorBanner message={error} onRetry={() => window.location.reload()} />
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            데이터를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600">
            잠시 후 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <GreetingBanner userName={user?.user_metadata?.full_name || user?.email || '사용자'} />
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          label="평균 점수"
          value={dashboardData.averageScore}
          delta={dashboardData.averageDelta}
          trend="up"
          unit="점"
        />
        <MetricCard
          label="완료 요약"
          value={dashboardData.summaryCount}
          delta={dashboardData.summaryDelta}
          trend="up"
          unit="개"
        />
        <MetricCard
          label="마지막 학습일"
          value={dashboardData.lastStudyDate}
          trend="neutral"
          isDate={true}
        />
      </div>

      {/* Quick Action Buttons */}
      <QuickActionButtons />

      {/* Progress Grid */}
      <LearningProgressGrid items={dashboardData.inProgress} />

      {/* Analytics Preview */}
      <AnalyticsPreview
        weeklyProgress={dashboardData.weeklyProgress}
        heatmapData={dashboardData.heatmap}
      />
    </div>
  );
} 