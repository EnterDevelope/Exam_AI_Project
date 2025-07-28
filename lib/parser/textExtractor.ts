// PDF 처리를 위한 간단한 함수 (pdf2json 대신 직접 구현)
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // PDF 기본 텍스트 추출 시도
    const text = buffer.toString('utf8');
    
    // PDF에서 간단한 텍스트 패턴 추출
    const textMatches = text.match(/\((.*?)\)/g);
    if (textMatches && textMatches.length > 0) {
      const extractedText = textMatches
        .map(match => match.replace(/[()]/g, ''))
        .filter(text => text.length > 2)
        .join(' ');
      
      if (extractedText.length > 10) {
        return extractedText;
      }
    }
    
    // 기본 텍스트 추출 실패 시 안내 메시지
    throw new Error('PDF에서 텍스트를 추출할 수 없습니다. 텍스트가 포함된 PDF 파일인지 확인해주세요.');
  } catch (error) {
    throw new Error('PDF 파일 처리 중 오류가 발생했습니다. 다른 PDF 파일을 시도해보세요.');
  }
}

export async function extractTextFromFile(
  file: File
): Promise<{ text: string; fileType: 'pdf' | 'hwp' | 'image' }> {
  console.log('[textExtractor] 파일 처리 시작:', {
    name: file.name,
    size: file.size,
    type: file.type
  });

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type;
    const name = file.name.toLowerCase();

    console.log('[textExtractor] 버퍼 생성 완료, 크기:', buffer.length);

    // 빈 파일 체크
    if (buffer.length === 0) {
      throw new Error('빈 파일입니다. 내용이 있는 파일을 업로드해주세요.');
    }

    // PDF 파일 처리
    if (mime === 'application/pdf' || name.endsWith('.pdf')) {
      console.log('[textExtractor] PDF 파일 처리 시작');
      try {
        // PDF 파일 유효성 기본 체크
        if (buffer.length < 10) {
          throw new Error('PDF 파일이 너무 작습니다. 유효한 PDF 파일인지 확인해주세요.');
        }

        // PDF 헤더 체크 (더 유연하게)
        const header = buffer.toString('ascii', 0, Math.min(8, buffer.length));
        if (!header.includes('%PDF')) {
          throw new Error('유효한 PDF 파일이 아닙니다. PDF 헤더가 없습니다.');
        }

        console.log('[textExtractor] PDF 텍스트 추출 시작...');
        const extractedText = await extractTextFromPDF(buffer);
        
        console.log('[textExtractor] PDF 처리 성공, 추출된 텍스트 길이:', extractedText.length);
        return { text: extractedText, fileType: 'pdf' };

      } catch (pdfError) {
        console.error('[textExtractor] PDF 파싱 오류:', pdfError);
        
        // 구체적인 오류 메시지 제공
        let errorMessage = 'PDF 파일 처리 중 오류가 발생했습니다';
        
        if (pdfError instanceof Error) {
          errorMessage = pdfError.message;
        }
        
        throw new Error(errorMessage);
      }
    }

    // HWP 파일 처리
    if (
      mime === 'application/x-hwp' ||
      mime === 'application/haansoft-hwp' ||
      name.endsWith('.hwp')
    ) {
      console.log('[textExtractor] HWP 파일 감지 - 지원하지 않음');
      throw new Error('HWP 파일은 현재 지원되지 않습니다.');
    }

    // 이미지 파일 처리 - OCR 기능 비활성화
    if (mime.startsWith('image/') || name.match(/\.(png|jpe?g|bmp|gif|svg)$/)) {
      console.log('[textExtractor] 이미지 파일 감지 - 현재 지원하지 않음');
      throw new Error('이미지 텍스트 인식 기능은 현재 개발 중입니다. PDF 파일을 사용해주세요.');
    }

    console.log('[textExtractor] 지원하지 않는 파일 형식:', { mime, name });
    throw new Error(`지원하지 않는 파일 형식입니다. PDF 파일만 지원합니다. (현재 형식: ${mime || '알 수 없는 형식'})`);
  } catch (error) {
    console.error('[textExtractor] 전체 처리 오류:', error);
    
    // 이미 처리된 오류는 그대로 전달
    if (error instanceof Error && (
      error.message.includes('PDF 파일 처리 중 오류가 발생했습니다') ||
      error.message.includes('이미지 텍스트 인식 기능은 현재 개발 중입니다') ||
      error.message.includes('지원하지 않는 파일 형식입니다') ||
      error.message.includes('빈 파일입니다') ||
      error.message.includes('HWP 파일은 현재 지원되지 않습니다')
    )) {
      throw error;
    }
    
    // 새로운 오류는 감싸서 전달
    throw new Error(`파일 처리 중 예상치 못한 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
