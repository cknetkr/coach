/* ── D-day ── */
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const dictTest = new Date(2026, 3, 27);
  const intTest  = new Date(2026, 5, 8);
  const dictText = (() => {
    const d = Math.ceil((dictTest - now) / 86400000);
    return d <= 0 ? '당일!' : d + '일 전';
  })();
  const intText = (() => {
    const d = Math.ceil((intTest - now) / 86400000);
    return d <= 0 ? '당일!' : d + '일 전';
  })();
  document.querySelectorAll('[data-eng-dday="dict"]').forEach((el) => {
    el.textContent = dictText;
  });
  document.querySelectorAll('[data-eng-dday="int"]').forEach((el) => {
    el.textContent = intText;
  });
  populateDictationVoices();
  updateSim();
});

/* ── 받아쓰기 데이터 ── */
const DICT_TOPICS = window.ENG_DICTATION_TOPICS || [
  {icon:'🎙️',num:'1과 P.13',title:'The Dot 그림책',desc:'잠재력과 창의성'},
  {icon:'📱',num:'1과 P.14',title:'5분 습관 루틴',desc:'joy journal · visualization'},
  {icon:'📰',num:'3과 P.57',title:'Ooho 현장 리포트',desc:'병 없는 물주머니'},
  {icon:'📢',num:'3과 P.58',title:'Act Now 캠페인',desc:'기후 행동 실천'},
  {icon:'⚖️',num:'4과 P.79',title:'잊힐 권리 토론',desc:'디지털 프라이버시'},
  {icon:'🎬',num:'4과 P.80',title:'가짜뉴스 판별',desc:'출처 · 근거 · 교차검증'},
  {icon:'💡',num:'5과 P.101',title:'헬리콥터 혁신 사례',desc:'전선 결빙 해결'},
  {icon:'🎨',num:'5과 P.102',title:'Erik Johansson',desc:'포토 콤비네이션'},
];
let selectedDictTopic = null, dictCount = 0;
const dictTTSState = {
  lines: [],
  currentIndex: -1,
  playingAll: false,
  pendingNextIndex: -1
};
let selectedDictLevel = 'normal';
let dictLineLevels = [];
let dictLineTTSSettings = [];
let dictPracticeMeta = [];
const DICT_LEVEL_LABELS = {
  easy: '쉬움',
  low: '하',
  normal: '중',
  hard: '상',
};

const DICT_SENTENCE_GUIDES = [
  { s:'Every child has a unique talent that is waiting to be discovered.', t:'모든 아이는 아직 발견되기를 기다리는 고유한 재능을 가지고 있다.', p:'unique · talent · waiting · discovered', m:'unique 발음, waiting의 t, discovered의 -ed를 자주 놓칩니다.', c:'has + 명사 + that 관계절 구조입니다. talent 뒤 설명절을 한 덩어리로 듣는 게 핵심입니다.' },
  { s:'The picture book shows that potential grows when we believe in ourselves.', t:'그 그림책은 우리가 자신을 믿을 때 잠재력이 자란다는 것을 보여 준다.', p:'picture · potential · grows · ourselves', m:'potential 철자와 grows의 s, ourselves의 강세를 자주 틀립니다.', c:'shows that 절 + when 절 구조입니다. 핵심 메시지와 조건절을 나눠 듣는 연습이 중요합니다.' },
  { s:'She reminded her students that failure is just the first step toward success.', t:'그녀는 학생들에게 실패가 성공을 향한 첫걸음일 뿐이라고 상기시켰다.', p:'reminded · failure · toward · success', m:'reminded의 -ed, failure의 ai 소리, toward의 약한 발음을 놓치기 쉽습니다.', c:'remind + 사람 + that 절 구조입니다. 수행평가 서술형 문장에서도 자주 쓰입니다.' },
  { s:'Spending just five minutes a day on a new habit can change your life.', t:'하루에 단 5분만 새로운 습관에 써도 삶이 달라질 수 있다.', p:'spending · minutes · habit · change', m:'Spending을 spend로, minutes의 복수 -s, habit의 h 발음을 자주 놓칩니다.', c:'동명사 주어 + can + 동사원형 구조입니다. Spending ... habit 전체가 주어입니다.' },
  { s:'He started his morning routine by writing three things he was grateful for.', t:'그는 감사한 세 가지를 적으며 아침 루틴을 시작했다.', p:'routine · writing · grateful · for', m:'routine 철자, writing의 묵음 t, grateful 철자를 많이 헷갈립니다.', c:'by + ing는 방법을 나타냅니다. how를 묻는 수행평가 답변에서 매우 자주 쓰는 패턴입니다.' },
  { s:'Small, consistent actions have a more powerful effect than occasional big efforts.', t:'작지만 꾸준한 행동은 가끔 하는 큰 노력보다 더 강한 효과를 낸다.', p:'consistent · powerful · effect · occasional', m:'consistent의 자음 반복, effect와 effort를 섞어 쓰는 실수가 많습니다.', c:'more powerful than 비교급 구문입니다. than 뒤 비교 대상을 같이 잡아야 합니다.' },
  { s:'Scientists have developed a biodegradable alternative to single-use plastic bottles.', t:'과학자들은 일회용 플라스틱 병을 대신할 생분해성 대안을 개발했다.', p:'scientists · developed · biodegradable · alternative', m:'scientists의 복수 자음군과 biodegradable의 긴 음절을 놓치기 쉽습니다.', c:'have developed 현재완료와 alternative to 표현을 묶어서 익혀 두면 좋습니다.' },
  { s:'The company replaced all its packaging with materials made from seaweed and cornstarch.', t:'그 회사는 모든 포장재를 해조류와 옥수수 전분으로 만든 재료로 바꾸었다.', p:'replaced · packaging · materials · cornstarch', m:'its와 it’s를 헷갈리거나 packaging의 g 소리를 자주 놓칩니다.', c:'replace A with B 구조입니다. made from은 재료를 설명하는 덧붙는 표현입니다.' },
  { s:'Reducing plastic waste requires both individual choices and government policy.', t:'플라스틱 쓰레기를 줄이려면 개인의 선택과 정부 정책이 모두 필요하다.', p:'reducing · requires · individual · policy', m:'requires의 s, individual의 음절 구분을 자주 놓칩니다.', c:'동명사 주어 + both A and B 병렬 구조입니다. 병렬을 통째로 잡아야 합니다.' },
  { s:'Young people around the world are taking action to protect the environment.', t:'전 세계의 젊은이들이 환경을 보호하기 위해 행동에 나서고 있다.', p:'around · action · protect · environment', m:'taking action을 끊어 듣거나 environment 철자를 자주 틀립니다.', c:'take action to 동사원형은 발표·캠페인 주제에서 꼭 알아야 하는 핵심 표현입니다.' },
  { s:'The campaign encourages everyone to make one small change starting today.', t:'그 캠페인은 모든 사람이 오늘부터 작은 변화 하나를 시작하도록 독려한다.', p:'campaign · encourages · everyone · starting', m:'encourages의 s, everyone을 every one으로 띄어 쓰는 실수가 많습니다.', c:'encourage + 사람 + to 동사원형 구조입니다. starting today는 뒤에서 보충 설명해 줍니다.' },
  { s:'Together, we can create a future where clean air and water are available for all.', t:'함께하면 모두를 위해 깨끗한 공기와 물이 제공되는 미래를 만들 수 있다.', p:'together · future · available · for all', m:'Together 뒤 쉼표, future의 ch 발음, available의 음절 수를 놓치기 쉽습니다.', c:'where 절이 future를 꾸미는 관계부사 구조입니다. 미래의 모습을 구체화할 때 자주 씁니다.' },
  { s:'Every worker deserves a safe environment and a fair wage for their labor.', t:'모든 노동자는 안전한 환경과 자신의 노동에 대한 정당한 임금을 받을 자격이 있다.', p:'worker · deserves · environment · labor', m:'deserves의 s, fair wage를 한 덩어리로 못 듣는 경우가 많습니다.', c:'deserve + 명사 구조와 a safe environment and a fair wage 병렬을 같이 들어야 합니다.' },
  { s:'The right to work with dignity should be protected by law in every country.', t:'존엄을 지키며 일할 권리는 모든 나라에서 법으로 보호되어야 한다.', p:'dignity · protected · law · country', m:'dignity의 g 소리, protected의 -ed, country의 tr 소리를 자주 놓칩니다.', c:'should be protected는 조동사 + 수동태입니다. 주장형 문장에서 자주 나옵니다.' },
  { s:'She argued that economic growth means nothing if workers cannot afford basic needs.', t:'그녀는 노동자들이 기본적인 필요를 감당할 수 없다면 경제성장은 아무 의미가 없다고 주장했다.', p:'argued · economic · afford · basic needs', m:'economic 강세, afford 발음, basic needs 묶음을 놓치기 쉽습니다.', c:'argued that 절 + if 절 구조입니다. 주장과 조건을 함께 말하는 고난도 패턴입니다.' },
  { s:'Always check the source before sharing information on social media.', t:'소셜 미디어에서 정보를 공유하기 전에 항상 출처를 확인해야 한다.', p:'source · sharing · information · social media', m:'source의 /sɔːrs/, sharing의 sh, information 철자를 자주 틀립니다.', c:'before + ing는 시간 순서를 말합니다. 지시문·조언문에서 꼭 알아둬야 합니다.' },
  { s:'Critical thinking is the most important skill for navigating the digital age.', t:'비판적 사고는 디지털 시대를 헤쳐 나가기 위한 가장 중요한 기술이다.', p:'critical · important · navigating · digital age', m:'critical의 t, navigating 철자, digital age 연결 발음을 놓치기 쉽습니다.', c:'the most important 최상급과 for + ing 목적 표현을 함께 잡아 두면 좋습니다.' },
  { s:'A single piece of misinformation can spread to millions of people within hours.', t:'단 하나의 허위 정보도 몇 시간 안에 수백만 명에게 퍼질 수 있다.', p:'single · misinformation · millions · within', m:'misinformation의 긴 단어 리듬과 millions의 복수형을 자주 놓칩니다.', c:'can spread to는 가능성과 방향을 함께 보여 주는 표현입니다. within hours도 자주 출제됩니다.' },
  { s:'The greatest innovations often come from questioning what everyone assumes to be true.', t:'가장 위대한 혁신은 종종 모두가 당연하다고 여기는 것을 의심하는 데서 나온다.', p:'greatest · innovations · questioning · assumes', m:'innovations의 복수, questioning의 tion 발음, assumes의 s를 자주 놓칩니다.', c:'come from + ing와 what 절이 함께 쓰인 문장입니다. 사고 전환형 표현의 핵심입니다.' },
  { s:'He transformed a simple observation about shadows into a groundbreaking invention.', t:'그는 그림자에 대한 단순한 관찰을 획기적인 발명으로 바꾸어 냈다.', p:'transformed · observation · shadows · groundbreaking', m:'transformed의 -ed, observation 철자, groundbreaking 같은 합성어를 자주 틀립니다.', c:'transform A into B 구조입니다. 아이디어를 결과물로 바꿀 때 쓰는 대표 표현입니다.' },
  { s:'Innovation is not just about technology — it is about solving human problems creatively.', t:'혁신은 단지 기술에 관한 것이 아니라 인간의 문제를 창의적으로 해결하는 데 관한 것이다.', p:'innovation · technology · solving · creatively', m:'technology와 creatively의 음절 수, not just about 리듬을 놓치기 쉽습니다.', c:'about + ing 표현과 대비 구조를 함께 익히면 발표문·면접 답변에 바로 써먹을 수 있습니다.' },
  { s:'Eriksson combines impossible scenes to challenge what we think photography can do.', t:'에릭손은 사진이 할 수 있다고 우리가 생각하는 한계를 흔들기 위해 불가능한 장면들을 결합한다.', p:'combines · impossible · challenge · photography', m:'combines의 s, impossible 강세, photography 철자를 자주 틀립니다.', c:'to challenge는 목적, what 절은 긴 목적어 역할을 합니다. 듣기에서 절 경계를 잘라 들어야 합니다.' },
  { s:'Each image tells a story that blurs the line between reality and imagination.', t:'각 이미지는 현실과 상상의 경계를 흐리는 이야기를 들려준다.', p:'image · story · blurs · imagination', m:'blurs의 r+s, reality와 imagination 철자를 동시에 놓치는 경우가 많습니다.', c:'that 관계절과 between A and B 병렬 구조를 함께 듣는 훈련이 중요합니다.' },
  { s:'Stand in front of the artwork and let your eyes travel from one detail to the next.', t:'작품 앞에 서서 시선이 한 디테일에서 다음 디테일로 이동하게 해 보라.', p:'artwork · travel · detail · next', m:'in front of를 묶어서 듣지 못하거나 detail 강세를 자주 틀립니다.', c:'명령문 + let + 목적어 + 동사원형 구조입니다. 오디오 가이드형 문장의 대표 패턴입니다.' },
];

