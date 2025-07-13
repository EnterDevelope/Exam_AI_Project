'use client';
import { useState } from 'react';

export default function TestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string>('');
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testType, setTestType] = useState<'connection' | 'summary' | 'quiz' | 'feedback'>('connection');

  // 연결 테스트
  const testAzureConnection = async () => {
    setLoading(true);
    setConnectionStatus('테스트 중...');
    try {
      const response = await fetch('/api/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setConnectionStatus(data.success ? '✅ 연결 성공' : '❌ 연결 실패');
    } catch (error) {
      setConnectionStatus('❌ 연결 실패: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 요약 API 테스트
  const testSummaryAPI = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: '인공지능 개론',
          week: '1주차',
          text: '인공지능(AI)은 컴퓨터가 인간의 지능을 모방하여 학습하고 추론하는 기술입니다. 머신러닝은 AI의 한 분야로, 데이터로부터 패턴을 학습하여 예측이나 분류를 수행합니다. 딥러닝은 머신러닝의 하위 분야로, 인공신경망을 사용하여 복잡한 패턴을 학습합니다. AI는 이미지 인식, 자연어 처리, 자율주행 등 다양한 분야에서 활용되고 있습니다.',
        }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: '테스트 실패: ' + (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  // 퀴즈 API 테스트
  const testQuizAPI = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summary: '# 인공지능 개론\n\n## 주요 개념\n- **인공지능(AI)**: 컴퓨터가 인간의 지능을 모방하는 기술\n- **머신러닝**: 데이터로부터 패턴을 학습하는 AI 분야\n- **딥러닝**: 인공신경망을 사용하는 머신러닝 기법\n\n## 활용 분야\n- 이미지 인식\n- 자연어 처리\n- 자율주행',
        }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: '테스트 실패: ' + (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  // 피드백 API 테스트
  const testFeedbackAPI = async () => {
    setLoading(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: '인공지능의 정의는 무엇인가요?',
          userAnswer: '컴퓨터 프로그램',
          correctAnswer: '컴퓨터가 인간의 지능을 모방하는 기술',
          summary: '# 인공지능 개론\n\n## 주요 개념\n- **인공지능(AI)**: 컴퓨터가 인간의 지능을 모방하는 기술',
        }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      setTestResult({ error: '테스트 실패: ' + (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Azure OpenAI API 테스트</h1>
        
        {/* 연결 상태 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">연결 상태</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={testAzureConnection}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? '테스트 중...' : 'Azure OpenAI 연결 테스트'}
            </button>
            <span className="text-sm font-medium">{connectionStatus}</span>
          </div>
        </div>

        {/* API 테스트 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API 테스트</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setTestType('summary')}
              className={`px-4 py-2 rounded border ${
                testType === 'summary' 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              요약 API
            </button>
            <button
              onClick={() => setTestType('quiz')}
              className={`px-4 py-2 rounded border ${
                testType === 'quiz' 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              퀴즈 API
            </button>
            <button
              onClick={() => setTestType('feedback')}
              className={`px-4 py-2 rounded border ${
                testType === 'feedback' 
                  ? 'bg-blue-500 text-white border-blue-500' 
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              피드백 API
            </button>
          </div>

          <div className="space-y-4">
            {testType === 'summary' && (
              <div>
                <h3 className="font-medium mb-2">요약 생성 테스트</h3>
                <p className="text-sm text-gray-600 mb-4">
                  인공지능 관련 샘플 텍스트로 요약을 생성합니다.
                </p>
                <button
                  onClick={testSummaryAPI}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? '요약 생성 중...' : '요약 API 테스트'}
                </button>
              </div>
            )}

            {testType === 'quiz' && (
              <div>
                <h3 className="font-medium mb-2">퀴즈 생성 테스트</h3>
                <p className="text-sm text-gray-600 mb-4">
                  요약 내용을 바탕으로 퀴즈를 생성합니다.
                </p>
                <button
                  onClick={testQuizAPI}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? '퀴즈 생성 중...' : '퀴즈 API 테스트'}
                </button>
              </div>
            )}

            {testType === 'feedback' && (
              <div>
                <h3 className="font-medium mb-2">피드백 생성 테스트</h3>
                <p className="text-sm text-gray-600 mb-4">
                  오답에 대한 해설을 생성합니다.
                </p>
                <button
                  onClick={testFeedbackAPI}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  {loading ? '피드백 생성 중...' : '피드백 API 테스트'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 결과 표시 */}
        {testResult && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">테스트 결과</h2>
            <div className="bg-gray-100 rounded p-4 overflow-auto max-h-96">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* 사용 안내 */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">사용 안내</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>연결 테스트</strong>: Azure OpenAI 서비스와의 연결 상태를 확인합니다.</p>
            <p>• <strong>요약 API</strong>: 텍스트를 입력하여 AI 요약을 생성합니다.</p>
            <p>• <strong>퀴즈 API</strong>: 요약 내용을 바탕으로 퀴즈를 생성합니다.</p>
            <p>• <strong>피드백 API</strong>: 오답에 대한 해설을 생성합니다.</p>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            * 모든 API 호출은 서버 사이드에서 처리되며, 환경 변수는 안전하게 보호됩니다.
          </p>
        </div>
      </div>
    </div>
  );
} 