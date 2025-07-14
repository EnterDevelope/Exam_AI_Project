import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    // 사용자 인증 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: '유효하지 않은 토큰입니다' }, { status: 401 });
    }

    // 오답 목록 조회
    let query = supabase
      .from('quiz_answers')
      .select(`
        *,
        quiz_questions (
          id,
          question,
          options,
          correct_answer,
          explanation,
          concept
        )
      `)
      .eq('user_id', user.id)
      .eq('is_correct', false)
      .order('created_at', { ascending: false });

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data: wrongAnswers, error } = await query;

    if (error) {
      console.error('오답 조회 오류:', error);
      return NextResponse.json({ error: '오답 목록을 불러오는데 실패했습니다' }, { status: 500 });
    }

    // 중복 제거 및 그룹핑
    const uniqueQuestions = wrongAnswers.reduce((acc, answer) => {
      const questionId = answer.quiz_questions.id;
      if (!acc[questionId]) {
        acc[questionId] = {
          ...answer.quiz_questions,
          wrong_count: 1,
          last_wrong_at: answer.created_at
        };
      } else {
        acc[questionId].wrong_count += 1;
        if (new Date(answer.created_at) > new Date(acc[questionId].last_wrong_at)) {
          acc[questionId].last_wrong_at = answer.created_at;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    const questions = Object.values(uniqueQuestions);

    return NextResponse.json({ questions });
  } catch (error) {
    console.error('오답 조회 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
} 