const DICT_SUFFIX_GUIDES = [
  { x:', which is something we should all think about.', t:' 그리고 이는 우리 모두가 한 번쯤 생각해 봐야 할 문제다.', p:'which · something · think about', m:'which를 witch처럼 적거나 think about을 끊어 쓰는 실수가 많습니다.', c:'which가 앞문장 전체를 받아 의견을 덧붙이는 관계절입니다.' },
  { x:', and that belief has the power to transform entire communities.', t:' 그리고 그런 믿음은 공동체 전체를 바꿀 힘을 가진다.', p:'belief · power · transform · communities', m:'belief와 live를 헷갈리거나 communities의 복수형을 자주 놓칩니다.', c:'that belief가 앞내용을 한 번 더 명사화해서 이어 주는 패턴입니다.' },
  { x:', and it can make a real difference in everyday life.', t:' 그리고 그것은 일상에서 실제 변화를 만들어 낼 수 있다.', p:'difference · everyday · life', m:'difference 철자와 everyday를 every day로 잘못 적는 경우가 많습니다.', c:'make a real difference는 수행평가 영어 표현에서 아주 자주 쓰이는 핵심 숙어입니다.' },
  { x:', which is why many students find this topic meaningful.', t:' 그래서 많은 학생들이 이 주제를 의미 있게 느낀다.', p:'meaningful · students · topic', m:'meaningful 철자와 students의 ts 소리를 자주 놓칩니다.', c:'which is why는 앞문장의 결과를 설명하는 이유 연결 표현입니다.' },
];

const DICT_BLANK_EXPLANATIONS = {
  [normalizeDictationSentence("Today, I'd like to introduce The Dot by Peter Reynolds.")]: {
    "i'd": {
      whyBlank: "`I'd like to ...`는 발표·소개 시작문에서 통째로 쓰는 핵심 입구 표현이라 자주 빈칸으로 나옵니다. 여기서 `I'd`를 맞혀야 뒤의 `like to introduce`까지 한 덩어리로 따라갈 수 있습니다.",
      whyWrong: "`I'd`는 소리가 매우 짧게 붙어서 들립니다. 그래서 `I`, `I'll`, `I would`, `id`처럼 잘못 적기 쉽습니다. 특히 빠르게 들으면 d 소리가 약해서 그냥 `I`로 적는 실수가 많습니다.",
      coach: "이 문장은 `Today` / `I'd like to introduce` / `The Dot by Peter Reynolds` 세 덩어리입니다. 여기서는 두 번째 덩어리의 출발점인 `I'd`를 먼저 잡아야 합니다.",
    },
    "peter": {
      whyBlank: "`Peter Reynolds`는 책과 저자를 정확히 찍는 고유명사라 시험에서 빈칸 후보가 됩니다. 내용 이해보다 `누구 작품인지`를 정확히 들었는지를 보려는 자리입니다.",
      whyWrong: "`Peter`는 익숙한 이름이지만 실제 듣기에서는 뒤의 `Reynolds`와 붙어서 빨리 지나갑니다. 그래서 `better`, `writer`, `peter` 철자 누락처럼 흔들리기 쉽습니다.",
      coach: "문장 끝은 `The Dot` 다음에 `by + 저자 이름` 구조입니다. 즉 여기 빈칸은 설명이 아니라 저자 이름의 첫 덩어리를 듣는 자리입니다.",
    },
    "reynolds": {
      whyBlank: "`Reynolds`는 낯선 고유명사라서 교과서 원문을 정확히 들었는지 확인하기 좋은 자리입니다. 특히 `Peter Reynolds`를 한 세트로 기억했는지 보려는 빈칸입니다.",
      whyWrong: "익숙하지 않은 이름이라 음절을 놓치기 쉽고, `Reynolds`를 `Raynolds`, `Reynold`, `Reynolds.`처럼 틀리기 쉽습니다. 마지막 `-lds` 자음군도 자주 빠집니다.",
      coach: "문장 끝은 `by Peter Reynolds`로 끝납니다. `by` 뒤에는 설명이 아니라 사람 이름이 온다고 먼저 예상하면 훨씬 잘 들립니다.",
    },
  },
};

