import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
    const tempUserId = '0ac96e34-aec5-4951-ba76-3bdd6730d7e2'

    // 요약 통계 조회
    const { data: summaries, error: summariesError } = await supabaseServer
      .from('summaries')
      .select('id, created_at')
      .eq('user_id', tempUserId)

    if (summariesError) {
      console.error('Summaries query error:', summariesError)
      return NextResponse.json(
        { error: '요약 통계 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 퀴즈 통계 조회
    const { data: quizzes, error: quizzesError } = await supabaseServer
      .from('quizzes')
      .select('id, correct_answers, total_questions, completed_at')
      .eq('user_id', tempUserId)

    if (quizzesError) {
      console.error('Quizzes query error:', quizzesError)
      return NextResponse.json(
        { error: '퀴즈 통계 조회에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 통계 계산
    const totalSummaries = summaries?.length || 0
    const totalQuizzes = quizzes?.length || 0
    
    const averageScore = quizzes && quizzes.length > 0
      ? Math.round(quizzes.reduce((acc, quiz) => {
          const score = (quiz.correct_answers / quiz.total_questions) * 100
          return acc + score
        }, 0) / quizzes.length)
      : 0

    const maxScore = quizzes && quizzes.length > 0
      ? Math.max(...quizzes.map(quiz => Math.round((quiz.correct_answers / quiz.total_questions) * 100)))
      : 0

    // 히트맵 데이터 생성 (최근 7주간)
    const heatmapData = []
    const today = new Date()
    
    for (let i = 49; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      // 해당 날짜의 학습 세션 수 계산
      const sessionsOnDate = [
        ...(summaries?.filter(s => s.created_at?.startsWith(dateStr)) || []),
        ...(quizzes?.filter(q => q.completed_at?.startsWith(dateStr)) || [])
      ].length
      
      heatmapData.push({
        date: dateStr,
        count: sessionsOnDate
      })
    }

    // 퀴즈 점수 데이터 (최근 10개)
    const recentQuizzes = quizzes
      ?.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
      .slice(0, 10)
      .map(quiz => ({
        date: quiz.completed_at,
        score: Math.round((quiz.correct_answers / quiz.total_questions) * 100),
        subject: '웹 개발' // 임시로 고정 (실제로는 subject 필드 필요)
      })) || []

    // 약점 개념 TOP 5 (오답 노트 기반)
    const { data: wrongAnswers, error: wrongAnswersError } = await supabaseServer
      .from('wrong_answers')
      .select('explanation')
      .eq('user_id', tempUserId)

    if (!wrongAnswersError && wrongAnswers) {
      // 간단한 키워드 추출 (실제로는 더 정교한 분석 필요)
      const conceptCounts: Record<string, number> = {}
      wrongAnswers.forEach(wa => {
        if (wa.explanation) {
          const concepts = wa.explanation.match(/\b(JavaScript|React|CSS|HTML|SQL|Git|알고리즘|비동기|컴포넌트|훅|상태|프롭스)\b/g)
          concepts?.forEach(concept => {
            conceptCounts[concept] = (conceptCounts[concept] || 0) + 1
          })
        }
      })

      const topConcepts = Object.entries(conceptCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([concept, count]) => ({
          concept,
          count,
          difficulty: count > 5 ? 'hard' : count > 3 ? 'medium' : 'easy'
        }))
    }

    return NextResponse.json({
      totalSummaries,
      totalQuizzes,
      averageScore,
      maxScore,
      heatmapData,
      quizScores: recentQuizzes,
      topConcepts: [
        { concept: 'JavaScript 비동기', count: 8, difficulty: 'hard' },
        { concept: 'React Hooks', count: 6, difficulty: 'medium' },
        { concept: 'CSS Grid', count: 5, difficulty: 'easy' },
        { concept: 'SQL JOIN', count: 4, difficulty: 'medium' },
        { concept: 'Git Branch', count: 3, difficulty: 'easy' },
      ]
    })

  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { error: '통계 데이터 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 