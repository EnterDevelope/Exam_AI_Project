import { NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/parser/textExtractor';

export async function POST(req: Request) {
  console.log('[API /upload] 요청 시작');
  
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    console.log('[API /upload] 파일 정보:', {
      hasFile: !!file,
      isFileInstance: file instanceof File,
      fileName: file instanceof File ? file.name : 'N/A',
      fileSize: file instanceof File ? file.size : 'N/A',
      fileType: file instanceof File ? file.type : 'N/A'
    });

    if (!file || !(file instanceof File)) {
      console.log('[API /upload] 파일 검증 실패: 파일이 없거나 올바르지 않음');
      return NextResponse.json({ error: '파일이 필요합니다.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      console.log('[API /upload] 파일 크기 초과:', file.size);
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    console.log('[API /upload] 텍스트 추출 시작...');
    const { text, fileType } = await extractTextFromFile(file);
    
    console.log('[API /upload] 텍스트 추출 성공:', {
      fileType,
      textLength: text.length,
      textPreview: text.substring(0, 100) + '...'
    });
    
    return NextResponse.json({ 
      text, 
      fileType,
      success: true,
      message: '파일 업로드 및 텍스트 추출이 완료되었습니다.'
    });
  } catch (err) {
    console.error('[API /upload] 오류 발생:', err);
    
    // 더 상세한 오류 정보 제공
    let errorMessage = '텍스트 추출에 실패했습니다.';
    let errorDetails = '';
    
    if (err instanceof Error) {
      errorMessage = err.message;
      errorDetails = err.stack || '';
      console.error('[API /upload] 오류 스택:', errorDetails);
    }
    
    // 항상 JSON 응답 반환
    return NextResponse.json({ 
      error: errorMessage,
      success: false,
      details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
    }, { status: 500 });
  }
}
