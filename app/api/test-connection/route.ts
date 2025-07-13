import { NextRequest, NextResponse } from 'next/server';
import { testConnection } from '@/lib/api/openai';

export async function POST(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    
    return NextResponse.json({
      success: isConnected,
      message: isConnected ? 'Azure OpenAI 연결 성공' : 'Azure OpenAI 연결 실패'
    });
  } catch (error) {
    console.error('연결 테스트 오류:', error);
    return NextResponse.json({
      success: false,
      message: '연결 테스트 중 오류가 발생했습니다: ' + (error as Error).message
    }, { status: 500 });
  }
} 