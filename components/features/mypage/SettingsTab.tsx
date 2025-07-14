'use client'

import { useState, useEffect } from 'react'
import ProfileForm from './ProfileForm'
import ToggleRow from './ToggleRow'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorBanner from '@/components/common/ErrorBanner'

interface UserProfile {
  id: string
  nickname: string
  school: string
  major: string
  email: string
  avatar?: string
  notificationPrefs: {
    wrongAnswerAlert: boolean
    weeklyReport: boolean
    newFeatureAlert: boolean
  }
}

export default function SettingsTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/user')
        
        if (!response.ok) {
          throw new Error('프로필 정보 조회에 실패했습니다.')
        }
        
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError('프로필 정보를 불러오는데 실패했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleProfileUpdate = async (updatedProfile: Partial<UserProfile>) => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProfile),
      })
      
      if (!response.ok) {
        throw new Error('프로필 업데이트에 실패했습니다.')
      }
      
      const data = await response.json()
      setProfile(data.user)
      // 성공 메시지 표시
    } catch (err) {
      setError('프로필 업데이트에 실패했습니다.')
    }
  }

  const handleNotificationToggle = async (key: keyof UserProfile['notificationPrefs']) => {
    if (!profile) return
    
    try {
      const updatedPrefs = {
        ...profile.notificationPrefs,
        [key]: !profile.notificationPrefs[key]
      }
      
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationPrefs: updatedPrefs
        }),
      })
      
      if (!response.ok) {
        throw new Error('알림 설정 업데이트에 실패했습니다.')
      }
      
      const data = await response.json()
      setProfile(data.user)
    } catch (err) {
      setError('알림 설정 업데이트에 실패했습니다.')
    }
  }

  const handleDataExport = async () => {
    try {
      setIsExporting(true)
      
      // Mock 데이터 내보내기 (실제로는 서버 사이드 job)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // 다운로드 링크 생성 (실제로는 서버에서 생성한 URL)
      const link = document.createElement('a')
      link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
        summaries: [],
        quizzes: [],
        profile: profile
      }, null, 2))
      link.download = `ai-summary-note-data-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      setIsExporting(false)
    } catch (err) {
      setError('데이터 내보내기에 실패했습니다.')
      setIsExporting(false)
    }
  }

  const handleAccountDelete = async () => {
    try {
      // Mock 계정 삭제 (실제로는 DELETE /api/user 호출)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 로그아웃 처리
      // router.push('/login')
    } catch (err) {
      setError('계정 삭제에 실패했습니다.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <ErrorBanner message={error} />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* 프로필 설정 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">프로필 설정</h3>
        </div>
        <div className="p-6">
          <ProfileForm profile={profile} onUpdate={handleProfileUpdate} />
        </div>
      </div>

      {/* 알림 설정 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">알림 설정</h3>
        </div>
        <div className="p-6 space-y-4">
          <ToggleRow
            label="오답 알림 받기"
            description="틀린 문제에 대한 해설 알림을 받습니다"
            checked={profile.notificationPrefs.wrongAnswerAlert}
            onChange={() => handleNotificationToggle('wrongAnswerAlert')}
          />
          <ToggleRow
            label="주간 학습 리포트"
            description="매주 학습 현황 요약을 받습니다"
            checked={profile.notificationPrefs.weeklyReport}
            onChange={() => handleNotificationToggle('weeklyReport')}
          />
          <ToggleRow
            label="새 기능 알림"
            description="새로운 기능 업데이트 알림을 받습니다"
            checked={profile.notificationPrefs.newFeatureAlert}
            onChange={() => handleNotificationToggle('newFeatureAlert')}
          />
        </div>
      </div>

      {/* 데이터 관리 */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">데이터 관리</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">데이터 내보내기</h4>
              <p className="text-sm text-gray-600">요약과 퀴즈 데이터를 JSON 형식으로 다운로드합니다</p>
            </div>
            <button
              onClick={handleDataExport}
              disabled={isExporting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? '내보내는 중...' : '내보내기'}
            </button>
          </div>
        </div>
      </div>

      {/* 계정 삭제 */}
      <div className="bg-red-50 rounded-lg border border-red-200">
        <div className="px-6 py-4 border-b border-red-200">
          <h3 className="text-lg font-semibold text-red-900">계정 삭제</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-red-900">계정 영구 삭제</h4>
              <p className="text-sm text-red-700 mt-1">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              계정 삭제
            </button>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 삭제 확인</h3>
            <p className="text-gray-600 mb-6">
              정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAccountDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 