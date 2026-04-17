# Test Prototype — CLAUDE.md
> 최종 수정: 2026-04-17
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

---

## 운영 원칙

- `test`의 실제 화면 기준은 `index.html`, `pages/`, `assets/`다.
- `src/`는 미래 이식용 골격이므로, 현재 런타임 변경과 혼동하지 않는다.
- 구현 전에 PLAN이 없으면 먼저 `docs/plan/PLAN_*.md`를 만든다.
- 기존 `docs/playbook.md`와 `docs/next_session_handoff.md`는 과거 handoff 기록으로 남기고, 새 운영 기준은 `GUIDE_playbook.md`에 둔다.
