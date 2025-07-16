import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'
import type { WrongAnswer } from '@/types/quiz';

type User = Database['public']['Tables']['users']['Row']
type Summary = Database['public']['Tables']['summaries']['Row']
type Quiz = Database['public']['Tables']['quizzes']['Row']

// 사용자 관련 훅
export function useUser(userId: string | null) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setUser(null)
      setIsLoading(false)
      return
    }

    const fetchUser = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) throw error
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : '사용자 정보를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  return { user, isLoading, error }
}

// 요약 히스토리 훅
export function useSummaryHistory(userId: string | null) {
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setSummaries([])
      setIsLoading(false)
      return
    }

    const fetchSummaries = async () => {
      try {
        const { data, error } = await supabase
          .from('summaries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) throw error
        setSummaries(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : '요약 히스토리를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummaries()
  }, [userId])

  return { summaries, isLoading, error }
}

// 요약 저장 함수
export async function saveSummary(summaryData: {
  user_id: string
  subject: string
  week_number?: number
  original_text: string
  summary_content: string
  summary_style?: string
  file_name?: string
  file_type?: string
}) {
  const { data, error } = await supabase
    .from('summaries')
    .insert(summaryData)
    .select()
    .single()

  if (error) throw error
  return data
}

// 퀴즈 저장 함수
export async function saveQuiz(quizData: {
  summary_id: string
  user_id: string
  questions: any
  total_questions: number
  correct_answers?: number
  completed_at?: string
}) {
  const { data, error } = await supabase
    .from('quizzes')
    .insert(quizData)
    .select()
    .single()

  if (error) throw error
  return data
}

// 오답 저장 함수
export async function saveWrongAnswer(wrongAnswerData: {
  quiz_id: string
  user_id: string
  question_index: number
  user_answer?: string
  correct_answer: string
  explanation?: string
}) {
  const { data, error } = await supabase
    .from('wrong_answers')
    .insert(wrongAnswerData)
    .select()
    .single()

  if (error) throw error
  return data
} 