---
featureId: F-PROT-01
version: 1
status: done
owner_agent: codex
master_plan_priority: 3순위
master_plan_stage_entry: 2.계획
created: 2026-04-17
updated: 2026-04-17
---

> 이 문서는 master-plan의 3순위 / 2.계획에 해당한다.

# PLAN_test_bootstrap_v1

## 3.1 배경

### 사용자 원문

> "지금 test폴더를 기준으로 잡고 작업을 할건데 master plan에 맞게 필요하나 파일들은 작성하고 구조를 잡아죠"

### 에이전트용 재해석

`test`에는 프로토타입 기획 자료와 과거 handoff 문서는 있지만, `master-plan` 파이프라인에 바로 연결되는 프로젝트 진입 문서가 없다.

이 상태에서는 다음 문제가 생긴다.

- 세션 시작 시 어떤 문서를 먼저 읽어야 하는지 고정되어 있지 않다.
- `docs/playbook.md`는 handoff 기록 성격이라 현재 운영 기준 문서로 쓰기 어렵다.
- `docs/plan/` 허브가 없어 새 기능을 PLAN 단위로 누적하기 어렵다.

따라서 이번 feature의 목적은 `test`를 특화 프로토타입 프로젝트로 명시하고, 다음 세션부터 바로 PLAN 기반으로 들어갈 수 있는 최소 문서 뼈대를 만드는 것이다.

## 3.2 현황 — 1단계 리서치 산출물

### 현재 문서 상태

- `D:/workbox/test/docs/README.md`
  - 프로젝트 개요와 엔트리 포인트는 적혀 있지만, 새 운영 기준 문서 연결은 없다.
- `D:/workbox/test/docs/playbook.md`
  - 이전 세션 handoff 성격이 강하며, `master-plan` 파이프라인에 직접 맞춘 구조는 아니다.
- `D:/workbox/test/docs/next_session_handoff.md`
  - 세부 handoff 기록은 있으나 프로젝트의 장기 운영 기준 문서는 아니다.
- `D:/workbox/test/CLAUDE.md`
  - 존재하지 않는다.
- `D:/workbox/test/docs/GUIDE_agents.md`
  - 존재하지 않는다.
- `D:/workbox/test/docs/GUIDE_playbook.md`
  - 존재하지 않는다.
- `D:/workbox/test/docs/plan/`
  - 존재하지 않는다.

### 관련 파일 전수 목록

- `D:/workbox/test/docs/README.md`
- `D:/workbox/test/docs/playbook.md`
- `D:/workbox/test/docs/next_session_handoff.md`
- `D:/workbox/llmwiki/wiki/master-plan.md`
- `D:/workbox/llmwiki/wiki/standards/plan-template.md`

### 기존 구현의 한계

- 프로젝트 루트 진입 문서가 없다.
- 현재 세션 기준과 과거 handoff 문서가 분리되지 않았다.
- PLAN 허브가 없어 다음 기능부터 어떤 featureId와 상태로 관리할지 고정되어 있지 않다.

### 외부 의존성·제약

- 코드 런타임 수정은 이번 feature 범위가 아니다.
- 기존 `docs/playbook.md`와 `docs/next_session_handoff.md`는 삭제하지 않고 legacy 참조로 유지한다.
- `test`는 공통 Core가 아니라 특화 프로토타입이므로 `master_plan_priority`는 `3순위`로 둔다.

## 3.3 목표

- `test` 프로젝트 루트에 에이전트 진입 문서가 생긴다.
- `docs/` 아래에 현재 세션 운영 기준 문서와 PLAN 허브가 생긴다.
- `docs/README.md`가 새 운영 문서를 먼저 가리킨다.
- 다음 세션부터 새 feature를 `docs/plan/PLAN_*.md`로 누적할 수 있다.

## 3.4 작업 단위 (Work Units)

#### W01 — 루트 진입 문서 생성

| 필드 | 값 |
|---|---|
| id | F-PROT-01/W01 |
| 대상 파일 | `D:/workbox/test/CLAUDE.md` (신규) |
| 행동 | 추가 |
| 완료 기준 | `test -f D:/workbox/test/CLAUDE.md` |
| 담당 | codex |
| 차단 | 없음 |

동작:
1. 프로젝트 성격과 `master-plan` 매핑을 적는다.
2. 읽을 문서 순서를 고정한다.
3. `docs/playbook.md`와 새 playbook의 관계를 짧게 적는다.

