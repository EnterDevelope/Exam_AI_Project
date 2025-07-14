import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { QuizCompleteRequest } from '@/types/quiz'

export async function POST(req: Request) {
  try {
    const {
      questions,
      userAnswers,
      correctAnswers,
      totalQuestions,
      subject,
      week
    }: QuizCompleteRequest = await req.json()

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

    // 퀴즈 결과 저장
    const { data: quizData, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        user_id: user.id,
        summary_id: null, // 추후 요약 ID와 연결
        questions: questions,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (quizError) {
      console.error('Quiz save error:', quizError)
      return NextResponse.json(
        { error: '퀴즈 결과 저장에 실패했습니다.' },
        { status: 500 }
      )
    }

    // 오답 노트 저장
    const wrongAnswers = []
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] !== questions[i].answer) {
        wrongAnswers.push({
          quiz_id: quizData.id,
          user_id: user.id,
          question_index: i,
          user_answer: userAnswers[i] || '',
          correct_answer: questions[i].answer,
          explanation: questions[i].explanation || null
        })
      }
    }

    if (wrongAnswers.length > 0) {
      const { error: wrongAnswerError } = await supabase
        .from('wrong_answers')
        .insert(wrongAnswers)

      if (wrongAnswerError) {
        console.error('Wrong answer save error:', wrongAnswerError)
        // 오답 저장 실패해도 퀴즈 결과는 반환
      }
    }

    return NextResponse.json({
      success: true,
      quizId: quizData.id,
      score: Math.round((correctAnswers / totalQuestions) * 100),
      correctAnswers,
      totalQuestions,
      wrongAnswersCount: wrongAnswers.length
    })

  } catch (error) {
    console.error('Quiz complete API error:', error)
    return NextResponse.json(
      { error: '퀴즈 완료 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 