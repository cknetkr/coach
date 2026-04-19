---
featureId: F-ENG-01
version: 1
status: in_progress
owner_agent: codex
master_plan_priority: 3순위
master_plan_stage_entry: 2.계획
created: 2026-04-18
updated: 2026-04-19
---

> 이 문서는 master-plan의 3순위 / 2.계획에 해당한다.
> 구현 단계에서는 **JS 클라이언트 범위** + **정적 템플릿** 원칙만 허용한다.

# PLAN_english_dictation_template_v1

## 3.1 배경

### 사용자 원문

> "지금건 나중에 프로그램으로 만들거야 그래서 프로그램적인 요소는 일단 배제 해야 되"
> "js에서 할수 있는것들만 진행 해야 하고 api도 연결 안할거야 지금은 그래서 템플릿형태로 다 만들어야 되"
> "문장이 변경되는건 안되 그게 시험범위니까 다른 내용으로 수정하는건 안되는거야"
> "중요한건 문제를 낼때 방식과 해설 방향이야 그게 중요하니까 맞게 수정해"

### 에이전트용 재해석

영어 받아쓰기 파트의 핵심 요구는 세 가지다.

1. **원문 문장은 절대 고정**한다.
2. **문제 내는 방식**을 수행평가 타당도 기준으로 바꾼다.
3. **해설 방향**을 정적 템플릿 계약서 기반으로 바꾼다.

즉 지금 feature의 본질은 UI 미세조정보다, 문장별 blank/commentary/grading 데이터 구조를 고정하는 것이다.

## 3.2 현황 — 1단계 리서치 산출물

### 현재 코드 상태

- `D:/workbox/test/assets/js/coach-english-dictation-bank.js`
  - `ENG_DICTATION_TOPICS[*].lines`가 시험 범위 원문을 가진다.
  - 현재 `sentences` 스키마 뼈대와 고정 blank 인덱스 일부가 들어가 있다.
- `D:/workbox/test/assets/js/coach-english-dictation-template.js`
  - `1과 P.13` 9문장 전체에 대해 `guide`, `commentary`, `fullMeaning`, `blanks[*].difficulty/hints/wrongPatterns/notes`가 정적 템플릿으로 들어갔다.
  - proper noun blank를 제거하고 `I'd / by / named / of / can't / at / there's` 같은 수행평가형 blank로 교체했다.
- `D:/workbox/test/assets/js/coach-english.js`
  - `sentenceEntry` 우선 렌더 경로가 override 템플릿까지 읽도록 확장됐다.
  - 받아쓰기 채점은 `correct / partial / wrong` 로컬 판정으로 교체됐다.
  - 빈칸 해설 카드와 문장 해설 패널이 `blank/commentary/fullMeaning` 정적 데이터를 우선 렌더링한다.
- `D:/workbox/test/assets/js/eng-s1.js`
  - 받아쓰기 카드 UI의 정적 틀을 가진다.
- `D:/workbox/test/assets/css/coach-english.css`
  - 카드/빈칸/해설 패널 스타일이 있다.

### 기존 구현의 한계

- 1과 첫 주제만 정적 템플릿이 완성되었고, 나머지 7개 주제는 아직 구형 fallback 경로를 탄다.
- `coach-english-dictation-bank.js` 본체에는 아직 새 계약서를 직접 병합하지 않았고, 별도 override 파일에서 우선 주입한다.
- 시험 모드, 재생 제한, `R/P` 단축키, 자동 focus, 모바일 세부 보정은 아직 남아 있다.

### 외부 의존성·제약

- 본 feature는 **클라이언트 JS + 정적 템플릿**만 사용한다.
- API 연결 금지, 백엔드 금지, DB 금지, localStorage 기반 누적 저장 금지.
- `ENG_DICTATION_TOPICS[*].lines`의 **문장 내용과 순서는 수정 금지**.
- blank는 영어 실력만으로 풀 수 있어야 하므로 **고유명사·인물명·지명은 전 난이도에서 빈칸 금지**.

