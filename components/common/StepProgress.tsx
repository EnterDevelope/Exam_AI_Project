interface StepProgressProps {
  current: number
  total: number
  className?: string
}

export default function StepProgress({ current, total, className = '' }: StepProgressProps) {
  const progress = (current / total) * 100

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-sm text-gray-600 min-w-[3rem] text-right">
        {Math.round(progress)}%
      </span>
    </div>
  )
} 