# 수행평가 자비스 엔진 — Product Requirements Document

**프로젝트 폴더명:** `test`  
**버전:** v1.0  
**작성일:** 2026-04  
**작성 기준:** `test/` 정적 프로토타입, `test/docs/playbook.md`, `test/docs/README.md`, 기존 기획 문서 종합  
**Firebase 프로젝트:** 미정  
**기술 스택:** 현재 `HTML/CSS/JS` 정적 프로토타입, 목표 `React/Vite + selfq 연동 + Gemini 계열 AI`

---

## 0. 왜 만드는가 (존재 이유 · 철학 · 방향)

> **이 섹션이 PRD의 전부다.**
> 기능 추가·변경·삭제의 모든 판단은 여기로 돌아와서 결정한다.

### 출발점
학생은 수행평가를 시작할 때 글을 못 쓰는 것보다, 과제 문서를 제대로 해석하지 못해서 막히는 경우가 많다.  
지금의 일반적인 AI 도구는 문장을 대신 써주거나 초안을 던져 주는 데는 강하지만, 수행평가 안내문을 읽고 "무엇을 어떤 순서로 준비해야 하는지"를 구조화해서 안내하는 데는 약하다.  
이 프로젝트는 그 빈틈을 메우기 위해 출발했다.

### 이 서비스가 만들어야 할 변화
학생이 과제 문서나 과목별 수행 흐름 앞에서 막막함을 느끼는 대신,
1. 해야 할 순서를 먼저 이해하고,
2. 지금 당장 해야 할 행동을 알고,
3. 결과물을 단계적으로 쌓아 가며,
4. 제출 직전에는 감점 위험까지 점검할 수 있게 만들어야 한다.

### 절대 되어서는 안 되는 모습 (금지 원칙)
```
- 대필형 답안 생성기처럼 보이거나 작동하지 않는다.
- 화려한 화면만 있고 실제 과제 진행 순서가 불분명한 서비스가 되지 않는다.
- 과목별 하드코딩 템플릿만 반복하는 고정형 폼 서비스에 머물지 않는다.
- 학생에게 한 번에 너무 많은 입력과 선택을 요구하지 않는다.
```
> 에이전트는 위 금지 원칙에 위배되는 기능을 구현하지 않는다.  
> 기획자의 명시적 승인 없이 이 원칙을 변경하지 않는다.

### 경쟁 서비스와의 차이 (철학적 차이)
이 서비스는 "잘 써주는 AI"보다 "먼저 이해하고 순서를 잡아주는 AI"에 가깝다.  
핵심은 결과 문장 생성이 아니라, 과제 구조 해석, 단계 설계, 진행 코칭, 루브릭 검증이다.

---

## 1. 킬러 메뉴 ★

> **사용자가 이 서비스를 선택하는 결정적 이유.**
> 이것이 없으면 이 서비스를 쓸 이유가 없다.

### 킬러 메뉴 정의
```
학생이 수행평가 주제나 안내문 앞에서 막히는 순간, AI가 해야 할 절차를 먼저 구조화하고 다음 행동을 바로 코칭해 주는 경험
```

### 첫 경험 시나리오
```
화면:   수행평가 허브 또는 과목별 코치 진입 화면
행동:   사용자가 국어/수학/영어 수행평가 흐름 또는 과제 문서를 선택한다
반응:   서비스가 과제 구조, 핵심 단계, 준비 포인트, 예시 결과물을 순서대로 제시한다
감정:   "아, 뭘 해야 하는지 이제 알겠다"는 안도감과 시작 가능성
```

### 설계 원칙
> 모든 기능 우선순위는 "킬러 메뉴를 강화하는가"를 첫 번째 기준으로 판단한다.  
> 킬러 메뉴의 경험을 희석시키는 방향의 기능 추가는 금지한다.

---

## 2. 서비스 정체성

### 2.1 한 줄 정의
중고등학생이 수행평가의 절차와 기준을 먼저 이해하고 단계별 코칭을 받을 수 있는 AI 수행평가 코치 서비스

### 2.2 타겟 사용자

| 우선순위 | 사용자 그룹 | 핵심 니즈 | 킬러 메뉴 접점 |
|------|------|------|------|
| 1순위 | 수행평가를 준비하는 중고등학생 | 무엇을 어떤 순서로 해야 하는지 빠르게 파악하고 싶음 | 과목별 코치 또는 문서 해석을 통해 즉시 절차를 받음 |
| 2순위 | 자기주도 학습이 약한 학생 | 과제를 작은 단계로 쪼개서 진행하고 싶음 | 단계별 질문과 체크포인트를 따라가며 완주 |
| 3순위 | 학부모/튜터/교사 보조 사용자 | 학생이 어디서 막히는지 확인하고 싶음 | 단계 결과, 체크리스트, 감점 위험 요약을 참고 |

