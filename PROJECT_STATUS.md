# AI Summary Note 프로젝트 개발 현황

## 2025년 7월 최신 작업 내역 및 진행 상황

- ✅ **AI 연동 인프라 완성**: Microsoft Copilot Studio 대신 **Azure AI Foundry** 기반으로 요약/퀴즈/피드백 API 연동 완료
- ✅ **환경 변수 및 .env.local 템플릿 정비**: Foundry 엔드포인트, API 키, 배포 이름 기준으로 환경 변수 구조 통일
- ✅ **API 정상화**: 연결 테스트, 요약, 피드백, 퀴즈 생성(마크다운 코드블록 파싱 버그 수정) 모두 정상 동작 확인
- ✅ **개발 문서(phase.md) 1.1 항목 Foundry 기준으로 수정**
- ✅ **Supabase 연동 및 DB 스키마 설계 완료**: 프로젝트 설정, 테이블 생성, API 연동, 데이터 저장 테스트 모두 성공
- ⏳ **페이지 컴포넌트 완성**: 마이페이지, 퀴즈 페이지, 홈페이지 UX 개선 등 주요 페이지 구현 필요
- ⏳ **상태 관리 및 인증 시스템**: 도메인별 상태 관리 스토어, 사용자 인증 시스템 구현 필요
- ▶️ **권장 개발 순서**: 페이지 컴포넌트 완성(Phase 3)과 상태 관리(Phase 4)를 병행하여 완전한 서비스로 발전시킬 것

---

## 프로젝트 개요

- **프로젝트명**: AI Summary Note (이그잼)
- **목적**: 한국 대학생(20-25세)을 위한 AI 기반 학습 요약 및 퀴즈 생성 서비스
- **기술스택**: Next.js 15.3.2, React 19, TypeScript, Tailwind CSS
- **Git 저장소**: https://github.com/EnterDevelope/Exam_AI_Project.git
- **목표 출시일**: 2025년 12월

## 핵심 기능

1. **파일 업로드**: PDF, HWP, 이미지 파일 업로드 및 텍스트 추출
2. **AI 요약**: 업로드된 자료를 GPT 기반으로 요약 (Azure AI Foundry 연동)
3. **퀴즈 생성**: 요약 내용을 바탕으로 5문제 퀴즈 생성 (객관식 3개, 주관식 2개)
4. **학습 관리**: 사용자별 퀴즈 이력, 오답 노트, 해설 제공

## 현재 구현 상태

### ✅ 완료된 부분

#### 1. 프로젝트 기본 구조

- Next.js 15 + TypeScript + Tailwind CSS 설정 완료
- App Router 구조 적용
- ESLint, PostCSS 설정 완료
- 모든 필수 패키지 설치 완료 (axios, zustand, pdf-parse, tesseract.js 등)

#### 2. 레이아웃 및 UI

- **Header 컴포넌트** (`components/layout/Header.tsx`)
  - 로고, 네비게이션 메뉴, 검색 기능
  - 반응형 디자인 적용
- **Footer 컴포넌트** (`components/layout/Footer.tsx`)
  - 기본 푸터 구조
- **FeatureCard 컴포넌트** (`components/common/FeatureCard.tsx`)
  - 기능 소개 카드 컴포넌트

#### 3. 메인 페이지

- **홈페이지** (`app/page.tsx`)
  - Hero 섹션: 프로젝트 소개 및 CTA 버튼
  - Features 섹션: 3가지 주요 기능 소개
  - 반응형 레이아웃 적용

#### 4. 타입 시스템

- **API 타입** (`types/api.ts`)
  ```typescript
  - ApiResponse<T>
  - SummaryRequest/Response
  - QuizRequest/Response
  - FeedbackRequest/Response
  - Question 인터페이스
  ```
- **요약 타입** (`types/summary.ts`)
  ```typescript
  -SummaryData - OutlineItem - Highlight;
  ```
- **퀴즈 타입** (`types/quiz.ts`)
  ```typescript
  -QuizData - Question - QuizResult - WrongAnswer;
  ```
- **플로우 타입** (`types/flow.ts`)
  ```typescript
  -FlowState - FlowStep;
  ```
- **Ambient 타입** (`types/ambient/`)
  ```typescript
  -pdf - parse.d.ts - tesseract.js.d.ts;
  ```

#### 5. 상태 관리

- **Zustand 기반 플로우 상태 관리** (`store/flow.ts`)
  ```typescript
  - currentStep: 'upload' | 'summary' | 'quiz' | 'result'
  - subject: string
  - summaryStyle: 'simple' | 'detailed'
  - rawText: string
  - summaryData: SummaryData | null
  - quizData: QuizData | null
  - error: string | null
  - isProcessing: boolean
  ```