### LitCoach 작업지시서 흡수 방침

- 아래 항목은 현재 `pages/assets` 런타임에 맞게 흡수한다.
  - blank별 `pos`, `difficulty.level`, `difficulty.basis`, `hints`, `wrongPatterns`
  - sentence별 `commentary.learningGoal`, `commentary.pronunciation`, `commentary.wrongReasons`, `commentary.shadowingTip`, `commentary.selfCheck`
  - sentence별 `fullMeaning.literal`, `fullMeaning.natural`, `fullMeaning.context`
  - `correct / partial / wrong` 3단계 채점
- 아래 항목은 개념만 흡수하고 파일 구조는 직접 따르지 않는다.
  - `src/data/_tplDictGrade.js`
  - `CommentaryPanel.jsx`
  - `BlankSentence.jsx`

## 3.3 목표

구현 완료 시 다음 상태를 만족해야 한다.

1. 8개 주제 전체 문장에 대해 `sentences[*]`가 존재하고, `text === lines[i]`를 유지한다.
2. 각 blank는 최소 `tokenIndex`, `answer`, `levels`, `pos`, `difficulty.level`, `difficulty.basis`, `hints`, `wrongPatterns`, `notes`를 가진다.
3. 각 sentence는 최소 `guide`, `commentary`, `fullMeaning`를 가진다.
4. `wrongPatterns.length >= 2`, `commentary.selfCheck.length === 3`를 만족한다.
5. proper noun blank가 없다.
6. 받아쓰기 렌더는 새 `sentenceEntry` 데이터만 우선 사용한다.
7. `gradeDictation`는 `callClaude`를 호출하지 않고 `correct / partial / wrong` 판정을 포함한 로컬 채점만 사용한다.

## 3.3.1 템플릿 운영 규칙

- 기준 템플릿은 `D:/workbox/test/assets/js/coach-english-dictation-template.js`의 `window.ENG_DICTATION_SENTENCE_BASELINES['dot-s00']`이다.
- 구조, 첨삭 톤, 카드 구성 실험은 먼저 `dot-s01`, `dot-s02`에서만 검증한다.
- `dot-s01`, `dot-s02`에서 효과가 확인된 요소만 `dot-s00` 기준 템플릿에 역이식한다.
- `dot-s03` 이후 문장은 항상 최신 `dot-s00` 기준 템플릿을 복제한 뒤 문장별 내용만 바꿔 확장한다.
- blank 선정 원칙은 전 문장 공통으로 **고유명사 blank 금지**를 유지한다.
- 최우선 판단 기준은 **1타 강사의 첨삭 느낌과 리드**다.
  - `coachLine`에서 바로 경고/점수 연결이 보여야 한다.
  - blank는 `호통 -> 사고경로 진단 -> 처방 -> 합격 기준` 순서로 읽혀야 한다.
  - 데이터 우선순위는 `coachLine`, `diagnosis`, `passCriteria`, `routine`, `tags`, `notes.core/listen/trap`이다.
- React/자동화 이식은 이 템플릿 규칙이 안정화된 뒤 후속 PLAN으로 분리한다.

## 3.4 작업 단위 (Work Units)

#### W01 — sentence 계약서 스키마 고정

| 필드 | 값 |
|---|---|
| id | F-ENG-01/W01 |
| 대상 파일 | `D:/workbox/test/assets/js/coach-english-dictation-bank.js` |
| 행동 | 수정 |
| 완료 기준 | `rg -c "commentary:|fullMeaning:|difficulty:|wrongPatterns:" D:/workbox/test/assets/js/coach-english-dictation-bank.js` → 각 패턴 1 이상 |
| 담당 | codex |
| 차단 | 없음 |

동작:
1. `sentences[i]` 스키마에 `guide`, `commentary`, `fullMeaning`, `blanks[*].difficulty`, `blanks[*].hints`, `blanks[*].wrongPatterns`, `blanks[*].pos`를 포함한다.
2. `text`는 반드시 `lines[i]`와 동일하게 둔다.
3. `lines`는 원문 보존용, `sentences`는 권위 템플릿 소스로 둔다.