#### W02 — 프로젝트 GUIDE_agents 생성

| 필드 | 값 |
|---|---|
| id | F-PROT-01/W02 |
| 대상 파일 | `D:/workbox/test/docs/GUIDE_agents.md` (신규) |
| 행동 | 추가 |
| 완료 기준 | `test -f D:/workbox/test/docs/GUIDE_agents.md` |
| 담당 | codex |
| 차단 | F-PROT-01/W01 |

동작:
1. 런타임 프로토타입과 `src/` 이식 골격의 차이를 적는다.
2. 작업 전 필독 문서 표를 추가한다.
3. 세션 시작 루틴과 구현 규칙을 적는다.

#### W03 — 프로젝트 GUIDE_playbook 생성

| 필드 | 값 |
|---|---|
| id | F-PROT-01/W03 |
| 대상 파일 | `D:/workbox/test/docs/GUIDE_playbook.md` (신규) |
| 행동 | 추가 |
| 완료 기준 | `test -f D:/workbox/test/docs/GUIDE_playbook.md` |
| 담당 | codex |
| 차단 | F-PROT-01/W02 |

동작:
1. `NEXT SESSION`을 추가한다.
2. `master-plan` 기준 순위와 현재 프로젝트 역할을 적는다.
3. legacy handoff 문서와 새 운영 문서의 역할을 분리한다.

#### W04 — PLAN 허브 생성

| 필드 | 값 |
|---|---|
| id | F-PROT-01/W04 |
| 대상 파일 | `D:/workbox/test/docs/plan/README.md` (신규) |
| 행동 | 추가 |
| 완료 기준 | `test -f D:/workbox/test/docs/plan/README.md` |
| 담당 | codex |
| 차단 | F-PROT-01/W03 |

동작:
1. `docs/plan/` 역할을 적는다.
2. 현재 PLAN 목록과 active PLAN 상태를 적는다.
3. 다음에 만들 PLAN 후보를 남긴다.

#### W05 — bootstrap PLAN 기록 생성

| 필드 | 값 |
|---|---|
| id | F-PROT-01/W05 |
| 대상 파일 | `D:/workbox/test/docs/plan/PLAN_test_bootstrap_v1.md` (신규) |
| 행동 | 추가 |
| 완료 기준 | `test -f D:/workbox/test/docs/plan/PLAN_test_bootstrap_v1.md` |
| 담당 | codex |
| 차단 | F-PROT-01/W04 |

동작:
1. 이번 bootstrap 작업의 배경과 목표를 적는다.
2. 새 문서 생성 작업을 work unit으로 남긴다.
3. 완료 후 `status: done`으로 고정한다.

#### W06 — 기존 README 연결 갱신

| 필드 | 값 |
|---|---|
| id | F-PROT-01/W06 |
| 대상 파일 | `D:/workbox/test/docs/README.md` |
| 행동 | 수정 |
| 완료 기준 | `rg -c "GUIDE_playbook\\.md" D:/workbox/test/docs/README.md` → `1` 이상 |
| 담당 | codex |
| 차단 | F-PROT-01/W03 |

동작:
1. 시작 문서를 새 운영 문서 세트로 바꾼다.
2. 기존 `docs/playbook.md`는 legacy reference로 남긴다.

## 3.5 검증 명령 형식

- W01: `test -f D:/workbox/test/CLAUDE.md`
- W02: `test -f D:/workbox/test/docs/GUIDE_agents.md`
- W03: `test -f D:/workbox/test/docs/GUIDE_playbook.md`
- W04: `test -f D:/workbox/test/docs/plan/README.md`
- W05: `test -f D:/workbox/test/docs/plan/PLAN_test_bootstrap_v1.md`
- W06: `rg -c "GUIDE_playbook\\.md" D:/workbox/test/docs/README.md` → `1` 이상

## 3.6 차단 요소 / 미결

- 영어 코치 변경분의 실제 feature 분할 기준은 다음 PLAN에서 정한다.
- `docs/playbook.md`와 `docs/next_session_handoff.md` 내용 중 무엇을 새 체계로 흡수할지는 별도 feature로 다룬다.

## 3.7 변경 이력

### v1 (2026-04-17)

- bootstrap PLAN 작성
- `test` 프로젝트용 운영 문서 뼈대 생성
- `docs/README.md` 연결 경로 갱신