#### 6. API 클라이언트 및 엔드포인트

- **Azure AI Foundry 클라이언트** (`lib/api/client.ts`)
  - Azure OpenAI 엔드포인트 및 API 키 설정
  - Axios 기반 HTTP 클라이언트
- **파일 업로드 API** (`app/api/upload/route.ts`)
  - 파일 업로드 및 텍스트 추출
  - 파일 크기 제한 (10MB)
  - PDF, 이미지 파일 지원
- **요약 생성 API** (`app/api/summary/route.ts`)
  - Azure OpenAI 요약 생성 호출
  - 과목, 주차, 텍스트 입력 처리
- **퀴즈 생성 API** (`app/api/quiz/route.ts`)
  - 요약 기반 퀴즈 생성
  - Azure OpenAI 퀴즈 생성 호출
- **피드백 API** (`app/api/feedback/route.ts`)
  - 오답 해설 생성
  - Azure OpenAI 피드백 생성 호출

#### 7. 파일 처리 및 텍스트 추출

- **텍스트 추출기** (`lib/parser/textExtractor.ts`)
  - PDF 파일: pdf-parse 라이브러리 사용
  - 이미지 파일: Tesseract.js OCR 사용
  - HWP 파일: 현재 미지원 (에러 처리 포함)
  - 파일 타입 자동 감지

#### 8. 페이지 컴포넌트

- **요약 페이지** (`app/summary/page.tsx`)
  - 파일 업로드 → 요약 생성 → 퀴즈 생성 플로우
  - 요약 결과 뷰 (마크다운 렌더링)
  - 퀴즈 생성 및 풀이 인터페이스
  - 오답 해설 자동 생성
  - 오답 복습 모드 전환

#### 9. 기능별 컴포넌트

- **FileUploader** (`components/common/FileUploader.tsx`)
  - 파일 선택 및 업로드
  - 로딩 상태 표시
  - 에러 처리
- **SummaryResultView** (`components/features/summary/SummaryResultView.tsx`)
  - 마크다운 요약 렌더링
  - ReactMarkdown + remarkGfm 사용
- **QuizCard** (`components/features/quiz/QuizCard.tsx`)
  - 객관식/주관식 문제 표시
  - 정답 확인 및 피드백
  - 오답 시 해설 요청

#### 10. 공통 컴포넌트

- **Button** (`components/common/Button.tsx`)
  - 재사용 가능한 버튼 컴포넌트
  - 다양한 스타일 변형 지원
- **Card** (`components/common/Card.tsx`)
  - 카드 레이아웃 컴포넌트
- **LoadingSpinner** (`components/common/LoadingSpinner.tsx`)
  - 로딩 상태 표시
- **Spinner** (`components/common/Spinner.tsx`)
  - 간단한 스피너 컴포넌트
- **ErrorBanner** (`components/common/ErrorBanner.tsx`)
  - 에러 메시지 표시

#### 11. 유틸리티

- **과목 감지기** (`lib/analyzer/subjectDetector.ts`)
  - 파일 내용 분석을 통한 과목 자동 감지
  - 현재는 구조만 구현

### ❌ 미구현된 부분

#### 1. 페이지 컴포넌트

- `/quiz` - 독립적인 퀴즈 페이지
- `/mypage` - 마이페이지 (학습 히스토리, 통계)
- `/quiz/review` - 오답 복습 모드 페이지

#### 2. 상태 관리 스토어

- `store/summary/` - 요약 관련 전용 상태
- `store/quiz/` - 퀴즈 관련 전용 상태
- `store/user/` - 사용자 관련 상태

#### 3. 핵심 기능 구현

- **Azure AI Foundry 연동**: 연결 테스트, 요약, 퀴즈, 피드백 API 모두 정상 동작 확인 완료
- **Supabase 데이터베이스 연동**: 프로젝트 설정, 스키마 생성, API 연동, 데이터 저장 테스트 완료
- **과목 감지 로직**: 실제 텍스트 분석 알고리즘 (미구현)
- **사용자 인증**: 로그인/회원가입 시스템 (미구현)

#### 4. 고급 기능

- **HWP 파일 지원**: 현재는 에러 처리만 구현
- **학습 진도 추적**: 주차별 진행률, 통계
- **PDF 다운로드**: 요약+퀴즈 PDF 생성
- **Notion/Google Drive 연동**

#### 5. 유틸리티 함수

- `lib/utils/` - 공통 유틸리티 함수들
- `lib/constants/` - 상수 정의
- `lib/validators/` - 입력 검증 함수

## 기술적 아키텍처

### 프론트엔드 구조

