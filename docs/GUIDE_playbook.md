# GUIDE_playbook.md — Test Prototype
> 최종 수정: 2026-04-18
> 세션 시작 시 `CLAUDE.md` 또는 `GUIDE_agents.md` 다음으로 읽는다.
> 이 프로젝트는 `master-plan` 기준 **3순위 / 특색 프로그램 변형**에 해당한다.
> 전체 기준은 `D:/workbox/llmwiki/wiki/master-plan.md`를 따른다.

---

## NEXT SESSION

```text
작업: 영어 받아쓰기 UI/해설 1차 개편 + GitHub 반영 완료 → active PLAN 범위 정식화 + 실화면 검수 + Netlify 재배포

우선 읽을 파일:
  - D:/workbox/test/CLAUDE.md
  - D:/workbox/test/docs/GUIDE_agents.md
  - D:/workbox/test/docs/plan/PLAN_english_dictation_template_v1.md
  - D:/workbox/test/docs/plan/PLAN_test_bootstrap_v1.md
  - D:/workbox/test/pages/coach-english.html
  - D:/workbox/test/assets/js/coach-english.js
  - D:/workbox/test/assets/js/coach-english-dictation-bank.js
  - D:/workbox/test/assets/js/eng-s1.js
  - D:/workbox/test/assets/css/coach-english.css

세션 시작 순서:
  1. docs/plan/README.md에서 active PLAN 유무 확인
  2. `PLAN_english_dictation_template_v1.md`를 읽고 이번 세션 구현분이 어느 work unit까지 닿았는지 표시
  3. `pages/coach-english.html` 과 관련 JS/CSS를 직접 열어 현재 렌더 상태를 확인
  4. GitHub 푸시분과 실제 Netlify 화면이 일치하는지 확인 후 필요한 보정만 진행

다음 세션 작업 목록:
  [ ] P0 `PLAN_english_dictation_template_v1.md` 상태/범위 정리
      - 현재 구현분과 PLAN work unit 간 차이 표시
      - 실제 완료/미완료 항목 표시
      - 필요하면 PLAN을 split 하거나 후속 v2 작성
  [ ] P0 영어 받아쓰기 실화면 수동 검토
      - pages/coach-english.html
      - assets/js/coach-english.js
      - assets/css/coach-english.css
      - assets/js/coach-english-dictation-bank.js
      - assets/js/eng-s1.js
      - 확인 포인트: 빈칸 인라인 입력 / 정답 보기 색상 / 공통 해설 4칸 문장별 차이
  [ ] P0 Netlify production 재배포
      - GitHub 최신 커밋 반영 후 실사이트 확인
      - coach-test-hongsun 기준 영어 페이지 렌더 확인
  [ ] P1 docs/playbook.md 와 next_session_handoff.md 에서 아직 유효한 내용만 새 playbook 체계로 흡수
  [ ] P1 국어/수학/영어 공통 요소와 과목 전용 요소 경계 문서화
  [ ] P2 src/ 이식 골격과 실제 런타임 경로 차이 정리

주의:
  - tmp-chrome-* 폴더는 세션 산출물이 아니라 브라우저 임시 폴더다.
  - 화면 수정은 먼저 pages/assets 기준으로 검증하고, src 반영은 별도 PLAN으로 분리한다.
  - `PLAN_english_dictation_template_v1.md`는 현재 미추적 상태일 수 있으니 active PLAN으로 유지할지 먼저 결정한다.
  - 기존 git 변경분은 사용자 작업일 수 있으므로 되돌리지 않는다.
```

---

## 핵심 확정 사항

### 프로젝트 위치

- 루트: `D:/workbox/test`
- 문서 기준: `docs/`
- 실제 런타임: `index.html`, `pages/`, `assets/`
- 미래 이식 골격: `src/`

### master-plan 매핑

- 순위: `3순위`
- 이유: `test`는 공통 Core 구축보다, 과목별 수행평가 코치라는 특색 프로그램의 프로토타입 검증에 가깝다.
- 운영 방식: 베이스/공통 패턴은 문서로 묶고, 과목별 차이는 feature PLAN으로 남긴다.

### 현재 구조 판단

