# AI Summary Note

> 한국 대학생을 위한 AI 기반 학습 요약 및 퀴즈 생성 서비스

PDF, HWP, 이미지 파일을 업로드하면 AI가 자동으로 요약하고 퀴즈를 생성해주는 웹 애플리케이션입니다. Azure OpenAI와 Supabase를 활용하여 개인화된 학습 경험을 제공합니다.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.3-38B2AC)

## ✨ 주요 기능

- **📄 파일 업로드**: PDF, 이미지 파일 지원 (HWP 지원 예정)
- **🤖 AI 요약**: Azure OpenAI를 활용한 스마트 요약 생성
- **📝 퀴즈 생성**: 요약 내용 기반 5문제 자동 생성 (객관식 3개, 주관식 2개)
- **📊 학습 관리**: 개인별 퀴즈 이력, 오답 노트, 해설 제공
- **📈 마이페이지**: 학습 통계, 히트맵, 진행률 추적

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/EnterDevelope/Exam_AI_Project.git
cd Exam_AI_Project
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 값을 설정하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Azure OpenAI 설정
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 🛠️ 기술 스택

### Frontend

- **Next.js 15.3.2** - React 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Zustand** - 상태 관리

### Backend

- **Azure OpenAI** - AI 요약/퀴즈 생성
- **Supabase** - 데이터베이스 및 인증
- **Next.js API Routes** - 서버 API

### 라이브러리

- **pdf-parse** - PDF 텍스트 추출
- **tesseract.js** - OCR (이미지 텍스트 추출)
- **react-markdown** - 마크다운 렌더링
- **axios** - HTTP 클라이언트

## 📁 프로젝트 구조

```
exam/
├── app/                    # Next.js App Router
│   ├── api/               # API 엔드포인트
│   ├── mypage/            # 마이페이지
│   ├── quiz/              # 퀴즈 페이지
│   ├── summary/           # 요약 페이지
│   └── page.tsx           # 홈페이지
├── components/            # React 컴포넌트
│   ├── common/            # 공통 컴포넌트
│   ├── features/          # 기능별 컴포넌트
│   └── layout/            # 레이아웃 컴포넌트
├── lib/                   # 유틸리티 라이브러리
├── store/                 # Zustand 상태 관리
├── types/                 # TypeScript 타입 정의
└── scripts/               # 유틸리티 스크립트
```

## 🎯 사용법

### 1. 파일 업로드

- 홈페이지에서 "파일 업로드" 버튼 클릭
- PDF 또는 이미지 파일 선택
- 과목과 주차 정보 입력

### 2. AI 요약 생성

- 업로드된 파일의 텍스트가 자동으로 추출됩니다
- Azure OpenAI가 내용을 분석하여 요약을 생성합니다
- 마크다운 형식으로 구조화된 요약을 확인할 수 있습니다

### 3. 퀴즈 풀이

- 요약 내용을 바탕으로 5문제가 자동 생성됩니다
- 객관식 3문제, 주관식 2문제로 구성됩니다
- 각 문제에 대한 상세한 해설을 제공합니다

### 4. 학습 관리

- 마이페이지에서 학습 통계를 확인할 수 있습니다
- 퀴즈 이력과 오답 노트를 관리할 수 있습니다
- 학습 히트맵으로 학습 패턴을 시각화합니다

## 🔧 개발

### 스크립트

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run start        # 프로덕션 서버 실행
npm run lint         # ESLint 검사
```

### 데이터베이스 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 다음 테이블들을 생성:

```sql
-- 사용자 테이블
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 요약 테이블
CREATE TABLE summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  subject TEXT,
  week_number INTEGER,
  original_text TEXT,
  summary_content TEXT,
  file_name TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 퀴즈 테이블
CREATE TABLE quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  summary_id UUID REFERENCES summaries(id),
  questions JSONB,
  total_questions INTEGER,
  correct_answers INTEGER,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 오답 노트 테이블
CREATE TABLE wrong_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id UUID REFERENCES quizzes(id),
  user_id UUID REFERENCES users(id),
  question_index INTEGER,
  user_answer TEXT,
  correct_answer TEXT,
  explanation TEXT
);
```

### Azure OpenAI 설정

1. [Azure Portal](https://portal.azure.com)에서 Azure OpenAI 리소스 생성
2. GPT-4 모델 배포
3. 환경 변수에 엔드포인트, API 키, 배포 이름 설정

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 [Issues](https://github.com/EnterDevelope/Exam_AI_Project/issues)를 통해 문의해주세요.

---

**개발자**: EnterDevelope  
**목표 출시일**: 2025년 12월
