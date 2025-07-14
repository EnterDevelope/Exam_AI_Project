'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import Button from '@/components/common/Button'
import FeatureCard from '@/components/common/FeatureCard'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import Link from 'next/link'

export default function HomePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Summary Note
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              PDF, HWP, 이미지 파일을 업로드하면 AI가 자동으로 요약하고 퀴즈를 생성해주는 
              <span className="text-blue-600 font-semibold"> 스마트 학습 도우미</span>입니다
            </p>
            
            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/summary">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors">
                    새로운 요약 시작하기
                  </Button>
                </Link>
                <Link href="/mypage">
                  <Button className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-colors">
                    학습 복습 이어하기
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors">
                    시작하기
                  </Button>
                </Link>
                <Link href="/login?next=/summary">
                  <Button className="bg-white hover:bg-gray-50 text-blue-600 border-2 border-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-colors">
                    무료로 체험해보기
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              핵심 기능
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AI 기술을 활용한 혁신적인 학습 경험을 제공합니다
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<span>📄</span>}
              title="스마트 파일 업로드"
              description="PDF, HWP, 이미지 파일을 드래그 앤 드롭으로 간편하게 업로드하고 자동으로 텍스트를 추출합니다."
            />
            <FeatureCard
              icon={<span>🤖</span>}
              title="AI 요약 생성"
              description="Azure OpenAI를 활용하여 업로드된 자료를 자동으로 요약하고 핵심 내용을 정리해드립니다."
            />
            <FeatureCard
              icon={<span>📝</span>}
              title="맞춤형 퀴즈 생성"
              description="요약 내용을 바탕으로 객관식과 주관식 문제를 자동 생성하여 학습 효과를 극대화합니다."
            />
            <FeatureCard
              icon={<span>📊</span>}
              title="학습 진도 추적"
              description="개인별 퀴즈 이력과 오답 노트를 통해 학습 진도를 체계적으로 관리합니다."
            />
            <FeatureCard
              icon={<span>🎯</span>}
              title="오답 복습 시스템"
              description="틀린 문제를 중심으로 한 반복 학습을 통해 취약점을 보완합니다."
            />
            <FeatureCard
              icon={<span>📈</span>}
              title="학습 통계 분석"
              description="히트맵과 차트를 통해 학습 패턴을 시각적으로 분석하고 개선점을 파악합니다."
            />
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              사용 방법
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              3단계로 간편하게 학습 자료를 요약하고 퀴즈를 생성하세요
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">파일 업로드</h3>
              <p className="text-gray-600">
                PDF, HWP, 이미지 파일을 드래그 앤 드롭으로 업로드하세요
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI 요약</h3>
              <p className="text-gray-600">
                AI가 자동으로 텍스트를 추출하고 핵심 내용을 요약해드립니다
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">퀴즈 풀기</h3>
              <p className="text-gray-600">
                요약 내용을 바탕으로 생성된 퀴즈를 풀고 학습을 완성하세요
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            지금 시작하세요
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            AI Summary Note와 함께 더 효율적이고 즐거운 학습을 경험해보세요
          </p>
          
          {user ? (
            <Link href="/summary">
              <Button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-colors">
                요약 시작하기
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-colors">
                무료로 시작하기
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
