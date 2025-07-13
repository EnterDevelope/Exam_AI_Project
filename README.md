# AI Summary Note

Next.js 기반의 학습 요약 및 퀴즈 생성 서비스입니다. Microsoft Copilot Studio의 Power Automate Flow와 연동하여 요약, 퀴즈, 해설을 제공합니다.

## 개발 환경 설정

```bash
npm install
npm run dev
```

### 필수 환경 변수

프로젝트 루트에 `.env.local` 파일을 만들고 다음 값을 설정합니다:

```bash
# Azure OpenAI 설정
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com
AZURE_OPENAI_API_KEY=your-api-key-here
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name
```

#### 환경 변수 설정 방법

1. **Azure Portal**에서 Azure OpenAI 리소스로 이동
2. **키 및 엔드포인트** 섹션에서:
   - `AZURE_OPENAI_ENDPOINT`: 엔드포인트 URL 복사
   - `AZURE_OPENAI_API_KEY`: 키 1 또는 키 2 중 하나 복사
3. **모델 배포** 섹션에서:
   - `AZURE_OPENAI_DEPLOYMENT_NAME`: 배포된 모델의 이름 복사

#### 예시
```bash
AZURE_OPENAI_ENDPOINT=https://my-openai-resource.openai.azure.com
AZURE_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4-deployment
```

## 스크립트

- `npm run dev` – 개발 서버 실행
- `npm run build` – 프로덕션 빌드
- `npm run start` – 프로덕션 서버 실행
- `npm run lint` – ESLint 검사
