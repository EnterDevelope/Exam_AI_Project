'use client'

interface KpiCardProps {
  label: string
  value: string | number
  delta?: {
    value: number
    isPositive: boolean
  }
  icon?: string
  className?: string
}

export default function KpiCard({ label, value, delta, icon, className = '' }: KpiCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {delta && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  delta.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {delta.isPositive ? '+' : ''}{delta.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs 지난 주</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-3xl text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
} 