#### W02 — 1과·3과 문장 데이터 완성

| 필드 | 값 |
|---|---|
| id | F-ENG-01/W02 |
| 대상 파일 | `D:/workbox/test/assets/js/coach-english-dictation-bank.js` |
| 행동 | 수정 |
| 완료 기준 | `rg -c "difficulty:|wrongPatterns:|learningGoal:|selfCheck:" D:/workbox/test/assets/js/coach-english-dictation-bank.js` → 각 패턴 40 이상 |
| 담당 | codex |
| 차단 | F-ENG-01/W01 |

동작:
1. `1과 P.13`, `1과 P.14`, `3과 P.57`, `3과 P.58`의 전 문장에 대해 blank/commentary/fullMeaning을 채운다.
2. low/normal/hard blank는 기능어·축약형·활용형·핵심 내용어 위주로 잡는다.
3. proper noun blank는 제거한다.

#### W03 — 4과 문장 데이터 완성

| 필드 | 값 |
|---|---|
| id | F-ENG-01/W03 |
| 대상 파일 | `D:/workbox/test/assets/js/coach-english-dictation-bank.js` |
| 행동 | 수정 |
| 완료 기준 | `rg -c "difficulty:|wrongPatterns:|learningGoal:|selfCheck:" D:/workbox/test/assets/js/coach-english-dictation-bank.js` → 각 패턴 60 이상 |
| 담당 | codex |
| 차단 | F-ENG-01/W02 |

동작:
1. `4과 P.79`, `4과 P.80`의 전 문장에 대해 같은 구조를 채운다.
2. 토론/리터러시 문장답게 `pos`와 `difficulty.basis`를 더 명확히 쓴다.

#### W04 — 5과 문장 데이터 완성

| 필드 | 값 |
|---|---|
| id | F-ENG-01/W04 |
| 대상 파일 | `D:/workbox/test/assets/js/coach-english-dictation-bank.js` |
| 행동 | 수정 |
| 완료 기준 | `rg -c "difficulty:|wrongPatterns:|learningGoal:|selfCheck:" D:/workbox/test/assets/js/coach-english-dictation-bank.js` → 각 패턴 78 이상 |
| 담당 | codex |
| 차단 | F-ENG-01/W03 |

동작:
1. `5과 P.101`, `5과 P.102` 전 문장을 완성한다.
2. 인용문 문장은 따옴표 안팎을 혼동하지 않도록 `wrongPatterns`와 `notes.trap`에 반영한다.

#### W05 — 해설 패널을 sentenceEntry 데이터로 전환

| 필드 | 값 |
|---|---|
| id | F-ENG-01/W05 |
| 대상 파일 | `D:/workbox/test/assets/js/coach-english.js`, `D:/workbox/test/assets/js/eng-s1.js` |
| 행동 | 교체 |
| 완료 기준 | `rg -c "learningGoal|shadowingTip|selfCheck|fullMeaning" D:/workbox/test/assets/js/coach-english.js D:/workbox/test/assets/js/eng-s1.js` → 4 이상 |
| 담당 | codex |
| 차단 | F-ENG-01/W04 |

동작:
1. blank 설명 UI는 `blank.notes`를 읽는다.
2. 문장 해설 UI는 `sentenceEntry.commentary`와 `sentenceEntry.fullMeaning`을 읽는다.
3. 기존 dynamic guide fallback 호출을 받아쓰기 경로에서 제거한다.

#### W06 — 로컬 채점 3단계화

| 필드 | 값 |
|---|---|
| id | F-ENG-01/W06 |
| 대상 파일 | `D:/workbox/test/assets/js/coach-english.js` |
| 행동 | 교체 |
| 완료 기준 | `rg -c "partial|callClaude" D:/workbox/test/assets/js/coach-english.js` → `partial` 1 이상 AND `callClaude` 5 이하 |
| 담당 | codex |
| 차단 | F-ENG-01/W05 |

