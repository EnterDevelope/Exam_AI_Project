# MCP API 연결 사양 (백엔드 ↔ Microsoft Copilot Studio)

> 목적: Node.js 백엔드에서 Microsoft Copilot Studio(MCP)에 요약, 퀴즈, 해설 생성을 요청하고 응답을 처리하기 위한 REST API 설계 기준
> 

---

### ✅ 공통 사양

| 항목 | 내용 |
| --- | --- |
| 호출 방식 | HTTP POST |
| 인증 방식 | Bearer Token (Power Automate Webhook URL) |
| Content-Type | application/json |
| 응답 형식 | JSON |
| 응답 시간 | 최대 15초 이내 |

---

### 📌 1. 요약 생성 요청 API

| 항목 | 값 |
| --- | --- |
| Endpoint | `/api/summary` |
| MCP Flow 연결 | `generateSummaryFlow` |

### 📤 요청 예시

```json
{
  "subject": "마케팅 원론",
  "week": "2주차",
  "text": "[텍스트로 변환된 강의자료 내용]"
}

```

### 📥 응답 예시

```json
{
  "summary": "# 마케팅 원론 2주차\n## 주요 개념\n- STP 전략\n- 시장 세분화 기준\n...",
  "keywords": ["STP", "4P", "세분화"]
}

```

---

### 📌 2. 퀴즈 생성 요청 API

| 항목 | 값 |
| --- | --- |
| Endpoint | `/api/quiz` |
| MCP Flow 연결 | `generateQuizFlow` |

### 📤 요청 예시

```json
{
  "summary": "# 마케팅 원론\n- STP 전략..."
}

```

### 📥 응답 예시

```json
{
  "questions": [
    {
      "type": "multiple",
      "question": "STP 전략에서 첫 번째 단계는 무엇인가?",
      "options": ["Segmentation", "Targeting", "Positioning", "Promotion"],
      "answer": "Segmentation",
      "explanation": "STP의 첫 단계는 시장을 세분화하는 것입니다."
    },
    {
      "type": "short",
      "question": "마케팅 믹스 4P 중 제품은 영어로 무엇인가?",
      "answer": "Product"
    }
  ]
}

```

---

### 📌 3. 해설 생성 요청 API

| 항목 | 값 |
| --- | --- |
| Endpoint | `/api/feedback` |
| MCP Flow 연결 | `generateFeedbackFlow` |

### 📤 요청 예시

```json
{
  "question": "STP 전략의 첫 단계는 무엇인가?",
  "userAnswer": "Targeting",
  "correctAnswer": "Segmentation",
  "summary": "- STP 전략: Segmentation, Targeting, Positioning 순으로 진행됨"
}

```

### 📥 응답 예시

```json
{
  "correctAnswer": "Segmentation",
  "explanation": "STP는 시장 세분화(Segmentation)에서 시작합니다.",
  "reference": "- STP 전략: Segmentation, Targeting, Positioning 순으로 진행됨"
}

```

---

### 🧰 백엔드 적용 예시 (Node.js / Axios)

```
const axios = require("axios");

async function callMcpSummary(text, subject, week) {
  const response = await axios.post(
    "https://prod-00...mcp-summary-flow-url",
    {
      subject,
      week,
      text,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MCP_WEBHOOK_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}

```

---

> 이 문서는 백엔드 개발자 및 외부 연동 담당자가 MCP에 안정적으로 접근하고 응답을 처리할 수 있도록 설계된 표준 사양입니다. 변경이 발생할 경우 Flow 이름 및 Endpoint 버전 관리 필수.
>