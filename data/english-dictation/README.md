# English Dictation JSON Source

이 폴더는 영어 받아쓰기 콘텐츠의 **원본 데이터(source of truth)** 를 보관한다.

현재 런타임은 `assets/js/coach-english-dictation-template.js`를 직접 읽지만,
앞으로는 아래 흐름으로 옮기는 것을 목표로 한다.

1. 문장 1개를 JSON 1개로 작성
2. `scripts/build-english-dictation-template.js`로 JSON을 읽어 JS 번들 생성
3. 정적 페이지는 생성된 JS만 로드
4. 나중에는 같은 JSON을 DB import 스크립트로도 재사용

## 구조

```text
data/english-dictation/
  README.md
  schema.litcoach-dictation.md
  topic01-the-dot/
    s01.json
```

## 설계 원칙

- 원문 문장은 시험 범위이므로 `text`를 절대 임의 수정하지 않는다.
- 문장 1개 = JSON 1개
- 고유명사/인물명/지명은 blank로 사용하지 않는다.
- `pronunciationGap`와 `selfCheck.solutions`처럼 시간이 많이 드는 필드는 핵심 문장부터 채운다.
- 지금은 JSON 파일로 관리하고, 나중에 Firebase/Supabase/Postgres 같은 DB로 옮길 수 있게 레코드 형태를 유지한다.

## LitCoach 프롬프트 흡수 범위

`C:\Users\net\Downloads\litcoach_master_prompt.md`에서 현재 프로젝트에 바로 적용 가능한 항목만 반영한다.

- `blanks[*].pos`
- `blanks[*].difficulty`
- `blanks[*].hints`
- `blanks[*].wrongPatterns`
- `commentary.learningGoal`
- `commentary.pronunciation`
- `commentary.pronunciationGap`
- `commentary.shadowingTip`
- `commentary.selfCheck`
- `fullMeaning`
- `tts`

현재는 `toeic`, `opic`, `vocabulary`를 스키마에서 허용하되 필수로 강제하지 않는다.
