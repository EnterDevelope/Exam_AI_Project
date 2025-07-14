'use client'

type TabType = 'overview' | 'summaries' | 'quizzes' | 'settings'

interface TabNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs = [
  { id: 'overview' as TabType, label: '개요', icon: '📊' },
  { id: 'summaries' as TabType, label: '요약', icon: '📝' },
  { id: 'quizzes' as TabType, label: '퀴즈', icon: '❓' },
  { id: 'settings' as TabType, label: '설정', icon: '⚙️' },
]

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  return (
    <nav className="flex space-x-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
} 