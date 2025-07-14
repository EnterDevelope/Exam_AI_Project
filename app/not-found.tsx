import Link from 'next/link'
import CTAButton from '@/components/common/CTAButton'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto p-6 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-gray-600">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <CTAButton variant="primary" className="w-full">
              홈으로 돌아가기
            </CTAButton>
          </Link>
          
          <Link href="/summary">
            <CTAButton variant="ghost" className="w-full">
              요약 시작하기
            </CTAButton>
          </Link>
        </div>
      </div>
    </div>
  )
} 