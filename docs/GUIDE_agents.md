# GUIDE_agents.md — Test Prototype
> 최종 수정: 2026-04-19
> `test` 프로젝트에서 에이전트가 작업 시작 전 반드시 읽는 진입점이다.
> 이 프로젝트는 `master-plan` 기준 **3순위 / 특색 프로그램 변형** 작업으로 운영한다.

---

## 프로젝트 개요

`test`는 수행평가 코치 흐름을 빠르게 검증하는 정적 프로토타입 저장소다.

- 런타임 프로토타입: `index.html`, `pages/`, `assets/`
- 차후 이식 골격: `src/`
- 참고 기획 문서: `docs/PRD_performance_jarvis_engine_v1.0.md`, `docs/performance_jarvis_engine_plan.md`, `docs/jarvis_ai_tutor_plan.md`

현재 기준에서 중요한 구분:

- `pages/`와 `assets/`는 지금 브라우저에서 보이는 실제 화면
- `src/`는 이후 `selfq` 등으로 옮길 때 참고할 구조

---

## 작업 전 필독 문서

| 상황 | 읽을 문서 |
|------|-----------|
| 전체 기준 확인 | `D:/workbox/llmwiki/wiki/master-plan.md` |
| PLAN 작성 | `D:/workbox/llmwiki/wiki/standards/plan-template.md` |
| 주석달기 | `D:/workbox/llmwiki/wiki/standards/annotation-format.md` |
| Codex 인계 | `D:/workbox/llmwiki/wiki/standards/agent-handoff.md` |
| 현재 세션 우선순위 | `docs/GUIDE_playbook.md` |
| PLAN 목록/상태 확인 | `docs/plan/README.md` |
| 과거 handoff 참고 | `docs/playbook.md`, `docs/next_session_handoff.md` |
| 이식 기준 확인 | `docs/selfq_migration_map.md` |

---

## 세션 시작 루틴

```text
1. master-plan.md 확인
2. GUIDE_playbook.md 확인
3. docs/plan/README.md에서 active PLAN 확인
4. 관련 HTML/CSS/JS 파일 직접 열기
5. 필요 시 기획 문서와 기존 handoff 문서 확인
6. 구현 시작
```

`시작하자` 또는 `시작 브리핑 해줘` 요청을 받으면 아래 3줄만 우선 보고한다.

- active PLAN: `없음` 또는 PLAN 경로 1개
- 지금 할 일: work unit ID 또는 `NEXT SESSION` 첫 항목
- 다음 한 줄 지시: `대상 + 행동 + 완료 기준`

`정리하자`, `세션 종료 정리해줘`, `플북 업데이트`, `로그 정리`, `마감 정리` 요청을 받으면 아래 종료 루틴을 바로 실행한다.

- 현재 작업 루트가 `test`인지 먼저 확인
- `docs/GUIDE_playbook.md`의 `NEXT SESSION` 갱신
- 관련 `docs/plan/PLAN_*.md` 상태 갱신
- 필요 시 `docs/README.md` 또는 관련 handoff 문서 갱신

---

## 핵심 운영 규칙

- PLAN 없이 구현부터 들어가지 않는다.
- `정리`, `개선`, `보강`, `반영`, `연결`, `착수` 같은 추상 단어만 있는 지시는 실행하지 않는다.
- 단, `정리하자`, `세션 종료 정리해줘`, `플북 업데이트`, `로그 정리`, `마감 정리`는 종료 루틴 트리거로 본다.
- `src/` 수정이 필요해도, 실제 런타임 화면이 `pages/`인지 `src/`인지 먼저 구분한다.
- 과목별 콘텐츠와 공통 레이아웃을 섞지 않는다.
  - 공통: `assets/css/coach-shared.css`, `assets/js/coach-shared.js`
  - 과목 전용: `coach-korean*`, `coach-math*`, `coach-english*`
- 학교/과목별 범위·배점·시험 날짜 같은 문구를 공통 파일에 올리지 않는다.
- 기존 Git 변경사항은 사용자 작업일 수 있으므로 되돌리지 않는다.

---

## 수정 범위 판단 기준

| 질문 | 기준 |
|------|------|
| 지금 바로 보이는 프로토타입을 바꾸는가? | `pages/`, `assets/`, `index.html` |
| 미래 이식 구조를 설명/준비하는가? | `src/`, `docs/selfq_migration_map.md` |
| 현재 세션의 우선 작업이 무엇인가? | `docs/GUIDE_playbook.md` |
| 이번 기능의 계약서가 있는가? | `docs/plan/PLAN_*.md` |

---

## 현재 권장 작업 흐름

1. `test`를 특화 프로토타입 프로젝트로 유지
2. 화면 변경은 `pages/`와 `assets/`에서 먼저 검증
3. 안정화된 패턴만 `src/` 이식 대상으로 기록
4. 반복되는 흐름은 PLAN으로 남겨 다음 세션에서도 재현 가능하게 유지
