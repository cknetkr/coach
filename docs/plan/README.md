# docs/plan/README.md — Test PLAN Hub
> 최종 수정: 2026-04-18
> `test` 프로젝트의 PLAN 문서 허브다.

---

## 원칙

- 모든 구현 작업은 `master-plan` 파이프라인에 맞춰 PLAN부터 만든다.
- 저장 위치는 `docs/plan/`으로 고정한다.
- 파일명은 `PLAN_<feature>_v<N>.md` 형식을 따른다.
- active PLAN 상태값은 `ready`, `in_progress`, `blocked`만 즉시 실행 대상으로 본다.

---

## 현재 PLAN 목록

| 파일 | featureId | 상태 | 의미 |
|------|-----------|------|------|
| `PLAN_test_bootstrap_v1.md` | `F-PROT-01` | `done` | `test` 프로젝트의 문서 운영 뼈대 생성 |
| `PLAN_english_dictation_template_v1.md` | `F-ENG-01` | `in_progress` | 영어 받아쓰기 템플릿 정적화 + 로컬 채점/UX 보강 |

현재 active PLAN: `PLAN_english_dictation_template_v1.md`

다음 생성 권장 PLAN:

1. 공통/과목 전용 자산 경계 정리 PLAN
2. `src/` 이식 골격 정리 PLAN

---

## 새 PLAN 작성 절차

1. `D:/workbox/llmwiki/wiki/master-plan.md`에서 순위와 단계 결정
2. `D:/workbox/llmwiki/wiki/standards/plan-template.md` 형식 준수
3. `featureId`, `목표`, `work unit`, `검증 명령`을 먼저 확정
4. 구현 전 `GUIDE_playbook.md`에 active PLAN 또는 다음 작업으로 연결

---

## featureId 메모

- `F-PROT-*` : 정적 프로토타입 운영/구조 작업
- `F-ENG-*` : 영어 코치 특화 기능
- `F-MATH-*` : 수학 코치 특화 기능
- `F-KOR-*` : 국어 코치 특화 기능
- 새 AREA가 필요하면 PLAN 안에 먼저 명시하고 이후 허브에 추가
