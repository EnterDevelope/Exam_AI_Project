'use client';

import { useState } from 'react';
import { useFlowStore } from '@/store/flow';
import Spinner from './Spinner';

export default function FileUploader() {
  const [isLoading, setIsLoading] = useState(false);
  const setRawText = useFlowStore((state) => state.setRawText);
  const setError = useFlowStore((state) => state.setError);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('[FileUploader] 파일 업로드 시작:', {
      name: file.name,
      size: file.size,
      type: file.type
    });

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setError(null);

    try {
      console.log('[FileUploader] API 요청 시작...');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('[FileUploader] API 응답 상태:', {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText,
        contentType: res.headers.get('content-type')
      });

      // 응답이 JSON인지 확인
      const contentType = res.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!isJson) {
        // HTML 응답인 경우 (500 에러 페이지 등)
        const htmlText = await res.text();
        console.error('[FileUploader] HTML 응답 받음:', htmlText.substring(0, 200));
        throw new Error('서버에서 예상치 못한 오류가 발생했습니다. 다시 시도해주세요.');
      }

      const data = await res.json();
      console.log('[FileUploader] API 응답 데이터:', {
        success: data.success,
        hasText: !!data.text,
        textLength: data.text?.length || 0,
        fileType: data.fileType,
        error: data.error
      });

      if (!res.ok || !data.success) {
        throw new Error(data.error || '업로드에 실패했습니다.');
      }

      if (!data.text) {
        throw new Error('텍스트 추출 결과가 비어있습니다.');
      }

      console.log('[FileUploader] 텍스트 추출 성공');
      setRawText(data.text);
      
      // 성공 메시지 표시
      alert(`파일 업로드 성공!\n파일 형식: ${data.fileType}\n추출된 텍스트: ${data.text.length}자`);
      
    } catch (err: any) {
      console.error('[FileUploader] 오류 발생:', err);
      const errorMessage = err.message || '업로드 중 오류가 발생했습니다.';
      alert(`업로드 실패: ${errorMessage}`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      // input 값 초기화 (같은 파일 재선택 가능하도록)
      e.target.value = '';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".pdf,.hwp,image/*"
        onChange={handleFileUpload}
        disabled={isLoading}
        className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      {isLoading && (
        <div className="flex items-center gap-2">
          <Spinner />
          <span className="text-sm text-gray-600">파일 처리 중...</span>
        </div>
      )}
    </div>
  );
}