```
app/                    # Next.js App Router
├── layout.tsx         # 루트 레이아웃
├── page.tsx          # 홈페이지
├── summary/          # 요약 페이지 ✅
│   └── page.tsx
├── quiz/             # 퀴즈 페이지 (미구현)
├── mypage/           # 마이페이지 (미구현)
└── api/              # API 라우트
    ├── upload/       # 파일 업로드 ✅
    ├── summary/      # 요약 생성 ✅
    ├── quiz/         # 퀴즈 생성 ✅
    └── feedback/     # 피드백 생성 ✅

components/            # 재사용 가능한 컴포넌트
├── layout/           # 레이아웃 컴포넌트 ✅
├── common/           # 공통 컴포넌트 ✅
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── FileUploader.tsx
│   ├── LoadingSpinner.tsx
│   ├── Spinner.tsx
│   ├── ErrorBanner.tsx
│   └── FeatureCard.tsx
└── features/         # 도메인별 컴포넌트
    ├── summary/      # 요약 관련 ✅
    │   └── SummaryResultView.tsx
    └── quiz/         # 퀴즈 관련 ✅
        └── QuizCard.tsx

store/                # Zustand 상태 관리
├── flow.ts          # 메인 플로우 상태 ✅
├── summary/         # 요약 상태 (미구현)
├── quiz/            # 퀴즈 상태 (미구현)
└── user/            # 사용자 상태 (미구현)

lib/                  # 유틸리티 라이브러리
├── api/             # API 클라이언트 ✅
│   └── client.ts
├── parser/          # 파일 파싱 ✅
│   └── textExtractor.ts
└── analyzer/        # 분석 도구
    └── subjectDetector.ts

types/                # TypeScript 타입 정의 ✅
├── api.ts
├── summary.ts
├── quiz.ts
├── flow.ts
├── index.ts
└── ambient/
    ├── pdf-parse.d.ts
    └── tesseract.js.d.ts
```

### 타입 시스템

- **엄격한 TypeScript**: 모든 컴포넌트와 함수에 타입 정의
- **인터페이스 기반**: API 요청/응답, 데이터 구조 명확히 정의
- **제네릭 활용**: API 응답 타입 안전성 보장
- **Ambient 타입**: 외부 라이브러리 타입 정의

### 스타일링

- **Tailwind CSS**: 유틸리티 클래스 기반 스타일링
- **컴포넌트별 스타일**: 재사용 가능한 CSS 클래스 정의
- **반응형 디자인**: 모바일/데스크톱 대응
- **Typography 플러그인**: 마크다운 렌더링 최적화

## 다음 개발 단계

### Phase 1: Azure AI Foundry 연동 (완료)

- [x] Azure OpenAI 엔드포인트 및 API 키 설정
- [x] System Prompt 구현 (요약, 퀴즈, 피드백)
- [x] Azure OpenAI API 테스트 및 디버깅
- [x] API 응답 형식 검증 (퀴즈 마크다운 코드블록 파싱 버그 수정 완료)

### Phase 2: 데이터베이스 연동 (완료)

- [x] Supabase 프로젝트 설정 (ap-northeast-1 리전)
- [x] 사용자 테이블 스키마 설계 및 생성
- [x] 요약/퀴즈/오답노트 데이터 스키마 설계 및 생성
- [x] 데이터베이스 클라이언트 구현 (클라이언트/서버)
- [x] API 연동 및 데이터 저장 테스트 완료
- [x] 타입 정의 및 훅 구현

### Phase 3: 페이지 컴포넌트 완성 (2-3주)

- [x] 퀴즈 페이지 구현 (`/quiz`) ✅
  - [x] 퀴즈 페이지 기본 구조 구현
  - [x] 퀴즈 상태 관리 스토어 생성
  - [x] UI 컴포넌트 구현 (QuizCard, QuizFeedbackCard, StepProgress, CTAButton)
  - [x] API 엔드포인트 구현 (`/api/quiz/complete`)
  - [x] 결과 페이지 구현 (`/quiz/result`)
  - [x] 타입 정의 완성
  - [x] 에러 처리 컴포넌트 생성
- [ ] 마이페이지 구현 (`/mypage`)
- [ ] 오답 복습 모드 페이지 (`/quiz/review`)
- [ ] 홈페이지 UX 개선 (A형/B형 분기)

### Phase 4: 상태 관리 완성 (1-2주)

- [ ] 요약 관련 상태 관리 (`store/summary/`)
- [ ] 퀴즈 관련 상태 관리 (`store/quiz/`)
- [ ] 사용자 관련 상태 관리 (`store/user/`)
- [ ] 전역 에러 처리 및 로딩 상태

### Phase 5: 고급 기능 구현 (2-3주)

