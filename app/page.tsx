import FeatureCard from '@/components/common/FeatureCard';
import FileUploader from '@/components/common/FileUploader';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col md:flex-row items-center justify-between py-20 gap-12 px-6">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl font-bold mb-2">AI 요약노트</h1>
            <p className="text-lg text-gray-600 mb-4">강의 자료를 업로드하면 AI가 자동으로 요약과 퀴즈를 생성해 드립니다.</p>
            <FileUploader />
            <div className="flex gap-3 mt-2">
              <button className="btn-primary flex items-center gap-2 bg-white text-brand border border-brand hover:bg-brand-light">
                <span role="img" aria-label="review">📚</span> 복습 이어하기
              </button>
              <button className="btn-primary flex items-center gap-2">
                <span role="img" aria-label="new">✨</span> 신규 요약 시작
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-[380px] h-[220px] bg-gray-200 rounded-lg" />
          </div>
        </section>
        {/* Features Section */}
        <section className="border-t py-20 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">주요 기능</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              <FeatureCard
                title="AI 자동 요약"
                description="강의자료에서 핵심 개념과 내용을 빠르게 요약해 드립니다."
              />
              <FeatureCard
                title="맞춤형 퀴즈 생성"
                description="요약본을 바탕으로 객관식·단답형 퀴즈를 자동으로 만들어 드립니다."
              />
              <FeatureCard
                title="오답 추적 및 피드백"
                description="오답을 자동 저장하고, 해설과 함께 반복 복습을 지원합니다."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
