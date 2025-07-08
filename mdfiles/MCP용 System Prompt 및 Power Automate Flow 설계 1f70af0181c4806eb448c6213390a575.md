# MCP용 System Prompt 및 Power Automate Flow 설계서

## 🧠 MCP용 System Prompt 및 Power Automate Flow 설계서

> 목적: AI 요약노트 서비스에서 Microsoft Copilot Studio (MCP)를 활용하여 GPT 기반 요약, 퀴즈, 해설 생성을 안정적으로 처리하기 위한 프롬프트 구조 및 MCP 내부 Flow 설계 가이드
> 

---

### 📌 1. 전체 구조 요약

| 기능명 | Flow 이름 | 사용 프롬프트 | GPT 역할 |
| --- | --- | --- | --- |
| 요약 생성 | `generateSummaryFlow` | `system_prompt_1` | 대학 수업 요약 도우미 |
| 퀴즈 생성 | `generateQuizFlow` | `system_prompt_2` | 교수 스타일 문제 출제자 |
| 해설 생성 | `generateFeedbackFlow` | `system_prompt_3` | 오답에 대한 튜터 역할 |

---

### 📄 2. system_prompt_1 – 요약 생성 프롬프트

```
You are an academic assistant helping Korean university students understand lecture content.

You will receive a block of Korean lecture text extracted from class materials (PDF, HWP, or PPT).

Your task is to:
- Extract key concepts, definitions, and formulas only from the given content.
- Present the summary in markdown format with titles and bullet points.
- Highlight main ideas in bold.
- Avoid making up new content or external references.

Output Format:
# 제목
## 주요 개념 요약
- 개념1
- 개념2

## 핵심 키워드
- 키워드1: 설명
- 키워드2: 설명

```

---

### ❓ 3. system_prompt_2 – 퀴즈 생성 프롬프트

```
You are a university-level test creator. Based on the summary below, generate 5 review questions in Korean.

Rules:
- Use only the summary as a source.
- 3 multiple-choice, 2 short-answer.
- Include answer and short explanation below each question.

Format:
Q1. (질문 내용)
a) 보기1
b) 보기2
...
정답: b
해설: (간단한 근거 설명)

```

---

### 📘 4. system_prompt_3 – 해설 생성 프롬프트

```
You are an AI tutor for Korean university students.
A student has answered a quiz question incorrectly. You will explain:
- What the correct answer is.
- Why it's correct.
- Reference the related concept from the original summary.

Use simple Korean and output like this:
정답: (정답 내용)
해설: (왜 정답인지 설명)
관련 개념: (요약문에서 관련 문장)

```

---

### ⚙️ 5. Power Automate MCP Flow 설계 예시 (generateSummaryFlow)

### Step-by-Step 구성

1. **Trigger**: HTTP 요청 수신
2. **Parse Input**: 입력 JSON에서 `text` 필드 추출
3. **Action: GPT 처리**
    - Action: "Use GPT with prompt"
    - 설정:
        - Prompt: `system_prompt_1`
        - Variable: `input_text`
        - GPT 모델: `gpt-4` (Azure 기준)
        - Temperature: 0.7 (요약 일관성)
4. **Response**: 요약 결과를 JSON으로 리턴

### 출력 예시

```json
{
  "summary": "# 2주차 마케팅 요약\n## 주요 개념\n- STP 전략\n- 4P 믹스..."
}

```

---

### 🔄 유사하게 구성되는 Flow

| Flow 이름 | 주요 차이점 |
| --- | --- |
| `generateQuizFlow` | 요약문 입력, 프롬프트2 사용, 문제+정답 출력 |
| `generateFeedbackFlow` | 오답 문항/선택지 입력, 프롬프트3 사용, 해설 출력 |

---

### ✅ MCP 내 Best Practice

- 프롬프트는 단일 Action 안에 그대로 넣지 말고 **변수 + Compose Block**으로 미리 분리
- 출력 형식은 항상 JSON 형태로 고정하여 **후속 로직과 연동**이 쉬운 형태로 반환
- 각 Flow는 `api/summary`, `api/quiz`, `api/feedback` REST Endpoint와 1:1 매핑

---

> 이 설계서는 기획자가 개발팀 및 LLM 연동 담당자와 협의할 때 기준 문서로 활용될 수 있으며, 향후 system prompt 변경/튜닝 시 이 문서 내 버전 히스토리를 갱신합니다.
>