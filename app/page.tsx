import FeatureCard from '@/components/common/FeatureCard';
import FileUploader from '@/components/common/FileUploader';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col md:flex-row items-center justify-between py-16 gap-8 px-4">
          <div className="flex-1 flex flex-col gap-6">
            <h1 className="text-4xl font-bold mb-2">AI Summary Note</h1>
            <p className="text-lg text-gray-600 mb-4">Upload your lecture file and get instant summaries and quizzes</p>
            <FileUploader />
            <div className="flex gap-3">
              <button className="btn-primary flex items-center gap-2 bg-white text-black border border-gray-300 hover:bg-gray-100">
                <span role="img" aria-label="review">📚</span> Continue Reviewing
              </button>
              <button className="btn-primary flex items-center gap-2 bg-black text-white">
                <span role="img" aria-label="new">✨</span> Start New Summary
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-[340px] h-[200px] bg-gray-200 rounded-lg" />
          </div>
        </section>
        {/* Features Section */}
        <section className="border-t py-16 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              <FeatureCard
                title="AI-Powered Summaries"
                description="Instantly generate concise and informative summaries from your lecture files."
              />
              <FeatureCard
                title="Custom Quizzes for Exams"
                description="Create and take personalized quizzes to prepare for your exams."
              />
              <FeatureCard
                title="Mistake Tracking and Feedback"
                description="Track mistakes and receive constructive feedback for effective learning."
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
