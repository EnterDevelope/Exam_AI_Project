'use client'

import { useEffect } from 'react'
import ErrorBanner from '@/components/common/ErrorBanner'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6">
        <ErrorBanner 
          message="페이지 로딩 중 오류가 발생했습니다." 
          onRetry={reset}
        />
      </div>
    </div>
  )
} 