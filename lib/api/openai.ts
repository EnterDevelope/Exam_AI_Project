import OpenAI from 'openai';

// Azure OpenAI 클라이언트 설정
const openai = new OpenAI({
  apiKey: process.env.AZURE_OPENAI_API_KEY,
  baseURL: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`,
  defaultQuery: { 'api-version': '2024-02-15-preview' },
  defaultHeaders: { 'api-key': process.env.AZURE_OPENAI_API_KEY },
});

// 환경 변수 검증
if (!process.env.AZURE_OPENAI_API_KEY || !process.env.AZURE_OPENAI_ENDPOINT || !process.env.AZURE_OPENAI_DEPLOYMENT_NAME) {
  throw new Error('Azure OpenAI 환경 변수가 설정되지 않았습니다.');
}

/**
 * 요약 생성 함수
 */
export async function generateSummary(text: string, subject?: string, week?: string): Promise<{ summary: string; keywords: string[] }> {
  const prompt = `다음은 ${subject || '대학 강의'} ${week ? week + ' ' : ''}내용입니다.

요약 규칙:
- 핵심 개념과 정의만 추출
- 마크다운 형식으로 정리 (# 제목, ## 소제목, - 목록)
- 주요 키워드를 **굵게** 표시
- 외부 정보 추가 금지
- 간결하고 명확하게 작성

내용:
${text}

요약:`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      messages: [
        {
          role: 'system',
          content: '당신은 한국 대학생을 위한 학술 요약 도우미입니다. 명확하고 구조화된 마크다운 요약을 제공하세요.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const summary = response.choices[0].message.content || '';
    
    // 키워드 추출 (간단한 방식)
    const keywords = extractKeywords(summary);
    
    return { summary, keywords };
  } catch (error) {
    console.error('요약 생성 오류:', error);
    throw new Error('요약 생성에 실패했습니다.');
  }
}

/**
 * 퀴즈 생성 함수
 */
export async function generateQuiz(summary: string): Promise<{
  questions: Array<{
    id: string;
    type: 'multiple' | 'short';
    question: string;
    options?: string[];
    answer: string;
    explanation: string;
  }>;
}> {
  const prompt = `다음 요약을 바탕으로 5개의 복습 문제를 만들어주세요.

규칙:
- 객관식 3개, 주관식 2개
- 요약 내용만 사용
- 각 문제마다 정답과 해설 포함
- JSON 형식으로 응답

요약:
${summary}

응답 형식:
{
  "questions": [
    {
      "type": "multiple",
      "question": "질문",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "answer": "정답",
      "explanation": "해설"
    },
    {
      "type": "short",
      "question": "질문",
      "answer": "정답",
      "explanation": "해설"
    }
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      messages: [
        {
          role: 'system',
          content: '당신은 대학 수준의 문제 출제자입니다. 명확하고 정확한 문제를 만들어주세요. 반드시 JSON 형식으로 응답하세요.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.choices[0].message.content || '{}';
    
    try {
      // 마크다운 코드블록(```json ... ```) 제거
      const cleaned = content
        .replace(/^```json\s*/i, '') // 맨 앞 ```json 제거
        .replace(/^```\s*/i, '')     // 맨 앞 ``` 제거(혹시 json이 없을 때)
        .replace(/```$/i, '')         // 맨 뒤 ``` 제거
        .trim();
      const quizData = JSON.parse(cleaned);
      // 응답 형식 검증 및 ID 추가
      const questions = quizData.questions?.map((q: any, index: number) => ({
        id: `q${index + 1}`,
        type: q.type || 'multiple',
        question: q.question || '',
        options: q.options || [],
        answer: q.answer || '',
        explanation: q.explanation || '',
      })) || [];

      return { questions };
    } catch (parseError) {
      console.error('퀴즈 응답 파싱 오류:', parseError);
      throw new Error('퀴즈 생성 응답을 파싱할 수 없습니다.');
    }
  } catch (error) {
    console.error('퀴즈 생성 오류:', error);
    throw new Error('퀴즈 생성에 실패했습니다.');
  }
}

/**
 * 피드백 생성 함수
 */
export async function generateFeedback(
  question: string, 
  userAnswer: string, 
  correctAnswer: string, 
  summary: string
): Promise<{ explanation: string }> {
  const prompt = `학생이 퀴즈 문제를 틀렸습니다. 정답과 해설을 제공해주세요.

문제: ${question}
학생 답안: ${userAnswer}
정답: ${correctAnswer}

요약 내용:
${summary}

해설 규칙:
- 왜 정답인지 명확히 설명
- 요약 내용을 참조
- 학생이 실수한 부분 지적
- 학습에 도움이 되는 설명

해설:`;

  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      messages: [
        {
          role: 'system',
          content: '당신은 친절한 AI 튜터입니다. 학생의 실수를 이해하고 도움이 되는 해설을 제공하세요.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    const explanation = response.choices[0].message.content || '해설을 생성할 수 없습니다.';
    return { explanation };
  } catch (error) {
    console.error('피드백 생성 오류:', error);
    throw new Error('피드백 생성에 실패했습니다.');
  }
}

/**
 * 키워드 추출 함수 (간단한 구현)
 */
function extractKeywords(text: string): string[] {
  // 마크다운에서 **로 감싸진 키워드 추출
  const boldKeywords = text.match(/\*\*(.*?)\*\*/g) || [];
  const keywords = boldKeywords.map(k => k.replace(/\*\*/g, ''));
  
  // 중복 제거 및 빈 문자열 필터링
  return [...new Set(keywords)].filter(k => k.trim().length > 0);
}

/**
 * Azure OpenAI 연결 테스트 함수
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await openai.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
      messages: [
        {
          role: 'user',
          content: '안녕하세요. 연결 테스트입니다.'
        }
      ],
      max_tokens: 10,
    });
    
    return response.choices[0].message.content !== undefined;
  } catch (error) {
    console.error('Azure OpenAI 연결 테스트 실패:', error);
    return false;
  }
} 