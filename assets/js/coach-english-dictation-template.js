function createDictationBlankTemplate(config) {
  return {
    tokenIndex: config.tokenIndex,
    answer: config.answer,
    levels: Array.isArray(config.levels) ? config.levels : [],
    pos: config.pos,
    difficulty: {
      level: config.difficultyLevel,
      basis: config.basis,
    },
    hints: {
      lv1: config.hints?.lv1 || null,
      lv2: config.hints?.lv2 || null,
      lv3: config.hints?.lv3 || null,
    },
    wrongPatterns: Array.isArray(config.wrongPatterns) ? config.wrongPatterns : [],
    notes: config.notes || null,
  };
}

function createDictationSentenceTemplate(config) {
  return {
    id: config.id,
    text: config.text,
    guide: config.guide || null,
    commentary: config.commentary || null,
    fullMeaning: config.fullMeaning || null,
    blanks: Array.isArray(config.blanks) ? config.blanks : [],
  };
}

window.ENG_DICTATION_TOPIC_OVERRIDES = {
  0: [
    createDictationSentenceTemplate({
      id: 'dot-s01',
      text: "Today, I'd like to introduce The Dot by Peter Reynolds.",
      guide: {
        t: "오늘 그림책 The Dot을 소개하고 싶다고 말문을 여는 발표 시작 문장입니다.",
        p: "Today / I'd like to introduce / The Dot by Peter Reynolds",
        m: "`I'd`와 `by`가 약하게 지나가고 `introduce` 철자를 흔히 놓칩니다.",
        c: "`Today` / `I'd like to introduce` / `The Dot by Peter Reynolds` 세 덩어리로 듣습니다.",
      },
      commentary: {
        learningGoal: "`I'd like to` 도입 표현과 `by + 저자` 구조를 듣고 정확히 적는 연습입니다.",
        pronunciation: {
          linking: "`I'd like`는 거의 한 덩어리로 붙어 들립니다.",
          weakForm: "`by`는 문장 끝에서 짧게 스쳐 가서 빠뜨리기 쉽습니다.",
          stress: "`introduce`, `Dot`, `Reynolds` 쪽에 강세가 모입니다.",
        },
        wrongReasons: [
          "`I'd`의 apostrophe를 빼고 `Id`로 적는 경우가 많습니다.",
          "`by`를 못 듣고 저자명만 받아적는 실수가 자주 나옵니다.",
        ],
        shadowingTip: "`Today I'd like to introduce`를 한 덩어리로 여러 번 붙여 읽은 뒤 뒤 절을 이어 붙입니다.",
        selfCheck: [
          "`I'd`를 `I would`의 축약형이라고 설명할 수 있나요?",
          "`by + 저자` 구조를 듣고 바로 떠올릴 수 있나요?",
          "`introduce` 철자를 보지 않고 적을 수 있나요?",
        ],
      },
      fullMeaning: {
        literal: "오늘, 나는 Peter Reynolds의 The Dot을 소개하고 싶습니다.",
        natural: "오늘은 피터 레이놀즈의 그림책 '점'을 소개할게요.",
        context: "책 소개 발표나 수업 발표를 시작할 때 바로 쓸 수 있는 도입 문장입니다.",
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 1,
          answer: "I'd",
          levels: ['low', 'normal', 'hard'],
          pos: "대명사+조동사 축약형 (I would → I'd)",
          difficultyLevel: 2,
          basis: '약하게 지나가는 축약형이라 apostrophe 인식이 필요합니다.',
          hints: {
            lv1: "I' _",
            lv2: "`like to` 앞에 오는 축약형입니다.",
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'Id', reason: 'apostrophe 누락' },
            { answer: 'I would', reason: '축약형 대신 풀어서 적음' },
          ],
          notes: {
            easy: "`I'd like to ...`는 '...하고 싶어요'로 발표를 여는 아주 자주 쓰는 시작 표현입니다.",
            role: "뒤의 `like to introduce`를 여는 짧은 도입 축약형입니다.",
            listen: "`Today / I'd like to introduce` 흐름에서 `I'd`가 두 번째 덩어리의 출발점입니다.",
            trap: "소리가 짧아서 `I`만 적거나 apostrophe를 빠뜨리기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 7,
          answer: 'by',
          levels: ['normal', 'hard'],
          pos: '전치사 (저자 표시: by + 사람)',
          difficultyLevel: 2,
          basis: '기능어라 약하게 들리고 뒤 고유명사와 붙어 지나갑니다.',
          hints: {
            lv1: 'b_',
            lv2: '저자 이름 바로 앞에 오는 전치사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'of', reason: '전치사 혼동' },
            { answer: '', reason: '약하게 들려 통째로 빠뜨림' },
          ],
          notes: {
            easy: "`by`는 '~의 저자'를 표시하는 짧은 연결말입니다.",
            role: "`The Dot`과 저자 이름을 연결하는 전치사입니다.",
            listen: "`The Dot by Peter Reynolds`를 한 묶음으로 듣되 이름 앞 짧은 소리를 챙기면 됩니다.",
            trap: "뒤 사람 이름에 신경이 쏠리면 `by`를 통째로 빼먹기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 4,
          answer: 'introduce',
          levels: ['hard'],
          pos: '동사원형 (like to introduce)',
          difficultyLevel: 1,
          basis: '핵심 내용어지만 발표 도입에서 매우 자주 쓰여 철자 자동화가 필요합니다.',
          hints: {
            lv1: 'intr_____',
            lv2: "'소개하다'라는 발표 시작 동사입니다.",
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'introdece', reason: '모음 순서 혼동' },
            { answer: 'introduse', reason: '마지막 발음을 철자로 잘못 옮김' },
          ],
          notes: {
            easy: "`introduce`는 '소개하다'라는 발표 핵심 동사입니다.",
            role: "`I'd like to` 뒤에서 실제 행동을 말하는 중심 동사입니다.",
            listen: "`I'd like to introduce`를 통째로 붙여 듣고 뒤 강세 있는 `-duce`를 확인합니다.",
            trap: "뜻은 아는데 `introduce` 철자를 뒤섞는 실수가 잦습니다.",
          },
        }),
      ],
    }),
    createDictationSentenceTemplate({
      id: 'dot-s02',
      text: 'This award-winning picture book tells the story of a girl named Vashti.',
      guide: {
        t: '그림책이 어떤 이야기인지 간단히 소개하면서, 수식어와 정보어를 차례로 붙이는 문장입니다.',
        p: 'This award-winning picture book / tells the story / of a girl named Vashti',
        m: '`named`를 동사로 잘못 듣거나 `of`를 놓치고, `award-winning` 하이픈 표현을 자주 틀립니다.',
        c: '`This award-winning picture book` / `tells the story` / `of a girl named Vashti`로 나눠 듣습니다.',
      },
      commentary: {
        learningGoal: '`story of ... named ...` 구조와 하이픈 형용사 `award-winning`을 듣고 구분하는 연습입니다.',
        pronunciation: {
          linking: '`story of a`는 빠르게 붙어 들립니다.',
          weakForm: '`of a`는 둘 다 약해져서 중간이 거의 사라진 것처럼 들릴 수 있습니다.',
          stress: '`award-winning`, `story`, `named`가 귀에 걸리는 핵심입니다.',
        },
        wrongReasons: [
          "`named`를 그냥 `name`으로 적고 -ed를 빼먹는 경우가 많습니다.",
          "`of a` 묶음을 놓쳐 문장 구조를 반만 적는 실수가 자주 납니다.",
        ],
        shadowingTip: "`tells the story of a girl named ...`를 끝까지 한 호흡으로 읽는 연습이 효과적입니다.",
        selfCheck: [
          "`named`가 앞 명사를 꾸민다는 점을 설명할 수 있나요?",
          "`of a`가 빠르게 약해져도 들을 수 있나요?",
          "`award-winning` 하이픈 형용사를 철자까지 적을 수 있나요?",
        ],
      },
      fullMeaning: {
        literal: '이 수상 경력이 있는 그림책은 바슈티라는 소녀의 이야기를 들려줍니다.',
        natural: '이 유명한 그림책은 바슈티라는 소녀 이야기를 담고 있어요.',
        context: '책 줄거리 소개에서 작품의 성격과 주인공을 함께 설명할 때 쓰는 문장입니다.',
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 10,
          answer: 'named',
          levels: ['low', 'normal', 'hard'],
          pos: '과거분사 (앞 명사 수식: a girl named ...)',
          difficultyLevel: 2,
          basis: '뜻은 쉬워도 -ed를 놓치기 쉽고 문장 속 역할을 이해해야 합니다.',
          hints: {
            lv1: 'na___',
            lv2: '이름이 ~인 이라는 뜻으로 앞 명사를 꾸밉니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'name', reason: '-ed 누락' },
            { answer: 'namede', reason: '철자 과잉' },
          ],
          notes: {
            easy: "`named`는 '이름이 ~인'처럼 앞 명사를 짧게 꾸며 주는 말입니다.",
            role: "`a girl` 뒤에 붙어 어떤 소녀인지 설명하는 수식어입니다.",
            listen: "`of a girl named Vashti`에서 `girl` 뒤 약하게 붙는 -ed 끝소리를 챙깁니다.",
            trap: "뜻만 따라가면 `name`까지만 적고 -ed를 빠뜨리기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 7,
          answer: 'of',
          levels: ['normal', 'hard'],
          pos: '전치사 (story of ...)',
          difficultyLevel: 2,
          basis: '기능어라 약하게 지나가고 뒤의 a와 붙어 들립니다.',
          hints: {
            lv1: 'o_',
            lv2: '`story` 뒤에서 내용을 이어 주는 전치사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'for', reason: '짧은 전치사 혼동' },
            { answer: '', reason: '무응답 - 약형 구간 인식 실패' },
          ],
          notes: {
            easy: "`of`는 '무엇의 이야기'처럼 내용을 이어 주는 연결말입니다.",
            role: "`the story` 뒤에서 뒤 명사구를 붙여 주는 전치사입니다.",
            listen: "`story of a`가 한 번에 붙어 지나가므로 `of`를 따로 의식해서 들어야 합니다.",
            trap: "앞뒤 내용어만 듣고 중간의 `of`를 통째로 빼먹는 경우가 많습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 1,
          answer: 'award-winning',
          levels: ['hard'],
          pos: '복합형용사 (명사 앞 수식)',
          difficultyLevel: 3,
          basis: '하이픈 복합어라 발음과 철자를 동시에 잡아야 합니다.',
          hints: {
            lv1: 'award-______',
            lv2: '상을 받은 이라는 뜻의 하이픈 형용사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'award wining', reason: '하이픈 누락 + 철자 혼동' },
            { answer: 'award-wining', reason: 'n 하나 누락' },
          ],
          notes: {
            easy: "`award-winning`은 '상을 받은'이라는 뜻으로 책의 가치를 먼저 보여 줍니다.",
            role: "`picture book` 앞에서 책을 꾸미는 핵심 형용사입니다.",
            listen: "`This award-winning picture book` 첫 덩어리에서 길게 붙는 소리로 들어야 합니다.",
            trap: "하이픈을 빼먹거나 `winning` 철자를 흔히 틀립니다.",
          },
        }),
      ],
    }),
    createDictationSentenceTemplate({
      id: 'dot-s03',
      text: "She believes she can't draw at all.",
      guide: {
        t: '바슈티가 스스로를 어떻게 생각하는지 짧고 강하게 말하는 문장입니다.',
        p: "She believes / she can't draw / at all",
        m: "`can't`의 t, `at all`의 약한 연결, `believes`의 -s를 자주 놓칩니다.",
        c: "`She believes` / `she can't draw` / `at all` 세 구간으로 끊어 듣습니다.",
      },
      commentary: {
        learningGoal: "생각·믿음을 나타내는 `believes`와 부정 표현 `can't ... at all`을 통째로 잡는 연습입니다.",
        pronunciation: {
          linking: "`can't draw`는 거의 한 덩어리처럼 빠르게 이어집니다.",
          weakForm: "`at all`은 뒤로 갈수록 약해져 문장 끝에서 흐려지기 쉽습니다.",
          stress: "`believes`, `can't`, `draw`에 중심 리듬이 있습니다.",
        },
        wrongReasons: [
          "`can't`를 `can`으로 받아 적어 의미를 반대로 쓰는 실수가 나옵니다.",
          "`at all`을 못 듣고 문장 끝을 비워 두는 경우가 많습니다.",
        ],
        shadowingTip: "`She believes she can't draw`를 먼저 안정적으로 말한 뒤 `at all`을 붙여 마무리합니다.",
        selfCheck: [
          "`can't draw`가 부정이라는 점을 바로 들을 수 있나요?",
          "`believes` 끝의 -s를 적을 수 있나요?",
          "`at all`을 문장 끝 약형으로도 잡을 수 있나요?",
        ],
      },
      fullMeaning: {
        literal: '그녀는 자신이 전혀 그림을 그릴 수 없다고 믿습니다.',
        natural: '바슈티는 자기는 그림을 전혀 못 그린다고 생각해요.',
        context: '자신감이 낮은 상태를 설명하며 뒤 변화와 대비를 만들기 위한 문장입니다.',
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 3,
          answer: "can't",
          levels: ['low', 'normal', 'hard'],
          pos: '조동사 부정형 (can not의 축약)',
          difficultyLevel: 2,
          basis: '짧은 부정 소리라 t를 놓치면 뜻이 정반대로 바뀝니다.',
          hints: {
            lv1: "ca__'_",
            lv2: '`draw` 앞의 부정 조동사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'can', reason: '부정 t 소리 누락' },
            { answer: 'cant', reason: 'apostrophe 누락' },
          ],
          notes: {
            easy: "`can't`는 '할 수 없다'는 뜻이라 문장 의미를 뒤집는 핵심 부정 표현입니다.",
            role: "`draw` 앞에서 가능 여부를 부정하는 조동사입니다.",
            listen: "`she can't draw`를 통째로 듣고 끝 t가 닫히는 느낌을 챙깁니다.",
            trap: "t를 못 들으면 `can`으로 적어 뜻이 반대로 바뀝니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 5,
          answer: 'at',
          levels: ['normal', 'hard'],
          pos: '전치사 (숙어: at all)',
          difficultyLevel: 2,
          basis: '문장 끝 약형 구간이라 짧고 흐리게 들립니다.',
          hints: {
            lv1: 'a_',
            lv2: '`all` 앞에서 함께 쓰여 전혀 라는 뜻을 만듭니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'all', reason: '숙어를 한 단어로 오인' },
            { answer: '', reason: '약하게 지나가서 생략' },
          ],
          notes: {
            easy: "`at all`은 '전혀'처럼 부정을 더 세게 만드는 표현입니다.",
            role: "문장 끝에서 부정을 강조하는 짧은 전치사 조각입니다.",
            listen: "`draw at all`을 한 덩어리로 듣고 `at`의 아주 짧은 모음 소리를 챙깁니다.",
            trap: "끝에 약하게 붙어 `all`만 적거나 통째로 놓치기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 1,
          answer: 'believes',
          levels: ['hard'],
          pos: '일반동사 3인칭 단수 현재',
          difficultyLevel: 2,
          basis: '의미어지만 끝의 -s를 놓치기 쉬운 활용형입니다.',
          hints: {
            lv1: 'belie___',
            lv2: '생각하다/믿다의 3인칭 단수형입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'believe', reason: '3인칭 단수 -s 누락' },
            { answer: 'beleives', reason: 'ie/ei 철자 혼동' },
          ],
          notes: {
            easy: "`believes`는 바슈티가 스스로를 어떻게 생각하는지 보여 주는 핵심 동사입니다.",
            role: "문장 첫 절의 중심 동사로 뒤 내용을 이끕니다.",
            listen: "`She believes / she can't draw`에서 첫 절 끝 -s를 닫아 듣습니다.",
            trap: "의미만 따라가면 `believe`로 적고 -s를 빠뜨리기 쉽습니다.",
          },
        }),
      ],
    }),
    createDictationSentenceTemplate({
      id: 'dot-s04',
      text: 'However, her teacher thinks she can and encourages her to just "make a dot and see where it takes you."',
      guide: {
        t: '선생님이 바슈티를 북돋우며 직접 행동하게 만드는 조언 문장입니다.',
        p: 'However, her teacher thinks / she can and encourages her / to just make a dot / and see where it takes you',
        m: '`encourages`의 철자, 약한 `to`, 문장 끝 `takes you` 연결을 자주 놓칩니다.',
        c: '`teacher thinks` / `encourages her` / `to just make a dot` / `see where it takes you` 순서로 듣습니다.',
      },
      commentary: {
        learningGoal: '`encourages + 사람 + to 동사원형` 구조와 인용문 안 행동 지시를 따라 적는 연습입니다.',
        pronunciation: {
          linking: '`takes you`는 /teiks yu/처럼 이어져 들립니다.',
          weakForm: '`to just`의 `to`는 매우 약하게 지나갑니다.',
          stress: '`teacher`, `encourages`, `dot`, `takes`에 힘이 실립니다.',
        },
        wrongReasons: [
          "`encourages` 철자가 길어 중간 음절을 빠뜨리는 경우가 많습니다.",
          "`to`를 놓치면 뒤 행동 지시 구조가 흐트러집니다.",
        ],
        shadowingTip: '`encourages her to just make a dot`를 한 번에 말하고, 뒤 `and see where it takes you`를 이어 붙입니다.',
        selfCheck: [
          "`encourages her to` 구조를 통째로 설명할 수 있나요?",
          "`to`가 약해도 뒤 동사원형을 예측할 수 있나요?",
          "`takes you` 연결 소리를 듣고 적을 수 있나요?",
        ],
      },
      fullMeaning: {
        literal: '하지만 그녀의 선생님은 그녀가 할 수 있다고 생각하고, 그냥 점 하나를 찍고 그것이 너를 어디로 데려가는지 보라고 격려합니다.',
        natural: '하지만 선생님은 네가 할 수 있다고 믿고, 그냥 점 하나 찍어 보고 그 점이 어디로 이끄는지 보라고 말해요.',
        context: '학생을 격려하며 행동을 유도하는 조언 문장이라 발표나 상담 표현과도 연결됩니다.',
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 7,
          answer: 'encourages',
          levels: ['low', 'normal', 'hard'],
          pos: '일반동사 3인칭 단수 현재',
          difficultyLevel: 2,
          basis: '길이가 길고 3인칭 단수 -s까지 챙겨야 하는 핵심 동사입니다.',
          hints: {
            lv1: 'encour____',
            lv2: '용기를 주고 하게 만든다는 뜻의 동사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'encourage', reason: '3인칭 단수 -s 누락' },
            { answer: 'encurages', reason: '중간 철자 누락' },
          ],
          notes: {
            easy: "`encourages`는 상대가 실제로 해 보도록 등을 떠미는 핵심 동사입니다.",
            role: "`teacher`가 무엇을 하는지 보여 주는 중심 동사입니다.",
            listen: "`she can and encourages her` 흐름에서 `and` 뒤 길게 이어지는 동사를 잡습니다.",
            trap: "길이가 길고 -s까지 챙겨야 해서 중간 철자나 끝소리를 자주 놓칩니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 9,
          answer: 'to',
          levels: ['normal', 'hard'],
          pos: 'to부정사 표지',
          difficultyLevel: 2,
          basis: '아주 약하게 들리지만 뒤 행동 지시를 여는 문법 신호입니다.',
          hints: {
            lv1: 't_',
            lv2: '`encourages her` 뒤에서 행동을 이어 주는 말입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: '', reason: '약하게 지나가서 생략' },
            { answer: 'too', reason: '동음이의 철자 혼동' },
          ],
          notes: {
            easy: "`to`는 뒤에 실제 행동을 붙이는 아주 짧은 문법 신호입니다.",
            role: "`encourages her` 뒤에서 무엇을 하게 하는지 이어 줍니다.",
            listen: "`encourages her to just`에서 `her`와 `just` 사이 짧은 소리를 잡습니다.",
            trap: "뜻을 따라가다 보면 `to`를 아예 안 적고 넘어가게 됩니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 18,
          answer: 'takes',
          levels: ['hard'],
          pos: '일반동사 3인칭 단수 현재',
          difficultyLevel: 2,
          basis: '문장 끝 연결 발음 속에서 -s를 포함한 활용형을 적어야 합니다.',
          hints: {
            lv1: 'ta___',
            lv2: '`where it ___ you` 자리의 동사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'take', reason: '3인칭 단수 -s 누락' },
            { answer: 'takess', reason: '끝소리 과잉 표기' },
          ],
          notes: {
            easy: "`takes`는 그 점이 너를 어디로 이끄는지 말해 주는 핵심 동사입니다.",
            role: "`where it takes you` 절의 중심 동사입니다.",
            listen: "`see where it takes you`를 통째로 듣고 `takes you` 연결을 같이 잡습니다.",
            trap: "`takes you`가 붙어 들려 `take`만 적거나 뒤 `you`와 섞기 쉽습니다.",
          },
        }),
      ],
    }),
    createDictationSentenceTemplate({
      id: 'dot-s05',
      text: 'Reluctantly, Vashti marks a small dot.',
      guide: {
        t: '망설이던 바슈티가 결국 점 하나를 찍는 장면을 짧게 보여 주는 문장입니다.',
        p: 'Reluctantly / Vashti marks / a small dot',
        m: '`marks`의 -s, 약한 관사 `a`, `small` 철자를 자주 놓칩니다.',
        c: '`Reluctantly` / `Vashti marks` / `a small dot` 세 덩어리로 듣습니다.',
      },
      commentary: {
        learningGoal: '짧은 문장 안에서도 동사 활용형 `marks`와 약한 관사 `a`를 놓치지 않는 연습입니다.',
        pronunciation: {
          linking: '`marks a`가 자연스럽게 붙어 들립니다.',
          weakForm: '`a`는 거의 흔적만 남을 정도로 약하게 지나갑니다.',
          stress: '`Reluctantly`, `marks`, `small`, `dot`에 리듬이 걸립니다.',
        },
        wrongReasons: [
          "`marks`를 `mark`로 적어 동사 활용형을 놓치는 경우가 많습니다.",
          "`a`를 안 적고 내용어 두 개만 적는 실수가 자주 나옵니다.",
        ],
        shadowingTip: '`marks a small dot`를 짧게 여러 번 붙여 읽으며 관사까지 같이 말하는 연습을 합니다.',
        selfCheck: [
          "`marks` 끝의 -s를 적었나요?",
          "`a small dot`에서 관사까지 챙겼나요?",
          "`Reluctantly`가 분위기를 설명한다는 점을 이해했나요?",
        ],
      },
      fullMeaning: {
        literal: '마지못해, 바슈티는 작은 점 하나를 찍습니다.',
        natural: '마지못해 바슈티는 작은 점 하나를 찍어요.',
        context: '이후 변화의 출발점이 되는 행동을 보여 주는 전환 문장입니다.',
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 2,
          answer: 'marks',
          levels: ['low', 'normal', 'hard'],
          pos: '일반동사 3인칭 단수 현재',
          difficultyLevel: 2,
          basis: '짧은 동사라도 3인칭 단수 -s를 챙겨야 점수가 납니다.',
          hints: {
            lv1: 'mar__',
            lv2: '점을 찍다/표시하다의 3인칭 단수형입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'mark', reason: '3인칭 단수 -s 누락' },
            { answer: 'marcks', reason: '자음 철자 혼동' },
          ],
          notes: {
            easy: "`marks`는 실제 행동이 일어나는 핵심 동사입니다.",
            role: "주어 `Vashti`가 무엇을 하는지 보여 주는 중심 동사입니다.",
            listen: "`Vashti marks a small dot`에서 이름 뒤 바로 나오는 짧은 동사를 잡습니다.",
            trap: "짧은 동사라 대충 적고 -s를 빼먹기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 4,
          answer: 'small',
          levels: ['normal', 'hard'],
          pos: '형용사 (dot 수식)',
          difficultyLevel: 1,
          basis: '내용어지만 짧은 문장이라 크기 표현을 정확히 적어야 의미가 살아납니다.',
          hints: {
            lv1: 'sm___',
            lv2: '`dot` 앞에서 크기를 말하는 형용사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'smal', reason: '마지막 l 누락' },
            { answer: 'smalll', reason: '자음 과잉 표기' },
          ],
          notes: {
            easy: "`small`은 점의 크기를 말해 주는 간단한 형용사입니다.",
            role: "`dot`을 꾸며 장면을 더 구체적으로 보여 줍니다.",
            listen: "`a small dot`를 붙여 듣고 `sm-` 시작을 먼저 잡습니다.",
            trap: "뜻은 쉬워도 l 개수를 헷갈려 철자를 틀리기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 3,
          answer: 'a',
          levels: ['hard'],
          pos: '부정관사',
          difficultyLevel: 2,
          basis: '짧고 약한 기능어라 듣기에서는 가장 먼저 빠지기 쉽습니다.',
          hints: {
            lv1: 'a',
            lv2: '`small dot` 앞의 관사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'the', reason: '관사 혼동' },
            { answer: '', reason: '약하게 지나가서 생략' },
          ],
          notes: {
            easy: "`a`는 점 하나를 말해 주는 아주 짧은 관사입니다.",
            role: "`small dot` 앞에서 단수 명사를 자연스럽게 열어 줍니다.",
            listen: "`marks a small`에서 동사와 형용사 사이 짧은 소리를 챙깁니다.",
            trap: "내용어만 적다가 관사를 통째로 빼먹는 실수가 많습니다.",
          },
        }),
      ],
    }),
    createDictationSentenceTemplate({
      id: 'dot-s06',
      text: 'To her surprise, the teacher asks her to sign it and proudly displays it in her office.',
      guide: {
        t: '선생님의 예상 밖 반응과 그 결과를 한 문장에 이어서 말하는 장면입니다.',
        p: 'To her surprise / the teacher asks her / to sign it / and proudly displays it in her office',
        m: '`asks`의 -s, 약한 `to`, 긴 동사 `displays` 철자를 자주 놓칩니다.',
        c: '`To her surprise` / `the teacher asks her` / `to sign it` / `displays it in her office`로 나눕니다.',
      },
      commentary: {
        learningGoal: '`ask + 사람 + to 동사원형` 구조와 뒤에 이어지는 두 번째 동사 `displays`를 분리해서 듣는 연습입니다.',
        pronunciation: {
          linking: '`sign it`과 `displays it`이 각각 자연스럽게 붙습니다.',
          weakForm: '`to`는 `asks her` 뒤에서 매우 약합니다.',
          stress: '`surprise`, `asks`, `sign`, `displays`, `office`가 핵심입니다.',
        },
        wrongReasons: [
          "`asks`의 /sks/ 자음군을 못 듣고 `ask`로 적는 경우가 많습니다.",
          "`displays`가 길어서 중간 철자와 끝 -s를 함께 놓치기 쉽습니다.",
        ],
        shadowingTip: '`asks her to sign it`를 먼저 끊어 연습하고, 그 다음 `and proudly displays it in her office`를 이어 붙입니다.',
        selfCheck: [
          "`asks her to`가 한 구조라는 점을 이해했나요?",
          "`sign it`과 `displays it` 연결을 둘 다 적을 수 있나요?",
          "`office`까지 포함한 마지막 구간을 끝까지 들었나요?",
        ],
      },
      fullMeaning: {
        literal: '놀랍게도, 선생님은 그녀에게 그것에 서명하라고 말하고 그것을 자신의 사무실에 자랑스럽게 전시합니다.',
        natural: '놀랍게도 선생님은 거기에 사인하라고 하고, 그 점을 자기 교무실에 자랑스럽게 걸어 둡니다.',
        context: '격려가 실제 행동과 인정으로 이어지는 장면이라 서사의 전환점 역할을 합니다.',
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 5,
          answer: 'asks',
          levels: ['low', 'normal', 'hard'],
          pos: '일반동사 3인칭 단수 현재',
          difficultyLevel: 2,
          basis: '짧지만 /sks/ 자음군 때문에 끝소리를 놓치기 쉽습니다.',
          hints: {
            lv1: 'as__',
            lv2: '`her to sign` 앞에서 요청하는 동사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'ask', reason: '3인칭 단수 -s 누락' },
            { answer: 'askes', reason: '활용형 과잉 추정' },
          ],
          notes: {
            easy: "`asks`는 선생님이 무엇을 요구하는지 보여 주는 짧은 핵심 동사입니다.",
            role: "`teacher` 뒤에서 요청 행동을 여는 동사입니다.",
            listen: "`the teacher asks her`에서 `teacher` 뒤 바로 이어지는 짧은 동사를 잡습니다.",
            trap: "/sks/ 끝소리가 약해서 `ask`로 적는 경우가 많습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 7,
          answer: 'to',
          levels: ['normal', 'hard'],
          pos: 'to부정사 표지',
          difficultyLevel: 2,
          basis: '매우 짧은 기능어지만 뒤 행동을 여는 구조 신호입니다.',
          hints: {
            lv1: 't_',
            lv2: '`asks her` 뒤에 오는 짧은 문법 신호입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: '', reason: '약하게 들려 생략' },
            { answer: 'too', reason: '동음이의 철자 혼동' },
          ],
          notes: {
            easy: "`to`는 뒤 `sign`을 이어 주는 아주 짧은 연결말입니다.",
            role: "`ask + 사람 + to 동사` 구조를 완성해 줍니다.",
            listen: "`asks her to sign` 흐름에서 `her`와 `sign` 사이 짧은 소리를 의식합니다.",
            trap: "짧아서 없어도 된다고 느껴져 그냥 빼먹기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 12,
          answer: 'displays',
          levels: ['hard'],
          pos: '일반동사 3인칭 단수 현재',
          difficultyLevel: 2,
          basis: '길이가 길고 3인칭 단수 -s까지 포함한 핵심 동사입니다.',
          hints: {
            lv1: 'disp____',
            lv2: '`proudly` 뒤에서 전시하다의 뜻으로 쓰인 동사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'display', reason: '3인칭 단수 -s 누락' },
            { answer: 'displaies', reason: 'y/ay 철자 혼동' },
          ],
          notes: {
            easy: "`displays`는 점을 실제로 전시하는 행동을 보여 주는 동사입니다.",
            role: "`and` 뒤에서 두 번째 행동을 이어 주는 핵심 동사입니다.",
            listen: "`and proudly displays it`를 통째로 듣고 중간 `play` 소리를 분명히 잡습니다.",
            trap: "길이가 길어 중간 철자와 끝 -s를 함께 놓치는 경우가 많습니다.",
          },
        }),
      ],
    }),
    createDictationSentenceTemplate({
      id: 'dot-s07',
      text: 'This experience makes Vashti believe in her potential, and she begins creating more colorful "dot" artworks.',
      guide: {
        t: '한 번의 경험이 바슈티의 가능성을 깨우고 행동 변화로 이어지는 문장입니다.',
        p: 'This experience makes Vashti believe / in her potential / and she begins creating / more colorful dot artworks',
        m: '`potential` 철자, 짧은 `in`, `creating`의 연속 모음을 자주 놓칩니다.',
        c: '`This experience makes Vashti believe` / `in her potential` / `she begins creating more colorful dot artworks`로 나눕니다.',
      },
      commentary: {
        learningGoal: '`believe in` 구문과 `begins creating`처럼 동사가 이어지는 흐름을 통째로 듣는 연습입니다.',
        pronunciation: {
          linking: '`believe in`과 `begins creating`이 각각 매끈하게 이어집니다.',
          weakForm: '`in`은 `believe` 뒤에서 아주 짧게 붙습니다.',
          stress: '`experience`, `potential`, `begins`, `creating`, `colorful`이 핵심입니다.',
        },
        wrongReasons: [
          "`potential` 철자가 길어 중간 음절을 빠뜨리기 쉽습니다.",
          "`in`을 놓치면 `believe in` 핵심 구문이 무너집니다.",
        ],
        shadowingTip: '`believe in her potential`을 먼저 한 덩어리로 익히고, 뒤 `begins creating ...`을 이어 붙입니다.',
        selfCheck: [
          "`believe in`을 하나의 표현으로 들을 수 있나요?",
          "`potential` 철자를 보지 않고 적을 수 있나요?",
          "`begins creating`처럼 동사가 이어지는 흐름을 잡을 수 있나요?",
        ],
      },
      fullMeaning: {
        literal: '이 경험은 바슈티가 자신의 잠재력을 믿게 만들고, 그녀는 더 다채로운 점 작품들을 만들기 시작합니다.',
        natural: '이 경험 덕분에 바슈티는 자신의 가능성을 믿게 되고, 더 다채로운 점 그림을 만들기 시작해요.',
        context: '자신감 회복과 성장 변화를 설명하는 핵심 결과 문장입니다.',
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 7,
          answer: 'potential',
          levels: ['low', 'normal', 'hard'],
          pos: '명사 (잠재력)',
          difficultyLevel: 1,
          basis: '핵심 내용어라 뜻을 정확히 알고 철자까지 자동화해야 합니다.',
          hints: {
            lv1: 'poten____',
            lv2: '가능성, 잠재력이라는 뜻의 명사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'potentional', reason: '철자 삽입' },
            { answer: 'potencial', reason: 'ti/ci 철자 혼동' },
          ],
          notes: {
            easy: "`potential`은 아직 안 드러난 가능성을 뜻하는 핵심 단어입니다.",
            role: "`believe in` 뒤에서 무엇을 믿게 되었는지 보여 주는 명사입니다.",
            listen: "`believe in her potential`을 통째로 듣고 길게 울리는 가운데 음절을 챙깁니다.",
            trap: "뜻은 알아도 `potential` 철자를 줄이거나 바꾸어 적는 경우가 많습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 5,
          answer: 'in',
          levels: ['normal', 'hard'],
          pos: '전치사 (believe in)',
          difficultyLevel: 2,
          basis: '기능어라 매우 짧지만 구문 의미를 완성하는 핵심 전치사입니다.',
          hints: {
            lv1: 'i_',
            lv2: '`believe` 뒤에서 꼭 붙는 전치사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'on', reason: '짧은 전치사 혼동' },
            { answer: '', reason: '무응답 - 약형 인식 실패' },
          ],
          notes: {
            easy: "`in`은 `believe`와 붙어 '믿다'의 대상을 자연스럽게 연결합니다.",
            role: "`believe in`이라는 핵심 구문을 완성하는 전치사입니다.",
            listen: "`believe in her`에서 `believe` 뒤 매우 짧게 붙는 소리를 잡습니다.",
            trap: "짧아서 생략하면 문장은 맞아 보여도 핵심 표현이 틀어집니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 11,
          answer: 'creating',
          levels: ['hard'],
          pos: '동명사/현재분사 (begin creating)',
          difficultyLevel: 2,
          basis: '동사 뒤 -ing 형태가 이어져 발음과 철자를 동시에 잡아야 합니다.',
          hints: {
            lv1: 'creat____',
            lv2: '`begins` 뒤에서 만드는 행동을 잇는 -ing 형태입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'create', reason: '-ing 누락' },
            { answer: 'creatting', reason: '자음 중복 오류' },
          ],
          notes: {
            easy: "`creating`은 실제 창작 행동이 계속 이어진다는 느낌을 주는 말입니다.",
            role: "`begins` 뒤에서 무엇을 시작했는지 보여 주는 -ing 형태입니다.",
            listen: "`begins creating more colorful` 흐름에서 `creating`의 길게 이어지는 모음을 잡습니다.",
            trap: "뜻은 알아도 -ing를 빼먹거나 철자를 늘려 적기 쉽습니다.",
          },
        }),
      ],
    }),
    createDictationSentenceTemplate({
      id: 'dot-s08',
      text: 'Finally, she realizes that she is indeed an artist.',
      guide: {
        t: '이야기의 결론에서 바슈티가 자신의 정체성을 받아들이는 문장입니다.',
        p: 'Finally / she realizes / that she is indeed / an artist',
        m: '`realizes`의 -s, `that`의 약한 연결, `indeed`의 철자를 자주 틀립니다.',
        c: '`Finally` / `she realizes` / `that she is indeed` / `an artist` 순서로 듣습니다.',
      },
      commentary: {
        learningGoal: '`realizes that` 절 구조와 강조 부사 `indeed`를 함께 듣고 적는 연습입니다.',
        pronunciation: {
          linking: '`that she is`는 빠르게 한 덩어리처럼 들립니다.',
          weakForm: '`that`은 절을 여는 기능어라 약하게 지나갑니다.',
          stress: '`Finally`, `realizes`, `indeed`, `artist`에 중심 리듬이 있습니다.',
        },
        wrongReasons: [
          "`realizes`의 -s를 빼먹어 활용형을 틀리는 경우가 많습니다.",
          "`that`을 놓치면 뒤 절 구조가 흐려지고 받아쓰기가 끊깁니다.",
        ],
        shadowingTip: '`she realizes that`를 붙여 읽고, 뒤 `she is indeed an artist`를 강조 리듬으로 마무리합니다.',
        selfCheck: [
          "`realizes that` 구조를 바로 떠올릴 수 있나요?",
          "`indeed`가 강조 부사라는 점을 이해했나요?",
          "`an artist`까지 끝까지 적었나요?",
        ],
      },
      fullMeaning: {
        literal: '마침내, 그녀는 자신이 정말로 한 명의 예술가라는 것을 깨닫습니다.',
        natural: '마침내 바슈티는 자신이 진짜 예술가라는 걸 깨달아요.',
        context: '주인공의 내적 변화가 완성되는 결론 문장입니다.',
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 2,
          answer: 'realizes',
          levels: ['low', 'normal', 'hard'],
          pos: '일반동사 3인칭 단수 현재',
          difficultyLevel: 2,
          basis: '의미어이지만 3인칭 단수 -s와 철자를 함께 맞춰야 합니다.',
          hints: {
            lv1: 'reali____',
            lv2: '깨닫다의 3인칭 단수형입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'realize', reason: '3인칭 단수 -s 누락' },
            { answer: 'realises', reason: '미국식/영국식 철자 혼동' },
          ],
          notes: {
            easy: "`realizes`는 주인공이 무엇을 깨닫는지 보여 주는 결론 동사입니다.",
            role: "문장 전체의 깨달음을 이끄는 중심 동사입니다.",
            listen: "`she realizes that`에서 `she` 뒤에 바로 붙는 동사를 잡습니다.",
            trap: "-s를 빼먹거나 s/z 철자 감각이 흔들려 실수하기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 3,
          answer: 'that',
          levels: ['normal', 'hard'],
          pos: '접속사 (realize that ...)',
          difficultyLevel: 2,
          basis: '짧은 기능어지만 뒤 절을 여는 문법 신호라 반드시 필요합니다.',
          hints: {
            lv1: 'th__',
            lv2: '`realizes` 뒤에서 뒤 내용을 여는 접속사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: '', reason: '약하게 들려 생략' },
            { answer: 'what', reason: '비슷한 기능어 혼동' },
          ],
          notes: {
            easy: "`that`은 뒤에 오는 깨달음의 내용을 열어 주는 짧은 말입니다.",
            role: "`realizes` 뒤의 절을 연결하는 접속사입니다.",
            listen: "`realizes that she is` 흐름에서 동사 바로 뒤에 나오는 약한 연결말을 잡습니다.",
            trap: "뜻 전달만 보면 없어 보여서 아예 빼먹기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 6,
          answer: 'indeed',
          levels: ['hard'],
          pos: '부사 (강조)',
          difficultyLevel: 2,
          basis: '짧지 않지만 자주 안 쓰는 강조 부사라 철자 자동화가 덜 되어 있습니다.',
          hints: {
            lv1: 'ind___',
            lv2: '정말로, 분명히 라는 뜻의 강조 부사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'indead', reason: '모음 철자 혼동' },
            { answer: 'in deed', reason: '띄어쓰기 오인' },
          ],
          notes: {
            easy: "`indeed`는 '정말로'라는 뜻으로 뒤 `an artist`를 강조합니다.",
            role: "자기 인식을 더 강하게 만드는 강조 부사입니다.",
            listen: "`she is indeed an artist`에서 `indeed`가 중간에서 또렷하게 들립니다.",
            trap: "익숙한 단어가 아니라 모음 철자나 띄어쓰기를 자주 틀립니다.",
          },
        }),
      ],
    }),
    createDictationSentenceTemplate({
      id: 'dot-s09',
      text: "With witty and vivid illustrations, the writer emphasizes that there's a creative spirit in every one of us.",
      guide: {
        t: '작가가 이 작품을 통해 전하고 싶은 핵심 메시지를 정리하는 마무리 문장입니다.',
        p: "With witty and vivid illustrations / the writer emphasizes / that there's a creative spirit / in every one of us",
        m: "`there's` 축약형, 약한 `of`, 긴 동사 `emphasizes`를 자주 놓칩니다.",
        c: "With witty and vivid illustrations / the writer emphasizes / that there's a creative spirit / in every one of us로 나눕니다.",
      },
      commentary: {
        learningGoal: "`there's` 축약형과 `every one of us` 묶음을 듣고, 핵심 메시지 문장을 정확히 받아쓰는 연습입니다.",
        pronunciation: {
          linking: "`there's a creative`가 자연스럽게 이어집니다.",
          weakForm: "`of`는 `one of us` 안에서 거의 흐려집니다.",
          stress: '`witty`, `vivid`, `writer`, `emphasizes`, `creative spirit`에 힘이 실립니다.',
        },
        wrongReasons: [
          "`there's`를 `there is`로 풀어 쓰거나 apostrophe를 빼먹는 경우가 많습니다.",
          "`one of us`에서 `of`를 못 듣고 구조를 틀리는 경우가 많습니다.",
        ],
        shadowingTip: "`the writer emphasizes that there's`까지 끊어 읽고, 뒤 `a creative spirit in every one of us`를 한 번에 마무리합니다.",
        selfCheck: [
          "`there's`를 축약형 그대로 적을 수 있나요?",
          "`one of us`에서 `of`를 챙겼나요?",
          "`emphasizes` 철자를 끝까지 적을 수 있나요?",
        ],
      },
      fullMeaning: {
        literal: '재치 있고 생생한 삽화와 함께, 작가는 우리 모두 안에 창의적인 정신이 있다는 것을 강조합니다.',
        natural: '재치 있고 생생한 그림을 통해, 작가는 우리 모두 안에 창의성이 있다고 강조해요.',
        context: '작품의 주제 의식을 한 문장으로 정리하는 발표 마무리용 문장입니다.',
      },
      blanks: [
        createDictationBlankTemplate({
          tokenIndex: 9,
          answer: "there's",
          levels: ['low', 'normal', 'hard'],
          pos: 'there is 축약형',
          difficultyLevel: 2,
          basis: '축약형이라 apostrophe와 짧은 연결 소리를 함께 잡아야 합니다.',
          hints: {
            lv1: "there'_",
            lv2: '`a creative spirit` 앞의 축약형입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'theres', reason: 'apostrophe 누락' },
            { answer: 'there is', reason: '축약형 대신 풀어 씀' },
          ],
          notes: {
            easy: "`there's`는 '있다'를 짧게 말하는 축약형입니다.",
            role: "`a creative spirit`가 존재함을 말해 주는 핵심 축약형입니다.",
            listen: "`emphasizes that there's a creative spirit`를 통째로 듣고 `there's`를 잡습니다.",
            trap: "짧아서 `there`만 적거나 apostrophe를 빼먹기 쉽습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 16,
          answer: 'of',
          levels: ['normal', 'hard'],
          pos: '전치사 (one of us)',
          difficultyLevel: 2,
          basis: '짧고 약한 기능어지만 `one of us` 구조를 완성합니다.',
          hints: {
            lv1: 'o_',
            lv2: '`one` 뒤에서 우리 모두를 연결하는 전치사입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: '', reason: '약하게 들려 생략' },
            { answer: 'for', reason: '짧은 전치사 혼동' },
          ],
          notes: {
            easy: "`of`는 `one of us`처럼 전체 중 일부를 말할 때 쓰는 짧은 전치사입니다.",
            role: "`every one`과 `us`를 이어 주는 연결말입니다.",
            listen: "`every one of us`를 통째로 듣고 가운데 약한 소리를 챙깁니다.",
            trap: "앞뒤 단어가 익숙해 `of`만 통째로 빠지는 경우가 많습니다.",
          },
        }),
        createDictationBlankTemplate({
          tokenIndex: 7,
          answer: 'emphasizes',
          levels: ['hard'],
          pos: '일반동사 3인칭 단수 현재',
          difficultyLevel: 2,
          basis: '길고 철자가 까다로운 핵심 동사라 정확한 철자 자동화가 필요합니다.',
          hints: {
            lv1: 'empha____',
            lv2: '강조하다의 3인칭 단수형입니다.',
            lv3: null,
          },
          wrongPatterns: [
            { answer: 'emphasize', reason: '3인칭 단수 -s 누락' },
            { answer: 'emphasises', reason: '미국식/영국식 철자 혼동' },
          ],
          notes: {
            easy: "`emphasizes`는 작가가 무엇을 중요하다고 말하는지 보여 주는 핵심 동사입니다.",
            role: "`the writer` 뒤에서 메시지를 강조하는 중심 동사입니다.",
            listen: "`the writer emphasizes that` 흐름에서 `writer` 뒤에 이어지는 긴 동사를 잡습니다.",
            trap: "길이가 길고 z/s 철자 감각이 흔들려 자주 틀립니다.",
          },
        }),
      ],
    }),
  ],
};
