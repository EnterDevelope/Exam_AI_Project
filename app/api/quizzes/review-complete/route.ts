import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, totalQuestions, correctAnswers, concepts } = body;
    
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

    const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // 복습 세션 결과 저장
    const { error: reviewError } = await supabase
      .from('quiz_reviews')
      .upsert({
        user_id: user.id,
        session_id: sessionId,
        total_questions: totalQuestions,
        correct_answers: correctAnswers,
        accuracy: accuracy,
        completed_at: new Date().toISOString()
      });

    if (reviewError) {
      console.error('복습 결과 저장 오류:', reviewError);
      return NextResponse.json({ error: '복습 결과를 저장하는데 실패했습니다' }, { status: 500 });
    }

    // 개념별 통계 업데이트
    for (const concept of concepts) {
      const { error: conceptError } = await supabase
        .from('concept_stats')
        .upsert({
          user_id: user.id,
          concept: concept,
          review_count: 1,
          last_reviewed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,concept'
        });

      if (conceptError) {
        console.error('개념 통계 업데이트 오류:', conceptError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      accuracy,
      totalQuestions,
      correctAnswers 
    });
  } catch (error) {
    console.error('복습 완료 API 오류:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
} 