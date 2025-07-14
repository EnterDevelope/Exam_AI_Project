'use client'

import { useState } from 'react'

interface UserProfile {
  id: string
  nickname: string
  school: string
  major: string
  email: string
  avatar?: string
}

interface ProfileFormProps {
  profile: UserProfile
  onUpdate: (updatedProfile: Partial<UserProfile>) => Promise<void>
}

export default function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const [formData, setFormData] = useState({
    nickname: profile.nickname,
    school: profile.school,
    major: profile.major
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nickname.trim()) {
      newErrors.nickname = '닉네임을 입력해주세요'
    } else if (formData.nickname.length < 2) {
      newErrors.nickname = '닉네임은 2자 이상이어야 합니다'
    } else if (formData.nickname.length > 20) {
      newErrors.nickname = '닉네임은 20자 이하여야 합니다'
    }

    if (!formData.school.trim()) {
      newErrors.school = '학교를 입력해주세요'
    }

    if (!formData.major.trim()) {
      newErrors.major = '전공을 입력해주세요'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    try {
      setIsLoading(true)
      await onUpdate(formData)
      // 성공 메시지 표시
    } catch (err) {
      // 에러 처리
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 검증 (512KB 제한)
    if (file.size > 512 * 1024) {
      alert('파일 크기는 512KB 이하여야 합니다')
      return
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다')
      return
    }

    try {
      // Mock 아바타 업로드 (실제로는 PUT /api/user/avatar 호출)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 성공 시 아바타 URL 업데이트
      const avatarUrl = URL.createObjectURL(file)
      await onUpdate({ avatar: avatarUrl })
    } catch (err) {
      alert('아바타 업로드에 실패했습니다')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 아바타 업로드 */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <img
            src={profile.avatar || '/api/placeholder/150/150'}
            alt="프로필 이미지"
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </label>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">프로필 이미지</h4>
          <p className="text-sm text-gray-600">512KB 이하의 이미지 파일을 업로드하세요</p>
        </div>
      </div>

      {/* 닉네임 */}
      <div>
        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
          닉네임
        </label>
        <input
          type="text"
          id="nickname"
          value={formData.nickname}
          onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nickname ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="닉네임을 입력하세요"
        />
        {errors.nickname && (
          <p className="mt-1 text-sm text-red-600">{errors.nickname}</p>
        )}
      </div>

      {/* 학교 */}
      <div>
        <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
          학교
        </label>
        <input
          type="text"
          id="school"
          value={formData.school}
          onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.school ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="학교를 입력하세요"
        />
        {errors.school && (
          <p className="mt-1 text-sm text-red-600">{errors.school}</p>
        )}
      </div>

      {/* 전공 */}
      <div>
        <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-2">
          전공
        </label>
        <input
          type="text"
          id="major"
          value={formData.major}
          onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.major ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="전공을 입력하세요"
        />
        {errors.major && (
          <p className="mt-1 text-sm text-red-600">{errors.major}</p>
        )}
      </div>

      {/* 이메일 (읽기 전용) */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          이메일
        </label>
        <input
          type="email"
          id="email"
          value={profile.email}
          disabled
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
        />
        <p className="mt-1 text-sm text-gray-600">이메일은 변경할 수 없습니다</p>
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
} 