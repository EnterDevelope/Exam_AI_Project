import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
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

    // 임시 사용자 ID (실제로는 인증된 사용자 ID 사용)
    const tempUserId = '0ac96e34-aec5-4951-ba76-3bdd6730d7e2'

    // 퀴즈 결과 저장
    const { data: quizData, error: quizError } = await supabaseServer
      .from('quizzes')
      .insert({
        user_id: tempUserId,
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
          user_id: tempUserId,
          question_index: i,
          user_answer: userAnswers[i] || '',
          correct_answer: questions[i].answer,
          explanation: questions[i].explanation || null
        })
      }
    }

    if (wrongAnswers.length > 0) {
      const { error: wrongAnswerError } = await supabaseServer
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
      correctAnswers,
      totalQuestions,
      accuracy: Math.round((correctAnswers / totalQuestions) * 100),
      wrongAnswersCount: wrongAnswers.length
    })

  } catch (error) {
    console.error('Quiz complete error:', error)
    return NextResponse.json(
      { error: '퀴즈 완료 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
} 