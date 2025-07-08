import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';

export async function extractTextFromFile(
  file: File
): Promise<{ text: string; fileType: 'pdf' | 'hwp' | 'image' }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type;
  const name = file.name.toLowerCase();

  if (mime === 'application/pdf' || name.endsWith('.pdf')) {
    const data = await pdfParse(buffer);
    return { text: data.text, fileType: 'pdf' };
  }

  if (
    mime === 'application/x-hwp' ||
    mime === 'application/haansoft-hwp' ||
    name.endsWith('.hwp')
  ) {
    throw new Error('HWP 파일은 현재 지원되지 않습니다.');
  }

  if (mime.startsWith('image/') || name.match(/\.(png|jpe?g|bmp)$/)) {
    const result = await Tesseract.recognize(buffer, 'kor+eng');
    return { text: result.data.text, fileType: 'image' };
  }

  throw new Error('지원하지 않는 파일 형식입니다.');
}
