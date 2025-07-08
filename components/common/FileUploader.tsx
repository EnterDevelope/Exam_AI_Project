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

    const formData = new FormData();
    formData.append('file', file);

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '업로드에 실패했습니다.');
      }
      setRawText(data.text);
    } catch (err: any) {
      alert(err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".pdf,.hwp,image/*"
        onChange={handleFileUpload}
      />
      {isLoading && <Spinner />}
    </div>
  );
}
