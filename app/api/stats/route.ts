import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  try {
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

    // 퀴즈 통계 조회
    const { data: quizStats, error: quizError } = await supabase
      .from('quizzes')
      .select('correct_answers, total_questions, completed_at')
      .eq('user_id', user.id)

    if (quizError) {
      console.error('Quiz stats error:', quizError)
      return NextResponse.json(
        { error: '퀴즈 통계 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 요약 통계 조회
    const { data: summaryStats, error: summaryError } = await supabase
      .from('summaries')
      .select('created_at')
      .eq('user_id', user.id)

    if (summaryError) {
      console.error('Summary stats error:', summaryError)
      return NextResponse.json(
        { error: '요약 통계 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 통계 계산
    const totalQuizzes = quizStats?.length || 0
    const totalSummaries = summaryStats?.length || 0
    
    let averageScore = 0
    let totalQuestions = 0
    let totalCorrect = 0

    if (quizStats && quizStats.length > 0) {
      totalQuestions = quizStats.reduce((sum, quiz) => sum + (quiz.total_questions || 0), 0)
      totalCorrect = quizStats.reduce((sum, quiz) => sum + (quiz.correct_answers || 0), 0)
      averageScore = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    }

    // 최근 활동일 계산
    const lastQuizDate = quizStats && quizStats.length > 0 
      ? new Date(Math.max(...quizStats.map(q => new Date(q.completed_at || '').getTime())))
      : null

    const lastSummaryDate = summaryStats && summaryStats.length > 0
      ? new Date(Math.max(...summaryStats.map(s => new Date(s.created_at).getTime())))
      : null

    const lastActivityDate = lastQuizDate && lastSummaryDate
      ? new Date(Math.max(lastQuizDate.getTime(), lastSummaryDate.getTime()))
      : lastQuizDate || lastSummaryDate

    const daysSinceLastActivity = lastActivityDate
      ? Math.floor((new Date().getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24))
      : null

    return NextResponse.json({
      totalQuizzes,
      totalSummaries,
      averageScore,
      totalQuestions,
      totalCorrect,
      lastActivityDate: lastActivityDate?.toISOString(),
      daysSinceLastActivity,
      streak: 0 // 추후 연속 학습일 계산 로직 추가
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: '통계 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 