# 20250713

## 🎯 개발 우선순위 및 순서

### **Phase 1: 핵심 인프라 완성 (1-2주)**

### 1.1 Azure AI Foundry 연동

```bash
# 환경 변수 설정
AZURE_OPENAI_ENDPOINT=your_foundry_endpoint
AZURE_OPENAI_API_KEY=your_foundry_api_key
AZURE_OPENAI_DEPLOYMENT_NAME=your_foundry_deployment_name
```

**작업 내용:**

- [ ] Foundry 엔드포인트, API 키, 배포 이름 환경 변수 설정
- [ ] System Prompt 구현 (요약, 퀴즈, 피드백)
- [ ] API 응답 형식 검증 및 테스트
- [ ] 에러 처리 개선

### 1.2 Supabase 설정 및 스키마

```sql
-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 요약 테이블
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subject TEXT NOT NULL,
  week TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 퀴즈 테이블
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_id UUID REFERENCES summaries(id),
  questions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 오답 노트 테이블
CREATE TABLE wrong_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  question_id TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

```

**작업 내용:**

- [ ] Supabase 프로젝트 생성
- [ ] 데이터베이스 스키마 설계 및 구현
- [ ] Supabase 클라이언트 설정
- [ ] 기본 CRUD 함수 구현

### **Phase 2: 홈페이지 UX 개선 (1주)**

### 2.1 A형/B형 분기 구조 구현

```tsx
// app/page.tsx - UX 문서 기반 개선
- "새로운 요약 시작하기" (A형) → /summary
- "학습 복습 이어하기" (B형) → /mypage
- 명확한 분기 구조 및 시각적 구분

```

**작업 내용:**

- [ ] 홈페이지 레이아웃 개선
- [ ] A형/B형 선택 UI 구현
- [ ] 반응형 디자인 최적화
- [ ] 사용자 가이드 추가

### 2.2 네비게이션 개선

```tsx
// components/layout/Header.tsx
- 현재 페이지 표시
- 사용자 상태에 따른 메뉴 변경
- 모바일 햄버거 메뉴

```

### **Phase 3: 페이지 컴포넌트 완성 (2-3주)**

### 3.1 마이페이지 구현 (`/mypage`)

```tsx
// app/mypage/page.tsx
- 과목별 대시보드
- 주차별 요약 리스트
- 퀴즈 결과 통계
- 오답 복습 루프

```

**작업 내용:**

- [ ] 마이페이지 레이아웃 및 컴포넌트
- [ ] 과목별 필터링 기능
- [ ] 요약 히스토리 표시
- [ ] 퀴즈 결과 통계 차트
- [ ] 오답 노트 관리

### 3.2 퀴즈 페이지 구현 (`/quiz`)

```tsx
// app/quiz/page.tsx
- 독립적인 퀴즈 풀이 인터페이스
- 퀴즈 진행률 표시
- 결과 요약 및 분석

```

### 3.3 오답 복습 모드 (`/quiz/review`)

```tsx
// app/quiz/review/page.tsx
- 오답 노트 기반 재풀이
- 반복 학습 루프
- 성과 추적

```

### **Phase 4: 상태 관리 및 데이터 연동 (1-2주)**

### 4.1 도메인별 상태 관리

```tsx
// store/summary.ts
interface SummaryStore {
  summaries: SummaryData[];
  currentSummary: SummaryData | null;
  isLoading: boolean;
  error: string | null;
  fetchSummaries: () => Promise<void>;
  createSummary: (data: CreateSummaryData) => Promise<void>;
}

// store/quiz.ts
interface QuizStore {
  quizzes: QuizData[];
  currentQuiz: QuizData | null;
  wrongAnswers: WrongAnswer[];
  isLoading: boolean;
  error: string | null;
  fetchQuizzes: () => Promise<void>;
  submitAnswer: (questionId: string, answer: string) => Promise<void>;
}

// store/user.ts
interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}
```

### 4.2 데이터베이스 연동

```tsx
// lib/database/summaries.ts
export async function createSummary(
  data: CreateSummaryData
): Promise<SummaryData>;
export async function getSummariesByUser(
  userId: string
): Promise<SummaryData[]>;
export async function getSummaryById(id: string): Promise<SummaryData>;

// lib/database/quizzes.ts
export async function createQuiz(data: CreateQuizData): Promise<QuizData>;
export async function getQuizzesBySummary(
  summaryId: string
): Promise<QuizData[]>;
export async function saveWrongAnswer(data: WrongAnswerData): Promise<void>;
```

### **Phase 5: UI/UX 개선 및 리팩토링 (1-2주)**

### 5.1 컴포넌트 리팩토링

```tsx
// components/common/FileUploader.tsx 개선
- 드래그 앤 드롭 지원
- 파일 타입 검증 강화
- 업로드 진행률 표시
- 에러 처리 개선

// components/features/summary/SummaryResultView.tsx 개선
- 마크다운 렌더링 최적화
- 목차 자동 생성
- 하이라이트 기능
- 다운로드 버튼

// components/features/quiz/QuizCard.tsx 개선
- 애니메이션 효과
- 접근성 개선
- 키보드 네비게이션
- 모바일 최적화

```

