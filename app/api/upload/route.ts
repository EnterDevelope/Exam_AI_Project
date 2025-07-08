import { NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/parser/textExtractor';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: '파일이 필요합니다.' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: '파일 크기는 10MB를 초과할 수 없습니다.' },
        { status: 400 }
      );
    }

    const { text, fileType } = await extractTextFromFile(file);
    return NextResponse.json({ text, fileType });
  } catch (err) {
    const message = err instanceof Error ? err.message : '텍스트 추출에 실패했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
