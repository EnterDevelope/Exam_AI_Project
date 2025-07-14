import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner />
        <p className="mt-4 text-gray-600">페이지를 불러오는 중...</p>
      </div>
    </div>
  )
} 