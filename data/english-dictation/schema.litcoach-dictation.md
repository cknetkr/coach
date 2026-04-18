# LitCoach Dictation JSON Schema

## 목적

이 스키마는:

- 현재 정적 사이트에서 JS 번들로 변환 가능하고
- 나중에 React/DB 구조로 그대로 이관 가능한
- 문장 단위 JSON 레코드 형식을 정의한다.

## 파일 단위

- 문장 1개 = JSON 파일 1개
- 파일명 예시: `s01.json`, `s02.json`
- topic 폴더 예시: `topic01-the-dot`

## 최상위 필드

```json
{
  "id": "dot-s01",
  "topicId": "topic01-the-dot",
  "order": 1,
  "subject": "1과 P.13",
  "title": "The Dot 그림책",
  "text": "Today, I'd like to introduce The Dot by Peter Reynolds.",
  "tts": {
    "label": "문장 1",
    "text": "Today, I'd like to introduce The Dot by Peter Reynolds.",
    "rates": [1, 0.7, 0.5]
  },
  "guide": {
    "t": "문장 전체 해석",
    "p": "귀에 걸어둘 소리",
    "m": "시험 함정",
    "c": "문장 쪼개기"
  },
  "commentary": {},
  "fullMeaning": {},
  "blanks": []
}
```

## `commentary` 구조

```json
{
  "learningGoal": "핵심 학습 목표",
  "pronunciation": {
    "linking": "연음 설명",
    "weakForm": "약형 설명",
    "stress": "강세 설명"
  },
  "pronunciationGap": [
    {
      "word": "I'd like to",
      "pos": "축약형 + 연음 덩어리",
      "known": {
        "syllables": [
          { "text": "아이드", "type": "stress" },
          { "text": "라이크", "type": "normal" },
          { "text": "투", "type": "normal" }
        ],
        "desc": "학습자가 외운 소리",
        "ttsText": "I'd like to",
        "ttsRate": 1
      },
      "actual": {
        "syllables": [
          { "text": "아이들라이크터", "type": "merge" }
        ],
        "desc": null,
        "hearPoint": "실제 들리는 방식 설명",
        "ttsText": "I'd like to",
        "ttsRate": 1,
        "ttsRateSlow": 0.75
      }
    }
  ],
  "wrongReasons": ["오답 설명 1", "오답 설명 2"],
  "shadowingTip": "쉐도잉 팁",
  "selfCheck": [
    {
      "question": "예/아니오로 답할 수 있는 질문",
      "solutions": [
        { "step": 1, "desc": "구체적 행동" },
        { "step": 2, "desc": "구체적 행동" }
      ],
      "goalTip": "최종 목표"
    }
  ]
}
```

## `blanks` 구조

```json
[
  {
    "tokenIndex": 1,
    "answer": "I'd",
    "levels": ["low", "normal", "hard"],
    "pos": "대명사+조동사 축약형",
    "difficulty": {
      "level": 2,
      "basis": "약형 발음과 apostrophe 인식 필요"
    },
    "hints": {
      "lv1": "I' _",
      "lv2": "like to 앞의 축약형",
      "lv3": null
    },
    "wrongPatterns": [
      { "answer": "Id", "reason": "apostrophe 누락" },
      { "answer": "I would", "reason": "축약형 대신 풀어서 씀" }
    ],
    "notes": {
      "easy": "한글로 풀면",
      "role": "문장 속 역할",
      "listen": "들을 때 포인트",
      "trap": "자주 틀리는 이유"
    }
  }
]
```

## 필수/권장

필수:

- `id`
- `topicId`
- `order`
- `text`
- `tts.text`
- `guide`
- `commentary.learningGoal`
- `fullMeaning`
- `blanks[*].answer`
- `blanks[*].levels`
- `blanks[*].wrongPatterns`

권장:

- `commentary.pronunciationGap`
- `commentary.selfCheck[*].solutions`
- `tts.rates`

## 타입 메모

`pronunciationGap[*].*.syllables[*].type` 허용값:

- `stress`
- `normal`
- `weak`
- `merge`
- `ghost`

## DB 이관 가정

이 구조는 나중에 아래처럼 바로 매핑할 수 있다.

- SQL: `sentences`, `sentence_blanks`, `sentence_pronunciation_gaps`
- Firestore: `dictationTopics/{topicId}/sentences/{sentenceId}`
- MongoDB: `dictationSentences` 컬렉션 문서
