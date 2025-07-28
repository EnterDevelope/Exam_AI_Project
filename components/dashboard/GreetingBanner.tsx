'use client';

interface GreetingBannerProps {
  userName: string;
}

export default function GreetingBanner({ userName }: GreetingBannerProps) {
  const today = new Date();
  const formattedDate = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요, {userName}님 👋
          </h1>
          <p className="text-gray-600 text-lg">
            오늘도 학습에 집중해보세요!
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <p className="text-sm text-gray-500">
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
} 