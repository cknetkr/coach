# Test Prototype — CLAUDE.md
> 최종 수정: 2026-04-19
> 이 파일은 `D:/workbox/test` 프로젝트의 에이전트 진입점이다.
> 이 프로젝트는 `llmwiki/wiki/master-plan.md` 기준으로 **3순위 / 특색 프로그램 변형 트랙**에 둔다.

---

## 프로젝트 성격

- 프로젝트 루트: `D:/workbox/test`
- 현재 역할: 수행평가 코치 정적 프로토타입
- 현재 런타임 기준: `index.html`, `pages/`, `assets/`
- 차후 이식 준비 영역: `src/`
- 상위 기준 문서: `D:/workbox/llmwiki/wiki/master-plan.md`

`test`는 공통 Core 보일러가 아니라, 과목별 수행평가 코치 흐름을 빠르게 검증하는 특화 프로토타입이다.
따라서 공통 프로그램 표준(2순위)보다 먼저, 특색 프로그램의 베이스/변형 경계를 분명히 기록하는 방식으로 운영한다.

---

## 작업 전 읽을 순서

1. `D:/workbox/llmwiki/wiki/master-plan.md`
2. `D:/workbox/llmwiki/wiki/standards/plan-template.md`
3. `D:/workbox/llmwiki/wiki/standards/annotation-format.md`
4. `D:/workbox/llmwiki/wiki/standards/agent-handoff.md`
5. `D:/workbox/test/docs/GUIDE_agents.md`
6. `D:/workbox/test/docs/GUIDE_playbook.md`
7. `D:/workbox/test/docs/plan/README.md`

---

## 시작 루틴

1. `GUIDE_playbook.md`의 `NEXT SESSION` 확인
2. `docs/plan/`에서 `status: ready | in_progress | blocked` PLAN 스캔
3. active PLAN이 있으면 PLAN 우선, 없으면 `NEXT SESSION` 첫 항목부터 시작
4. 실제 수정 대상 파일을 직접 열어 현재 구현 상태 확인

## 시작 트리거

- 사용자가 `시작하자`, `시작 브리핑 해줘`, `세션 시작`, `지금 뭐해야 해`처럼 시작 의미의 표현을 쓰면, 현재 작업 루트가 `test`인지 먼저 확인한 뒤 시작 루틴을 바로 실행한다.
- 이 경우 먼저 보고할 것은 다음 3개다.
  - active PLAN: `없음` 또는 PLAN 경로 1개
  - 지금 할 일: `NEXT SESSION` 첫 항목 또는 active PLAN work unit
  - 다음 한 줄 지시: `대상 + 행동 + 완료 기준`

---

## 종료 트리거

- 사용자가 `정리하자`, `세션 종료 정리해줘`, `플북 업데이트`, `로그 정리`, `마감 정리`처럼 종료 의미의 표현을 쓰면, 현재 작업 루트가 `test`인지 먼저 확인한 뒤 `test/docs/GUIDE_playbook.md`의 종료 루틴을 바로 실행한다.
- 이 경우 `정리`는 추상 요청이 아니라 명시적 close-out 트리거로 본다.
- 종료 루틴의 기본 대상은 다음 3개다.
  - `docs/GUIDE_playbook.md`의 `NEXT SESSION`
  - 관련 `docs/plan/PLAN_*.md` 상태
  - 필요 시 `docs/README.md`

---

## 운영 원칙

- `test`의 실제 화면 기준은 `index.html`, `pages/`, `assets/`다.
- `src/`는 미래 이식용 골격이므로, 현재 런타임 변경과 혼동하지 않는다.
- 구현 전에 PLAN이 없으면 먼저 `docs/plan/PLAN_*.md`를 만든다.
- 기존 `docs/playbook.md`와 `docs/next_session_handoff.md`는 과거 handoff 기록으로 남기고, 새 운영 기준은 `GUIDE_playbook.md`에 둔다.
