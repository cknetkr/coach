# GUIDE_playbook.md — Test Prototype
> 최종 수정: 2026-04-19
> 세션 시작 시 `CLAUDE.md` 또는 `GUIDE_agents.md` 다음으로 읽는다.
> 이 프로젝트는 `master-plan` 기준 **3순위 / 특색 프로그램 변형**에 해당한다.
> 전체 기준은 `D:/workbox/llmwiki/wiki/master-plan.md`를 따른다.

---

## NEXT SESSION

```text
작업: 영어 받아쓰기 1타 첨삭 톤 기준 고정 + 문장 1·2 기준 샘플 확정 + 빈칸 탭 실화면 검수

우선 읽을 파일:
  - D:/workbox/test/CLAUDE.md
  - D:/workbox/test/docs/GUIDE_agents.md
  - D:/workbox/test/docs/GUIDE_playbook.md
  - D:/workbox/test/docs/plan/PLAN_english_dictation_template_v1.md
  - D:/workbox/prepEng/src/data/english/dictation/topic01-the-dot/s01.js
  - D:/workbox/prepEng/src/data/english/dictation/topic01-the-dot/s02.js
  - D:/workbox/test/pages/coach-english.html
  - D:/workbox/test/assets/js/coach-english.js
  - D:/workbox/test/assets/js/coach-english-dictation-template.js
  - D:/workbox/test/assets/css/coach-english.css

세션 시작 순서:
  1. docs/plan/README.md에서 active PLAN 유무 확인
  2. `PLAN_english_dictation_template_v1.md`를 읽고 이번 세션 구현분이 어느 work unit까지 닿았는지 표시
  3. `s01.js`, `s02.js`, `coach-english-dictation-template.js`를 비교해 기준 blank/코칭 톤이 어긋나지 않는지 확인
  4. `pages/coach-english.html`을 열어 빈칸 탭이 "호통 -> 진단 -> 합격 기준" 흐름으로 실제 보이는지 검수

다음 세션 작업 목록:
  [ ] P0 영어 받아쓰기 실화면 수동 검토
      - pages/coach-english.html
      - assets/js/coach-english.js
      - assets/js/coach-english-dictation-template.js
      - assets/css/coach-english.css
      - 확인 포인트: blank 카드 첫 줄 1타 코멘트 / 진단표 3열 / 합격 기준 초록 블록 / 태그 색 구분
  [ ] P0 `PLAN_english_dictation_template_v1.md` 상태/범위 정리
      - 현재 구현분과 PLAN work unit 간 차이 표시
      - 실제 완료/미완료 항목 표시
      - 필요하면 PLAN을 split 하거나 후속 v2 작성
  [ ] P1 문장 3 이후 확장 시 s01·s02 톤 유지
      - 고유명사 blank 금지 유지
      - coachLine / diagnosis / passCriteria / routine 우선 반영
  [ ] P1 Netlify production 재배포
      - GitHub 최신 커밋 반영 후 실사이트 확인
      - coach-test-hongsun 기준 영어 페이지 렌더 확인
  [ ] P1 docs/playbook.md 와 next_session_handoff.md 에서 아직 유효한 내용만 새 playbook 체계로 흡수
  [ ] P2 src/ 이식 골격과 실제 런타임 경로 차이 정리

주의:
  - tmp-chrome-* 폴더는 세션 산출물이 아니라 브라우저 임시 폴더다.
  - 판단 기준은 "1타 강사처럼 명확하고 전략적으로 리드하느냐"가 최우선이다. 스키마 미화보다 사용자 체감이 먼저다.
  - 화면 수정은 먼저 pages/assets 기준으로 검증하고, src 반영은 별도 PLAN으로 분리한다.
  - 문장 1, 2는 기준 샘플이다. 새 문장 확장 전 반드시 s01/s02와 빈칸 톤을 비교한다.
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

### 시작 트리거 해석

- `시작하자`, `시작 브리핑 해줘`, `세션 시작`, `지금 뭐해야 해`는 모두 이 파일의 시작 루틴을 실행하라는 뜻으로 해석한다.
- 이때 먼저 확인할 것은 "현재 작업 루트가 `test`인가"이다. `test` 세션이면 `test` 문서와 PLAN만 기준으로 잡는다.
- 시작 루틴에서는 최소한 active PLAN, 지금 할 일, 다음 한 줄 지시를 먼저 정리해서 보고한다.

### PLAN 우선 규칙

- `docs/plan/`에 `status: ready | in_progress | blocked` PLAN이 있으면 그 문서를 우선한다.
- active PLAN이 없을 때만 `NEXT SESSION`의 첫 작업으로 내려간다.
- 한 세션에서 새 feature가 생기면 바로 새 PLAN을 만든다.

### 영어 받아쓰기 템플릿 규칙

- `assets/js/coach-english-dictation-template.js`의 `window.ENG_DICTATION_SENTENCE_BASELINES['dot-s00']`를 기준 템플릿으로 고정한다.
- 새 구조 실험과 첨삭 톤 검증은 먼저 `문장 1`, `문장 2`에서만 테스트한다.
- `문장 1`, `문장 2`에서 검증된 요소만 다시 `dot-s00` 기준 템플릿에 역이식한다.
- `문장 3` 이후 확장은 항상 갱신된 `dot-s00` 기준 템플릿을 복제해 시작한다.
- blank 선정 원칙은 **고유명사 blank 금지**를 유지한다. `s02`도 이 원칙에 맞춰 `award-winning / of / named` 기준으로 정리한다.
- 최우선 판단 기준은 **1타 강사의 첨삭 느낌과 리드**다.
  - 첫 줄 `coachLine`에서 바로 경고/점수 연결이 보여야 한다.
  - blank 카드는 `호통 -> 오답 사고경로 진단 -> 처방 -> 합격 기준` 순서로 읽혀야 한다.
  - `coachLine`, `diagnosis`, `passCriteria`, `routine`, `tags`, `notes.core/listen/trap`를 사용자 체감 우선 필드로 본다.
- 구조 실험 단계에서는 React 이식이나 별도 스키마 확장을 먼저 하지 않는다. 현재 기준 런타임은 `test`의 HTML/JS 템플릿이다.

### 종료 시 갱신

1. `GUIDE_playbook.md`의 `NEXT SESSION`
2. 관련 `PLAN_*.md` 상태
3. 필요 시 `docs/README.md`

### 종료 트리거 해석

- `정리하자`, `세션 종료 정리해줘`, `플북 업데이트`, `로그 정리`, `마감 정리`는 모두 이 파일의 종료 루틴을 실행하라는 뜻으로 해석한다.
- 이때 먼저 확인할 것은 "현재 작업 루트가 `test`인가"이다. `test` 세션이면 `test` 문서만 갱신하고, 다른 프로젝트 규칙으로 넘어가지 않는다.
- 종료 루틴에서는 최소한 `NEXT SESSION`, 관련 `PLAN`, 필요 시 `docs/README.md`까지 같이 본다. 단순 요약만 하고 끝내지 않는다.

---

## WORK LOG

### 2026-04-19

- `정리하자` 같은 표현을 `test`에서도 명시적 종료 트리거로 해석하도록 문서 규칙을 보강했다.
- 종료 루틴 실행 전 현재 작업 루트가 `test`인지 먼저 확인하고, `NEXT SESSION`과 `PLAN`을 같이 갱신하도록 기준을 고정했다.
- 영어 받아쓰기 방향을 `1타 강사의 첨삭 느낌과 리드` 기준으로 다시 고정했다.
- 판단 기준을 스키마 정리보다 사용자 체감 우선으로 재정의했다.
  - 먼저 꽂히는 `coachLine`
  - 학생 사고경로를 찌르는 `diagnosis`
  - 바로 행동으로 이어지는 `passCriteria + routine`
  - `⭐핵심 / 🔥함정 / 🎯출제 / ⚠️혼동` 태그
- `prepEng/src/data/english/dictation/topic01-the-dot/s01.js`를 문장 1 기준 샘플로 다시 정리했다.
- `prepEng/src/data/english/dictation/topic01-the-dot/s02.js`도 같은 톤으로 맞추고, 고유명사 blank를 제거해 `award-winning / of / named` 구조로 재배치했다.
- `assets/js/coach-english-dictation-template.js`의 `dot-s00` 기준 템플릿과 첫 문장에 `flowUnits`, `chunkMeaning`, `vocabulary`, `coachLine`, `diagnosis`, `selfCheck`를 반영했다.
- `assets/js/coach-english.js`의 빈칸 탭 렌더를 `정답+태그 -> 1타 코멘트 -> CORE/LISTEN/TRAP -> 오답 진단표 -> 합격 기준` 흐름으로 바꿨다.
- `assets/css/coach-english.css`에 태그 색, 노란 코멘트 배너, 빨간 진단표, 초록 합격 기준 스타일을 추가했다.
- 다음 구현 판단은 항상 `s01`, `s02`, `dot-s00`, 실화면 blank 카드 4곳을 함께 비교한 뒤 진행한다.

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
