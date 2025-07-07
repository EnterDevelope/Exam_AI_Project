# AI Summary Note

Next.js 기반의 학습 요약 및 퀴즈 생성 서비스입니다. Microsoft Copilot Studio의 Power Automate Flow와 연동하여 요약, 퀴즈, 해설을 제공합니다.

## 개발 환경 설정

```bash
npm install
npm run dev
```

### 필수 환경 변수

`.env.local` 파일을 생성하여 다음 값을 설정합니다.

```
MICROSOFT_COPILOT_WEBHOOK_URL=your_webhook_url
MCP_WEBHOOK_TOKEN=your_bearer_token
```

## 스크립트

- `npm run dev` – 개발 서버 실행
- `npm run build` – 프로덕션 빌드
- `npm run start` – 프로덕션 서버 실행
- `npm run lint` – ESLint 검사