### 5.2 로딩 및 에러 상태 개선

```tsx
// components/common/LoadingSpinner.tsx
- 스켈레톤 로딩
- 진행률 표시
- 애니메이션 개선

// components/common/ErrorBanner.tsx
- 에러 타입별 처리
- 재시도 기능
- 사용자 친화적 메시지

```

### 5.3 반응형 디자인 최적화

```css
/* styles/globals.css */
- 모바일 퍼스트 접근법
- 터치 친화적 인터페이스
- 성능 최적화

```

### **Phase 6: 고급 기능 구현 (2-3주)**

### 6.1 과목 자동 감지 로직

```tsx
// lib/analyzer/subjectDetector.ts
export function detectSubject(text: string): string {
  // 키워드 기반 과목 분류
  // 머신러닝 모델 적용 (선택사항)
  // 정확도 향상
}
```

### 6.2 HWP 파일 지원

```tsx
// lib/parser/textExtractor.ts
- HWP 파일 파싱 라이브러리 추가
- 텍스트 추출 로직 구현
- 에러 처리 개선

```

### 6.3 PDF 다운로드 기능

```tsx
// lib/utils/pdfGenerator.ts
export async function generateSummaryPDF(summary: SummaryData): Promise<Blob>;
export async function generateQuizPDF(quiz: QuizData): Promise<Blob>;
export async function generateCombinedPDF(
  summary: SummaryData,
  quiz: QuizData
): Promise<Blob>;
```

### 6.4 학습 진도 추적

```tsx
// lib/analytics/learningProgress.ts
export function calculateProgress(userId: string): LearningProgress;
export function generateWeaknessReport(userId: string): WeaknessReport;
export function createStudyPlan(userId: string): StudyPlan;
```

### **Phase 7: 성능 최적화 및 테스트 (1-2주)**

### 7.1 성능 최적화

```tsx
// 코드 스플리팅
- 페이지별 지연 로딩
- 컴포넌트 지연 로딩
- 번들 크기 최적화

// 캐싱 전략
- API 응답 캐싱
- 상태 지속성
- 오프라인 지원

```

### 7.2 테스트 코드 작성

```tsx
// __tests__/components/
- 컴포넌트 단위 테스트
- 사용자 인터랙션 테스트

// __tests__/api/
- API 엔드포인트 테스트
- 통합 테스트

// __tests__/utils/
- 유틸리티 함수 테스트
- 파서 함수 테스트

```

### 7.3 접근성 및 SEO 최적화

```tsx
// 접근성
- ARIA 라벨 추가
- 키보드 네비게이션
- 스크린 리더 지원

// SEO
- 메타데이터 최적화
- 구조화된 데이터
- 사이트맵 생성

```

## 📅 개발 일정 요약

| Phase   | 기간  | 주요 목표                | 완료 기준                   |
| ------- | ----- | ------------------------ | --------------------------- |
| Phase 1 | 1-2주 | MCP 연동 + Supabase 설정 | 실제 AI 요약/퀴즈 생성 가능 |
| Phase 2 | 1주   | 홈페이지 UX 개선         | A형/B형 분기 완성           |
| Phase 3 | 2-3주 | 페이지 컴포넌트 완성     | 모든 페이지 구현 완료       |
| Phase 4 | 1-2주 | 상태 관리 + DB 연동      | 데이터 지속성 확보          |
| Phase 5 | 1-2주 | UI/UX 개선               | 사용자 경험 최적화          |
| Phase 6 | 2-3주 | 고급 기능 구현           | 완전한 기능 세트            |
| Phase 7 | 1-2주 | 최적화 + 테스트          | 프로덕션 준비 완료          |

**총 예상 기간: 9-15주**

## �� 즉시 시작 가능한 작업

### 1. 환경 설정 (오늘 시작)

```bash
# .env.local 파일 생성
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
MICROSOFT_COPILOT_WEBHOOK_URL=your_mcp_webhook_url
MCP_WEBHOOK_TOKEN=your_mcp_token

```

### 2. Supabase 프로젝트 설정

- Supabase 계정 생성
- 새 프로젝트 생성
- 데이터베이스 스키마 설계

### 3. Microsoft Copilot Studio 설정

- MCP 프로젝트 생성
- Webhook URL 및 토큰 발급
- System Prompt 설정

### 4. 홈페이지 UX 개선

- 현재 홈페이지 분석
- A형/B형 분기 UI 설계
- 컴포넌트 구조 개선

## �� 성공 지표

### 기술적 지표

- [ ] MCP API 응답 시간 < 15초
- [ ] 페이지 로딩 시간 < 3초
- [ ] 테스트 커버리지 > 80%
- [ ] 접근성 점수 > 90%

### 사용자 경험 지표

- [ ] 파일 업로드 성공률 > 95%
- [ ] 요약 생성 정확도 > 85%
- [ ] 퀴즈 풀이 완료율 > 90%
- [ ] 사용자 재방문율 > 40%
