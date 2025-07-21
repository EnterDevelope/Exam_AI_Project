# AI Summary Note 프로젝트 개발 현황

## 프로젝트 개요 및 구조

- **목표**: 대학생 대상, 강의자료(PDF/HWP/이미지) 업로드 → AI 요약 → 퀴즈 생성/풀이 → 오답/히스토리 관리, 반복 복습 루프 제공
- **주요 기능**: 파일 업로드, AI 요약, 퀴즈 자동 생성, 오답 노트, 마이페이지, 다운로드, 히스토리, 통계
- **주요 페르소나**: 벼락치기형(A), 루틴형(B) 모두 만족하는 플로우 설계

### 사용 기술

- **프론트엔드**: Next.js 13+ (App Router), React, Tailwind CSS, TypeScript, Zustand, Axios
- **백엔드/API**: Next.js API Route, Node.js, Express, Supabase(PostgreSQL)
- **AI/외부 연동**: Azure OpenAI (GPT-4), Microsoft Copilot Studio, REST Webhook
- **스토리지**: Firebase Storage 또는 AWS S3
- **배포/운영**: Vercel, Railway, .env.local 환경변수 관리

### 폴더 구조 및 설계 원칙

- `app/` : Next.js App Router 기반 라우트 및 페이지, API Route
- `components/` : 공통/도메인별 UI 컴포넌트 (common, features, layout)
- `lib/` : API 유틸, 텍스트 파서, 분석기, supabase 클라이언트 등 핵심 로직
- `store/` : Zustand 기반 상태 관리 (도메인별 분리)
- `types/` : 타입 정의 (api, quiz, summary, flow 등)
- `mdfiles/` : 요구사항, 설계, 회의록 등 문서
- `styles/` : Tailwind CSS 글로벌 스타일
- `public/` : 정적 자산(로고 등)

### 인증/SSR/미들웨어 구조

- **@supabase/ssr** 기반 SSR/미들웨어/클라이언트 인증 세션 동기화
- 미들웨어에서 updateSession 유틸리티 함수로 쿠키 기반 세션 갱신
- 클라이언트/SSR/미들웨어 모두에서 인증이 일관되게 동작
- 공식 가이드/베스트프랙티스 준수

### 타입/상태 관리

- TypeScript 기반 엄격한 타입 관리
- Zustand로 도메인별 상태 분리, selector 적극 사용
- persist 미들웨어 제거, SSR/CSR 혼용 문제 방지

### 보안/운영

- 환경 변수는 .env.local로 분리, 절대 노출 금지
- Supabase RLS(행 수준 보안) 정책 적용
- 파일/입력 데이터 검증 및 크기 제한
- API/미들웨어/SSR에서 인증/권한 체크 일관성 유지

---

## 2025년 7월 최신 작업 내역 및 진행 상황

- ✅ **AI 연동 인프라 완성**: Microsoft Copilot Studio 대신 Azure AI Foundry 기반으로 요약/퀴즈/피드백 API 연동 완료
- ✅ **환경 변수 및 .env.local 템플릿 정비**: Foundry 엔드포인트, API 키, 배포 이름 기준으로 환경 변수 구조 통일
- ✅ **API 정상화**: 연결 테스트, 요약, 피드백, 퀴즈 생성(마크다운 코드블록 파싱 버그 수정) 모두 정상 동작 확인
- ✅ **Supabase 연동 및 DB 스키마 설계 완료**: 프로젝트 설정, 테이블 생성, API 연동, 데이터 저장 테스트 모두 성공
- ✅ **인증/SSR/미들웨어 구조 개선**: 공식 가이드 기반 SSR/미들웨어/클라이언트 인증 세션 동기화, 쿠키 기반 세션 갱신, 무한로딩/무한 리다이렉트 완전 해결
- ✅ **주요 페이지 정상화**: 요약하기/마이페이지 등 인증 보호 페이지 무한로딩 현상 해결, 정상 진입 및 데이터 표시 확인
- ✅ **코드 리팩토링 및 변수명 충돌/오타 수정**: isLoading 등 변수명 중복/오타 제거, 상태 관리 구조 개선
- ✅ **공식 가이드/베스트프랙티스 준수**: Supabase + Next.js App Router 최신 권장 구조 적용, 미들웨어 matcher 최적화, SSR/CSR 혼용 문제 해결

---

### 현재까지의 주요 완료 항목

- [x] Azure AI Foundry 연동 및 API 구조 확립
- [x] Supabase DB 스키마/연동/테스트 완료
- [x] 인증 시스템 SSR/CSR/미들웨어 구조 개선 및 동기화
- [x] 요약하기/마이페이지/퀴즈 등 주요 페이지 무한로딩/리다이렉트 이슈 해결
- [x] 코드 리팩토링 및 상태 관리 구조 개선
- [x] 공식 문서 기반 베스트프랙티스 적용

## 핵심 기능

1. **파일 업로드**: PDF, HWP, 이미지 파일 업로드 및 텍스트 추출
2. **AI 요약**: 업로드된 자료를 GPT 기반으로 요약 (Azure AI Foundry 연동)
3. **퀴즈 생성**: 요약 내용을 바탕으로 5문제 퀴즈 생성 (객관식 3개, 주관식 2개)
4. **학습 관리**: 사용자별 퀴즈 이력, 오답 노트, 해설 제공

5. **고급 기능 구현**
   - 오답 복습 모드, 과목 자동 감지, HWP 파일 지원, PDF 다운로드 등
6. **UI/UX 개선**
   - 마이페이지/퀴즈/홈페이지 UX 고도화, 반응형 최적화
7. **테스트 및 최적화**
   - 단위/통합 테스트, 성능 최적화, 에러/로딩 UX 개선
8. **운영/배포 준비**
   - 환경 변수/보안 점검, 배포 자동화, 문서화

---

#### 참고 자료.

- [Supabase 공식 Next.js 인증 가이드](https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware)
- [공식 SSR Auth 가이드](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supaboost: Supabase + Next.js SSR/CSR](https://www.supaboost.dev/blog/supabase-server-side-rendering-nextjs)
- [Infinite scroll with Next.js, Framer Motion, and Supabase](https://supabase.com/blog/infinite-scroll-with-nextjs-framer-motion)