---

## 3. 핵심 사용 흐름 (Core Flow)

```
[허브 진입] → [과목/과제 선택] → [과제 구조 이해] → ★[단계별 코칭 경험]★ → [초안/결과물 축적] → [루브릭 점검]
```

### 디바이스별 역할 분리
| 디바이스 | 주요 용도 | 핵심 기능 |
|------|------|------|
| PC / 태블릿 | 구조 이해·작성·수정 | 허브 탐색, 단계별 작성, 예시/체크리스트 확인, 최종 정리 |
| 모바일 | 확인·복습·실행 | 현재 단계 확인, 체크포인트 복습, 발표/시험 대비 확인 |

---

## 4. 기능 명세

> 기능 우선순위 판단 기준: 킬러 메뉴를 강화하는가 → 섹션 0 금지 원칙에 위배되지 않는가

### 4.1 MVP — 반드시 포함

| # | 기능명 | 설명 | 킬러 메뉴 연관성 | 우선순위 |
|------|------|------|------|------|
| 1 | 수행평가 허브 | 국어·수학·영어 수행평가 흐름 진입 허브 제공 | 직접 | P0 |
| 2 | 과목별 코치 화면 | 과목 특성에 맞는 진행 단계, 안내 카피, 예시 화면 제공 | 직접 | P0 |
| 3 | 단계형 진행 구조 | 과제를 한 번에 쓰지 않고 단계별로 나눠 진행 | 직접 | P0 |
| 4 | 체크리스트/가이드 블록 | 해야 할 일, 자주 놓치는 포인트, 예시 결과를 함께 제시 | 직접 | P0 |
| 5 | 정적 프로토타입 시각 QA 체계 | 루트 HTML 프로토타입을 시각 기준으로 유지 | 간접 | P0 |
| 6 | React 전환용 라우트/구조 초안 | `test/src` 기준 페이지 분리와 추후 selfq 이전 준비 | 간접 | P0 |
| 7 | 문서 해석형 과제 입력 설계 | 자유 입력이 아니라 과제 안내문 중심으로 확장 가능한 입력 구조 설계 | 직접 | P0 |

### 4.2 Phase 2 — MVP 이후

| # | 기능명 | 설명 | 선행 조건 |
|------|------|------|------|
| 1 | 문서 업로드/붙여넣기 | 수행평가 안내문 또는 루브릭 입력 | MVP 화면 구조 안정화 |
| 2 | Document Parser | 과제명, 조건, 글자 수, 평가 기준 자동 추출 | 문서 입력 경로 확보 |
| 3 | Assignment Schema Builder | 문서 해석 결과를 공통 JSON 구조로 저장 | Parser 정의 완료 |
| 4 | Workflow Generator | 추출된 항목에 맞춰 단계와 질문 자동 생성 | 공통 스키마 완성 |
| 5 | Rubric Checker | 누락 항목, 감점 위험, 분량/조건 충족 여부 점검 | 결과물 구조화 |
| 6 | 초안 통합 및 출력 | 단계별 입력을 최종 제출 형식으로 조립 | 단계 결과 저장 구조 |
| 7 | 발표/시험 대비 훈련 | 암기 카드, 빈칸 퀴즈, 발표용 요약 제공 | 결과물 생성 안정화 |

### 4.3 미정 / 보류

| 기능명 | 보류 이유 |
|------|------|
| 음성 대화형 튜터 | MVP 범위를 벗어나며 품질 관리 비용이 큼 |
| OCR 고도화 | 현재는 텍스트 입력 중심으로도 초기 검증 가능 |
| 학급 단위 운영 대시보드 | 학생 경험과 킬러 메뉴 검증이 먼저 |
| 자동 제출/외부 LMS 연동 | 실제 학교 환경별 요구사항이 불명확함 |

---

## 5. 콘텐츠 & 데이터 구조

### 5.1 핵심 데이터 엔티티