- [ ] 과목 자동 감지 로직 구현
- [ ] HWP 파일 지원 추가
- [ ] PDF 다운로드 기능
- [ ] 학습 진도 추적 및 통계

### Phase 6: 테스트 및 최적화 (1-2주)

- [ ] 단위 테스트 작성
- [ ] 통합 테스트 작성
- [ ] 성능 최적화
- [ ] 배포 준비

## 개발 환경 설정

### 필수 환경 변수

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
```

### 설치된 주요 패키지

- `next`: 15.3.2
- `react`: ^19.0.0
- `typescript`: ^5
- `tailwindcss`: ^3.4.3
- `axios`: ^1.10.0 ✅
- `zustand`: ^5.0.6 ✅
- `pdf-parse`: ^1.1.1 ✅
- `tesseract.js`: ^6.0.1 ✅
- `react-markdown`: ^10.1.0 ✅
- `remark-gfm`: ^4.0.1 ✅
- `clsx`: ^2.1.1 ✅

## 코드 품질 및 컨벤션

### 코딩 스타일

- **함수형 컴포넌트**: 클래스 컴포넌트 대신 함수형 컴포넌트 사용
- **명명 규칙**: camelCase (변수/함수), PascalCase (컴포넌트/타입)
- **타입 안전성**: any 타입 사용 금지, 명시적 타입 정의
- **에러 처리**: try-catch 블록과 적절한 에러 메시지

### 파일 구조 규칙

- **도메인별 분리**: features 디렉토리로 기능별 컴포넌트 분리
- **공통 컴포넌트**: common 디렉토리에 재사용 가능한 컴포넌트 배치
- **타입 정의**: types 디렉토리에 중앙 집중식 타입 관리
- **API 라우트**: app/api 디렉토리에 기능별 분리 (Azure AI Foundry 클라이언트 포함)

### 상태 관리 원칙

- **Zustand 사용**: 복잡한 상태는 Zustand 스토어로 관리
- **로컬 상태**: 단순한 상태는 useState로 관리
- **도메인별 분리**: summary, quiz, user별로 스토어 분리
- **플로우 상태**: 전체 사용자 여정을 관리하는 flow 스토어

## 현재 이슈 및 개선점

### 기술적 부채

1. **데이터베이스 부재**: 사용자 데이터 및 히스토리 저장 불가
2. **에러 처리**: 전역 에러 처리 및 사용자 피드백 개선 필요
3. **테스트 코드**: 단위 테스트 및 통합 테스트 부재
4. **HWP 파일 지원**: 현재는 에러 처리만 구현

### UX/UI 개선점

1. **홈페이지 분기**: A형/B형 사용자 분기 구조 필요
2. **반응형 디자인**: 모바일 최적화 개선
3. **로딩 애니메이션**: 사용자 경험 향상을 위한 로딩 상태 개선
4. **접근성**: ARIA 라벨 및 키보드 네비게이션 부족

### 성능 최적화

1. **코드 스플리팅**: 페이지별 지연 로딩 구현
2. **이미지 최적화**: Next.js Image 컴포넌트 활용
3. **캐싱 전략**: API 응답 캐싱 및 상태 지속성
4. **번들 크기**: 불필요한 의존성 제거

## 결론

현재 프로젝트는 **핵심 기능의 기본 구조가 잘 구현**되어 있으며, **확장 가능한 아키텍처**를 갖추고 있습니다.

**완료된 부분**:

- 프로젝트 기본 설정 및 구조
- 타입 시스템 및 상태 관리 기반
- 기본 UI 컴포넌트 및 레이아웃
- API 엔드포인트 구조 (Azure AI Foundry 클라이언트 포함)
- 파일 업로드 및 텍스트 추출 기능
- 요약 페이지 및 퀴즈 인터페이스
- **Supabase 데이터베이스 연동 완료** (프로젝트 설정, 스키마, API 연동, 데이터 저장 테스트)

**다음 우선순위**:

1. **페이지 컴포넌트 완성**: 마이페이지, 퀴즈 페이지, 홈페이지 UX 개선
2. **상태 관리 및 인증 시스템**: 도메인별 상태 관리, 사용자 인증
3. **고급 기능 구현**: 과목 자동 감지, HWP 파일 지원, PDF 다운로드

전체적으로 **견고한 기반**이 구축되어 있어, 핵심 기능 구현에 집중할 수 있는 상태입니다. 특히 파일 업로드부터 퀴즈 풀이까지의 기본 플로우가 구현되어 있고, Azure AI Foundry와 Supabase 연동이 완료되어 **MVP 수준의 서비스를 제공할 수 있습니다**. 다음 단계로 페이지 컴포넌트 완성과 상태 관리를 병행하여 완전한 서비스로 발전시킬 수 있습니다.
