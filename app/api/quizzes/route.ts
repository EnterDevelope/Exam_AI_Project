import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const period = searchParams.get('period')
    
    // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
    const tempUserId = '0ac96e34-aec5-4951-ba76-3bdd6730d7e2'

    // 기본 쿼리 구성
    let query = supabaseServer
      .from('quizzes')
      .select(`
        id,
        correct_answers,
        total_questions,
        completed_at,
        wrong_answers!inner(user_id)
      `)
      .eq('user_id', tempUserId)
      .order('completed_at', { ascending: false })

    // 기간 필터 적용
    if (period && period !== 'all') {
      const now = new Date()
      let startDate: Date
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case 'quarter':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0) // 모든 기간
      }
      
      query = query.gte('completed_at', startDate.toISOString())
    }

    const { data: quizzes, error } = await query

    if (error) {
      console.error('Quizzes query error:', error)
      return NextResponse.json(
        { error: '퀴즈 히스토리 조회에 실패했습니다.', details: error.message },
        { status: 500 }
      )
    }

    // 응답 데이터 변환
    const formattedQuizzes = quizzes?.map(quiz => ({
      id: quiz.id,
      subject: '웹 개발', // 임시로 고정 (실제로는 summary와 연결 필요)
      week: '1주차', // 임시로 고정 (실제로는 summary와 연결 필요)
      score: Math.round((quiz.correct_answers / quiz.total_questions) * 100),
      totalQuestions: quiz.total_questions,
      correctAnswers: quiz.correct_answers,
      completedAt: quiz.completed_at,
      wrongAnswersCount: quiz.wrong_answers?.length || 0
    })) || []

    return NextResponse.json(formattedQuizzes)

  } catch (error) {
    console.error('Quizzes API error:', error)
    return NextResponse.json(
      { error: '퀴즈 히스토리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 