동작:
1. `grade()` 개념을 현재 파일 구조에 맞게 넣는다.
2. `Id` vs `I'd` 같은 apostrophe 차이는 `partial` 처리한다.
3. 대소문자는 무시한다.
4. `gradeDictation`에서 `callClaude` 호출을 제거한다.

#### W07 — 시험 시뮬레이션 모드

| 필드 | 값 |
|---|---|
| id | F-ENG-01/W07 |
| 대상 파일 | `D:/workbox/test/assets/js/eng-s1.js`, `D:/workbox/test/assets/js/coach-english.js`, `D:/workbox/test/assets/css/coach-english.css` |
| 행동 | 추가 |
| 완료 기준 | `rg -c "dict-exam-mode|dict-exam-on|dict-play-count" D:/workbox/test/assets/js/eng-s1.js D:/workbox/test/assets/js/coach-english.js D:/workbox/test/assets/css/coach-english.css` → 3 이상 |
| 담당 | codex |
| 차단 | F-ENG-01/W06 |

동작:
1. 시험 모드 토글을 추가한다.
2. 문장당 재생 횟수 제한과 시각적 표시를 넣는다.

#### W08 — UX 마감

| 필드 | 값 |
|---|---|
| id | F-ENG-01/W08 |
| 대상 파일 | `D:/workbox/test/assets/js/coach-english.js`, `D:/workbox/test/assets/css/coach-english.css` |
| 행동 | 수정 |
| 완료 기준 | `rg -c "KeyR|KeyP|focus\\(|dict-cloze-input" D:/workbox/test/assets/js/coach-english.js D:/workbox/test/assets/css/coach-english.css` → 4 이상 |
| 담당 | codex |
| 차단 | F-ENG-01/W07 |

동작:
1. 정답 입력 후 다음 blank auto focus를 넣는다.
2. `Space / R / P` 단축키를 넣는다.
3. 모바일 blank input 폭과 줄바꿈을 보정한다.

## 3.5 검증 명령 형식

- W01: `rg -c "commentary:|fullMeaning:|difficulty:|wrongPatterns:" D:/workbox/test/assets/js/coach-english-dictation-bank.js`
- W02: `rg -c "difficulty:|wrongPatterns:|learningGoal:|selfCheck:" D:/workbox/test/assets/js/coach-english-dictation-bank.js`
- W05: `rg -c "learningGoal|shadowingTip|selfCheck|fullMeaning" D:/workbox/test/assets/js/coach-english.js D:/workbox/test/assets/js/eng-s1.js`
- W06: `rg -c "partial|callClaude" D:/workbox/test/assets/js/coach-english.js`
- 전체 수동 확인: `pages/coach-english.html` → `1과 P.13` → 첫 문장 blank가 `I'd / by` 계열인지, proper noun blank가 아닌지, 해설 카드에 `학습 목표 / 발음 포인트 / 자주 틀리는 이유 / 쉐도잉 팁 / 전체 의미 / 자기평가` 구조가 보이는지 확인

## 3.6 차단 요소 / 미결

- 78문장 전체 commentary/fullMeaning 작성량이 많다.
- 현재 코드에는 일부 고정 blank 데이터가 이미 들어가 있으므로, proper noun blank 제거와 재배치가 선행돼야 한다.
- 사용자 확인 필요: 첫 배포 범위를 `s01~s09` 수준의 1차 완성본으로 먼저 검수할지, 아니면 78문장 일괄 완성 후 한 번에 검수할지.

## 3.7 변경 이력

### v1 (2026-04-18)

- 영어 받아쓰기 템플릿 feature 초안 작성
- 원문 문장 고정 / 문제 방식 / 해설 방향 중심으로 범위 재정의
- LitCoach 작업지시서의 데이터 계약서와 3단계 채점 구조를 현재 `pages/assets` 런타임 기준으로 흡수