| 엔티티 | 생성 주체 | 저장 위치 | 설명 |
|------|------|------|------|
| `subjects` | 관리자/기획자 | 정적 데이터 또는 `config` | 국어·수학·영어 등 과목별 코치 진입 정보 |
| `assignments` | 사용자/AI | `assignments/{assignmentId}` | 수행평가 과제 메타 정보, 안내문, 제약 조건 |
| `assignmentSchemas` | AI | `assignments/{assignmentId}/schemas/{schemaId}` | 문서 해석 결과로 생성된 구조화 스키마 |
| `workflowSessions` | 사용자/AI | `users/{uid}/workflowSessions/{sessionId}` | 현재 진행 단계, 답변, 체크 상태 |
| `stepResults` | 사용자/AI | `users/{uid}/workflowSessions/{sessionId}/stepResults/{stepId}` | 단계별 입력과 피드백 결과 |
| `finalOutputs` | AI/사용자 | `users/{uid}/finalOutputs/{outputId}` | 최종 제출용 초안, 체크리스트, 요약본 |

### 5.2 사용자별 누적 데이터

| 데이터 | 저장 경로 | 설명 |
|------|------|------|
| 프로필/학년/선호 과목 | `users/{uid}` | 개인화 코칭의 기본 정보 |
| 최근 수행평가 이력 | `users/{uid}/workflowSessions` | 최근 작업 중인 과제와 완료 여부 |
| 단계별 답변 | `users/{uid}/workflowSessions/{sessionId}/stepResults` | 중간 작성물 누적 |
| 최종 결과물 | `users/{uid}/finalOutputs` | 제출본, 발표본, 복습본 저장 |

---

## 6. Firestore 스키마 초안

```text
subjects/{subjectId}
  ├─ name: string              // 과목명
  ├─ slug: string              // korean, math, english
  ├─ status: string            // prototype, live
  └─ config: map               // 카피/CTA/단계 설정

assignments/{assignmentId}
  ├─ uid: string               // 작성자
  ├─ subjectId: string         // 연결 과목
  ├─ title: string             // 과제명
  ├─ inputMode: string         // subjectFlow | documentUpload | pastedText
  ├─ sourceText: string        // 안내문 원문
  ├─ rubricText: string        // 루브릭 원문
  ├─ constraints: array        // 분량, 금지 사항 등
  ├─ status: string            // draft, in_progress, completed
  ├─ createdAt: timestamp
  └─ updatedAt: timestamp

assignments/{assignmentId}/schemas/{schemaId}
  ├─ assignmentType: string    // reading-analysis, presentation, essay ...
  ├─ steps: array              // 구조화된 단계 정의
  ├─ globalConstraints: array  // 전체 제약
  ├─ finalOutputType: string   // worksheet, essay, script ...
  └─ parserVersion: string

users/{uid}
  ├─ displayName: string
  ├─ schoolLevel: string
  ├─ role: string              // student, admin
  └─ createdAt: timestamp

users/{uid}/workflowSessions/{sessionId}
  ├─ assignmentId: string
  ├─ currentStepId: string
  ├─ completionRate: number
  ├─ riskFlags: array
  ├─ lastCoachMessage: string
  └─ updatedAt: timestamp

users/{uid}/workflowSessions/{sessionId}/stepResults/{stepId}
  ├─ title: string
  ├─ answer: string
  ├─ feedback: string
  ├─ selfCheck: array
  └─ updatedAt: timestamp

users/{uid}/finalOutputs/{outputId}
  ├─ assignmentId: string
  ├─ draft: string
  ├─ checklist: array
  ├─ summaryCards: array
  └─ createdAt: timestamp

settings/_config
  ├─ prototypeSourceOfTruth: string   // root-html
  └─ activeSubjects: array
```

### 스키마 결정 보류 항목

| 경로 | 보류 이유 |
|------|------|
| `assignments/{assignmentId}/files` | 파일 업로드 방식을 Firebase Storage로 갈지 외부 스토리지로 갈지 미정 |
| `users/{uid}/classrooms` | 교사/학급 운영 범위가 MVP에 포함되지 않음 |
| `analytics/*` | 이벤트 설계를 먼저 정한 뒤 반영 필요 |

---

## 7. 기술 스택 & 인프라

### 7.1 프론트엔드
- 현재: 루트 `test/` 기반 정적 HTML/CSS/JS 프로토타입
- 목표: React 19 + Vite
- 라우터: React Router v6 계열
- 중요 원칙: 실제 마이그레이션 시작 전까지는 루트 HTML 프로토타입을 시각 QA의 기준으로 유지

### 7.2 백엔드
- Firebase Auth: 추후 이메일/소셜 로그인 검토, 현재는 미구현
- Firestore Rules 방향: 학생 본인 데이터 중심 읽기/쓰기, 관리자 일부 설정만 별도 권한
- Firebase Functions: 문서 해석, 단계 생성, 루브릭 체크 등 AI 호출 중계 용도