- 허브 화면: `index.html`
- 과목 화면: `pages/coach-korean*.html`, `pages/coach-math.html`, `pages/coach-english.html`
- 공통 스타일/동작: `assets/css/coach-shared.css`, `assets/js/coach-shared.js`
- 과목별 분리 자산: `assets/css/coach-*.css`, `assets/js/coach-*.js`, `assets/js/eng-s*.js`, `assets/js/math-s*.js`

---

## 문서 역할 분담

| 질문 | 기준 문서 |
|------|-----------|
| 이 프로젝트를 어디서 시작하나? | `CLAUDE.md`, `docs/GUIDE_agents.md` |
| 지금 무엇을 먼저 해야 하나? | 이 파일 `NEXT SESSION` |
| 구현 전에 계약서가 있나? | `docs/plan/PLAN_*.md` |
| PLAN 목록/상태는 어디서 보나? | `docs/plan/README.md` |
| 과거 handoff는 어디 있나? | `docs/playbook.md`, `docs/next_session_handoff.md` |
| 이식 기준은 무엇인가? | `docs/selfq_migration_map.md` |

---

## 세션 운영 규칙

### 시작 순서

```text
1. CLAUDE.md
2. GUIDE_agents.md
3. GUIDE_playbook.md
4. docs/plan/README.md
5. active PLAN 또는 NEXT SESSION 첫 대상 파일
```

### PLAN 우선 규칙

- `docs/plan/`에 `status: ready | in_progress | blocked` PLAN이 있으면 그 문서를 우선한다.
- active PLAN이 없을 때만 `NEXT SESSION`의 첫 작업으로 내려간다.
- 한 세션에서 새 feature가 생기면 바로 새 PLAN을 만든다.

### 종료 시 갱신

1. `GUIDE_playbook.md`의 `NEXT SESSION`
2. 관련 `PLAN_*.md` 상태
3. 필요 시 `docs/README.md`

---

## WORK LOG

### 2026-04-18

- 영어 받아쓰기(`coach-english`) 흐름을 집중 수정했다.
- 상단 전역 설정을 줄이고, 문장 카드 기준으로 난이도/듣기/정답 보기 흐름을 재구성했다.
- 아래 `빈칸 1, 2, 3` 입력칸을 제거하고 문장 내부 빈칸에 직접 입력하는 방식으로 바꿨다.
- `정답 보기`를 누르면 문장 전체 스크립트 대신 각 빈칸 아래 정답 단어만 초록색으로 인라인 표시되도록 바꿨다.
- `정답 보기` 상태에서 현재 입력값 기준으로 맞으면 파랑, 틀리면 빨강으로 input 색이 바뀌게 했다.
- 속도/음성 선택을 작게 줄여 `문장 듣기` 줄에 합쳤다.
- 빈칸/문장 해설을 `한글로 풀면 / 문장 속 역할 / 들을 때 포인트 / 자주 틀리는 이유` 구조로 재정리했다.
- 공통 해설 4칸도 `문장 전체 해석 / 귀에 걸어둘 소리 / 시험 함정 / 문장 쪼개기`로 재라벨링했다.
- `With witty and vivid illustrations...` 문장 전용 공통 가이드를 추가했고, 등록되지 않은 문장도 구조를 읽어 공통 4칸이 달라지도록 fallback 로직을 보강했다.
- GitHub 최신 반영 커밋:
  - `6945708 feat: refine english dictation review flow`
  - `b6357eb feat: improve english dictation guidance`
- 아직 이번 묶음의 Netlify production 재배포 확인은 남아 있다.

### 2026-04-17

- `test`를 `master-plan` 체계에 맞추기 위한 프로젝트 운영 뼈대를 추가했다.
- `CLAUDE.md`, `GUIDE_agents.md`, `GUIDE_playbook.md`, `docs/plan/README.md`, `PLAN_test_bootstrap_v1.md`를 새로 만들었다.
- `docs/README.md`의 시작 문서를 기존 `docs/playbook.md`에서 새 운영 문서 세트로 전환했다.
- 기존 `docs/playbook.md`, `docs/next_session_handoff.md`는 legacy handoff 참조로 유지하기로 했다.