function getDictationWordCount(sentence) {
  return String(sentence || '').trim().split(/\s+/).filter(Boolean).length;
}

function getDictationSourceLines(topic) {
  const lines = Array.isArray(topic?.lines) ? topic.lines.filter(Boolean) : [];
  if (!lines.length) return [];
  return lines;
}

function normalizeDictationBlank(text) {
  return normalizeDictationSentence(text).replace(/[^a-z0-9-]/g, '');
}

function splitDictationToken(token) {
  const match = String(token).match(/^([^A-Za-z]*)([A-Za-z]+(?:[-'][A-Za-z]+)*)([^A-Za-z]*)$/);
  if (!match) {
    return { prefix: '', core: '', suffix: '', raw: token };
  }
  return {
    prefix: match[1],
    core: match[2],
    suffix: match[3],
    raw: token,
  };
}

function getDictationBlankQuota(level, eligibleCount) {
  if (level === 'easy') return 0;
  if (level === 'low') return Math.min(1, eligibleCount);
  if (level === 'normal') return Math.min(2, eligibleCount);
  return Math.min(Math.max(3, Math.ceil(eligibleCount / 4)), 4, eligibleCount);
}

function selectDictationBlankIndices(tokens, level) {
  const stopwords = new Set([
    'the', 'and', 'that', 'with', 'from', 'into', 'your', 'they', 'them', 'this', 'will', 'have',
    'been', 'were', 'just', 'than', 'when', 'what', 'about', 'their', 'there', 'where', 'while',
    'which', 'because', 'would', 'could', 'should', 'after', 'before', 'around', 'every', 'other',
  ]);
  const primary = tokens
    .map((token, index) => ({ ...token, index }))
    .filter((token) => token.core && token.core.length >= 4 && !stopwords.has(token.core.toLowerCase()) && indexIsBlankable(token.index, tokens.length));
  const secondary = tokens
    .map((token, index) => ({ ...token, index }))
    .filter((token) => token.core && token.core.length >= 3 && indexIsBlankable(token.index, tokens.length));
  const eligible = primary.length ? primary : secondary;
  const quota = getDictationBlankQuota(level, eligible.length);
  if (!quota) return [];

  const selected = [];
  const step = eligible.length / quota;
  for (let i = 0; i < quota; i += 1) {
    const pick = eligible[Math.min(eligible.length - 1, Math.floor((i + 0.5) * step))];
    if (pick && !selected.includes(pick.index)) selected.push(pick.index);
  }
  return selected.sort((a, b) => a - b);
}

function indexIsBlankable(index, length) {
  if (length <= 4) return index > 0 && index < length - 1;
  return index > 0 && index < length - 1;
}

function buildDictationPracticeMeta(line, level) {
  const tokens = String(line || '').split(/\s+/).map(splitDictationToken);
  const blankIndices = selectDictationBlankIndices(tokens, level);
  const blanks = [];
  const html = tokens.map((token, tokenIndex) => {
    if (!blankIndices.includes(tokenIndex) || !token.core) {
      return escapeHtml(token.raw);
    }
    const blankId = blanks.length;
    blanks.push({
      tokenIndex,
      answer: token.core,
      normalizedAnswer: normalizeDictationBlank(token.core),
      display: `${token.prefix}${token.core}${token.suffix}`,
      explanation: getDictationBlankExplanation(line, token.core, tokenIndex, tokens),
    });
    return `${escapeHtml(token.prefix)}<span class="dict-cloze-blank" data-blank-index="${blankId}"><span class="dict-cloze-blank__text">${'_'.repeat(Math.max(token.core.length, 4))}</span></span>${escapeHtml(token.suffix)}`;
  }).join(' ');

  return {
    line,
    level,
    blanks,
    previewHtml: html,
    isStudyMode: level === 'easy' || !blanks.length,
  };
}

function getDictationBlankExplanation(line, answer, tokenIndex, tokens) {
  const normalizedSentence = normalizeDictationSentence(line);
  const normalizedAnswer = normalizeDictationBlank(answer);
  const manual = DICT_BLANK_EXPLANATIONS[normalizedSentence]?.[normalizedAnswer];
  if (manual) return manual;

  const lower = String(answer || '').toLowerCase();
  const prevCore = tokens[tokenIndex - 1]?.core || '';
  const nextCore = tokens[tokenIndex + 1]?.core || '';
  const startsWithUpper = /^[A-Z]/.test(String(answer || ''));
  const endsWithEd = /ed$/i.test(lower);
  const endsWithIng = /ing$/i.test(lower);
  const isContraction = /'/.test(String(answer || ''));

  if (isContraction) {
    return {
      whyBlank: `\`${answer}\`는 문장 리듬을 결정하는 축약형이라 시험에서 잘 뚫립니다. 축약형을 맞혀야 뒤에 붙는 핵심 동작까지 자연스럽게 이어집니다.`,
      whyWrong: `축약형은 소리가 짧고 약하게 지나가서 그냥 다른 단어로 듣거나 아예 놓치기 쉽습니다. 특히 apostrophe가 빠지거나 원형으로 잘못 적는 실수가 많습니다.`,
      coach: `이 자리는 문장 뼈대를 여는 짧은 기능어입니다. 앞뒤 단어를 따로 듣기보다 \`${answer}\`를 한 덩어리 리듬으로 외우는 것이 빠릅니다.`,
    };
  }

  if (startsWithUpper) {
    return {
      whyBlank: `\`${answer}\`는 고유명사라 내용 이해보다 정확한 청취를 확인하기 좋은 자리입니다. 책 제목, 인물 이름, 지명 같은 정보는 시험에서 자주 빈칸으로 나옵니다.`,
      whyWrong: `익숙하지 않은 이름은 소리만 듣고 철자를 추측하게 되므로 오탈자가 자주 납니다. 특히 첫 음절만 듣고 비슷한 철자로 적거나 끝 자음을 빼먹기 쉽습니다.`,
      coach: `이 위치는 설명 문장이 아니라 이름 정보가 들어가는 자리입니다. 앞뒤에 붙은 단서를 보고 \`${prevCore} + ${answer} + ${nextCore}\` 같은 이름 덩어리로 먼저 예상하세요.`,
    };
  }

  if (endsWithEd) {
    return {
      whyBlank: `\`${answer}\`는 동사의 완료형·과거형 흔적이 살아 있는 자리라 문장 핵심 동작을 제대로 들었는지 보기 좋습니다.`,
      whyWrong: `-ed는 실제 발음이 약해지기 쉬워서 기본형으로 적거나 끝소리를 빼먹는 실수가 많습니다. 듣기에서는 핵심 동사 자체보다 어미가 더 잘 날아갑니다.`,
      coach: `이 자리는 문장의 행동을 말하는 핵심 동사입니다. 주어 다음에 어떤 일이 일어났는지 잡는 자리라고 생각하면 더 잘 들립니다.`,
    };
  }

  if (endsWithIng) {
    return {
      whyBlank: `\`${answer}\`는 진행·동명사 느낌을 가진 단어라 문장 구조를 이해했는지 확인하기 좋은 자리입니다.`,
      whyWrong: `-ing는 코로 울리듯 지나가서 g를 놓치거나 기본형으로 적는 경우가 많습니다. 특히 앞단어와 이어 들리면 단어 경계가 흐려집니다.`,
      coach: `이 단어는 문장을 설명하는 움직임 덩어리입니다. 앞뒤를 끊지 말고 \`${prevCore} ${answer} ${nextCore}\` 리듬으로 같이 잡으세요.`,
    };
  }

  return {
    whyBlank: `\`${answer}\`는 이 문장에서 의미를 실제로 끌고 가는 핵심 단어라 빈칸으로 뚫기 좋습니다. 앞뒤가 다 보여도 이 단어를 못 들으면 문장 중심이 무너집니다.`,
    whyWrong: `이 자리는 소리만 듣고 얼핏 넘어가면 비슷한 단어로 착각하기 쉽습니다. 특히 철자 하나 차이, 복수형, 시제 흔적을 같이 놓치는 경우가 많습니다.`,
    coach: `문장을 통째로 외우려 하지 말고 \`${prevCore || '앞'} → ${answer} → ${nextCore || '뒤'}\` 흐름으로 잡으세요. 이 빈칸은 그중 가운데 핵심 덩어리입니다.`,
  };
}

function normalizeDictationSentence(text) {
  return String(text || '')
    .replace(/[’']/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/[“”"'`]/g, '')
    .trim()
    .toLowerCase();
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getDictationGuide(sentence) {
  let base = String(sentence || '').trim();
  const extras = [];
  for (const guide of DICT_SUFFIX_GUIDES) {
    if (base.endsWith(guide.x)) {
      base = base.slice(0, -guide.x.length).trim();
      extras.push(guide);
      break;
    }
  }
  const baseGuide = DICT_SENTENCE_GUIDES.find((guide) => normalizeDictationSentence(guide.s) === normalizeDictationSentence(base));
  if (!baseGuide) {
    return {
      t: '문장 전체 의미를 먼저 잡고, 핵심 동사와 연결 표현을 분리해서 들으세요.',
      p: '핵심 동사 · 복수형 -s · 전치사 묶음 · 관계절 시작어',
      m: '긴 문장은 복수형 -s, 관계절, 전치사 덩어리를 자주 놓칩니다.',
      c: '주어, 핵심 동사, 보충 설명절을 세 덩어리로 나눠 듣는 것이 핵심입니다.',
    };
  }
  return {
    t: [baseGuide.t, ...extras.map((item) => item.t)].join(''),
    p: [baseGuide.p, ...extras.map((item) => item.p)].filter(Boolean).join(' · '),
    m: [baseGuide.m, ...extras.map((item) => item.m)].filter(Boolean).join(' '),
    c: [baseGuide.c, ...extras.map((item) => item.c)].filter(Boolean).join(' '),
  };
}

function supportsDictationTTS() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function setDictationTTSStatus(message, tone = '') {
  const el = document.getElementById('dict-tts-status');
  if (!el) return;
  el.textContent = message;
  el.className = `dict-tts-status${tone ? ` ${tone}` : ''}`;
}

function getEnglishDictationVoices() {
  if (!supportsDictationTTS()) return [];
  return window.speechSynthesis.getVoices()
    .filter((voice) => /^en(-|_)/i.test(voice.lang) || /English/i.test(voice.name));
}

function ensureDictationLineTTSSettings() {
  dictLineTTSSettings = dictTTSState.lines.map((_, index) => ({
    rate: Number(dictLineTTSSettings[index]?.rate) || 0.9,
    voiceName: dictLineTTSSettings[index]?.voiceName || '',
  }));
}

function getDictationLineTTSSetting(index) {
  return dictLineTTSSettings[index] || { rate: 0.9, voiceName: '' };
}

function populateDictationVoices() {
  if (!supportsDictationTTS()) {
    setDictationTTSStatus('이 브라우저는 TTS 미지원', 'warn');
    return;
  }
  const voices = getEnglishDictationVoices();
  document.querySelectorAll('.dict-line-voice-select').forEach((select) => {
    const lineIndex = Number(select.dataset.lineIndex);
    const current = dictLineTTSSettings[lineIndex]?.voiceName || '';
    select.innerHTML = '<option value="">기본 음성</option>' + voices.map((voice) => (
      `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
    )).join('');
    if (voices.some((voice) => voice.name === current)) {
      select.value = current;
    } else {
      select.value = '';
    }
  });
  if (!voices.length) {
    setDictationTTSStatus('영어 음성 로딩 중', 'warn');
  } else if (!dictTTSState.lines.length) {
    setDictationTTSStatus('스크립트 생성 후 듣기 가능');
  }
}

if (supportsDictationTTS()) {
  window.speechSynthesis.onvoiceschanged = populateDictationVoices;
}

function getDictationVoice(voiceName = '') {
  if (!supportsDictationTTS()) return null;
  if (!voiceName) return null;
  return window.speechSynthesis.getVoices().find((voice) => voice.name === voiceName) || null;
}

function parseDictationLines(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

function highlightDictationLineButton(index) {
  document.querySelectorAll('#dict-tts-line-buttons .dict-tts-line-btn').forEach((button, buttonIndex) => {
    button.classList.toggle('active', buttonIndex === index);
  });
  document.querySelectorAll('#dict-practice-list .dict-practice-card').forEach((card, cardIndex) => {
    card.classList.toggle('active', cardIndex === index);
  });
}

function focusDictationSentence(index, behavior = 'smooth') {
  const card = document.getElementById(`dict-card-${index}`);
  if (!card) return;
  dictTTSState.currentIndex = index;
  highlightDictationLineButton(index);
  card.scrollIntoView({ behavior, block: 'start' });
  setDictationTTSStatus(`문장 ${index + 1} 선택됨`, 'active');
}

function renderDictationLineButtons() {
  const container = document.getElementById('dict-tts-line-buttons');
  if (!container) return;
  if (!dictTTSState.lines.length) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = dictTTSState.lines.map((_, index) => (
    `<button type="button" class="dict-tts-line-btn" onclick="focusDictationSentence(${index})">문장 ${index + 1}</button>`
  )).join('');
  highlightDictationLineButton(dictTTSState.currentIndex);
}

function renderDictationPracticeCards() {
  const container = document.getElementById('dict-practice-list');
  if (!container) return;
  if (!dictTTSState.lines.length) {
    container.innerHTML = '';
    return;
  }
  ensureDictationLineTTSSettings();
  dictPracticeMeta = dictTTSState.lines.map((line, index) => buildDictationPracticeMeta(line, dictLineLevels[index] || selectedDictLevel));
  container.innerHTML = dictPracticeMeta.map((meta, index) => {
    const line = meta.line;
    const guide = getDictationGuide(line);
    const blankCountLabel = meta.isStudyMode ? '전체 공개' : `빈칸 ${meta.blanks.length}개`;
    const ttsSetting = getDictationLineTTSSetting(index);
    return `
      <article class="dict-practice-card" id="dict-card-${index}">
        <div class="dict-practice-head">
          <div>
            <div class="dict-practice-meta">
              <span class="dict-practice-step">문장 ${index + 1}</span>
              <span class="dict-difficulty-chip subtle">${blankCountLabel}</span>
              <div class="dict-level-switch">
                ${Object.entries(DICT_LEVEL_LABELS).map(([levelKey, label]) => `
                  <button type="button" class="dict-level-pill${meta.level === levelKey ? ' active' : ''}" onclick="setDictationLineLevel(${index}, '${levelKey}')">${label}</button>
                `).join('')}
              </div>
            </div>
            <div class="dict-practice-sub">한 번 듣고 빈칸만 채우기. 필요하면 같은 문장을 다시 듣고 정답을 확인하세요.</div>
          </div>
          <div class="dict-practice-actions">
            <button class="btn-secondary" type="button" onclick="playDictationSentence(${index})">🔊 문장 듣기</button>
            <button class="btn-secondary dict-answer-toggle" id="dict-answer-toggle-${index}" type="button" onclick="revealDictationAnswer(${index})">
              <span id="dict-answer-toggle-label-${index}">정답 보기</span>
            </button>
          </div>
        </div>
        <div class="dict-card-tts-controls">
          <label class="dict-card-tts-option">
            <span>속도</span>
            <input type="range" min="0.7" max="1.2" step="0.1" value="${ttsSetting.rate.toFixed(1)}" oninput="setDictationLineRate(${index}, this.value)">
            <strong id="dict-line-rate-label-${index}">${ttsSetting.rate.toFixed(1)}x</strong>
          </label>
          <label class="dict-card-tts-option dict-card-tts-option--voice">
            <span>음성</span>
            <select class="field-input dict-line-voice-select" data-line-index="${index}" onchange="setDictationLineVoice(${index}, this.value)">
              <option value="">기본 음성</option>
            </select>
          </label>
        </div>
        <div class="dict-cloze-line">${meta.previewHtml}</div>
        <div class="dict-answer-sheet dict-answer-sheet--inline" id="dict-answer-sheet-${index}" hidden>
          <div class="dict-coach-tag">정답 스크립트</div>
          <div class="dict-answer-text">${escapeHtml(`${index + 1}. ${line}`)}</div>
        </div>
        ${meta.isStudyMode ? `
          <div class="dict-cloze-note">쉬움 난이도는 전체 문장을 공개합니다. 먼저 흐름과 의미를 익힌 뒤 하·중·상으로 올리세요.</div>
        ` : `
          <div class="dict-cloze-answer-grid">
            ${meta.blanks.map((blank, blankIndex) => `
              <label class="dict-answer-field" for="dict-answer-${index}-${blankIndex}">
                <span class="dict-answer-label">빈칸 ${blankIndex + 1}</span>
                <input class="field-input dict-answer-inline" id="dict-answer-${index}-${blankIndex}" type="text" placeholder="정답 입력">
              </label>
            `).join('')}
          </div>
          <div class="dict-blank-guide-list">
            ${meta.blanks.map((blank, blankIndex) => `
              <div class="dict-blank-guide-card">
                <div class="dict-coach-tag">빈칸 ${blankIndex + 1} — ${escapeHtml(blank.answer)}</div>
                <p><strong>왜 여기 뚫렸나:</strong> ${escapeHtml(blank.explanation.whyBlank)}</p>
                <p><strong>왜 자주 틀리나:</strong> ${escapeHtml(blank.explanation.whyWrong)}</p>
                <p><strong>1타 해설:</strong> ${escapeHtml(blank.explanation.coach)}</p>
              </div>
            `).join('')}
          </div>
        `}
        <div class="dict-coach-grid">
          <div class="dict-coach-block">
            <div class="dict-coach-tag">전체 해석</div>
            <p>${escapeHtml(guide.t)}</p>
          </div>
          <div class="dict-coach-block">
            <div class="dict-coach-tag">발음 주의</div>
            <p>${escapeHtml(guide.p)}</p>
          </div>
          <div class="dict-coach-block">
            <div class="dict-coach-tag">많이 놓치는 포인트</div>
            <p>${escapeHtml(guide.m)}</p>
          </div>
          <div class="dict-coach-block">
            <div class="dict-coach-tag">1타 강사 핵심개념</div>
            <p>${escapeHtml(guide.c)}</p>
          </div>
        </div>
      </article>
    `;
  }).join('');
  populateDictationVoices();
  highlightDictationLineButton(dictTTSState.currentIndex);
}

function syncDictationTTSFromScript() {
  const scriptText = document.getElementById('dict-script')?.textContent || '';
  dictTTSState.lines = parseDictationLines(scriptText);
  dictTTSState.currentIndex = -1;
  dictTTSState.playingAll = false;
  dictTTSState.pendingNextIndex = dictTTSState.lines.length ? 0 : -1;
  ensureDictationLineTTSSettings();
  renderDictationLineButtons();
  renderDictationPracticeCards();
  if (!supportsDictationTTS()) {
    setDictationTTSStatus('이 브라우저는 TTS 미지원', 'warn');
    return;
  }
  if (!dictTTSState.lines.length) {
    setDictationTTSStatus('스크립트 생성 후 듣기 가능');
    return;
  }
  setDictationTTSStatus(`TTS 준비 · ${dictTTSState.lines.length}문장`, 'active');
}

function stopDictationTTS(options = {}) {
  if (!supportsDictationTTS()) return;
  const { preserveStatus = false } = options;
  window.speechSynthesis.cancel();
  dictTTSState.currentIndex = -1;
  dictTTSState.playingAll = false;
  dictTTSState.pendingNextIndex = dictTTSState.lines.length ? 0 : -1;
  highlightDictationLineButton(-1);
  if (!preserveStatus) {
    setDictationTTSStatus(
      dictTTSState.lines.length ? '정지됨 · 문장 선택 가능' : '스크립트 생성 후 듣기 가능'
    );
  }
}

function createDictationUtterance(text, index) {
  const utterance = new SpeechSynthesisUtterance(text);
  const setting = getDictationLineTTSSetting(index);
  const selectedVoice = getDictationVoice(setting.voiceName);
  utterance.lang = selectedVoice?.lang || 'en-US';
  utterance.rate = Number(setting.rate) || 0.9;
  utterance.pitch = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onstart = () => {
    dictTTSState.currentIndex = index;
    highlightDictationLineButton(index);
    setDictationTTSStatus(`문장 ${index + 1} 재생 중`, 'active');
  };
  utterance.onend = () => {
    dictTTSState.currentIndex = index;
    dictTTSState.pendingNextIndex = index < dictTTSState.lines.length - 1 ? index + 1 : -1;
    dictTTSState.playingAll = dictTTSState.pendingNextIndex >= 0;
    highlightDictationLineButton(index);
    setDictationTTSStatus(
      dictTTSState.pendingNextIndex >= 0
        ? `문장 ${index + 1} 완료 · 답안 입력`
        : `마지막 문장 완료`,
      'active'
    );
  };
  utterance.onerror = () => {
    dictTTSState.currentIndex = -1;
    dictTTSState.playingAll = false;
    dictTTSState.pendingNextIndex = index < dictTTSState.lines.length - 1 ? index + 1 : -1;
    highlightDictationLineButton(-1);
    setDictationTTSStatus('TTS 오류 · 다시 시도', 'warn');
  };
  return utterance;
}

function setDictationLineRate(index, value) {
  ensureDictationLineTTSSettings();
  const rate = Number(value) || 0.9;
  dictLineTTSSettings[index] = {
    ...getDictationLineTTSSetting(index),
    rate,
  };
  const label = document.getElementById(`dict-line-rate-label-${index}`);
  if (label) label.textContent = `${rate.toFixed(1)}x`;
}

function setDictationLineVoice(index, value) {
  ensureDictationLineTTSSettings();
  dictLineTTSSettings[index] = {
    ...getDictationLineTTSSetting(index),
    voiceName: value || '',
  };
}

(function renderDictTopics() {
  const grid = document.getElementById('topic-grid');
  if (!grid) return;
  grid.innerHTML = DICT_TOPICS.map((t,i) => `
    <div class="topic-card" id="dtc-${i}" onclick="selectDictTopic(${i})">
      <div class="topic-icon">${t.icon}</div>
      <div class="topic-num">${t.num}</div>
      <div class="topic-title">${t.title}</div>
      <div class="topic-desc">${t.desc}</div>
    </div>
  `).join('');
})();
function selectDictTopic(idx) {
  document.querySelectorAll('#topic-grid .topic-card').forEach((c,i) => c.classList.toggle('selected', i===idx));
  selectedDictTopic = DICT_TOPICS[idx];
  refreshDictationView();
}

function resetDictationFeedback() {
  const feedback = document.getElementById('dict-feedback');
  if (!feedback) return;
  feedback.textContent = '빈칸을 채운 뒤 자동 채점을 실행하십시오.';
  feedback.classList.remove('has-content');
}

function refreshDictationView() {
  if (!selectedDictTopic) return;
  const el = document.getElementById('dict-script');
  const box = document.getElementById('dict-script-box');
  if (!el || !box) return;
  stopDictationTTS({ preserveStatus: true });
  const sourceLines = getDictationSourceLines(selectedDictTopic);
  dictLineLevels = sourceLines.map((_, index) => dictLineLevels[index] || selectedDictLevel);
  el.textContent = sourceLines.map((line, index) => `${index + 1}. ${line}`).join('\n');
  box.style.display = sourceLines.length ? 'block' : 'none';
  syncDictationTTSFromScript();
  resetDictationFeedback();
}

function setDictationLineLevel(index, level) {
  dictLineLevels[index] = level;
  renderDictationPracticeCards();
  resetDictationFeedback();
}

async function generateDictation() {
  if (!selectedDictTopic) { showToast('주제를 먼저 선택하십시오'); return; }
  const el = document.getElementById('dict-script');
  const box = document.getElementById('dict-script-box');
  stopDictationTTS({ preserveStatus: true });
  box.style.display = 'block';
  const sourceLines = getDictationSourceLines(selectedDictTopic);
  if (sourceLines.length) {
    el.textContent = sourceLines.map((line, index) => `${index + 1}. ${line}`).join('\n');
    syncDictationTTSFromScript();
    showToast(`${selectedDictTopic.source || selectedDictTopic.title} 스크립트를 불러왔습니다.`);
    return;
  }
  const sys = `당신은 영어 수행평가 받아쓰기 연습 전문가입니다. 고등학교 2학년 수준(CEFR B1~B2)의 받아쓰기 연습 문장을 생성하십시오.`;
  const usr = `주제: ${selectedDictTopic.title} (${selectedDictTopic.desc})\n\n요구사항:\n- 각 문장은 번호(1. 2. 3...)를 붙여 한 줄씩 출력\n- 자연스러운 영어 구어체\n- 한국어 번역 포함 금지\n- 문장만 출력`;
  await callClaude(sys, usr, el);
  syncDictationTTSFromScript();
}

function playDictationAll() {
  if (!dictTTSState.lines.length) { showToast('먼저 받아쓰기 스크립트를 생성하십시오'); return; }
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  stopDictationTTS({ preserveStatus: true });
  dictTTSState.playingAll = true;
  dictTTSState.pendingNextIndex = 0;
  window.speechSynthesis.speak(createDictationUtterance(dictTTSState.lines[0], 0));
}

function playDictationSentence(index) {
  if (!dictTTSState.lines[index]) { showToast('해당 문장을 찾을 수 없습니다'); return; }
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  stopDictationTTS({ preserveStatus: true });
  dictTTSState.playingAll = false;
  dictTTSState.pendingNextIndex = index < dictTTSState.lines.length - 1 ? index + 1 : -1;
  window.speechSynthesis.speak(createDictationUtterance(dictTTSState.lines[index], index));
}

function playNextDictationSentence() {
  if (!dictTTSState.lines.length) { showToast('먼저 받아쓰기 스크립트를 생성하십시오'); return; }
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) { showToast('현재 문장이 재생 중입니다'); return; }
  const nextIndex = dictTTSState.pendingNextIndex >= 0 ? dictTTSState.pendingNextIndex : 0;
  if (!dictTTSState.lines[nextIndex]) { showToast('다음 문장이 없습니다'); return; }
  stopDictationTTS({ preserveStatus: true });
  dictTTSState.playingAll = true;
  dictTTSState.pendingNextIndex = nextIndex;
  window.speechSynthesis.speak(createDictationUtterance(dictTTSState.lines[nextIndex], nextIndex));
}

function pauseDictationTTS() {
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  if (!window.speechSynthesis.speaking || window.speechSynthesis.paused) { showToast('현재 재생 중인 음성이 없습니다'); return; }
  window.speechSynthesis.pause();
  setDictationTTSStatus('일시정지 · 이어듣기 가능', 'warn');
}

function resumeDictationTTS() {
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  if (!window.speechSynthesis.paused) { showToast('이어들을 음성이 없습니다'); return; }
  window.speechSynthesis.resume();
  setDictationTTSStatus(
    dictTTSState.currentIndex >= 0 ? `문장 ${dictTTSState.currentIndex + 1} 재생 중` : '재생 중',
    'active'
  );
}

function revealDictationAnswer(index) {
  const sheet = document.getElementById(`dict-answer-sheet-${index}`);
  const toggle = document.getElementById(`dict-answer-toggle-${index}`);
  const label = document.getElementById(`dict-answer-toggle-label-${index}`);
  if (!sheet || !toggle || !label) return;
  sheet.hidden = false;
  toggle.disabled = true;
  toggle.classList.add('is-done');
  label.textContent = '정답 표시됨';
}

function getDictationAnswerValues() {
  return dictPracticeMeta.map((meta, lineIndex) => (
    meta.blanks.map((_, blankIndex) => document.getElementById(`dict-answer-${lineIndex}-${blankIndex}`)?.value.trim() || '')
  ));
}

function buildDictationLocalReview(lines, answers) {
  const rows = lines.map((_, index) => {
    const meta = dictPracticeMeta[index];
    const answerSet = answers[index] || [];
    if (!meta || meta.isStudyMode) return `문장 ${index + 1}: 쉬움 난이도는 전체 문장 공개 모드입니다.`;
    if (!answerSet.some(Boolean)) return `문장 ${index + 1}: 아직 빈칸 답안을 입력하지 않았습니다.`;
    const correct = meta.blanks.filter((blank, blankIndex) => normalizeDictationBlank(answerSet[blankIndex]) === blank.normalizedAnswer).length;
    const total = meta.blanks.length;
    const accuracy = total ? Math.round((correct / total) * 100) : 0;
    return `문장 ${index + 1}: ${accuracy}% 일치 · ${correct}/${total}개 빈칸 정답`;
  });
  return `[문장별 빠른 체크]\n${rows.join('\n')}`;
}
async function gradeDictation() {
  const script = dictTTSState.lines.map((line, index) => `${index + 1}. ${line}`).join('\n');
  const answers = getDictationAnswerValues();
  const answerPayload = dictPracticeMeta.map((meta, index) => {
    if (!meta || meta.isStudyMode) return `문장 ${index + 1}: 쉬움 난이도(전체 공개)`;
    return `문장 ${index + 1}\n${meta.blanks.map((blank, blankIndex) => `- 빈칸 ${blankIndex + 1}: 정답=${blank.answer} | 학생답=${answers[index]?.[blankIndex] || '(미입력)'}`).join('\n')}`;
  }).join('\n\n');
  const el = document.getElementById('dict-feedback');
  if (dictPracticeMeta.every((meta) => meta.isStudyMode)) {
    showToast('쉬움 난이도는 전체 공개 모드입니다. 하·중·상에서 빈칸 채점을 사용하십시오');
    return;
  }
  if (!answers.flat().some(Boolean)) { showToast('빈칸 답안을 먼저 입력하십시오'); return; }
  if (!script || script==='분석 중...') { showToast('먼저 스크립트를 생성하십시오'); return; }
  const sys = `당신은 영어 받아쓰기 빈칸 시험 채점 전문가입니다. 원문과 학생의 빈칸 답안을 비교하여:\n[정확도]: 빈칸 기준 정답 비율\n[오류 목록]: 빈칸별 오답 (정답|학생답 형식)\n[유형 분석]: 철자 오류/활용형 오류/복수형·시제 오류/구두점 포함 여부\n[반복 훈련 포인트]: 가장 많이 틀린 유형과 교정 방법`;
  const aiText = await callClaude(sys, `원문:\n${script}\n\n학생 빈칸 답안:\n${answerPayload}`, el);
  el.textContent = `${buildDictationLocalReview(dictTTSState.lines, answers)}\n\n${aiText}`;
}
function clearDictation() {
  stopDictationTTS({ preserveStatus: true });
  dictPracticeMeta.forEach((meta, index) => {
    meta.blanks.forEach((_, blankIndex) => {
      const input = document.getElementById(`dict-answer-${index}-${blankIndex}`);
      if (input) input.value = '';
    });
    const sheet = document.getElementById(`dict-answer-sheet-${index}`);
    if (sheet) sheet.hidden = true;
    const toggle = document.getElementById(`dict-answer-toggle-${index}`);
    if (toggle) {
      toggle.disabled = false;
      toggle.classList.remove('is-done');
    }
    const label = document.getElementById(`dict-answer-toggle-label-${index}`);
    if (label) label.textContent = '정답 보기';
  });
  const fb = document.getElementById('dict-feedback');
  fb.textContent = '스크립트를 불러오고 받아쓰기 후 채점을 실행하십시오.';
  fb.classList.remove('has-content');
}
function dictCountUp() {
  dictCount++;
  document.getElementById('dict-count-display').textContent = dictCount;
  showToast(`${dictCount}회 완료!`);
}

/* ── 문장완성 ── */
const SENTENCE_SAMPLES = [
  {
    label: '예시 1',
    title: '친환경 기술의 필요성',
    summary: '이유 1개 + 예시 1개가 반드시 보이는 유형',
    prompt: 'Complete the paragraph in 4 to 5 sentences. Explain why eco-friendly technology is important for our future. Include one clear reason and one example.',
    guideTitle: '질문에 직접 답하고 because + For example 구조를 분명히 보이게 쓰는 문제입니다.',
    points: [
      '첫 문장에서 eco-friendly technology가 왜 중요한지 바로 답하십시오.',
      '둘째 문장에는 because로 이유를 붙이고, 셋째 문장에는 For example로 사례를 넣으십시오.',
      '마지막 문장은 Therefore로 짧게 정리하면 안정적입니다.',
    ],
    phrases: ['I believe ... is important', 'This is because ...', 'For example, ...', 'Therefore, ...'],
    sampleNote: '보통 1문제 기준으로 이렇게 4~5문장 정도 쓰면 충분합니다.',
  },
  {
    label: '예시 2',
    title: '하루 5분 습관',
    summary: '짧은 습관이 왜 삶을 바꾸는지 설명하는 유형',
    prompt: 'Write 4 to 5 sentences about a small daily habit that can improve your life. State your opinion, give a reason, and include a simple example from daily life.',
    guideTitle: '거창한 이야기보다 내 생활과 연결된 예시를 한 문장 넣는 것이 핵심입니다.',
    points: [
      '첫 문장은 small daily habit에 대한 내 의견으로 시작하십시오.',
      '이유는 productivity, health, confidence 같은 쉬운 단어로 써도 충분합니다.',
      '예시는 waking up early, reading for five minutes, writing a to-do list처럼 구체적으로 넣으십시오.',
    ],
    phrases: ['I think a small habit can ...', 'It helps me ... because ...', 'For example, ...', 'As a result, ...'],
    sampleNote: '생활 예시는 길게 쓰지 말고 한 문장만 넣어도 내용 점수를 챙길 수 있습니다.',
  },
  {
    label: '예시 3',
    title: '가짜뉴스 확인의 중요성',
    summary: '의견 + 검증 방법 + 사례를 쓰는 정보 리터러시 유형',
    prompt: 'Complete the response in 4 to 5 sentences. Explain why checking information before sharing it online is important. Include one reason and one realistic example.',
    guideTitle: '온라인 정보 공유 전 검증의 필요성을 묻는 문제라서, reason과 realistic example이 둘 다 있어야 합니다.',
    points: [
      '첫 문장에서 checking information is important라고 직접 답하십시오.',
      '이유는 misinformation spreads quickly 같은 표현으로 짧게 정리하면 됩니다.',
      '예시는 social media, fake news, wrong information 중 하나와 연결해 구체화하십시오.',
    ],
    phrases: ['It is important to check ...', 'This is because ...', 'For instance, ...', 'That is why ...'],
    sampleNote: '이 유형은 정답 표현 하나를 찾는 문제가 아니라, 직접 답하고 이유를 설명하는 문제입니다.',
  },
];

function renderSentenceSamples() {
  const grid = document.getElementById('sent-sample-grid');
  if (!grid) return;
  grid.innerHTML = SENTENCE_SAMPLES.map((sample, index) => `
    <button type="button" class="sent-sample-card" id="sent-sample-${index}" onclick="loadSentenceSample(${index})">
      <span class="sent-sample-label">${sample.label}</span>
      <strong class="sent-sample-title">${sample.title}</strong>
      <span class="sent-sample-desc">${sample.summary}</span>
    </button>
  `).join('');
}

function loadSentenceSample(index) {
  const sample = SENTENCE_SAMPLES[index];
  if (!sample) return;
  document.querySelectorAll('#sent-sample-grid .sent-sample-card').forEach((card, cardIndex) => {
    card.classList.toggle('selected', cardIndex === index);
  });
  const promptEl = document.getElementById('sent-prompt');
  const answerEl = document.getElementById('sent-answer');
  const feedbackEl = document.getElementById('sent-feedback');
  const kickerEl = document.getElementById('sent-guide-kicker');
  const titleEl = document.getElementById('sent-guide-title');
  const listEl = document.getElementById('sent-guide-list');
  const phrasesEl = document.getElementById('sent-guide-phrases');
  const sampleNoteEl = document.getElementById('sent-current-sample');

  if (promptEl) promptEl.value = sample.prompt;
  if (answerEl) answerEl.value = '';
  if (feedbackEl) {
    feedbackEl.textContent = '답안을 작성 후 채점을 실행하십시오.';
    feedbackEl.classList.remove('has-content');
  }
  if (kickerEl) kickerEl.textContent = sample.label;
  if (titleEl) titleEl.textContent = sample.guideTitle;
  if (listEl) {
    listEl.innerHTML = sample.points.map((item) => `<div class="sent-guide-item">${escapeHtml(item)}</div>`).join('');
  }
  if (phrasesEl) {
    phrasesEl.innerHTML = sample.phrases.map((item) => `<span class="sent-guide-chip">${escapeHtml(item)}</span>`).join('');
  }
  if (sampleNoteEl) sampleNoteEl.textContent = `${sample.title} 예시 문제를 불러왔습니다. ${sample.sampleNote}`;
  bindAutoResizeTextareas(document.getElementById('eng-s2'));
  showToast(`${sample.title} 문제를 불러왔습니다.`);
}

(function initSentenceSamples() {
  renderSentenceSamples();
  if (SENTENCE_SAMPLES.length) loadSentenceSample(0);
})();

async function analyzeSentence() {
  const prompt = document.getElementById('sent-prompt').value.trim();
  const answer = document.getElementById('sent-answer').value.trim();
  const el = document.getElementById('sent-feedback');
  if (!answer) { showToast('답안을 먼저 입력하십시오'); return; }
  const sys = `당신은 고등학교 영어 수행평가 채점 전문가입니다. 학생의 문장완성 답안을 4가지 기준으로 평가하십시오:\n①과제완성(5점): 요구 조건 충족\n②내용(5점): 주제 적합성·충실도\n③언어사용(5점): 문법·어휘·철자·구두점\n④구성의 참신성(5점): 독창적이고 자연스러운 구성\n각 항목 /5점 점수 + 개선점 제시.`;
  await callClaude(sys, `주어진 문장/빈칸: ${prompt||'(미입력)'}\n학생 답안: ${answer}`, el);
}
async function generateSentenceHint() {
  const prompt = document.getElementById('sent-prompt').value.trim();
  const el = document.getElementById('sent-feedback');
  if (!prompt) { showToast('주어진 문장을 먼저 입력하십시오'); return; }
  const sys = `당신은 영어 수행평가 튜터입니다. 정답을 알려주지 말고 방향만 힌트로 제시하십시오.`;
  await callClaude(sys, `문제: ${prompt}\n힌트를 3가지 제시하십시오. 핵심 문법 포인트, 어울리는 어휘, 구조 힌트 순으로.`, el);
}

/* ── 면접 ── */
const INT_TOPICS = [
  {icon:'📚',key:'dream_book',title:'The Dot 그림책'},
  {icon:'⏰',key:'habit',title:'5분 습관 루틴'},
  {icon:'♻️',key:'plastic',title:'Ooho 현장 리포트'},
  {icon:'📣',key:'act_now',title:'Act Now 캠페인'},
  {icon:'⚖️',key:'privacy_right',title:'잊힐 권리 토론'},
  {icon:'🔍',key:'fake_news',title:'가짜뉴스 판별'},
  {icon:'💡',key:'innovation',title:'헬리콥터 혁신 사례'},
  {icon:'🎨',key:'art_guide',title:'Erik Johansson'},
];
const INT_TOPIC_MAP = {
  dream_book:'The Dot 그림책 소개',
  habit:'하루 5분 습관 루틴',
  plastic:'Ooho 친환경 리포트',
  act_now:'Act Now 기후 행동 캠페인',
  privacy_right:'잊힐 권리 토론',
  fake_news:'가짜뉴스 판별 정보성 영상',
  innovation:'헬리콥터 혁신 사례',
  art_guide:'Erik Johansson 작품 오디오 가이드'
};
let selectedIntTopic = null;
(function renderIntTopics() {
  const grid = document.getElementById('int-topic-grid');
  if (!grid) return;
  grid.innerHTML = INT_TOPICS.map(t => `
    <div class="topic-card" onclick="selectIntTopic(this,'${t.key}')">
      <div class="topic-icon">${t.icon}</div>
      <div class="topic-title">${t.title}</div>
    </div>
  `).join('');
})();
function selectIntTopic(el, key) {
  document.querySelectorAll('#int-topic-grid .topic-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  selectedIntTopic = key;
}
async function generateInterviewQuestion() {
  if (!selectedIntTopic) { showToast('주제를 먼저 선택하십시오'); return; }
  const el = document.getElementById('int-question');
  document.getElementById('int-question-box').style.display = 'block';
  const sys = `당신은 고등학교 영어 면접 출제 전문가입니다. 실제 영어 면접 수준의 질문 1개를 영어로 생성하십시오.`;
  await callClaude(sys, `소재: ${INT_TOPIC_MAP[selectedIntTopic]}\n학생이 1~2분 내외로 답할 수 있는 영어 면접 질문 1개를 생성하십시오. 질문만 출력하십시오.`, el);
}
async function analyzeInterview() {
  const s1 = document.getElementById('int-s1').value.trim();
  const s2 = document.getElementById('int-s2').value.trim();
  const s3 = document.getElementById('int-s3').value.trim();
  const s4 = document.getElementById('int-s4').value.trim();
  const el = document.getElementById('int-feedback');
  if (!s1 && !s2 && !s3 && !s4) { showToast('답변을 최소 1단계 이상 작성하십시오'); return; }
  const hasOpinion = /think|believe|opinion|perspective/i.test(s3);
  const w3 = document.getElementById('int-warn-3');
  if (s3.length>5 && !hasOpinion) { w3.textContent='⚠ I think / I believe 등 의견 표현이 없습니다.'; w3.className='step-warn visible warn-red'; }
  else if (s3.length>5) { w3.textContent='✓ 의견 표현 확인됨'; w3.className='step-warn visible warn-blue'; }
  else { w3.className='step-warn'; }
  const hasConcl = /sum|conclusion|therefore|that's why/i.test(s4);
  const w4 = document.getElementById('int-warn-4');
  if (s4.length>5 && !hasConcl) { w4.textContent='⚠ "To sum up / In conclusion" 등 마무리 표현이 없습니다.'; w4.className='step-warn visible warn-red'; }
  else if (s4.length>5) { w4.textContent='✓ 마무리 표현 확인됨'; w4.className='step-warn visible warn-blue'; }
  else { w4.className='step-warn'; }
  const question = document.getElementById('int-question')?.textContent || '';
  const sys = `당신은 고등학교 영어 면접 채점관입니다. 4기준 평가:\n①과제완성(5점) ②내용(5점) ③언어사용(5점) ④구성의참신성(5점)\n각 항목 /5점 + 총평 + 개선점.`;
  await callClaude(sys, `면접 질문: ${question||'(미생성)'}\n①도입: ${s1||'(미입력)'}\n②핵심: ${s2||'(미입력)'}\n③의견: ${s3||'(미입력)'}\n④마무리: ${s4||'(미입력)'}`, el);
}
function clearInterview() {
  ['int-s1','int-s2','int-s3','int-s4'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  const fb=document.getElementById('int-feedback');
  fb.textContent='주제를 선택하고 4단계 답변 후 채점을 실행하십시오.';
  fb.classList.remove('has-content');
  ['int-warn-3','int-warn-4'].forEach(id => { const el=document.getElementById(id); if(el) el.className='step-warn'; });
}

/* ── 점수 시뮬레이터 ── */
function updateSim() {
  const exam = parseInt(document.getElementById('sim-exam')?.value||80);
  const sent = parseInt(document.getElementById('sim-sent')?.value||16);
  const dict = parseInt(document.getElementById('sim-dict')?.value||14);
  const int_ = parseInt(document.getElementById('sim-int')?.value||16);
  document.getElementById('sim-exam-val').textContent = exam;
  document.getElementById('sim-sent-val').textContent = sent;
  document.getElementById('sim-dict-val').textContent = dict;
  document.getElementById('sim-int-val').textContent  = int_;
  const examRef = Math.round(exam*0.4*10)/10;
  const saTotal = sent+dict+int_;
  const total   = Math.round((examRef+saTotal)*10)/10;
  document.getElementById('res-exam').textContent  = examRef;
  document.getElementById('res-sa').textContent    = saTotal;
  document.getElementById('res-total').textContent = total;
  let grade, color, msg;
  if (total>=90) { grade='A (최우수)'; color='var(--eng-primary)'; msg='현재 궤도를 유지하십시오.'; }
  else if (total>=80) { grade='B (우수)'; color='#38bdf8'; msg=`받아쓰기(${dict}/20)와 면접(${int_}/20)에서 각 2~3점 추가 시 A등급 진입 가능합니다.`; }
  else if (total>=70) { grade='C (보통)'; color='var(--warning)'; msg='받아쓰기를 최우선으로 추가 훈련이 필요합니다.'; }
  else { grade='D (주의)'; color='var(--danger)'; msg='즉각적인 집중 훈련이 필요합니다. Step 1 받아쓰기부터 시작하십시오.'; }
  document.getElementById('grade-msg').innerHTML = `<strong style="color:${color};font-size:1.1rem;">${grade}</strong><br><span style="color:var(--text-secondary);">${msg}</span>`;
}
async function getSimStrategy() {
  const exam = document.getElementById('sim-exam').value;
  const sent = document.getElementById('sim-sent').value;
  const dict = document.getElementById('sim-dict').value;
  const int_ = document.getElementById('sim-int').value;
  const total = document.getElementById('res-total').textContent;
  const el = document.getElementById('sim-ai-feedback');
  const sys = `당신은 고등학교 영어 수행평가 전략 코치입니다. 최단시간 내 최대 점수 향상 전략을 제시하십시오.`;
  const usr = `현재 예상 점수:\n- 정기시험: ${exam}점 → 반영 후 ${Math.round(exam*0.4*10)/10}점\n- 문장완성: ${sent}/20점\n- 받아쓰기: ${dict}/20점\n- 영어면접: ${int_}/20점\n- 합계: ${total}/100점\n\n각 영역별 약점을 분석하고 지금 당장 실행할 수 있는 우선순위 3가지 훈련 계획을 구체적으로 제시하십시오.`;
  await callClaude(sys, usr, el);
}

window.addEventListener('beforeunload', () => {
  stopDictationTTS({ preserveStatus: true });
});

document.addEventListener('keydown', (event) => {
  if (event.code !== 'Space' || event.repeat) return;
  const target = event.target;
  const isTypingTarget = target instanceof HTMLElement && (
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'INPUT' ||
    target.isContentEditable
  );
  if (isTypingTarget) return;
  const panel = document.getElementById('eng-s1');
  if (!panel || panel.style.display === 'none') return;
  if (!dictTTSState.lines.length) return;
  event.preventDefault();
  playNextDictationSentence();
});
