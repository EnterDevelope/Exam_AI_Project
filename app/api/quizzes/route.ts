import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const subject = searchParams.get('subject')
    const period = searchParams.get('period')
    
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    // 인증된 사용자 정보 가져오기
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: '인증되지 않은 사용자입니다.' },
        { status: 401 }
      )
    }

    // 기본 쿼리 구성
    let query = supabase
      .from('quizzes')
      .select(`
        id,
        correct_answers,
        total_questions,
        completed_at,
        wrong_answers!inner(user_id)
      `)
      .eq('user_id', user.id)
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
      score: quiz.total_questions > 0 
        ? Math.round((quiz.correct_answers / quiz.total_questions) * 100)
        : 0,
      correctAnswers: quiz.correct_answers,
      totalQuestions: quiz.total_questions,
      completedAt: quiz.completed_at,
      wrongAnswersCount: quiz.wrong_answers?.length || 0
    })) || []

    return NextResponse.json({
      quizzes: formattedQuizzes,
      total: formattedQuizzes.length
    })

  } catch (error) {
    console.error('Quizzes API error:', error)
    return NextResponse.json(
      { error: '퀴즈 히스토리 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 