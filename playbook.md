# 다음 세션 핸드오프

## 1. 작업 위치

작업 루트:
- `D:\workbox\test`

핵심 파일:
- `D:\workbox\test\index.html`
- `D:\workbox\test\coach-korean.html`
- `D:\workbox\test\coach-math.html`
- `D:\workbox\test\coach-english.html`
- `D:\workbox\test\coach-shared.css`
- `D:\workbox\test\coach-korean.css`
- `D:\workbox\test\coach-math.css`
- `D:\workbox\test\coach-english.css`
- `D:\workbox\test\coach-shared.js`

기획/참고 문서:
- `D:\workbox\test\docs\jarvis_ai_tutor_plan.md`
- `D:\workbox\test\docs\performance_jarvis_engine_plan.md`

## 2. 지금 상태 요약

- 허브 `index.html`
  - 제목과 첫 화면 문구를 `수행평가` 중심으로 다시 정리
  - `국어 · 영어 · 대수` 샘플 구성이 한눈에 보이게 조정
  - 핵심 메시지를 `흐름 정리 → 개념 정리 → 샘플 확인` 순서로 통일
  - 카카오 캐시 우회를 위해 `canonical`, `og:url` 고정값을 제거하고 `kakao-preview-hongi-final.jpg`로 교체

- 허브 `index.html`은 자비스 엔진형 소개 문구로 수정됨
  - 단순 과목 링크가 아니라
  - 무엇을 고민할지 / 어떻게 쓸지 / 자비스 엔진이 어떤 흐름인지 보이게 바뀜

- 수학 `coach-math.html`
  - `Math Jarvis Engine` 소개 블록 있음
  - 학생용 가이드 블록 추가됨
    - 이 파트에서 꼭 고민할 것
    - 반드시 잡아야 할 개념
    - 선생님께 꼭 해야 할 질문
    - 구체 예시
  - STEP 2에도 서술형 관점 가이드 추가됨

- 영어 `coach-english.html`
  - `English Jarvis Engine` 소개 블록 있음
  - 학생용 가이드 블록 추가됨
    - 이 파트에서 꼭 고민할 것
    - 반드시 잡아야 할 표현/구조
    - 선생님께 꼭 해야 할 질문
    - 구체 예시
  - STEP 2 문장완성 / STEP 3 영어면접 앞에도 실전 가이드 추가됨

- CSS 구조 정리됨
  - 공통: `coach-shared.css`
  - 국어 전용: `coach-korean.css`
  - 수학 전용: `coach-math.css`
  - 영어 전용: `coach-english.css`
  - 예전처럼 공통 파일 하나에 과목별 스타일을 많이 섞지 않도록 분리함

- 데스크톱 폭 기준은 `1200px`로 맞춤
  - 수학/영어는 `coach-shared.css`의 `--page-max: 1200px`
  - 국어도 `coach-korean.css`에서 동일 기준으로 맞춤
  - 헤더/서브탭/본문 모두 가운데 정렬 기준으로 조정함

## 3. 중요한 판단 기준

- `교과서 p.10~39 (탐구&융합, 수학이야기 제외)` 같은 문구는 공통이 아님
- 이런 건 학교/학년/교사별로 달라질 수 있어서
  - 공통 규칙으로 빼면 안 됨
  - 해당 페이지 전용 콘텐츠로 둬야 함

즉 구분 기준:

- 공통으로 둘 것
  - 레이아웃
  - 공용 컴포넌트
  - 자비스 엔진 프레임
  - 공통 UI 스타일

- 개별로 둘 것
  - 시험 범위
  - 페이지 수
  - 시험 날짜
  - 배점
  - 학교/과목별 안내 문구

## 4. 다음 세션에서 바로 해야 할 일

우선순위 1:
- 브라우저 기준 실제 화면 검수
- CSS 분리 후 깨진 부분이 없는지 확인
- 특히 아래 4개를 먼저 확인
  - `index.html`
  - `coach-korean.html`
  - `coach-math.html`
  - `coach-english.html`

우선순위 2:
- `coach-shared.css`에 남은 스타일 중
  - 실제로 공통인지
  - 과목 전용이어야 하는지
  한 번 더 정리

우선순위 3:
- 콘텐츠 레벨 정리
  - 공통 문구
  - 학교별/과목별 문구
  를 데이터 관점에서 분리할지 검토

우선순위 4:
- `selfq` 이식 대비 구조 유지
  - 현재 실행용 정적 프로토타입은 `test/` 루트에 유지
  - 향후 이식용 골격은 `test/src/...` 아래에서 준비
  - 기준 문서는 `test/docs/selfq_migration_map.md`

## 5. 다음 세션 첫 점검 체크리스트

1. 수학 페이지에서
   - 헤더 정렬
   - 서브탭 정렬
   - 가이드 블록 간격
   - 공식 카드 레이아웃
   - 모바일 줄바꿈
   확인

2. 영어 페이지에서
   - STEP 0 가이드 블록
   - STEP 2 PREP 카드
   - STEP 3 면접 가이드
   - 점수 시뮬레이터 정렬
   확인

3. 국어 페이지에서
   - `coach-korean.css` 연결 후 깨진 스타일이 없는지
   - 스텝 레일 / 섹션 카드 / 모달이 그대로 보이는지
   확인

## 6. 참고 메모

- 아까 나온 `stream disconnected before completion`은
  엔진 로직 고장이라기보다 응답 연결이 중간에 끊긴 쪽에 가까움

- 국어 CSS 분리 중 큰 패치를 한 번에 넣다가
  Windows 쪽 도구 한계성 에러가 있었지만
  이후 CSS 파일 추출 방식으로 정리 완료함

- 즉 현재는
  “엔진이 망가졌다”기보다
  “구조 변경 후 실제 렌더 검수가 아직 안 끝난 상태”로 보는 게 맞음

## 7. 다음 세션 시작 문장 추천

다음 세션 시작하자마자:

`test/playbook.md 읽고, index → 국어 → 수학 → 영어 순서로 렌더/정렬/CSS 분리 상태 먼저 점검한 뒤 수정 시작`