### 7.3 AI 엔진
| 엔진 | 역할 | 호출 방식 |
|------|------|------|
| Gemini 계열 LLM | 문서 해석, 단계 생성, 피드백, 결과물 조립 | Functions 경유 |
| 보조 규칙 엔진 | 글자 수, 항목 누락, 체크리스트 검증 | 서버/클라이언트 혼합 가능 |

### 7.4 외부 연동
| 서비스 | 용도 | MVP 포함 여부 |
|------|------|------|
| Firebase Storage | 문서/이미지 첨부 | N |
| OCR 서비스 | 이미지 문서 텍스트 추출 | N |
| 학교/LMS 연동 | 제출 자동화, 수업 연계 | N |

---

## 8. 역할 & 권한

| 역할 | 구현 방식 | 접근 범위 |
|------|------|------|
| 관리자 | `users.role = admin` | 과목 설정, 카피/구조 실험, 운영 지표 확인 |
| 학생 | Firebase Auth | 본인 과제, 세션, 결과물 전체 |
| 비로그인 사용자 | 공개 허브 접근 또는 제한적 체험 | 허브와 샘플 화면 열람만 허용 가능 |

---

## 9. 성장 & 수익화 로드맵

### 9.1 확산 전략
```
[개인 학생용 프로토타입 검증] → [과목별 완주 경험 고도화] → [문서 해석형 AI 코치 정식화] → [학부모/튜터/학교 단위 확장]
```

### 9.2 수익화 계획
| 단계 | 시점 | 방식 |
|------|------|------|
| MVP | 초기 검증 단계 | 무료 |
| Phase 2 | 문서 해석 기능 안정화 이후 | 과목별 프리미엄 코칭 또는 월 구독 |
| Phase 3 | 기관 확장 단계 | 학원/학교용 라이선스 또는 B2B 패키지 |

---

## 10. 관리자 대시보드 구조

| 탭 ID | 라벨 | 파일 | MVP 포함 |
|------|------|------|------|
| `overview` | 프로토타입 현황 | `AdminPrototypeOverview.jsx` | N |
| `subjects` | 과목 설정 | `AdminSubjectConfigPage.jsx` | N |
| `prompt-lab` | 프롬프트/AI 실험 | `AdminPromptLabPage.jsx` | N |
| `content-qa` | 시각 QA / 카피 검수 | `AdminContentQAPage.jsx` | N |

> 현재 `test` 프로젝트는 학생 경험 검증이 우선이므로 관리자 대시보드는 설계만 유지하고 구현은 보류한다.

---

## 11. 미결 사항

| # | 항목 | 영향 범위 | 우선순위 |
|------|------|------|------|
| 1 | 문서 입력 방식을 텍스트 우선으로 시작할지, 파일 업로드를 같이 넣을지 | 입력 UX, 스토리지, AI 파이프라인 | P0 |
| 2 | 국어/수학/영어 이후 과목 확장 순서 | IA, 카피, 프롬프트 구조 | P1 |
| 3 | selfq 내부 이식 시점과 범위 | 라우트, 데이터 구조, 컴포넌트 분리 | P0 |
| 4 | 실제 AI 결과 저장 단위를 step 중심으로 둘지 output 중심으로 둘지 | Firestore 스키마, 비용 최적화 | P1 |
| 5 | 비로그인 체험 범위를 어디까지 허용할지 | 퍼널, 인증 전략 | P1 |

---

## 12. 에이전트 작업 규칙

- 섹션 0의 **금지 원칙**에 위배되는 기능을 구현하지 않는다.
- 섹션 1의 **킬러 메뉴**를 희석시키는 방향의 변경을 하지 않는다.
- 루트 `test/` HTML 프로토타입을 시각 QA의 기준으로 유지한다.
- `test/src` 전환 작업은 루트 프로토타입과 비교 가능한 상태에서만 진행한다.
- 문서 해석 기능을 넣더라도 "답안 대필"처럼 보이는 UX는 피한다.
- 이 문서에 없는 컬렉션/필드를 임의로 추가하지 않는다.
- 스키마 변경이 필요하면 반드시 사용자 확인 후 진행한다.
- `[미정]` 또는 `보류` 항목은 승인 없이 구현하지 않는다.

---

> 문서 버전: v1.0  
> 생성 기준: `test/docs/README.md`, `test/docs/playbook.md`, `test/docs/performance_jarvis_engine_plan.md`, `test/docs/jarvis_ai_tutor_plan.md`, `test/docs/selfq_migration_map.md` 종합  
> 이전 문서: 없음
