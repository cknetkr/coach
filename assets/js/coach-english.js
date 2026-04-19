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
  pendingNextIndex: -1,
  isPaused: false,
};
const dictSentenceModalState = {
  open: false,
  activeIndex: -1,
  answersVisible: false,
  fontScaleStep: 0,
};
const dictConceptExplorerState = {};
const dictConceptTTSState = {
  currentButtonId: '',
  currentUtterance: null,
};
let selectedDictLevel = 'normal';
let selectedDictBlankMode = 'word';
let dictLineLevels = [];
let dictLineTTSSettings = [];
let dictPracticeMeta = [];
let dictSentenceEntries = [];
const DICT_LEVEL_LABELS = {
  easy: '쉬움',
  low: '하',
  normal: '중',
  hard: '상',
};
const DICT_BLANK_MODE_LABELS = {
  word: '단어',
  phrase: '숙어',
};
const DICT_SENTENCE_MODAL_FONT_PRESETS = [
  { text: '0.88rem', cloze: '0.88rem', lineHeight: '1.72', input: '0.8rem', inputHeight: '1.9rem', inputMinWidth: '3.5rem', answer: '0.6rem' },
  { text: '0.94rem', cloze: '0.94rem', lineHeight: '1.84', input: '0.84rem', inputHeight: '2rem', inputMinWidth: '3.8rem', answer: '0.64rem' },
  { text: '1rem', cloze: '1rem', lineHeight: '1.98', input: '0.88rem', inputHeight: '2.15rem', inputMinWidth: '4.2rem', answer: '0.68rem' },
  { text: '1.06rem', cloze: '1.06rem', lineHeight: '2.08', input: '0.92rem', inputHeight: '2.24rem', inputMinWidth: '4.5rem', answer: '0.72rem' },
  { text: '1.12rem', cloze: '1.12rem', lineHeight: '2.18', input: '0.96rem', inputHeight: '2.34rem', inputMinWidth: '4.8rem', answer: '0.76rem' },
];

function createDefaultDictConceptState() {
  return {
    open: false,
    section: 'essential',
    activeTab: 'blanks',
    speakingMode: 'schoolInterview',
    loading: false,
    data: null,
  };
}

function getDictConceptState(lineIndex) {
  if (!dictConceptExplorerState[lineIndex]) {
    dictConceptExplorerState[lineIndex] = createDefaultDictConceptState();
  }
  return dictConceptExplorerState[lineIndex];
}

function getDictationHint(hints, level) {
  if (!hints) return null;
  if (level === 'low') return hints.lv1 || null;
  if (level === 'normal') return hints.lv2 || hints.lv1 || null;
  return null;
}

function getDictationBlankTargetCount(level) {
  if (level === 'easy') return 0;
  if (level === 'low') return 1;
  if (level === 'normal') return 2;
  return 3;
}

function getDictationBlankModeSummary(mode) {
  if (mode === 'phrase') {
    return '숙어 하 핵심구 1개 · 중 핵심+정보 2개 · 상 핵심+정보+연결 3개';
  }
  return '단어 하 핵심 내용어 1개 · 중 핵심+함정 2개 · 상 핵심+함정+구조 3개';
}

function isDictationExamStandalonePage() {
  return document.body?.dataset?.engPage === 'dictation-exam';
}

function getSelectedDictTopicIndex() {
  return Math.max(0, DICT_TOPICS.findIndex((topic) => topic === selectedDictTopic));
}

function getSelectedDictPartNumber() {
  return getSelectedDictTopicIndex() + 1;
}

function getDictationSentenceModalTitle() {
  return `Part ${getSelectedDictPartNumber()} 전체 시험`;
}

function getDictationSentenceModalSummary() {
  return '전체 듣기 후 한 번에 풀고 정답 확인';
}

function getDictationSentenceModalFontPreset() {
  const presetIndex = Math.max(0, Math.min(DICT_SENTENCE_MODAL_FONT_PRESETS.length - 1, dictSentenceModalState.fontScaleStep + 2));
  return DICT_SENTENCE_MODAL_FONT_PRESETS[presetIndex];
}

function syncDictationSentenceModalFontUI() {
  const dialog = document.querySelector('#dict-sentence-modal .dict-sentence-modal__dialog');
  if (!dialog) return;
  const preset = getDictationSentenceModalFontPreset();
  dialog.style.setProperty('--dict-modal-text-size', preset.text);
  dialog.style.setProperty('--dict-modal-cloze-size', preset.cloze);
  dialog.style.setProperty('--dict-modal-line-height', preset.lineHeight);
  dialog.style.setProperty('--dict-modal-input-size', preset.input);
  dialog.style.setProperty('--dict-modal-input-height', preset.inputHeight);
  dialog.style.setProperty('--dict-modal-input-min-width', preset.inputMinWidth);
  dialog.style.setProperty('--dict-modal-answer-size', preset.answer);
  const decreaseButton = document.getElementById('dict-sentence-font-decrease');
  const increaseButton = document.getElementById('dict-sentence-font-increase');
  if (decreaseButton) decreaseButton.disabled = dictSentenceModalState.fontScaleStep <= -2;
  if (increaseButton) increaseButton.disabled = dictSentenceModalState.fontScaleStep >= 2;
}

function adjustDictationSentenceModalFont(delta) {
  const nextValue = Math.max(-2, Math.min(2, dictSentenceModalState.fontScaleStep + Number(delta || 0)));
  if (nextValue === dictSentenceModalState.fontScaleStep) return;
  dictSentenceModalState.fontScaleStep = nextValue;
  syncDictationSentenceModalFontUI();
}

function buildDictationExamHref(topicIndex = getSelectedDictTopicIndex()) {
  const url = new URL('coach-english-exam.html', window.location.href);
  url.searchParams.set('topic', String(Math.max(0, Number(topicIndex) || 0)));
  return url.toString();
}

function openDictationExamPage(topicIndex = getSelectedDictTopicIndex()) {
  window.location.href = buildDictationExamHref(topicIndex);
}

function normalizeDictationTokenCore(value) {
  return normalizeDictationBlank(value).replace(/['’]/g, "'");
}

function normalizeDictationGradeText(value) {
  return String(value || '').trim().toLowerCase();
}

function stripDictationApostrophes(value) {
  return normalizeDictationGradeText(value).replace(/[’']/g, '');
}

function gradeDictationBlankAnswer(userInput, answer) {
  const normalized = normalizeDictationGradeText(userInput);
  const correct = normalizeDictationGradeText(answer);
  if (normalized === correct) return 'correct';
  if (normalized && stripDictationApostrophes(normalized) === stripDictationApostrophes(correct)) return 'partial';
  return 'wrong';
}

const DICT_SENTENCE_GUIDES = [
  { s:'Every child has a unique talent that is waiting to be discovered.', t:'모든 아이는 아직 발견되기를 기다리는 고유한 재능을 가지고 있다.', p:'unique · talent · waiting · discovered', m:'unique 발음, waiting의 t, discovered의 -ed를 자주 놓칩니다.', c:'has + 명사 + that 관계절 구조입니다. talent 뒤 설명절을 한 덩어리로 듣는 게 핵심입니다.' },
  { s:'The picture book shows that potential grows when we believe in ourselves.', t:'그 그림책은 우리가 자신을 믿을 때 잠재력이 자란다는 것을 보여 준다.', p:'picture · potential · grows · ourselves', m:'potential 철자와 grows의 s, ourselves의 강세를 자주 틀립니다.', c:'shows that 절 + when 절 구조입니다. 핵심 메시지와 조건절을 나눠 듣는 연습이 중요합니다.' },
  { s:"With witty and vivid illustrations, the writer emphasizes that there's a creative spirit in every one of us.", t:'재치 있고 생생한 그림으로, 작가는 우리 모두 안에 창의적인 힘이 있다고 강조한다.', p:'With witty and vivid illustrations / emphasizes / there’s a creative spirit', m:'문장 앞 설명구에 끌려 중심 동사 emphasizes를 놓치거나, 뒤 that절의 creative spirit를 통째로 못 잡는 경우가 많습니다.', c:'앞 분위기 설명 / 작가의 핵심 동사 / 진짜 메시지 세 덩어리로 나눠 듣는 문장입니다.' },
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
      easy: "`I'd like to ...`는 한국어로 보면 '저는 ...를 소개하고 싶어요'처럼 말문을 여는 짧은 입구 표현입니다.",
      role: "이 문장에서는 본론으로 들어가기 전에 분위기를 여는 짧은 시작 표현입니다. 뜻 하나보다 문장 리듬을 여는 역할이 더 큽니다.",
      listen: "`Today / I'd like to introduce / The Dot by Peter Reynolds` 세 덩어리로 들으세요. 여기서는 두 번째 덩어리의 출발점인 `I'd`를 먼저 잡으면 됩니다.",
      trap: "`I'd`는 소리가 매우 짧고 약하게 붙어서 `I`, `I'll`, `I would`처럼 흔들리기 쉽습니다. 빠르게 들리면 d 소리를 놓치고 그냥 `I`로 적는 경우가 많습니다.",
    },
    "peter": {
      easy: "`Peter Reynolds`는 한국어로 풀면 '피터 레이놀즈'처럼 저자 이름을 찍는 부분입니다. 내용이 아니라 이름표라고 생각하면 쉽습니다.",
      role: "문장 끝 `by + 이름` 구조에서 첫 번째 이름 덩어리입니다. 설명이 아니라 저자 정보를 정확히 받아 적는 자리입니다.",
      listen: "`The Dot by Peter Reynolds`를 한 세트로 들으세요. `by`가 나오면 뒤에는 설명이 아니라 사람 이름이 온다고 먼저 예상하면 훨씬 잘 들립니다.",
      trap: "`Peter`는 익숙한 이름 같아도 실제 듣기에서는 뒤 `Reynolds`와 붙어 빨리 지나갑니다. 그래서 `better`처럼 다른 소리로 착각하거나 철자를 덜 적는 실수가 많습니다.",
    },
    "reynolds": {
      easy: "`Reynolds`는 한국어로 보면 저자 성을 마무리하는 부분입니다. 결국 `Peter Reynolds`를 한 이름으로 듣느냐를 보는 자리입니다.",
      role: "문장 끝 이름 정보의 마지막 조각입니다. 앞의 `Peter`와 붙여서 하나의 사람 이름으로 완성해야 합니다.",
      listen: "`by Peter Reynolds`를 통째로 잡으세요. 특히 뒤쪽 `Reynolds`는 이름 마무리라고 생각하고 끝 자음까지 같이 들어야 합니다.",
      trap: "익숙하지 않은 이름이라 음절을 놓치기 쉽고, `Raynolds`, `Reynold`처럼 적는 실수가 많습니다. 마지막 `-lds` 자음군이 특히 자주 빠집니다.",
    },
  },
};

const DICT_KOREAN_GLOSSARY = {
  vivid: '그림이나 표현이 확 살아 있는 느낌',
  emphasizes: '중요하다고 힘줘 말하는 느낌',
  emphasize: '중요하다고 힘줘 말하는 것',
  creative: '새롭고 기발하게 만들어 내는 느낌',
  spirit: '마음속에 있는 힘이나 기운',
  unique: '딱 그 사람만 가진 특별한 느낌',
  talent: '타고난 재능',
  potential: '아직 안 터졌지만 안에 있는 가능성',
  grateful: '고맙게 느끼는 마음',
  powerful: '힘이 큰',
  biodegradable: '자연에서 썩는',
  alternative: '대신 쓸 수 있는 다른 선택지',
  campaign: '사람들에게 같이하자고 움직이는 활동',
  encourages: '해보자고 등을 떠미는 느낌',
  dignity: '사람답게 존중받는 가치',
  misinformation: '틀린 정보가 사실처럼 퍼진 것',
  innovation: '새로운 방식으로 문제를 푸는 변화',
  transformed: '완전히 바꿔 놓은',
  groundbreaking: '판을 바꿀 만큼 새롭고 센',
  illustrations: '글을 살려 주는 그림',
  discovered: '찾아낸',
  environment: '주변 환경',
  protect: '지켜 내다',
  writer: '글쓴이',
  routine: '매일 굴러가는 습관 흐름',
  success: '성공',
  failure: '실패',
};

const DICT_FUNCTION_WORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'for', 'by', 'in', 'on', 'at', 'with', 'from', 'and', 'or', 'but',
  'than', 'that', 'who', 'which', 'when', 'where', 'because', 'if', 'while', 'into', 'over', 'under',
  'through', 'during', 'after', 'before',
]);

const DICT_CONFUSING_WORDS = new Set([
  'their', 'there', "they're", 'its', "it's", 'to', 'too', 'two', 'than', 'then',
]);

function getDictationWordCount(sentence) {
  return String(sentence || '').trim().split(/\s+/).filter(Boolean).length;
}

function getDictationSourceLines(topic) {
  const lines = Array.isArray(topic?.lines) ? topic.lines.filter(Boolean) : [];
  if (!lines.length) return [];
  return lines;
}

function getDictationTopicOverrideEntries(topic) {
  const overrides = window.ENG_DICTATION_TOPIC_OVERRIDES || {};
  const topicIndex = DICT_TOPICS.indexOf(topic);
  if (topicIndex >= 0 && Array.isArray(overrides[topicIndex])) {
    return overrides[topicIndex];
  }
  const matchedIndex = DICT_TOPICS.findIndex((item) => item?.num === topic?.num && item?.title === topic?.title);
  return matchedIndex >= 0 && Array.isArray(overrides[matchedIndex]) ? overrides[matchedIndex] : [];
}

function getDictationSentenceEntries(topic) {
  const sourceLines = getDictationSourceLines(topic);
  const overrides = getDictationTopicOverrideEntries(topic);
  const sentences = Array.isArray(topic?.sentences) ? topic.sentences : [];
  return sourceLines.map((line, index) => {
    const entry = overrides[index] || sentences[index] || {};
    return {
      ...entry,
      text: line,
      guide: entry.guide || null,
      commentary: entry.commentary || null,
      fullMeaning: entry.fullMeaning || null,
      examModes: entry.examModes || null,
      vocabulary: Array.isArray(entry.vocabulary) ? entry.vocabulary : [],
      blanks: Array.isArray(entry.blanks) ? entry.blanks : [],
    };
  });
}

function normalizeDictationBlank(text) {
  return normalizeDictationSentence(text).replace(/[^a-z0-9-]/g, '');
}

function splitDictationToken(token) {
  const match = String(token).match(/^([^A-Za-z0-9]*)([A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*)([^A-Za-z0-9]*)$/);
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

function indexIsBlankable(index, length) {
  if (length <= 4) return index > 0 && index < length - 1;
  return index > 0 && index < length - 1;
}

function isLikelyProperNounBlank(token, tokenIndex, tokens) {
  if (!token?.core) return false;
  const startsWithUpper = /^[A-Z]/.test(token.core);
  if (!startsWithUpper) return false;
  if (tokenIndex === 0) return false;
  const nextStartsWithUpper = /^[A-Z]/.test(tokens[tokenIndex + 1]?.core || '');
  const prevLower = (tokens[tokenIndex - 1]?.core || '').toLowerCase();
  return nextStartsWithUpper || prevLower === 'by' || prevLower === 'named';
}

function pickTopBlankCandidates(candidates, count, priorityKey) {
  if (!count) return [];
  return [...candidates]
    .sort((a, b) => (b[priorityKey] - a[priorityKey]) || (b.score - a.score) || (a.index - b.index))
    .slice(0, count);
}

function buildDictationBlankCandidates(tokens) {
  return tokens
    .map((token, index) => {
      if (!token.core || !indexIsBlankable(index, tokens.length)) return null;
      const profile = getDictationBlankProfile(token.core, index, tokens);
      if (isLikelyProperNounBlank(token, index, tokens)) return null;
      const score = [
        profile.isContraction ? 10 : 0,
        profile.endsWithEd ? 8 : 0,
        profile.endsWithEs ? 7 : 0,
        profile.endsWithS ? 6 : 0,
        profile.endsWithIng ? 6 : 0,
        profile.isFunctionWord ? 7 : 0,
        profile.isNumberLike ? 7 : 0,
        profile.hasHyphen ? 5 : 0,
        profile.looksVerb ? 5 : 0,
        profile.looksNoun ? 3 : 0,
        profile.looksAdjective ? 2 : 0,
        profile.isConfusingWord ? 7 : 0,
        profile.lower.length >= 8 ? 2 : 0,
      ].reduce((sum, value) => sum + value, 0);
      const teacherBucket = (() => {
        if (profile.isContraction || (profile.isFunctionWord && ['to', 'of', 'at', 'in', 'on', 'by', 'for', 'with', 'where', 'that'].includes(profile.lower))) {
          return 'trap';
        }
        if (profile.endsWithEd || profile.endsWithEs || profile.endsWithS || profile.endsWithIng || profile.hasHyphen) {
          return 'structure';
        }
        if (profile.looksVerb || profile.looksNoun || profile.looksAdjective || profile.lower.length >= 6) {
          return 'core';
        }
        if (profile.isFunctionWord) return 'trap';
        return 'core';
      })();
      const corePriority = score + (profile.looksVerb ? 6 : 0) + (profile.looksNoun ? 4 : 0) + (profile.looksAdjective ? 3 : 0) - (profile.isFunctionWord ? 10 : 0);
      const trapPriority = score + (profile.isContraction ? 8 : 0) + (profile.isFunctionWord ? 6 : 0) + (profile.isConfusingWord ? 4 : 0);
      const structurePriority = score + (profile.endsWithEd ? 6 : 0) + (profile.endsWithEs ? 5 : 0) + (profile.endsWithS ? 4 : 0) + (profile.endsWithIng ? 4 : 0) + (profile.hasHyphen ? 3 : 0);
      return { index, token, profile, score, teacherBucket, corePriority, trapPriority, structurePriority };
    })
    .filter(Boolean);
}

function pickTeacherWordBlankCandidates(candidates, level) {
  const selected = [];
  const takeFromBucket = (bucket, priorityKey) => {
    const next = pickTopBlankCandidates(
      candidates.filter((candidate) => candidate.teacherBucket === bucket && !selected.some((item) => item.index === candidate.index)),
      1,
      priorityKey
    )[0];
    if (next) selected.push(next);
  };

  if (level === 'low') {
    takeFromBucket('core', 'corePriority');
    if (!selected.length) takeFromBucket('structure', 'structurePriority');
    if (!selected.length) takeFromBucket('trap', 'trapPriority');
    return selected;
  }

  takeFromBucket('core', 'corePriority');
  takeFromBucket('trap', 'trapPriority');

  if (level === 'hard') {
    takeFromBucket('structure', 'structurePriority');
  }

  const quota = getDictationBlankTargetCount(level);
  if (selected.length < quota) {
    const fallbackPriority = level === 'hard' ? 'structurePriority' : 'trapPriority';
    selected.push(...pickTopBlankCandidates(
      candidates.filter((candidate) => !selected.some((item) => item.index === candidate.index)),
      quota - selected.length,
      fallbackPriority
    ));
  }

  return selected;
}

function buildAutomaticDictationBlankIndices(tokens, level) {
  const candidates = buildDictationBlankCandidates(tokens);
  if (!candidates.length) return [];
  return pickTeacherWordBlankCandidates(candidates, level)
    .map((candidate) => candidate.index)
    .sort((a, b) => a - b);
}

function buildAutomaticDictationPhraseChunkCandidates(tokens) {
  const candidates = [];
  for (let start = 0; start < tokens.length; start += 1) {
    for (let size = 2; size <= 4; size += 1) {
      const end = start + size - 1;
      if (end >= tokens.length) continue;
      const slice = tokens.slice(start, end + 1);
      if (slice.some((token) => !token.core)) continue;
      const profiles = slice.map((token, index) => getDictationBlankProfile(token.core, start + index, tokens));
      const functionWordCount = profiles.filter((profile) => profile.isFunctionWord).length;
      const verbLikeCount = profiles.filter((profile) => profile.looksVerb).length;
      const capitalizedCount = profiles.filter((profile) => profile.startsWithUpper).length;
      const contentCount = profiles.filter((profile) => !profile.isFunctionWord).length;
      if (!contentCount) continue;
      const score = (
        (functionWordCount * 6)
        + (verbLikeCount * 5)
        + (capitalizedCount * 3)
        + (profiles.some((profile) => profile.isContraction) ? 6 : 0)
        + (profiles.some((profile) => profile.hasHyphen) ? 4 : 0)
        + (size === 3 ? 2 : 0)
        + (size === 4 ? 1 : 0)
      );
      if (score < 7) continue;
      const teacherBucket = (() => {
        if (verbLikeCount >= 1 && functionWordCount >= 1) return 'core';
        if (functionWordCount >= 1) return 'link';
        return 'info';
      })();
      candidates.push({
        answer: slice.map((token) => token.core).join(' '),
        pos: '자동 숙어/구',
        tags: ['⭐숙어', 'AUTO'],
        autoGenerated: true,
        score,
        teacherBucket,
      });
    }
  }
  return candidates
    .sort((a, b) => (b.score - a.score) || (b.answer.split(' ').length - a.answer.split(' ').length))
    .filter((candidate, index, arr) => arr.findIndex((item) => item.answer === candidate.answer) === index);
}

function buildDictationPhraseChunkCandidates(sentenceEntry, tokens = []) {
  const manual = Array.isArray(sentenceEntry?.phraseBlanks) ? sentenceEntry.phraseBlanks.filter(Boolean) : [];
  if (manual.length) return manual.map((item) => ({ ...item }));
  const chunks = String(sentenceEntry?.guide?.p || '')
    .split(/\s*\/\s*/)
    .map((chunk) => String(chunk || '').trim())
    .filter(Boolean);
  if (chunks.length) {
    return chunks.map((chunk) => ({
      answer: chunk,
      pos: '숙어/구',
      tags: ['⭐숙어'],
      notes: {
        easy: '문장을 덩어리로 듣기 위한 핵심 구간입니다.',
        role: '이 문장을 말할 때 한 번에 묶어야 하는 정보 블록입니다.',
        listen: `\`${chunk}\`를 단어별로 쪼개지 말고 한 호흡으로 들으세요.`,
        trap: '단어 하나씩 적으려 들면 중간 연결이 끊겨 전체 구간을 놓치기 쉽습니다.',
      },
      coachLine: `\`${chunk}\`는 통째로 들어야 합니다. 이 구간은 단어가 아니라 한 블록으로 적는다는 감각이 필요합니다.`,
      selfCheck: {
        question: `\`${chunk}\`를 한 번에 듣고 적을 수 있나요?`,
        solutions: [
          { step: 1, desc: '문장 전체 1회 청취 후, 이 구간만 먼저 적습니다.' },
          { step: 2, desc: '오답이면 이 구간만 5회 연속 끊어 읽고 다시 받아씁니다.' },
        ],
        goalTip: '3회 연속 이 구간 전체를 정확히 적을 때까지 반복합니다.',
      },
    }));
  }
  return buildAutomaticDictationPhraseChunkCandidates(tokens).map((candidate) => ({
    ...candidate,
    notes: {
      easy: '문장 전체 의미를 덩어리로 묶어 듣기 위한 자동 숙어 구간입니다.',
      role: '단어 하나씩이 아니라 문장 블록으로 복원해야 하는 구간입니다.',
      listen: `\`${candidate.answer}\`를 한 덩어리로 이어 들어 보세요.`,
      trap: '내용어만 따로 적으면 연결 구조가 끊겨서 구간 전체를 놓치기 쉽습니다.',
    },
    coachLine: `\`${candidate.answer}\`는 자동 추출된 핵심 구간입니다. 단어별이 아니라 묶음으로 적으세요.`,
    selfCheck: {
      question: `\`${candidate.answer}\`를 한 번에 받아쓸 수 있나요?`,
      solutions: [
        { step: 1, desc: '문장 전체를 1회 들은 뒤 이 구간만 먼저 적습니다.' },
        { step: 2, desc: '오답이면 이 구간만 3회 반복해서 다시 받아씁니다.' },
      ],
      goalTip: '이 구간을 3회 연속 정확히 적을 때까지 반복합니다.',
    },
  }));
}

function findDictationPhraseTokenRange(tokens, answerText, usedRanges = []) {
  const phraseTokens = String(answerText || '')
    .split(/\s+/)
    .map(splitDictationToken)
    .map((item) => normalizeDictationTokenCore(item.core))
    .filter(Boolean);
  if (!phraseTokens.length) return null;
  for (let start = 0; start <= tokens.length - phraseTokens.length; start += 1) {
    const overlap = usedRanges.some((range) => start <= range.end && (start + phraseTokens.length - 1) >= range.start);
    if (overlap) continue;
    let matched = true;
    for (let offset = 0; offset < phraseTokens.length; offset += 1) {
      if (normalizeDictationTokenCore(tokens[start + offset]?.core) !== phraseTokens[offset]) {
        matched = false;
        break;
      }
    }
    if (matched) {
      return {
        startTokenIndex: start,
        endTokenIndex: start + phraseTokens.length - 1,
      };
    }
  }
  return null;
}

function scoreDictationPhraseCandidate(tokens, range) {
  const slice = tokens.slice(range.startTokenIndex, range.endTokenIndex + 1);
  return slice.reduce((sum, token, index) => {
    const profile = getDictationBlankProfile(token.core, range.startTokenIndex + index, tokens);
    return sum
      + (profile.isContraction ? 12 : 0)
      + (profile.isFunctionWord ? 5 : 0)
      + (profile.hasHyphen ? 5 : 0)
      + (profile.looksVerb ? 4 : 0)
      + (profile.startsWithUpper ? 2 : 0);
  }, slice.length * 2);
}

function resolveDictationPhraseDefinitions(sentenceEntry, tokens, level) {
  if (level === 'easy') return [];
  const targetCount = getDictationBlankTargetCount(level);
  if (!targetCount) return [];
  const usedRanges = [];
  const candidates = buildDictationPhraseChunkCandidates(sentenceEntry, tokens)
    .filter((blank) => !Array.isArray(blank.levels) || blank.levels.includes(level))
    .map((blank) => {
      const range = findDictationPhraseTokenRange(tokens, blank.answer, usedRanges);
      if (!range) return null;
      usedRanges.push({ start: range.startTokenIndex, end: range.endTokenIndex });
      return {
        ...blank,
        ...range,
        answer: String(blank.answer || '').trim(),
        normalizedAnswer: normalizeDictationGradeText(blank.answer),
        display: String(blank.answer || '').trim(),
        hint: getDictationHint(blank.hints, level),
        score: scoreDictationPhraseCandidate(tokens, range),
        explanation: blank.notes || null,
        teacherBucket: blank.teacherBucket || (
          scoreDictationPhraseCandidate(tokens, range) >= 18 ? 'core' : 'info'
        ),
      };
    })
    .filter(Boolean);

  const selected = [];
  const takePhraseBucket = (bucket) => {
    const next = [...candidates]
      .filter((candidate) => candidate.teacherBucket === bucket && !selected.some((item) => item.startTokenIndex === candidate.startTokenIndex && item.endTokenIndex === candidate.endTokenIndex))
      .sort((a, b) => (b.score - a.score) || (a.startTokenIndex - b.startTokenIndex))[0];
    if (next) selected.push(next);
  };

  if (level === 'low') {
    takePhraseBucket('core');
    if (!selected.length) takePhraseBucket('info');
  } else if (level === 'normal') {
    takePhraseBucket('core');
    takePhraseBucket('info');
  } else {
    takePhraseBucket('core');
    takePhraseBucket('info');
    takePhraseBucket('link');
  }

  if (selected.length < targetCount) {
    selected.push(...[...candidates]
      .filter((candidate) => !selected.some((item) => item.startTokenIndex === candidate.startTokenIndex && item.endTokenIndex === candidate.endTokenIndex))
      .sort((a, b) => (b.score - a.score) || (a.startTokenIndex - b.startTokenIndex))
      .slice(0, targetCount - selected.length));
  }

  return selected
    .sort((a, b) => a.startTokenIndex - b.startTokenIndex);
}

function resolveDictationWordDefinitions(sentenceEntry, tokens, level) {
  if (level === 'easy') return [];
  const manualBlanks = Array.isArray(sentenceEntry?.blanks)
    ? sentenceEntry.blanks.filter((blank) => !Array.isArray(blank.levels) || blank.levels.includes(level))
    : [];
  const blanks = (manualBlanks.length
    ? manualBlanks.map((blank) => ({ ...blank }))
    : buildAutomaticDictationBlankIndices(tokens, level).map((tokenIndex) => ({ tokenIndex })))
    .filter((blank) => Number.isInteger(blank.tokenIndex) && tokens[blank.tokenIndex]?.core)
    .sort((a, b) => a.tokenIndex - b.tokenIndex);

  return blanks.map((blank) => {
    const token = tokens[blank.tokenIndex];
    const answer = blank.answer || token.core;
    return {
      ...blank,
      tokenIndex: blank.tokenIndex,
      answer,
      normalizedAnswer: normalizeDictationBlank(answer),
      display: `${token.prefix}${token.core}${token.suffix}`,
      explanation: blank.notes || getDictationBlankExplanation(sentenceEntry?.text || '', answer, blank.tokenIndex, tokens),
      hint: getDictationHint(blank.hints, level),
    };
  });
}

function resolveDictationBlankDefinitions(sentenceEntry, tokens, level, blankMode) {
  if (blankMode === 'phrase') {
    return resolveDictationPhraseDefinitions(sentenceEntry, tokens, level);
  }
  return resolveDictationWordDefinitions(sentenceEntry, tokens, level);
}

function renderDictationWordBlankPreview(tokens, blankDefinitions, lineIndex) {
  const blankMap = new Map(blankDefinitions.map((blank, index) => [blank.tokenIndex, { blank, blankId: index }]));
  return tokens.map((token, tokenIndex) => {
    const matchedBlank = blankMap.get(tokenIndex);
    if (!matchedBlank || !token.core) {
      return escapeHtml(token.raw);
    }
    const inputWidth = Math.max(Math.min(token.core.length, 12), 4);
    return `${escapeHtml(token.prefix)}<span class="dict-cloze-blank" data-blank-index="${matchedBlank.blankId}"><input class="field-input dict-cloze-input" id="dict-answer-${lineIndex}-${matchedBlank.blankId}" type="text" size="${inputWidth}" aria-label="문장 ${lineIndex + 1} 단어 빈칸 ${matchedBlank.blankId + 1}" autocomplete="off" autocapitalize="off" spellcheck="false" oninput="handleDictationInlineInput(${lineIndex}, ${matchedBlank.blankId})"><span class="dict-answer-word" id="dict-answer-word-${lineIndex}-${matchedBlank.blankId}" hidden>${escapeHtml(token.core)}</span></span>${escapeHtml(token.suffix)}`;
  }).join(' ');
}

function renderDictationPhraseBlankPreview(tokens, blankDefinitions, lineIndex) {
  const html = [];
  let tokenIndex = 0;
  while (tokenIndex < tokens.length) {
    const blankIndex = blankDefinitions.findIndex((blank) => blank.startTokenIndex === tokenIndex);
    if (blankIndex === -1) {
      html.push(escapeHtml(tokens[tokenIndex].raw));
      tokenIndex += 1;
      continue;
    }
    const blank = blankDefinitions[blankIndex];
    const firstToken = tokens[blank.startTokenIndex];
    const lastToken = tokens[blank.endTokenIndex];
    const inputWidth = Math.max(Math.min(blank.answer.length + 2, 28), 10);
    html.push(`${escapeHtml(firstToken.prefix)}<span class="dict-cloze-blank dict-cloze-blank--phrase" data-blank-index="${blankIndex}"><input class="field-input dict-cloze-input dict-cloze-input--phrase" id="dict-answer-${lineIndex}-${blankIndex}" type="text" size="${inputWidth}" aria-label="문장 ${lineIndex + 1} 숙어 빈칸 ${blankIndex + 1}" autocomplete="off" autocapitalize="off" spellcheck="false" oninput="handleDictationInlineInput(${lineIndex}, ${blankIndex})"><span class="dict-answer-word" id="dict-answer-word-${lineIndex}-${blankIndex}" hidden>${escapeHtml(blank.answer)}</span></span>${escapeHtml(lastToken.suffix)}`);
    tokenIndex = blank.endTokenIndex + 1;
  }
  return html.join(' ');
}

function renderDictationSentenceModalWordBlankPreview(tokens, blankDefinitions, lineIndex) {
  const blankMap = new Map(blankDefinitions.map((blank, index) => [blank.tokenIndex, { blank, blankId: index }]));
  return tokens.map((token, tokenIndex) => {
    const matchedBlank = blankMap.get(tokenIndex);
    if (!matchedBlank || !token.core) {
      return escapeHtml(token.raw);
    }
    const inputWidth = Math.max(Math.min(token.core.length, 12), 4);
    return `${escapeHtml(token.prefix)}<span class="dict-cloze-blank" data-blank-index="${matchedBlank.blankId}"><input class="field-input dict-cloze-input" id="dict-modal-answer-${lineIndex}-${matchedBlank.blankId}" type="text" size="${inputWidth}" aria-label="전체 문장 문장 ${lineIndex + 1} 단어 빈칸 ${matchedBlank.blankId + 1}" autocomplete="off" autocapitalize="off" spellcheck="false" oninput="handleDictationSentenceModalInput(${lineIndex}, ${matchedBlank.blankId})"><span class="dict-answer-word" id="dict-modal-answer-word-${lineIndex}-${matchedBlank.blankId}" hidden>${escapeHtml(token.core)}</span></span>${escapeHtml(token.suffix)}`;
  }).join(' ');
}

function renderDictationSentenceModalPhraseBlankPreview(tokens, blankDefinitions, lineIndex) {
  const html = [];
  let tokenIndex = 0;
  while (tokenIndex < tokens.length) {
    const blankIndex = blankDefinitions.findIndex((blank) => blank.startTokenIndex === tokenIndex);
    if (blankIndex === -1) {
      html.push(escapeHtml(tokens[tokenIndex].raw));
      tokenIndex += 1;
      continue;
    }
    const blank = blankDefinitions[blankIndex];
    const firstToken = tokens[blank.startTokenIndex];
    const lastToken = tokens[blank.endTokenIndex];
    const inputWidth = Math.max(Math.min(blank.answer.length + 2, 28), 10);
    html.push(`${escapeHtml(firstToken.prefix)}<span class="dict-cloze-blank dict-cloze-blank--phrase" data-blank-index="${blankIndex}"><input class="field-input dict-cloze-input dict-cloze-input--phrase" id="dict-modal-answer-${lineIndex}-${blankIndex}" type="text" size="${inputWidth}" aria-label="전체 문장 문장 ${lineIndex + 1} 숙어 빈칸 ${blankIndex + 1}" autocomplete="off" autocapitalize="off" spellcheck="false" oninput="handleDictationSentenceModalInput(${lineIndex}, ${blankIndex})"><span class="dict-answer-word" id="dict-modal-answer-word-${lineIndex}-${blankIndex}" hidden>${escapeHtml(blank.answer)}</span></span>${escapeHtml(lastToken.suffix)}`);
    tokenIndex = blank.endTokenIndex + 1;
  }
  return html.join(' ');
}

function renderDictationSentenceModalPreview(meta, lineIndex) {
  if (!meta) return escapeHtml(dictTTSState.lines[lineIndex] || '');
  if (meta.isStudyMode || !meta.blanks.length) return escapeHtml(meta.line);
  if (meta.blankMode === 'phrase') {
    return renderDictationSentenceModalPhraseBlankPreview(meta.tokens, meta.blanks, lineIndex);
  }
  return renderDictationSentenceModalWordBlankPreview(meta.tokens, meta.blanks, lineIndex);
}

function buildDictationPracticeMeta(sentenceEntry, level, lineIndex, blankMode = selectedDictBlankMode) {
  const line = sentenceEntry?.text || '';
  const tokens = String(line).split(/\s+/).map(splitDictationToken);
  const blankDefinitions = resolveDictationBlankDefinitions(sentenceEntry, tokens, level, blankMode);
  const html = blankMode === 'phrase'
    ? renderDictationPhraseBlankPreview(tokens, blankDefinitions, lineIndex)
    : renderDictationWordBlankPreview(tokens, blankDefinitions, lineIndex);

  return {
    line,
    level,
    blankMode,
    blankModeLabel: DICT_BLANK_MODE_LABELS[blankMode] || '단어',
    tokens,
    blanks: blankDefinitions,
    previewHtml: html,
    isStudyMode: level === 'easy' || !blankDefinitions.length,
  };
}

function getDictationBlankProfile(answer, tokenIndex, tokens) {
  const lower = String(answer || '').toLowerCase();
  const prevCore = tokens[tokenIndex - 1]?.core || '';
  const prevLower = prevCore.toLowerCase();
  const prev2Core = tokens[tokenIndex - 2]?.core || '';
  const prev2Lower = prev2Core.toLowerCase();
  const nextCore = tokens[tokenIndex + 1]?.core || '';
  const nextLower = nextCore.toLowerCase();
  const startsWithUpper = /^[A-Z]/.test(String(answer || ''));
  const endsWithEd = /ed$/i.test(lower);
  const endsWithEs = /es$/i.test(lower);
  const endsWithS = /s$/i.test(lower) && !endsWithEs;
  const endsWithIng = /ing$/i.test(lower);
  const isContraction = /'/.test(String(answer || ''));
  const isFunctionWord = DICT_FUNCTION_WORDS.has(lower);
  const isNumberLike = /\d/.test(String(answer || '')) || /^(first|second|third|fourth|fifth|once|twice)$/i.test(lower);
  const hasHyphen = /-/.test(String(answer || ''));
  const isConfusingWord = DICT_CONFUSING_WORDS.has(lower);

  const determiners = new Set(['a', 'an', 'the', 'this', 'that', 'these', 'those', 'my', 'your', 'our', 'their', 'his', 'her', 'its']);
  const clauseStarters = new Set(['that', 'if', 'when', 'where', 'why', 'how', 'whether', 'because']);
  const helperWords = new Set(['and', 'or', 'but', 'by', 'to', 'of', 'for', 'with', 'in', 'on']);

  const looksVerb = endsWithEd || endsWithIng || clauseStarters.has(nextLower) || ['writer', 'she', 'he', 'it', 'they', 'we', 'people', 'campaign', 'company'].includes(prevLower);
  const looksAdjective = !!nextCore && !clauseStarters.has(nextLower) && (
    determiners.has(prevLower) || prevLower === 'and' || determiners.has(prev2Lower)
  );
  const looksNoun = !looksVerb && !looksAdjective && (determiners.has(prevLower) || helperWords.has(prevLower));

  return {
    lower,
    prevCore,
    prevLower,
    prev2Core,
    prev2Lower,
    nextCore,
    nextLower,
    startsWithUpper,
    endsWithEd,
    endsWithEs,
    endsWithS,
    endsWithIng,
    isContraction,
    isFunctionWord,
    isNumberLike,
    hasHyphen,
    isConfusingWord,
    looksVerb,
    looksAdjective,
    looksNoun,
  };
}

function getDictationListeningChunk(answer, profile) {
  if (profile.isContraction) {
    return [profile.prevCore, answer, profile.nextCore].filter(Boolean).join(' ');
  }
  if (profile.isFunctionWord) {
    return [profile.prevCore, answer, profile.nextCore].filter(Boolean).join(' ');
  }
  if (profile.startsWithUpper) {
    return [profile.prevLower === 'by' ? profile.prevCore : '', answer, profile.nextCore].filter(Boolean).join(' ');
  }
  if (profile.looksAdjective) {
    return [profile.prevLower === 'and' ? profile.prev2Core : '', profile.prevCore, answer, profile.nextCore].filter(Boolean).join(' ');
  }
  return [profile.prevCore, answer, profile.nextCore].filter(Boolean).join(' ');
}

function getDictationEasyMeaning(answer, profile) {
  const glossary = DICT_KOREAN_GLOSSARY[profile.lower];
  if (glossary) return `쉽게 말하면 '${glossary}' 쪽 느낌입니다.`;
  if (profile.isContraction) return '쉽게 말하면 뜻보다 문장 리듬을 여는 짧은 입구 표현입니다.';
  if (profile.isFunctionWord) return '쉽게 말하면 뜻풀이보다 앞뒤를 붙여 주는 연결 고리입니다.';
  if (profile.isNumberLike) return '쉽게 말하면 정보의 숫자나 순서를 찍는 자리입니다.';
  if (profile.startsWithUpper) return '쉽게 말하면 내용 설명이 아니라 이름표를 찍는 자리입니다.';
  if (profile.looksAdjective) return `쉽게 말하면 뒤에 오는 ${profile.nextCore || '말'} 느낌을 살려 주는 꾸밈말입니다.`;
  if (profile.looksVerb) return "쉽게 말하면 이 문장에서 진짜 하고 싶은 말을 끌고 가는 '~한다' 자리입니다.";
  if (profile.looksNoun) return '쉽게 말하면 이 문장이 말하고 싶은 핵심 소재를 찍는 말입니다.';
  return '쉽게 말하면 이 문장 중심을 잡아 주는 핵심 단어입니다.';
}

function getDictationRoleMeaning(answer, profile) {
  if (profile.isContraction) return '문장을 여는 짧은 시작 표현';
  if (profile.isFunctionWord) return '앞뒤 소리를 이어 주는 기능어';
  if (profile.isNumberLike) return '숫자·순서·횟수 정보';
  if (profile.startsWithUpper) return '사람·책·작품 이름 같은 정보';
  if (profile.looksAdjective) return '뒤 명사를 꾸며 주는 말';
  if (profile.looksVerb) return '주어 다음 핵심 동사';
  if (profile.looksNoun) return '문장 핵심 소재를 찍는 명사';
  return '문장 중심을 잡는 핵심 단어';
}

function getDictationBlankExplanation(line, answer, tokenIndex, tokens) {
  const normalizedSentence = normalizeDictationSentence(line);
  const normalizedAnswer = normalizeDictationBlank(answer);
  const manual = DICT_BLANK_EXPLANATIONS[normalizedSentence]?.[normalizedAnswer];
  if (manual) return manual;

  const profile = getDictationBlankProfile(answer, tokenIndex, tokens);
  const chunk = getDictationListeningChunk(answer, profile);

  if (profile.isContraction) {
    return {
      easy: getDictationEasyMeaning(answer, profile),
      role: "소개나 의견을 시작할 때 말문을 여는 짧은 표현입니다. 단어 하나보다 리듬으로 익히는 쪽이 더 중요합니다.",
      listen: `\`${chunk}\`를 통째로 들으세요. 앞뒤를 끊지 말고 한 덩어리로 잡아야 자연스럽게 따라갑니다.`,
      trap: '소리가 짧고 약하게 지나가서 다른 단어로 착각하거나 apostrophe를 빼먹기 쉽습니다.',
    };
  }

  if (profile.startsWithUpper) {
    return {
      easy: getDictationEasyMeaning(answer, profile),
      role: `${getDictationRoleMeaning(answer, profile)}를 정확히 받아 적는 자리입니다. 내용 이해보다 '누구/무엇 이름인지'를 찍는 문제가 됩니다.`,
      listen: `\`${chunk}\`를 이름 한 세트로 들으세요. 특히 앞의 단서가 \`${profile.prevCore || '앞말'}\`이면 그 뒤에는 이름 정보가 온다고 먼저 예상하면 쉽습니다.`,
      trap: '익숙하지 않은 이름은 소리만 듣고 철자를 추측하게 되어 첫 음절만 적거나 끝 자음을 빼먹는 실수가 많습니다.',
    };
  }

  if (profile.isFunctionWord) {
    return {
      easy: getDictationEasyMeaning(answer, profile),
      role: `${getDictationRoleMeaning(answer, profile)}입니다. 내용어보다 소리가 약해서 오히려 시험에서 더 자주 빠지는 자리입니다.`,
      listen: `\`${chunk}\`를 붙여서 들으세요. ${answer}만 따로 찾지 말고 앞말과 뒷말 사이에서 약하게 스쳐 가는 소리로 잡는 게 핵심입니다.`,
      trap: '뜻이 쉬운 단어라 눈으로는 아는데, 실제 듣기에서는 약하게 붙어 지나가서 통째로 빠뜨리는 경우가 많습니다.',
    };
  }

  if (profile.isNumberLike) {
    return {
      easy: getDictationEasyMeaning(answer, profile),
      role: `${getDictationRoleMeaning(answer, profile)}를 정확히 찍는 자리입니다. 숫자 하나만 틀려도 정보 전체가 달라집니다.`,
      listen: `\`${chunk}\`처럼 숫자 앞뒤를 같이 들으세요. 숫자 자체보다 그 숫자를 받는 명사와 세트로 잡는 편이 안전합니다.`,
      trap: '숫자나 서수는 들리는 순간은 짧은데 정보 비중은 커서, 철자를 줄이거나 다른 수로 바꿔 적는 실수가 자주 납니다.',
    };
  }

  if (profile.endsWithEd || profile.looksVerb) {
    return {
      easy: getDictationEasyMeaning(answer, profile),
      role: `${getDictationRoleMeaning(answer, profile)}입니다. 한국어로는 결국 '~한다 / ~라고 말한다'처럼 문장 중심을 끌고 가는 자리입니다.`,
      listen: `주어 다음에 오는 \`${answer}\`를 먼저 잡고, 필요하면 \`${chunk}\`처럼 앞뒤까지 같이 들으세요.`,
      trap: profile.endsWithEd
        ? '-ed 끝소리가 약하게 들려 기본형으로 적거나 끝소리를 빼먹는 경우가 많습니다.'
        : '뒤 설명절이나 다음 명사에 끌려 핵심 동사를 흘려듣기 쉽습니다. 중심 동사인데도 그냥 지나가기 쉬운 자리입니다.',
    };
  }

  if (profile.endsWithIng) {
    return {
      easy: getDictationEasyMeaning(answer, profile),
      role: "'~하는 것 / ~하면서'처럼 움직임을 이어 주는 말입니다. 문장에 동작 느낌을 붙이는 자리라고 보면 됩니다.",
      listen: `\`${chunk}\`처럼 앞뒤를 같이 들으세요. 특히 -ing는 뒤로 흘러가듯 들려서 단어 경계가 쉽게 무너집니다.`,
      trap: '-ing의 g 소리를 빼먹거나 기본형으로 적는 경우가 많습니다. 앞단어와 붙어 들리면 경계를 놓치기 쉽습니다.',
    };
  }

  if (profile.endsWithEs || profile.endsWithS) {
    return {
      easy: getDictationEasyMeaning(answer, profile),
      role: `${getDictationRoleMeaning(answer, profile)}입니다. 단수/복수나 3인칭 흔적이 붙어 있어 문법 정보까지 같이 담는 자리입니다.`,
      listen: `\`${chunk}\`에서 끝소리까지 같이 들으세요. 앞부분만 잡고 넘어가면 마지막 -s/-es가 거의 안 들린 채 지나갑니다.`,
      trap: '뜻은 맞게 들었는데 끝의 -s/-es를 빼먹어 감점되는 유형이 매우 많습니다. 특히 복수형과 동사 활용형에서 자주 무너집니다.',
    };
  }

  if (profile.isConfusingWord) {
    return {
      easy: getDictationEasyMeaning(answer, profile),
      role: `${getDictationRoleMeaning(answer, profile)}입니다. 발음이 비슷한 짝이 있어 소리만 듣고 쓰면 헷갈리기 쉬운 자리입니다.`,
      listen: `\`${chunk}\`를 통째로 들으세요. 이 단어 하나보다 앞뒤 문맥에서 '무슨 역할인지'를 같이 잡아야 맞게 적을 수 있습니다.`,
      trap: 'to/too/two, than/then, their/there처럼 비슷하게 들리는 단어와 섞여 쓰기 쉽습니다. 문맥까지 같이 확인해야 안전합니다.',
    };
  }

  return {
    easy: getDictationEasyMeaning(answer, profile),
    role: `${getDictationRoleMeaning(answer, profile)}입니다. 이 단어를 놓치면 문장 중심이 흐려집니다.`,
    listen: `문장을 통째로 외우려 하지 말고 \`${chunk}\` 같은 작은 덩어리로 잡으세요. 이 빈칸은 그 덩어리 중심에서 시험 포인트를 찍는 자리입니다.`,
    trap: '소리만 대충 잡으면 철자 하나, 어미 하나, 끝소리 하나 때문에 바로 흔들립니다. 시험에서는 바로 이 작은 차이를 많이 묻습니다.',
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

const DICT_GUIDE_VERBS = new Set([
  'is', 'are', 'was', 'were', 'be', 'am', 'have', 'has', 'had', 'can', 'could', 'will', 'would',
  'should', 'may', 'might', 'must', 'do', 'does', 'did', 'make', 'makes', 'made', 'show', 'shows',
  'tell', 'tells', 'told', 'believe', 'believes', 'think', 'thinks', 'encourage', 'encourages',
  'start', 'starts', 'started', 'change', 'changes', 'changed', 'create', 'creates', 'created',
  'replace', 'replaced', 'require', 'requires', 'argue', 'argued', 'spread', 'transform', 'transformed',
  'combine', 'combines', 'travel', 'travels', 'let', 'lets', 'protect', 'protects', 'deserve', 'deserves',
  'emphasize', 'emphasizes',
]);

function cleanDictationGuideWord(word) {
  return String(word || '').replace(/^[^A-Za-z']+|[^A-Za-z']+$/g, '');
}

function isLikelyDictationVerb(word) {
  const lower = cleanDictationGuideWord(word).toLowerCase();
  if (!lower) return false;
  if (DICT_GUIDE_VERBS.has(lower)) return true;
  if (/(ed|ing)$/.test(lower)) return true;
  if (/s$/.test(lower) && lower.length > 3) return true;
  return false;
}

function shortenDictationChunk(chunk, maxWords = 5) {
  const words = String(chunk || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '';
  if (words.length <= maxWords) return words.join(' ');
  return `${words.slice(0, maxWords).join(' ')} ...`;
}

function extractDictationGuideParts(sentence) {
  const raw = String(sentence || '').replace(/[“”"]/g, '').replace(/\s+/g, ' ').trim();
  if (!raw) return { lead: '', core: '', tail: '' };

  let lead = '';
  let main = raw;
  const commaIndex = raw.indexOf(',');
  if (commaIndex > 0) {
    lead = raw.slice(0, commaIndex).trim();
    main = raw.slice(commaIndex + 1).trim();
  }

  const clauseMatch = main.match(/\b(that|if|when|where|because|which|who|why|how)\b/i);
  if (clauseMatch && clauseMatch.index > 0) {
    const markerIndex = clauseMatch.index;
    return {
      lead,
      core: main.slice(0, markerIndex).trim(),
      tail: main.slice(markerIndex).trim(),
    };
  }

  const words = main.split(/\s+/).filter(Boolean);
  const verbIndex = words.findIndex((word, index) => index > 0 && isLikelyDictationVerb(word));
  if (verbIndex > 0) {
    return {
      lead,
      core: words.slice(0, verbIndex + 1).join(' '),
      tail: words.slice(verbIndex + 1).join(' ').trim(),
    };
  }

  return {
    lead,
    core: words.slice(0, Math.min(4, words.length)).join(' '),
    tail: words.slice(Math.min(4, words.length)).join(' ').trim(),
  };
}

function buildDynamicDictationGuide(sentence) {
  const parts = extractDictationGuideParts(sentence);
  const lead = shortenDictationChunk(parts.lead, 5);
  const core = shortenDictationChunk(parts.core, 5);
  const tail = shortenDictationChunk(parts.tail, 6);

  const t = parts.lead && parts.tail
    ? `쉽게 보면 \`${lead}\`로 앞 분위기를 깔고, \`${core}\`에서 중심을 말한 뒤, \`${tail}\`가 뒤 메시지로 붙는 문장입니다.`
    : parts.tail
      ? `쉽게 보면 \`${core}\`가 중심이고, 뒤의 \`${tail}\`가 그 뜻을 보충하는 문장입니다.`
      : `쉽게 보면 \`${core}\`가 이 문장의 핵심 뜻을 거의 다 끌고 가는 문장입니다.`;

  const p = [lead, core, tail].filter(Boolean).join(' / ');

  const m = parts.lead && parts.tail
    ? `앞 설명 \`${lead}\`에 끌려 중심 \`${core}\`를 놓치거나, 뒤 메시지 \`${tail}\`를 통째로 못 잡는 경우가 많습니다.`
    : parts.tail
      ? `앞 핵심 \`${core}\`는 들었는데, 뒤에 붙는 \`${tail}\`를 날려서 문장 뜻을 반만 이해하는 경우가 많습니다.`
      : `짧은 문장처럼 보여도 \`${core}\` 안의 중심 단어를 하나 놓치면 뜻이 바로 흐려집니다.`;

  const c = parts.lead && parts.tail
    ? `\`${lead}\` / \`${core}\` / \`${tail}\` 세 덩어리로 끊어 들으세요.`
    : parts.tail
      ? `\`${core}\` / \`${tail}\` 두 덩어리로 먼저 잡고, 필요하면 안에서 다시 쪼개 들으세요.`
      : `\`${core}\`를 한 덩어리로 먼저 잡고, 안에서 핵심 단어를 다시 확인하세요.`;

  return { t, p, m, c };
}

function getDictationGuide(sentenceEntry) {
  const manualGuide = sentenceEntry?.guide;
  if (manualGuide?.t && manualGuide?.p && manualGuide?.m && manualGuide?.c) {
    return manualGuide;
  }

  let base = String(sentenceEntry?.text || sentenceEntry || '').trim();
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
    return buildDynamicDictationGuide(base);
  }
  return {
    t: [baseGuide.t, ...extras.map((item) => item.t)].join(''),
    p: [baseGuide.p, ...extras.map((item) => item.p)].filter(Boolean).join(' · '),
    m: [baseGuide.m, ...extras.map((item) => item.m)].filter(Boolean).join(' '),
    c: [baseGuide.c, ...extras.map((item) => item.c)].filter(Boolean).join(' '),
  };
}

function buildDictationBlankGuideHtml(blank, blankIndex, lineIndex, level) {
  const tagToneClass = (tag) => {
    const value = String(tag || '');
    if (value.includes('⭐')) return 'is-core';
    if (value.includes('🔥')) return 'is-trap';
    if (value.includes('🎯')) return 'is-exam';
    if (value.includes('⚠️')) return 'is-mix';
    return '';
  };
  const explanation = blank.explanation || {};
  const coreText = explanation.core || [explanation.easy, explanation.role].filter(Boolean).join(' / ');
  const hintText = blank.hint
    ? `<div class="dict-blank-hint"><strong>${escapeHtml(DICT_LEVEL_LABELS[level] || level)} 힌트</strong><span>${escapeHtml(blank.hint)}</span></div>`
    : '';
  const tagText = Array.isArray(blank.tags) && blank.tags.length
    ? `
      <div class="dict-blank-tag-list">
        ${blank.tags.map((tag) => `<span class="dict-blank-tag ${tagToneClass(tag)}">${escapeHtml(tag)}</span>`).join('')}
      </div>
    `
    : '';
  const coachLine = blank.coachLine
    ? `
      <div class="dict-blank-coachline">
        <strong>1타 코멘트</strong>
        <p>${escapeHtml(blank.coachLine)}</p>
      </div>
    `
    : '';
  const difficultyText = blank.difficulty?.basis
    ? `<p class="dict-blank-footnote"><strong>난도 근거:</strong> ${escapeHtml(blank.difficulty.basis)}</p>`
    : '';
  const wrongPatterns = Array.isArray(blank.wrongPatterns) && blank.wrongPatterns.length
    ? `
      <div class="dict-wrong-patterns">
        ${blank.wrongPatterns.map((item) => `
          <div class="dict-wrong-pattern-item">❌ ${escapeHtml(item.answer || '(무응답)')} — ${escapeHtml(item.reason || '')}</div>
        `).join('')}
      </div>
    `
    : '';
  const diagnosis = Array.isArray(blank.diagnosis) && blank.diagnosis.length
    ? `
      <div class="dict-blank-diagnosis">
        <div class="dict-blank-section-label">오답 진단표</div>
        ${blank.diagnosis.map((item) => `
          <div class="dict-blank-diagnosis-row">
            <div class="dict-blank-diagnosis-cell">
              <strong>증상</strong>
              <span>${escapeHtml(item.symptom || '')}</span>
            </div>
            <div class="dict-blank-diagnosis-cell">
              <strong>원인</strong>
              <span>${escapeHtml(item.cause || '')}</span>
            </div>
            <div class="dict-blank-diagnosis-cell">
              <strong>처방</strong>
              <span>${escapeHtml(item.fix || '')}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `
    : '';
  const passBlock = blank.selfCheck?.passCriteria || (Array.isArray(blank.selfCheck?.routine) && blank.selfCheck.routine.length)
    ? `
      <div class="dict-blank-pass">
        <div class="dict-blank-section-label">합격 기준</div>
        ${blank.selfCheck?.question ? `<p class="dict-blank-pass-question">${escapeHtml(blank.selfCheck.question)}</p>` : ''}
        ${blank.selfCheck?.passCriteria ? `<p class="dict-blank-pass-criteria">✅ ${escapeHtml(blank.selfCheck.passCriteria)}</p>` : ''}
        ${Array.isArray(blank.selfCheck?.routine) && blank.selfCheck.routine.length ? `
          <div class="dict-blank-routine-list">
            ${blank.selfCheck.routine.map((item) => `
              <div class="dict-blank-routine-item">
                <strong>루틴 ${escapeHtml(item.step || '')}</strong>
                <span>${escapeHtml(item.do || '')}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `
    : '';
  return `
    <div class="dict-blank-guide-card">
      <div class="dict-blank-head">
        <div>
          <div class="dict-coach-tag">빈칸 ${blankIndex + 1}</div>
          <div class="dict-blank-answer-row">
            <strong>${escapeHtml(blank.answer)}</strong>
            ${blank.pos ? `<span>${escapeHtml(blank.pos)}</span>` : ''}
          </div>
        </div>
        ${tagText}
      </div>
      <div class="dict-guide-answer" id="dict-guide-answer-${lineIndex}-${blankIndex}" hidden>
        <p><strong>정답:</strong> ${escapeHtml(blank.answer)}</p>
        ${blank.pos ? `<p><strong>문법/역할:</strong> ${escapeHtml(blank.pos)}</p>` : ''}
      </div>
      ${coachLine}
      ${hintText}
      <div class="dict-blank-note-grid">
        ${coreText ? `<div class="dict-blank-note-row"><strong>CORE</strong><span>${escapeHtml(coreText)}</span></div>` : ''}
        ${explanation.listen ? `<div class="dict-blank-note-row"><strong>LISTEN</strong><span>${escapeHtml(explanation.listen)}</span></div>` : ''}
        ${explanation.trap ? `<div class="dict-blank-note-row"><strong>TRAP</strong><span>${escapeHtml(explanation.trap)}</span></div>` : ''}
      </div>
      ${difficultyText}
      ${wrongPatterns}
      ${diagnosis}
      ${passBlock}
    </div>
  `;
}

function buildDictationCommentaryHtml(sentenceEntry, guide, lineIndex) {
  const commentary = sentenceEntry?.commentary;
  const fullMeaning = sentenceEntry?.fullMeaning;
  if (!commentary?.learningGoal && !fullMeaning?.natural) {
    return `
      <div class="dict-coach-grid">
        <div class="dict-coach-block">
          <div class="dict-coach-tag">문장 전체 해석</div>
          <p>${escapeHtml(guide.t)}</p>
        </div>
        <div class="dict-coach-block">
          <div class="dict-coach-tag">귀에 걸어둘 소리</div>
          <p>${escapeHtml(guide.p)}</p>
        </div>
        <div class="dict-coach-block">
          <div class="dict-coach-tag">시험 함정</div>
          <p>${escapeHtml(guide.m)}</p>
        </div>
        <div class="dict-coach-block">
          <div class="dict-coach-tag">문장 쪼개기</div>
          <p>${escapeHtml(guide.c)}</p>
        </div>
      </div>
    `;
  }

  const pronunciationRows = [
    ['연음', commentary?.pronunciation?.linking],
    ['약형', commentary?.pronunciation?.weakForm],
    ['강세', commentary?.pronunciation?.stress],
    ['귀에 걸어둘 소리', guide?.p],
    ['문장 쪼개기', guide?.c],
  ].filter(([, value]) => value);

  const wrongReasons = [
    ...(Array.isArray(commentary?.wrongReasons) ? commentary.wrongReasons : []),
    guide?.m || '',
  ].filter(Boolean);

  const selfChecks = (Array.isArray(commentary?.selfCheck) ? commentary.selfCheck : []).slice(0, 3);
  const pronunciationGap = Array.isArray(commentary?.pronunciationGap) ? commentary.pronunciationGap : [];

  return `
    <div class="dict-commentary-panel">
      ${pronunciationGap.length ? `
        <div class="dict-commentary-section">
          <div class="dict-coach-tag">발음 갭</div>
          <div class="dict-pron-gap-list">
            ${pronunciationGap.map((item) => `
              <div class="dict-pron-gap-card">
                <div class="dict-pron-gap-head">
                  <strong>${escapeHtml(item.word || '')}</strong>
                  ${item.pos ? `<span>${escapeHtml(item.pos)}</span>` : ''}
                </div>
                <div class="dict-pron-gap-row">
                  <label>외운 소리</label>
                  <div>
                    <div class="dict-pron-syllables">
                      ${(Array.isArray(item.known?.syllables) ? item.known.syllables : []).map((syllable) => `
                        <span class="dict-pron-syllable is-${escapeHtml(syllable.type || 'normal')}">${escapeHtml(syllable.text || '')}</span>
                      `).join('')}
                    </div>
                    ${item.known?.desc ? `<p>${escapeHtml(item.known.desc)}</p>` : ''}
                  </div>
                </div>
                <div class="dict-pron-gap-row">
                  <label>실제 소리</label>
                  <div>
                    <div class="dict-pron-syllables">
                      ${(Array.isArray(item.actual?.syllables) ? item.actual.syllables : []).map((syllable) => `
                        <span class="dict-pron-syllable is-${escapeHtml(syllable.type || 'normal')}">${escapeHtml(syllable.text || '')}</span>
                      `).join('')}
                    </div>
                    ${item.actual?.hearPoint ? `<p class="dict-pron-hear-point">${escapeHtml(item.actual.hearPoint)}</p>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">발음 포인트</div>
        <div class="dict-commentary-list">
          ${pronunciationRows.map(([label, value]) => `
            <div class="dict-commentary-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>
          `).join('')}
        </div>
      </div>
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">자주 틀리는 이유</div>
        <div class="dict-commentary-bullets">
          ${wrongReasons.map((item) => `<div>${escapeHtml(item)}</div>`).join('')}
        </div>
      </div>
      <div class="dict-commentary-section dict-commentary-section--tip">
        <div class="dict-coach-tag">쉐도잉 팁</div>
        <p>${escapeHtml(commentary?.shadowingTip || guide.c)}</p>
      </div>
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">자기 점검</div>
        <div class="dict-self-check-list">
          ${selfChecks.map((item, itemIndex) => `
            <div class="dict-self-check-card">
              <label class="dict-self-check-item" for="dict-self-check-${lineIndex}-${itemIndex}">
                <input class="dict-self-check-input" id="dict-self-check-${lineIndex}-${itemIndex}" type="checkbox">
                <span class="dict-self-check-box"></span>
                <span>${escapeHtml(typeof item === 'string' ? item : item?.question || '')}</span>
              </label>
              ${Array.isArray(item?.solutions) && item.solutions.length ? `
                <button type="button" class="dict-self-check-toggle" onclick="toggleDictationSelfCheckSolution(${lineIndex}, ${itemIndex})">해결 단계 보기</button>
                <div class="dict-self-check-solution" id="dict-self-check-solution-${lineIndex}-${itemIndex}" hidden>
                  ${item.solutions.map((solution) => `
                    <div class="dict-self-check-step">
                      <strong>${escapeHtml(String(solution.step || ''))}</strong>
                      <span>${escapeHtml(solution.desc || '')}</span>
                    </div>
                  `).join('')}
                  ${item.goalTip ? `<div class="dict-self-check-goal">${escapeHtml(item.goalTip)}</div>` : ''}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function buildDictationLearningGoalHtml(sentenceEntry, guide) {
  const commentary = sentenceEntry?.commentary;
  const learningGoal = commentary?.learningGoal || guide?.t;
  if (!learningGoal) return '';
  return `
    <div class="dict-commentary-section dict-commentary-section--goal dict-commentary-section--prelude">
      <div class="dict-coach-tag">학습 목표</div>
      <p>${escapeHtml(learningGoal)}</p>
    </div>
  `;
}

function buildDictationFullMeaningHtml(sentenceEntry) {
  const fullMeaning = sentenceEntry?.fullMeaning;
  if (!fullMeaning?.literal && !fullMeaning?.natural && !fullMeaning?.context) return '';
  return `
    <div class="dict-commentary-section dict-commentary-section--summary">
      <div class="dict-coach-tag">문장 전체 의미</div>
      <div class="dict-commentary-list">
        ${fullMeaning?.literal ? `<div class="dict-commentary-row"><strong>직역</strong><span>${escapeHtml(fullMeaning.literal)}</span></div>` : ''}
        ${fullMeaning?.natural ? `<div class="dict-commentary-row"><strong>자연번역</strong><span>${escapeHtml(fullMeaning.natural)}</span></div>` : ''}
        ${fullMeaning?.context ? `<div class="dict-commentary-row"><strong>상황</strong><span>${escapeHtml(fullMeaning.context)}</span></div>` : ''}
      </div>
    </div>
  `;
}

function getDictationConceptDataPath(sentenceEntry) {
  const conceptDataPaths = {
    'dot-s01': '../data/english-dictation/topic01-the-dot/s01.json',
    'dot-s02': '../data/english-dictation/topic01-the-dot/s02.json',
  };
  return conceptDataPaths[String(sentenceEntry?.id || '')] || '';
}

function escapeDictationJsString(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

// Sentence JSON is split into exam-essential and advanced study lanes.
// Keep this mapping stable so future prompt outputs can target the same UI slots.
function buildDictationConceptSections(sentenceEntry) {
  const commentary = sentenceEntry?.commentary || {};
  const toeic = sentenceEntry?.examModes?.toeic || {};
  const school = sentenceEntry?.examModes?.schoolInterview || {};
  const opic = sentenceEntry?.examModes?.opic || {};
  const toeics = sentenceEntry?.examModes?.toeicSpeaking || {};
  const grammarSummary = (() => {
    const patterns = Array.isArray(toeic.keyPatterns) && toeic.keyPatterns.length
      ? toeic.keyPatterns
      : ["would like to", 'by + 저자'];
    return patterns.slice(0, 2).join(' / ');
  })();
  const pronunciationSummary = [
    commentary?.pronunciation?.linking ? '연음' : '',
    commentary?.pronunciation?.stress ? '강세' : '',
    commentary?.pronunciation?.weakForm ? '약형' : '',
  ].filter(Boolean).join(' · ') || '연음 · 강세 · 약형';
  const blankSummary = (sentenceEntry?.blanks || []).map((blank) => blank.answer).slice(0, 3).join(' · ') || '핵심 빈칸';
  const meaningSummary = '직역 · 자연 · 상황';
  const schoolSummary = Array.isArray(school.answerFlow) && school.answerFlow.length
    ? school.answerFlow.slice(0, 3).map((item) => item.label).join(' · ')
    : '시작 · 핵심 이유 · 마무리';
  const opicSummary = Array.isArray(opic.answerFlow) && opic.answerFlow.length
    ? opic.answerFlow.slice(0, 3).map((item) => item.label).join(' · ')
    : '오프닝 · 이유 · 마무리';
  const toeicSpeakingSummary = Array.isArray(toeics.responseFrames) && toeics.responseFrames.length
    ? toeics.responseFrames.slice(0, 3).map((item) => item.label).join(' · ')
    : '의견 · 이유 · 예시';
  const vocabularySummary = (sentenceEntry?.vocabulary || []).map((item) => item.word).slice(0, 3).join(' · ') || '핵심어 · 표현';
  return [
    {
      key: 'essential',
      label: '시험 필수',
      summary: '받아쓰기 · 해석 · 빈칸 · 발음',
      cards: [
        { key: 'blanks', label: '빈칸 해설', summary: blankSummary },
        { key: 'pronunciation', label: '발음·듣기', summary: pronunciationSummary },
        { key: 'vocabulary', label: '핵심 어휘', summary: vocabularySummary },
        { key: 'meaning', label: '문장 해석', summary: meaningSummary },
        { key: 'grammar', label: '문법 포인트', summary: grammarSummary },
      ],
    },
    {
      key: 'advanced',
      label: '심화 확장',
      summary: '학교면접 · 오픽 · 토익스피킹',
      cards: [
        { key: 'schoolInterview', label: '학교면접', summary: schoolSummary },
        { key: 'opic', label: '오픽', summary: opicSummary },
        { key: 'toeicSpeaking', label: '토익스피킹', summary: toeicSpeakingSummary },
      ],
    },
  ];
}

function buildDictationPronunciationGapHtml(items) {
  if (!Array.isArray(items) || !items.length) return '';
  return `
    <div class="dict-pron-gap-list">
      ${items.map((item) => `
        <div class="dict-pron-gap-card">
          <div class="dict-pron-gap-head">
            <strong>${escapeHtml(item.word || '')}</strong>
            ${item.pos ? `<span>${escapeHtml(item.pos)}</span>` : ''}
          </div>
          <div class="dict-pron-gap-row">
            <label>외운 소리</label>
            <div>
              <div class="dict-pron-syllables">
                ${(Array.isArray(item.known?.syllables) ? item.known.syllables : []).map((syllable) => `
                  <span class="dict-pron-syllable is-${escapeHtml(syllable.type || 'normal')}">${escapeHtml(syllable.text || '')}</span>
                `).join('')}
              </div>
              ${item.known?.desc ? `<p>${escapeHtml(item.known.desc)}</p>` : ''}
              <div class="dict-concept-tts-row">
                ${buildDictationConceptTTSButtons(item.known?.ttsText || item.word || '', [item.known?.ttsRate || 1, 0.6], ['보통 속도', '느리게'], `known-${escapeDictationJsString(item.word || 'gap')}`)}
              </div>
            </div>
          </div>
          <div class="dict-pron-gap-row">
            <label>실제 소리</label>
            <div>
              <div class="dict-pron-syllables">
                ${(Array.isArray(item.actual?.syllables) ? item.actual.syllables : []).map((syllable) => `
                  <span class="dict-pron-syllable is-${escapeHtml(syllable.type || 'normal')}">${escapeHtml(syllable.text || '')}</span>
                `).join('')}
              </div>
              ${item.actual?.hearPoint ? `<p class="dict-pron-hear-point">${escapeHtml(item.actual.hearPoint)}</p>` : ''}
              <div class="dict-concept-tts-row">
                ${buildDictationConceptTTSButtons(item.actual?.ttsText || item.word || '', [item.actual?.ttsRate || 1, item.actual?.ttsRateSlow || 0.75], ['실제 속도로 듣기', `${Number(item.actual?.ttsRateSlow || 0.75).toFixed(2).replace(/0$/, '')}x`], `actual-${escapeDictationJsString(item.word || 'gap')}`)}
              </div>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function buildDictationConceptTTSButtons(text, rates, labels, keyPrefix) {
  const values = Array.isArray(rates) && rates.length ? rates : [1];
  return values.map((rate, index) => {
    const buttonId = `dict-concept-tts-${keyPrefix}-${index}`.replace(/[^a-zA-Z0-9_-]/g, '-');
    return `
      <button
        type="button"
        id="${buttonId}"
        class="dict-concept-tts-btn${index > 0 ? ' slow' : ''}"
        onclick="playDictationConceptTTS('${escapeDictationJsString(buttonId)}', '${escapeDictationJsString(text)}', ${Number(rate) || 1})"
      >
        ▶ ${escapeHtml(labels?.[index] || `${Number(rate).toFixed(1)}x 듣기`)}
      </button>
    `;
  }).join('');
}

function buildDictationConceptFlowBox(sentenceEntry) {
  const guide = sentenceEntry?.guide || {};
  const units = Array.isArray(guide.flowUnits) ? guide.flowUnits : [];
  if (!units.length) return '';
  return `
    <div class="dict-flow-box">
      <div class="dict-flow-label">끊어 읽기 단위 ( / = 짧은 쉼 )</div>
      <div class="dict-flow-line">
        ${units.map((unit, index) => `
          ${index ? '<span class="dict-flow-arrow">/</span>' : ''}
          <span class="dict-flow-word tone-${escapeHtml(unit.tone || 'a')}${unit.subtle ? ' subtle' : ''}">${escapeHtml(unit.text || '')}</span>
        `).join('')}
      </div>
      ${guide.fullHeard ? `<div class="dict-flow-heard">${escapeHtml(guide.fullHeard)}</div>` : ''}
      <div class="dict-concept-tts-row">
        ${buildDictationConceptTTSButtons(sentenceEntry?.tts?.text || sentenceEntry?.text || '', sentenceEntry?.tts?.rates || [1, 0.7, 0.5], ['전체 문장 듣기', '0.7x 느리게', '0.5x 아주 느리게'], 'sentence')}
      </div>
      <div class="dict-flow-legend">
        <div><span class="dict-flow-dot tone-a"></span>강세 음절</div>
        <div><span class="dict-flow-dot tone-b"></span>약형/축약</div>
        <div><span class="dict-flow-dot tone-d"></span>연음 뭉침</div>
        <div><span class="dict-flow-dot ghost"></span>거의 안 들림</div>
      </div>
    </div>
  `;
}

function stopDictationConceptTTS() {
  if (!supportsDictationTTS()) return;
  window.speechSynthesis.cancel();
  if (dictConceptTTSState.currentButtonId) {
    document.getElementById(dictConceptTTSState.currentButtonId)?.classList.remove('playing');
  }
  dictConceptTTSState.currentButtonId = '';
  dictConceptTTSState.currentUtterance = null;
}

function playDictationConceptTTS(buttonId, text, rate = 1) {
  if (!supportsDictationTTS()) {
    showToast('이 브라우저는 TTS를 지원하지 않습니다');
    return;
  }
  const phrase = String(text || '').trim();
  if (!phrase) {
    showToast('재생할 문장이 없습니다');
    return;
  }
  const button = document.getElementById(buttonId);
  const wasSame = dictConceptTTSState.currentButtonId === buttonId;
  stopDictationTTS({ preserveStatus: true });
  stopDictationConceptTTS();
  if (wasSame) return;
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = 'en-US';
  utterance.rate = Number(rate) || 1;
  const voice = getEnglishDictationVoices().find((item) => /en-us/i.test(item.lang)) || getEnglishDictationVoices()[0] || null;
  if (voice) utterance.voice = voice;
  utterance.onstart = () => {
    button?.classList.add('playing');
    dictConceptTTSState.currentButtonId = buttonId;
    dictConceptTTSState.currentUtterance = utterance;
    setDictationTTSStatus(`재생 중: ${phrase}`, 'active');
  };
  utterance.onend = utterance.onerror = () => {
    button?.classList.remove('playing');
    dictConceptTTSState.currentButtonId = '';
    dictConceptTTSState.currentUtterance = null;
    setDictationTTSStatus('재생 완료', 'active');
  };
  window.speechSynthesis.resume();
  window.setTimeout(() => window.speechSynthesis.speak(utterance), 40);
}

function buildDictationConceptPriorityHtml({ tag = '1타 첨삭', title = '', priority = '', training = '', target = '', warning = '' }) {
  const badges = [
    priority ? `<span class="dict-concept-badge is-critical">중요도 ${escapeHtml(priority)}</span>` : '',
    training ? `<span class="dict-concept-badge">${escapeHtml(training)}</span>` : '',
    target ? `<span class="dict-concept-badge is-soft">${escapeHtml(target)}</span>` : '',
  ].filter(Boolean).join('');
  return `
    <div class="dict-commentary-section dict-concept-priority">
      <div class="dict-coach-tag">${escapeHtml(tag)}</div>
      ${title ? `<p class="dict-concept-priority-title">${escapeHtml(title)}</p>` : ''}
      ${badges ? `<div class="dict-concept-badge-row">${badges}</div>` : ''}
      ${warning ? `<p class="dict-concept-warning">${escapeHtml(warning)}</p>` : ''}
    </div>
  `;
}

function buildDictationConceptDrillHtml(items) {
  const drills = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!drills.length) return '';
  return `
    <div class="dict-concept-drill-list">
      ${drills.map((item) => `
        <div class="dict-concept-drill-item">
          <strong>${escapeHtml(item.label || '')}</strong>
          <span>${escapeHtml(item.text || '')}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function buildDictationConceptSelfCheckHtml(items) {
  const checks = Array.isArray(items) ? items.filter((item) => item?.question) : [];
  if (!checks.length) return '';
  return `
    <div class="dict-commentary-section">
      <div class="dict-coach-tag">통과 기준</div>
      <div class="dict-concept-check-list">
        ${checks.map((item) => `
          <div class="dict-concept-check-card">
            <p class="dict-concept-check-question">${escapeHtml(item.question || '')}</p>
            ${Array.isArray(item.solutions) && item.solutions.length ? `
              <div class="dict-commentary-bullets">
                ${item.solutions.map((solution) => `<div>${escapeHtml(solution.desc || '')}</div>`).join('')}
              </div>
            ` : ''}
            ${item.goalTip ? `<p class="dict-concept-check-goal">${escapeHtml(item.goalTip)}</p>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// Grammar tab should coach the student on what must be memorized, not just list rules.
function buildDictationConceptGrammarHtml(sentenceEntry) {
  const toeic = sentenceEntry?.examModes?.toeic || {};
  const patterns = Array.isArray(toeic.keyPatterns) && toeic.keyPatterns.length
    ? toeic.keyPatterns
    : ["I'd like to + 동사원형", 'by + 사람'];
  const grammarCards = [
    {
      title: "I'd like to = I would like to",
      summary: '`would like to + 동사원형`을 통째로 외워야 발표 시작이 흔들리지 않습니다.',
      why: '축약형을 못 알아보면 듣기, 독해, 말하기에서 전부 속도가 끊깁니다.',
      drill: '3초 안에 `I would like to`와 `I\'d like to`를 서로 바꿔 말하기 5회',
    },
    {
      title: 'introduce + 목적어',
      summary: '`introduce` 뒤에는 사람, 책, 주제 같은 목적어가 바로 옵니다.',
      why: '`introduce about`처럼 전치사를 붙이면 점수가 바로 깎이는 대표 실수입니다.',
      drill: '`introduce a book / a speaker / myself` 3세트를 소리 내어 반복',
    },
    {
      title: 'by + 사람',
      summary: '`The Dot by Peter Reynolds`처럼 작품과 저자를 묶는 기본 전치사입니다.',
      why: '`of / with / from`과 헷갈리면 토익 전치사 문제와 독해 해석이 같이 무너집니다.',
      drill: '`a book by ~`, `a song by ~`, `a movie by ~`로 바꿔 말하기',
    },
  ];
  return `
    ${buildDictationConceptPriorityHtml({
      title: '이 문장은 문법 설명보다 발표 시작 구조를 통째로 암기해야 점수가 납니다.',
      priority: '★★★★★',
      training: '필수 암기 + 이해 필수',
      target: '3초 안에 구조 복원',
      warning: '여기서 `would like to`, `introduce`, `by + 사람`을 못 잡으면 뒤에서 아무리 반복해도 계속 틀립니다.',
    })}
    <div class="dict-commentary-section">
        <div class="dict-coach-tag">무조건 외울 구조</div>
        <div class="dict-concept-chip-list">
          ${patterns.map((item) => `<span class="dict-concept-chip">${escapeHtml(item)}</span>`).join('')}
        </div>
        <p class="dict-concept-emphasis">이 문법 탭의 목적은 규칙 암기가 아니라, 시험장에서 바로 꺼내 쓸 구조를 몸에 붙이는 것입니다.</p>
        <div class="dict-concept-study-grid">
          ${grammarCards.map((card) => `
            <div class="dict-concept-study-card">
              <strong>${escapeHtml(card.title)}</strong>
              <p>${escapeHtml(card.summary)}</p>
            <div class="dict-commentary-bullets">
              <div>${escapeHtml(card.why)}</div>
              <div>${escapeHtml(card.drill)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ${(toeic.grammarPoints || []).length ? `
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">시험에서 걸리는 이유</div>
        <div class="dict-commentary-bullets">
          ${(toeic.grammarPoints || []).map((point) => `<div>${escapeHtml(point.label || '')} · ${escapeHtml(point.desc || '')}</div>`).join('')}
        </div>
      </div>
    ` : ''}
    ${buildDictationConceptDrillHtml([
      { label: '암기', text: '`I would like to`를 축약형과 원형으로 5번씩 바꿔 말하세요.' },
      { label: '적용', text: '`introduce` 뒤 목적어를 바꿔 새 문장 3개를 직접 만드세요.' },
      { label: '점검', text: '`by + 사람`이 보이면 저자 표시라고 바로 말할 수 있어야 합니다.' },
    ])}
  `;
}

function buildDictationConceptPronunciationHtml(sentenceEntry) {
  const commentary = sentenceEntry?.commentary || {};
  const guide = sentenceEntry?.guide || {};
  const pronunciationItems = [
    { label: '연음', value: commentary?.pronunciation?.linking },
    { label: '약형', value: commentary?.pronunciation?.weakForm },
    { label: '강세', value: commentary?.pronunciation?.stress },
  ].filter((item) => item.value);
  return `
    ${pronunciationItems.length ? `
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">발음 3포인트</div>
        <div class="dict-pron-summary-grid">
          ${pronunciationItems.map((item) => `
            <div class="dict-pron-summary-card">
              <div class="dict-pron-summary-tag">${escapeHtml(item.label)}</div>
              <div class="dict-pron-summary-text">${escapeHtml(item.value)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
    ${buildDictationPronunciationGapHtml(commentary?.pronunciationGap || [])}
    ${buildDictationConceptFlowBox(sentenceEntry)}
    ${(guide?.p || guide?.c) ? `
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">귀에 걸어둘 소리</div>
        <div class="dict-commentary-list">
          ${guide?.p ? `<div class="dict-commentary-row"><strong>끊어 듣기</strong><span>${escapeHtml(guide.p)}</span></div>` : ''}
          ${guide?.c ? `<div class="dict-commentary-row"><strong>듣는 요령</strong><span>${escapeHtml(guide.c)}</span></div>` : ''}
        </div>
      </div>
    ` : ''}
  `;
}

function buildDictationConceptBlanksHtml(sentenceEntry, lineIndex) {
  const practiceMeta = dictPracticeMeta[lineIndex];
  const blanks = Array.isArray(practiceMeta?.blanks) ? practiceMeta.blanks : [];
  const blankAnswers = blanks.map((blank) => blank.answer).filter(Boolean).join(' · ');
  return `
    ${buildDictationConceptPriorityHtml({
      title: '빈칸 탭은 해설 읽는 곳이 아니라, 어디서 점수가 깎이는지 먼저 찍고 바로 교정 루프로 들어가는 곳입니다.',
      priority: '★★★★★',
      training: '반복 훈련',
      target: '빈칸 신호 즉시 반응',
      warning: '순서는 고정입니다. 호통 -> 진단 -> 처방 -> 합격 기준. 이 흐름이 안 잡히면 같은 오답을 계속 반복합니다.',
    })}
    <div class="dict-commentary-section">
      <div class="dict-coach-tag">이번 문장에서 먼저 적어야 할 답</div>
      <div class="dict-concept-chip-list">
        ${blanks.map((blank) => `<span class="dict-concept-chip">${escapeHtml(blank.answer || '')}</span>`).join('')}
      </div>
      <div class="dict-commentary-bullets">
        <div>${escapeHtml(blankAnswers || '핵심 빈칸을 먼저 고정하세요.')}</div>
        <div>순서는 '소리 확인 -> 철자 확정 -> 오답 사고경로 차단'으로 가져가야 실전에서 덜 흔들립니다.</div>
      </div>
    </div>
    <div class="dict-blank-guide-list">
      ${blanks.map((blank, blankIndex) => buildDictationBlankGuideHtml(blank, blankIndex, lineIndex, dictLineLevels[lineIndex] || selectedDictLevel)).join('')}
    </div>
    ${buildDictationConceptDrillHtml([
      { label: '1차', text: '정답 가리고 소리만 듣고 빈칸을 적으세요. 해석은 나중입니다.' },
      { label: '2차', text: '틀린 빈칸은 무조건 진단표 원인과 연결해서 다시 써야 합니다.' },
      { label: '통과', text: 'passCriteria를 찍기 전에는 이 문장 끝난 게 아닙니다.' },
    ])}
  `;
}

// Meaning tab must separate "understand the sentence" from "see how the test will trap it".
function buildDictationConceptMeaningHtml(sentenceEntry) {
  const toeic = sentenceEntry?.examModes?.toeic || {};
  const fullMeaning = sentenceEntry?.fullMeaning || {};
  const meaningHtml = buildDictationFullMeaningHtml(sentenceEntry);
  const toeicHtml = (toeic.learningGoal || toeic.coachLine || toeic.fastRule || (toeic.quickChecks || []).length) ? `
    <div class="dict-commentary-section">
      <div class="dict-coach-tag">시험에서 이렇게 걸린다</div>
      <p>${escapeHtml(toeic.coachLine || toeic.learningGoal || '이 문장은 토익에서 패턴과 전치사 포인트를 함께 묻기 좋은 구조입니다.')}</p>
      ${toeic.fastRule ? `<p class="dict-concept-emphasis">${escapeHtml(toeic.fastRule)}</p>` : ''}
      ${(toeic.quickChecks || []).length ? `
        <div class="dict-commentary-bullets">
          ${(toeic.quickChecks || []).map((item) => `<div>${escapeHtml(item.stem || item.question || '')} ${escapeHtml(item.rationale || item.answer || '')}</div>`).join('')}
        </div>
      ` : ''}
    </div>
  ` : '';
  const coachIntroHtml = (fullMeaning.literal || fullMeaning.natural || fullMeaning.context) ? `
    ${buildDictationConceptPriorityHtml({
      title: '해석 탭은 문장 뜻을 아는 데서 끝나면 안 되고, 그 뜻으로 빈칸을 역추론할 수 있어야 합니다.',
      priority: '★★★★☆',
      training: '이해 + 문맥 추론',
      target: '뜻 보고 빈칸 예측',
      warning: '직역만 보고 넘어가면 시험에서는 단어는 알아도 빈칸을 못 메우는 상태가 됩니다.',
    })}
    <div class="dict-commentary-section">
      <div class="dict-coach-tag">1타 강사 코멘트</div>
      <div class="dict-commentary-bullets">
        ${fullMeaning.natural ? `<div>이 문장은 ${escapeHtml(fullMeaning.natural)}처럼 자연스럽게 이해돼야 문맥으로 빈칸을 추론할 수 있습니다.</div>` : ''}
        ${fullMeaning.context ? `<div>${escapeHtml(fullMeaning.context)}</div>` : ''}
        <div>시험에서는 해석을 보기 위한 탭이 아니라, 빈칸 앞뒤 의미를 빠르게 연결하기 위한 탭으로 써야 합니다.</div>
      </div>
    </div>
  ` : '';
  return coachIntroHtml || meaningHtml || toeicHtml
    ? `${coachIntroHtml}${meaningHtml}${toeicHtml}`
    : `
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">문장 해석</div>
        <p>등록된 의미 데이터가 없습니다.</p>
      </div>
    `;
}

function buildDictationConceptToeicHtml(sentenceEntry) {
  const toeic = sentenceEntry?.examModes?.toeic || {};
  return `
    <div class="dict-commentary-section">
      <div class="dict-coach-tag">토익 포인트</div>
      <p>${escapeHtml(toeic.learningGoal || toeic.coachLine || '등록된 토익 확장 데이터가 없습니다.')}</p>
      ${toeic.fastRule ? `<p class="dict-concept-emphasis">${escapeHtml(toeic.fastRule)}</p>` : ''}
      <div class="dict-commentary-bullets">
        ${(toeic.quickChecks || []).map((item) => `<div>${escapeHtml(item.stem || item.question || '')} ${escapeHtml(item.rationale || item.answer || '')}</div>`).join('')}
      </div>
    </div>
    ${(toeic.grammarPoints || []).map((point) => `
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">${escapeHtml(point.label || '문법 포인트')}</div>
        <p>${escapeHtml(point.desc || '')}</p>
      </div>
    `).join('')}
  `;
}

function buildDictationConceptSpeakingModeHtml(sentenceEntry, modeKey) {
  const modeMap = {
    schoolInterview: { label: '학교면접', block: sentenceEntry?.examModes?.schoolInterview || {} },
    opic: { label: '오픽', block: sentenceEntry?.examModes?.opic || {} },
    toeicSpeaking: { label: '토익스피킹', block: sentenceEntry?.examModes?.toeicSpeaking || {} },
  };
  const selectedMode = modeMap[modeKey];
  if (!selectedMode || !selectedMode.block || !Object.keys(selectedMode.block).length) {
    return `
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">스피킹 확장</div>
        <p>등록된 스피킹 확장 데이터가 없습니다.</p>
      </div>
    `;
  }
  const block = selectedMode.block;
  const flow = block.answerFlow || block.responseFrames || [];
  const sampleAnswers = Array.isArray(block.sampleAnswers) ? block.sampleAnswers.slice(0, 2) : [];
  const followUps = Array.isArray(block.followUps) ? block.followUps.slice(0, 2) : [];
  const recoveryLines = Array.isArray(block.recoveryLines) ? block.recoveryLines.slice(0, 2) : [];
  const selfChecks = Array.isArray(block.selfCheck) ? block.selfCheck.slice(0, 1) : [];
  return `
    ${buildDictationConceptPriorityHtml({
      title: '이 문장 하나를 오프닝으로 잡아 두면 학교 면접, 오픽, 토스까지 다른 답변으로 확장할 수 있습니다.',
      priority: '★★★★☆',
      training: '반복 훈련 + 말하기 적용',
      target: '2초 안에 시작',
      warning: '첫 문장이 막히면 뒤 이유 문장과 예시 문장도 같이 무너집니다. 오프닝부터 자동화해야 합니다.',
    })}
    <div class="dict-concept-speak-grid">
      <div class="dict-commentary-section">
        <div class="dict-coach-tag">${escapeHtml(selectedMode.label)}</div>
        <p>${escapeHtml(block.learningGoal || block.coachLine || '')}</p>
        ${block.fastRule ? `<p class="dict-concept-emphasis">${escapeHtml(block.fastRule)}</p>` : ''}
        ${flow.length ? `
          <div class="dict-commentary-list">
            ${flow.slice(0, 4).map((item) => `
              <div class="dict-commentary-row"><strong>${escapeHtml(item.label || '')}</strong><span>${escapeHtml(item.text || '')}</span></div>
            `).join('')}
          </div>
        ` : ''}
        ${sampleAnswers.length ? `
          <div class="dict-concept-mini-list">
            ${sampleAnswers.map((item) => `
              <div class="dict-concept-mini-card">
                <strong>${escapeHtml(item.label || '샘플 답변')}</strong>
                <p>${escapeHtml(item.text || '')}</p>
                ${item.coaching ? `<span>${escapeHtml(item.coaching)}</span>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${followUps.length ? `
          <div class="dict-commentary-bullets">
            ${followUps.map((item) => `<div>${escapeHtml(item.label || '')} · ${escapeHtml(item.text || '')}</div>`).join('')}
          </div>
        ` : ''}
        ${recoveryLines.length ? `
          <div class="dict-concept-chip-list">
            ${recoveryLines.map((line) => `<span class="dict-concept-chip">${escapeHtml(line)}</span>`).join('')}
          </div>
        ` : ''}
        ${selfChecks.length ? `
          <div class="dict-commentary-bullets">
            ${selfChecks.map((item) => `<div>${escapeHtml(item.goalTip || item.question || '')}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function buildDictationConceptVocabularyHtml(sentenceEntry) {
  const vocabulary = sentenceEntry?.vocabulary || [];
  const voca = sentenceEntry?.examModes?.voca || {};
  const quickChecks = Array.isArray(voca.quickChecks) ? voca.quickChecks : [];
  const selfChecks = Array.isArray(voca.selfCheck) ? voca.selfCheck.slice(0, 2) : [];
  return `
    ${buildDictationConceptPriorityHtml({
      title: '고득점을 위한 어휘 학습은 단어 뜻만 아는 수준을 넘어서야 합니다. `뜻 + 묶음 표현 + 시험에서 쓰이는 자리`까지 한 세트로 외워야 합니다.',
      priority: '★★★★★',
      training: '필수 암기 + 반복 훈련',
      target: '단어를 보면 예문이 바로 나와야 함',
      warning: '고득점을 위해서는 어휘를 얕게 외우면 안 됩니다. 듣기, 파트5, 말하기가 같이 흔들리지 않도록 어휘를 바닥부터 단단히 잡아야 합니다.',
    })}
    <div class="dict-commentary-section">
      <div class="dict-coach-tag">어휘 코칭</div>
      <p>${escapeHtml(voca.coachLine || voca.fastRule || '핵심 어휘를 의미와 쓰임으로 묶어 보세요.')}</p>
      ${voca.fastRule ? `<p class="dict-concept-emphasis">${escapeHtml(voca.fastRule)}</p>` : ''}
      ${quickChecks.length ? `
        <div class="dict-commentary-bullets">
          ${quickChecks.map((item) => `<div>${escapeHtml(item.question || '')} ${escapeHtml(item.answer || '')} ${escapeHtml(item.coaching || '')}</div>`).join('')}
        </div>
      ` : ''}
    </div>
    <div class="dict-concept-vocab-list">
      ${vocabulary.map((item, index) => `
        <div class="dict-commentary-section">
          <div class="dict-concept-word-head">
            <div>
              <div class="dict-coach-tag">${escapeHtml(item.word || '')}</div>
              <p class="dict-concept-word-meta">
                ${escapeHtml((item.meanings || []).join(', '))}
                ${item.pos ? ` · ${escapeHtml(item.pos)}` : ''}
                ${item.pronunciation ? ` · ${escapeHtml(item.pronunciation)}` : ''}
              </p>
            </div>
            <span class="dict-concept-badge${item.isMust ? ' is-critical' : ''}">${escapeHtml(item.isMust ? '필수 암기' : '보조 표현')}</span>
          </div>
          ${item.exampleSentence ? `<p class="dict-concept-example">${escapeHtml(item.exampleSentence)}${item.exampleContext ? ` · ${escapeHtml(item.exampleContext)}` : ''}</p>` : ''}
          ${item.ttsText ? `
            <div class="dict-concept-tts-row">
              ${buildDictationConceptTTSButtons(item.ttsText, [1, 0.72], ['듣기', '느리게'], `voca-${escapeDictationJsString(item.word || `word-${index}`)}`)}
            </div>
          ` : ''}
          ${buildDictationConceptDrillHtml([
            { label: '왜 중요', text: item.isMust ? '이 단어는 이 문장뿐 아니라 발표 시작, 토익, 말하기까지 반복해서 재등장합니다.' : '뜻만 말하지 말고 이 문장에서 어떤 자리인지 같이 기억해야 합니다.' },
            item.collocations?.length ? { label: '묶음 암기', text: item.collocations.slice(0, 3).join(' / ') } : null,
            item.toeicNote ? { label: '토익 포인트', text: item.toeicNote } : null,
            item.opicNote ? { label: '말하기 포인트', text: item.opicNote } : null,
          ])}
          ${Array.isArray(item.collocations) && item.collocations.length ? `
            <div class="dict-concept-chip-list">
              ${item.collocations.map((term) => `<span class="dict-concept-chip">${escapeHtml(term)}</span>`).join('')}
            </div>
          ` : ''}
          ${Array.isArray(item.synonyms) && item.synonyms.length ? `
            <div class="dict-commentary-row"><strong>비슷한 말</strong><span>${escapeHtml(item.synonyms.join(', '))}</span></div>
          ` : ''}
          ${Array.isArray(item.derivatives) && item.derivatives.length ? `
            <div class="dict-commentary-row"><strong>파생어</strong><span>${escapeHtml(item.derivatives.join(', '))}</span></div>
          ` : ''}
          ${Array.isArray(item.confusables) && item.confusables.length ? `
            <div class="dict-commentary-bullets">
              ${item.confusables.map((pair) => `<div>${escapeHtml(pair.word || '')} · ${escapeHtml(pair.desc || '')}</div>`).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ${buildDictationConceptSelfCheckHtml(selfChecks)}
  `;
}

function buildDictationConceptExplorerBody(sentenceEntry, lineIndex, activeTab) {
  switch (activeTab) {
    case 'grammar':
      return buildDictationConceptGrammarHtml(sentenceEntry);
    case 'pronunciation':
      return buildDictationConceptPronunciationHtml(sentenceEntry);
    case 'blanks':
      return buildDictationConceptBlanksHtml(sentenceEntry, lineIndex);
    case 'meaning':
      return buildDictationConceptMeaningHtml(sentenceEntry);
    case 'toeic':
      return buildDictationConceptToeicHtml(sentenceEntry);
    case 'schoolInterview':
    case 'opic':
    case 'toeicSpeaking':
      return buildDictationConceptSpeakingModeHtml(sentenceEntry, activeTab);
    case 'vocabulary':
      return buildDictationConceptVocabularyHtml(sentenceEntry);
    default:
      return buildDictationConceptGrammarHtml(sentenceEntry);
  }
}

function renderDictationConceptExplorer(lineIndex) {
  const state = getDictConceptState(lineIndex);
  const container = document.getElementById(`dict-concept-shell-${lineIndex}`);
  const button = document.getElementById(`dict-open-concept-${lineIndex}`);
  const sentenceEntry = state?.data || dictSentenceEntries[lineIndex];
  if (!container || !state || !sentenceEntry) return;
  if (!state.open) {
    container.hidden = true;
    if (button) button.textContent = '🧪 1타 첨삭';
    return;
  }
  const sections = buildDictationConceptSections(sentenceEntry);
  const activeSection = sections.find((section) => section.key === state.section) || sections[0] || null;
  const cards = activeSection?.cards || [];
  const isMobileConceptList = window.matchMedia('(max-width: 640px)').matches;
  if (activeSection && !cards.some((card) => card.key === state.activeTab)) {
    state.activeTab = cards[0]?.key || 'meaning';
  }
  container.hidden = false;
  if (button) button.textContent = '🧪 첨삭 닫기';
  if (state.loading) {
    container.innerHTML = `<div class="dict-commentary-section"><div class="dict-coach-tag">첨삭 로딩 중</div><p>첫 문장 첨삭 데이터를 불러오고 있습니다.</p></div>`;
    return;
  }
  container.innerHTML = `
    <div class="dict-concept-explorer">
      <div class="dict-concept-body dict-concept-body--full">
        <div class="dict-concept-section-tabs">
          ${sections.map((section) => `
            <button
              type="button"
              class="dict-concept-section-tab${activeSection?.key === section.key ? ' active' : ''}"
              onclick="setDictationConceptSection(${lineIndex}, '${escapeDictationJsString(section.key)}')"
            >
              <strong>${escapeHtml(section.label)}</strong>
              <span>${escapeHtml(section.summary)}</span>
            </button>
          `).join('')}
        </div>
        <div class="dict-concept-explorer dict-concept-explorer--nested">
          ${isMobileConceptList ? `
            <label class="dict-concept-mobile-picker">
              <span>항목 선택</span>
              <select class="field-input" onchange="setDictationConceptTab(${lineIndex}, this.value)">
                ${cards.map((card) => `
                  <option value="${escapeHtml(card.key)}"${state.activeTab === card.key ? ' selected' : ''}>${escapeHtml(card.label)}</option>
                `).join('')}
              </select>
            </label>
          ` : `
            <div class="dict-concept-nav">
              ${cards.map((card) => `
                <button
                  type="button"
                  class="dict-concept-tab${state.activeTab === card.key ? ' active' : ''}"
                  onclick="setDictationConceptTab(${lineIndex}, '${escapeDictationJsString(card.key)}')"
                >
                  <strong>${escapeHtml(card.label)}</strong>
                  <span>${escapeHtml(card.summary)}</span>
                </button>
              `).join('')}
            </div>
          `}
          <div class="dict-concept-body">
            ${buildDictationConceptExplorerBody(sentenceEntry, lineIndex, state.activeTab)}
          </div>
        </div>
      </div>
    </div>
  `;
}

async function ensureDictationConceptData(lineIndex) {
  const state = getDictConceptState(lineIndex);
  const sentenceEntry = dictSentenceEntries[lineIndex];
  if (!state || state.data || !sentenceEntry) return;
  const path = getDictationConceptDataPath(sentenceEntry);
  if (!path) {
    state.data = sentenceEntry;
    return;
  }
  state.loading = true;
  renderDictationConceptExplorer(lineIndex);
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.data = { ...sentenceEntry, ...data };
  } catch (error) {
    console.error(error);
    state.data = sentenceEntry;
    showToast('첨삭 데이터를 불러오지 못했습니다');
  } finally {
    state.loading = false;
    renderDictationConceptExplorer(lineIndex);
  }
}

function setDictationConceptTab(lineIndex, tabKey) {
  const state = getDictConceptState(lineIndex);
  state.activeTab = tabKey;
  renderDictationConceptExplorer(lineIndex);
}

function setDictationConceptSection(lineIndex, sectionKey) {
  const state = getDictConceptState(lineIndex);
  const sentenceEntry = state?.data || dictSentenceEntries[lineIndex];
  if (!state || !sentenceEntry) return;
  const section = buildDictationConceptSections(sentenceEntry).find((item) => item.key === sectionKey);
  if (!section) return;
  state.section = section.key;
  state.activeTab = section.cards[0]?.key || 'meaning';
  renderDictationConceptExplorer(lineIndex);
}

function setDictationConceptSpeakingMode(lineIndex, modeKey) {
  const state = getDictConceptState(lineIndex);
  state.speakingMode = modeKey;
  renderDictationConceptExplorer(lineIndex);
}

function toggleDictationConceptExplorer(lineIndex) {
  const state = getDictConceptState(lineIndex);
  state.open = !state.open;
  if (!state.open) stopDictationConceptTTS();
  renderDictationConceptExplorer(lineIndex);
  if (state.open) {
    void ensureDictationConceptData(lineIndex);
  }
}

function toggleDictationSelfCheckSolution(lineIndex, itemIndex) {
  const el = document.getElementById(`dict-self-check-solution-${lineIndex}-${itemIndex}`);
  if (!el) return;
  el.hidden = !el.hidden;
}

function supportsDictationTTS() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function setDictationTTSStatus(message, tone = '') {
  const el = document.getElementById('dict-tts-status');
  if (!el) return;
  el.textContent = message;
  el.className = `dict-tts-status${tone ? ` ${tone}` : ''}`;
  el.hidden = !String(message || '').trim();
}

function getEnglishDictationVoices() {
  if (!supportsDictationTTS()) return [];
  return window.speechSynthesis.getVoices()
    .filter((voice) => /^en(-|_)/i.test(voice.lang) || /English/i.test(voice.name));
}

function ensureDictationLineTTSSettings() {
  dictLineTTSSettings = dictTTSState.lines.map((_, index) => ({
    rate: Number(dictLineTTSSettings[index]?.rate) || 1,
    voiceName: dictLineTTSSettings[index]?.voiceName || '',
  }));
}

function getDictationLineTTSSetting(index) {
  return dictLineTTSSettings[index] || { rate: 1, voiceName: '' };
}

function getDictationGlobalTTSSetting() {
  const activeIndex = dictTTSState.currentIndex >= 0 ? dictTTSState.currentIndex : 0;
  return getDictationLineTTSSetting(activeIndex);
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
  syncDictationGlobalTTSControls();
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

function getStickyViewportOffset() {
  return ['.page-header', '.sub-tabbar'].reduce((maxOffset, selector) => {
    const element = document.querySelector(selector);
    if (!(element instanceof HTMLElement)) return maxOffset;
    const style = window.getComputedStyle(element);
    if ((style.position !== 'sticky' && style.position !== 'fixed') || style.display === 'none' || style.visibility === 'hidden') {
      return maxOffset;
    }
    const rect = element.getBoundingClientRect();
    if (rect.height <= 0 || rect.bottom <= 0) return maxOffset;
    return Math.max(maxOffset, rect.bottom);
  }, 0);
}

function focusDictationSentence(index, behavior = 'smooth') {
  const card = document.getElementById(`dict-card-${index}`);
  if (!card) return;
  dictTTSState.currentIndex = index;
  highlightDictationLineButton(index);
  const stickyOffset = getStickyViewportOffset();
  const cardTop = window.scrollY + card.getBoundingClientRect().top;
  const targetTop = Math.max(0, cardTop - stickyOffset - 16);
  window.scrollTo({ top: targetTop, behavior });
  setDictationTTSStatus(`문장 ${index + 1} 선택됨`, 'active');
}

function updateDictationSentenceModalTrigger() {
  document.querySelectorAll('#dict-open-sentence-modal').forEach((button) => {
    button.disabled = !dictTTSState.lines.length;
  });
}

function syncDictationAllPlaybackToggle() {
  const button = document.getElementById('dict-play-all-toggle');
  if (!button) return;
  button.disabled = !dictTTSState.lines.length;
  button.textContent = dictTTSState.isPaused
    ? '▶ 전체 듣기'
    : (dictTTSState.currentIndex >= 0 ? '⏸ 일시정지' : '🔊 전체 듣기');
}

function renderDictationSentenceModalList() {
  const container = document.getElementById('dict-sentence-modal-list');
  if (!container) return;
  if (!dictTTSState.lines.length) {
    container.innerHTML = '<div class="dict-sentence-modal__empty">문장을 불러오면 여기서 전체 시험 페이지로 바로 풀 수 있습니다.</div>';
    syncDictationSentenceModalFontUI();
    syncDictationAllPlaybackToggle();
    return;
  }
  const modeLabel = DICT_BLANK_MODE_LABELS[selectedDictBlankMode] || '단어';
  const uniqueLevels = [...new Set(dictPracticeMeta.map((meta) => meta?.level).filter(Boolean))];
  const levelSummary = uniqueLevels.length === 1
    ? `난이도 ${DICT_LEVEL_LABELS[uniqueLevels[0]] || uniqueLevels[0]}`
    : '문장별 난이도 반영';
  const modalBlankCountLabel = dictPracticeMeta[0]
    ? (dictPracticeMeta[0].isStudyMode ? '전체 공개' : `${dictPracticeMeta[0].blankModeLabel} ${dictPracticeMeta[0].blanks.length}개`)
    : '';
  container.innerHTML = `
    <div class="dict-sentence-modal__summary">
      <div class="dict-sentence-modal__summary-config">
        <div class="dict-line-group dict-line-group--meta">
          <span class="dict-line-group-label">구멍 기준</span>
          <div class="dict-level-switch">
            ${Object.entries(DICT_BLANK_MODE_LABELS).map(([modeKey, label]) => `
              <button type="button" class="dict-level-pill${selectedDictBlankMode === modeKey ? ' active' : ''}" onclick="setDictationBlankMode('${modeKey}')">${label}</button>
            `).join('')}
          </div>
          <span class="dict-difficulty-chip subtle">${escapeHtml(getDictationBlankModeSummary(selectedDictBlankMode))}</span>
        </div>
        <div class="dict-line-group dict-line-group--meta">
          <span class="dict-line-group-label">난이도</span>
          ${modalBlankCountLabel ? `<span class="dict-difficulty-chip subtle">${escapeHtml(modalBlankCountLabel)}</span>` : ''}
          <div class="dict-level-switch">
            ${Object.entries(DICT_LEVEL_LABELS).map(([levelKey, label]) => `
              <button type="button" class="dict-level-pill${selectedDictLevel === levelKey ? ' active' : ''}" onclick="setDictationLineLevel(0, '${levelKey}')">${label}</button>
            `).join('')}
          </div>
        </div>
      </div>
      <div class="dict-sentence-modal__summary-control-row">
        <div class="dict-top-tts-controls dict-top-tts-controls--modal">
          <label class="dict-card-tts-option">
            <span>속도</span>
            <input type="range" min="0.7" max="1.2" step="0.1" value="${getDictationGlobalTTSSetting().rate.toFixed(1)}" oninput="setDictationGlobalRate(this.value)">
            <strong id="dict-modal-rate-label">${getDictationGlobalTTSSetting().rate.toFixed(1)}x</strong>
          </label>
          <label class="dict-card-tts-option dict-card-tts-option--voice">
            <span>음성</span>
            <select class="field-input dict-line-voice-select dict-modal-voice-select" data-line-index="0" id="dict-modal-voice-select" onchange="setDictationGlobalVoice(this.value)">
              <option value="">기본 음성</option>
            </select>
          </label>
        </div>
        <div class="dict-sentence-modal__summary-actions">
          <button type="button" class="btn-secondary" id="dict-play-all-toggle" onclick="toggleDictationAllPlayback()">🔊 전체 듣기</button>
          <button type="button" class="btn-secondary dict-answer-toggle" id="dict-sentence-modal-answer-toggle" onclick="toggleDictationSentenceModalAnswers()">
            <span id="dict-sentence-modal-answer-toggle-label">${dictSentenceModalState.answersVisible ? '정답 전체 숨기기' : '정답 전체 보기'}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="dict-sentence-modal__sheet">
      ${dictTTSState.lines.map((line, index) => {
        const meta = dictPracticeMeta[index];
        return `
          <div class="dict-sentence-modal__entry" id="dict-sentence-modal-item-${index}">
            <div class="dict-cloze-line dict-sentence-modal__cloze" id="dict-sentence-modal-text-${index}">${renderDictationSentenceModalPreview(meta, index)}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  setDictationSentenceModalAnswerRevealState(dictSentenceModalState.answersVisible);
  populateDictationVoices();
  syncDictationSentenceModalFontUI();
  syncDictationAllPlaybackToggle();
}

function syncDictationSentenceModalHeader() {
  const title = document.getElementById('dict-sentence-modal-title');
  const caption = document.querySelector('#dict-sentence-modal .dict-sentence-modal__caption');
  const summary = document.getElementById('dict-exam-current-topic');
  if (title) title.textContent = getDictationSentenceModalTitle();
  if (caption) caption.textContent = getDictationSentenceModalSummary();
  if (summary && selectedDictTopic) {
    summary.textContent = `${selectedDictTopic.num} · ${selectedDictTopic.title} · ${selectedDictTopic.desc}`;
  }
  if (isDictationExamStandalonePage()) {
    document.title = `${getDictationSentenceModalTitle()} — 수행평가 만점 코치`;
  }
}

function setActiveDictationSentenceModalItem(index = -1) {
  dictSentenceModalState.activeIndex = -1;
  document.querySelectorAll('#dict-sentence-modal-list .dict-sentence-modal__entry').forEach((item) => {
    const isActive = Number(item.id.replace('dict-sentence-modal-item-', '')) === index;
    item.classList.toggle('is-playing', isActive);
  });
  dictSentenceModalState.activeIndex = index;
}

function openDictationSentenceModal() {
  if (isDictationExamStandalonePage()) {
    dictSentenceModalState.open = true;
    syncDictationSentenceModalHeader();
    syncDictationSentenceModalFontUI();
    return;
  }
  if (!dictTTSState.lines.length) {
    showToast('먼저 받아쓰기 스크립트를 불러오십시오');
    return;
  }
  const modal = document.getElementById('dict-sentence-modal');
  if (!modal) return;
  dictSentenceModalState.open = true;
  syncDictationSentenceModalHeader();
  renderDictationSentenceModalList();
  modal.hidden = false;
  syncDictationSentenceModalFontUI();
}

function closeDictationSentenceModal(options = {}) {
  const { stopAudio = true } = options;
  const modal = document.getElementById('dict-sentence-modal');
  if (!modal) return;
  dictSentenceModalState.open = isDictationExamStandalonePage();
  dictSentenceModalState.answersVisible = false;
  if (!isDictationExamStandalonePage()) {
    modal.hidden = true;
  }
  setActiveDictationSentenceModalItem(-1);
  if (stopAudio) stopDictationTTS({ preserveStatus: true });
}

function renderDictationLineButtons() {
  const container = document.getElementById('dict-tts-line-buttons');
  if (!container) return;
  document.querySelectorAll('.dict-tts-toolbar-head .dict-sentence-modal-trigger').forEach((button) => button.remove());
  if (!dictTTSState.lines.length) {
    container.innerHTML = '';
    return;
  }
  const activeIndex = dictTTSState.currentIndex >= 0 ? dictTTSState.currentIndex : 0;
  const activeMeta = dictPracticeMeta[activeIndex];
  const globalTTSSetting = getDictationGlobalTTSSetting();
  const blankCountLabel = activeMeta
    ? (activeMeta.isStudyMode ? '전체 공개' : `${activeMeta.blankModeLabel} ${activeMeta.blanks.length}개`)
    : '';
  container.innerHTML = `
    <div class="dict-line-row dict-line-row--sentence">
      <div class="dict-line-group dict-line-group--sentence">
        <span class="dict-line-group-label">문장 선택</span>
        <div class="dict-line-tabs">
          ${dictTTSState.lines.map((_, index) => (
            `<button type="button" class="dict-tts-line-btn" onclick="focusDictationSentence(${index})">문장 ${index + 1}</button>`
          )).join('')}
        </div>
      </div>
      <div class="dict-line-toolbar dict-line-toolbar--sentence">
        ${isDictationExamStandalonePage()
          ? `<span class="dict-exam-inline-chip">Part ${getSelectedDictPartNumber()} 전체 시험</span>`
          : `<button type="button" class="btn-secondary dict-sentence-modal-trigger" id="dict-open-sentence-modal" onclick="openDictationExamPage()">시험 페이지</button>`}
      </div>
    </div>
    <div class="dict-line-row dict-line-row--controls">
      <div class="dict-line-toolbar dict-line-toolbar--controls">
        <div class="dict-line-group dict-line-group--meta">
          <span class="dict-line-group-label">구멍 기준</span>
          <div class="dict-level-switch">
            ${Object.entries(DICT_BLANK_MODE_LABELS).map(([modeKey, label]) => `
              <button type="button" class="dict-level-pill${selectedDictBlankMode === modeKey ? ' active' : ''}" onclick="setDictationBlankMode('${modeKey}')">${label}</button>
            `).join('')}
          </div>
          <span class="dict-difficulty-chip subtle">${escapeHtml(getDictationBlankModeSummary(selectedDictBlankMode))}</span>
        </div>
        <div class="dict-line-group dict-line-group--meta">
          <span class="dict-line-group-label">난이도</span>
          ${blankCountLabel ? `<span class="dict-difficulty-chip subtle">${blankCountLabel}</span>` : ''}
          <div class="dict-level-switch">
            ${Object.entries(DICT_LEVEL_LABELS).map(([levelKey, label]) => `
              <button type="button" class="dict-level-pill${activeMeta?.level === levelKey ? ' active' : ''}" onclick="setDictationLineLevel(${activeIndex}, '${levelKey}')">${label}</button>
            `).join('')}
          </div>
        </div>
        <div class="dict-top-tts-controls dict-top-tts-controls--inline">
          <label class="dict-card-tts-option">
            <span>속도</span>
            <input type="range" min="0.7" max="1.2" step="0.1" value="${globalTTSSetting.rate.toFixed(1)}" oninput="setDictationGlobalRate(this.value)">
            <strong id="dict-global-rate-label">${globalTTSSetting.rate.toFixed(1)}x</strong>
          </label>
          <label class="dict-card-tts-option dict-card-tts-option--voice">
            <span>음성</span>
            <select class="field-input dict-line-voice-select dict-global-voice-select" data-line-index="0" id="dict-global-voice-select" onchange="setDictationGlobalVoice(this.value)">
              <option value="">기본 음성</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  `;
  highlightDictationLineButton(activeIndex);
}

function setDictationBlankMode(mode) {
  if (!DICT_BLANK_MODE_LABELS[mode] || selectedDictBlankMode === mode) return;
  selectedDictBlankMode = mode;
  renderDictationPracticeCards();
}

function getDictationPreviewHref(sentenceEntry, index) {
  if (!sentenceEntry?.id) return '';
  const params = new URLSearchParams({
    sentenceId: sentenceEntry.id,
  });
  return `coach-english-json-preview-v2.html?${params.toString()}`;
}

function rebuildDictationPracticeMeta() {
  ensureDictationLineTTSSettings();
  dictPracticeMeta = dictSentenceEntries.map((sentenceEntry, index) => (
    buildDictationPracticeMeta(sentenceEntry, dictLineLevels[index] || selectedDictLevel, index, selectedDictBlankMode)
  ));
}

function renderDictationPracticeCards() {
  const container = document.getElementById('dict-practice-list');
  rebuildDictationPracticeMeta();
  if (!container) {
    renderDictationLineButtons();
    renderDictationSentenceModalList();
    populateDictationVoices();
    return;
  }
  if (!dictSentenceEntries.length) {
    container.innerHTML = '';
    renderDictationSentenceModalList();
    return;
  }
  container.innerHTML = dictPracticeMeta.map((meta, index) => {
    const sentenceEntry = dictSentenceEntries[index];
    const guide = getDictationGuide(sentenceEntry);
    const blankCountLabel = meta.isStudyMode ? '전체 공개' : `${meta.blankModeLabel} ${meta.blanks.length}개`;
    const useInlineConceptExplorer = Boolean(getDictationConceptDataPath(sentenceEntry));
    const jsonPreviewHref = useInlineConceptExplorer ? '' : getDictationPreviewHref(sentenceEntry, index);
    return `
      <article class="dict-practice-card" id="dict-card-${index}">
        <div class="dict-practice-head">
          <div>
            <div class="dict-practice-meta">
              <span class="dict-practice-step">문장 ${index + 1}</span>
              <span class="dict-difficulty-chip subtle">${blankCountLabel}</span>
            </div>
            <div class="dict-practice-sub">문장 전체를 한 번 듣고 ${meta.blankModeLabel} 구멍만 채우세요. 필요하면 같은 문장을 다시 듣고 정답을 확인하세요.</div>
          </div>
          <div class="dict-practice-actions">
            <button class="btn-secondary" type="button" onclick="playDictationSentence(${index})">🔊 문장 전체 듣기</button>
            ${useInlineConceptExplorer ? `<button class="btn-secondary dict-concept-toggle" id="dict-open-concept-${index}" type="button" onclick="toggleDictationConceptExplorer(${index})">🧪 1타 첨삭</button>` : ''}
            ${jsonPreviewHref ? `<a class="btn-secondary dict-preview-link" href="${jsonPreviewHref}" target="_blank" rel="noopener noreferrer">🧪 1타 첨삭</a>` : ''}
            <button class="btn-secondary dict-answer-toggle" id="dict-answer-toggle-${index}" type="button" onclick="revealDictationAnswer(${index})">
              <span id="dict-answer-toggle-label-${index}">정답 보기</span>
            </button>
          </div>
        </div>
        <div class="dict-cloze-line">${meta.previewHtml}</div>
        ${useInlineConceptExplorer ? `
          <div class="dict-concept-shell" id="dict-concept-shell-${index}" hidden></div>
        ` : `
          ${buildDictationLearningGoalHtml(sentenceEntry, guide)}
          ${buildDictationFullMeaningHtml(sentenceEntry)}
          ${meta.isStudyMode ? `
            <div class="dict-cloze-note">쉬움 난이도는 전체 문장을 공개합니다. 먼저 흐름과 의미를 익힌 뒤 하·중·상으로 올리세요.</div>
          ` : `
            <div class="dict-blank-guide-list">
              ${meta.blanks.map((blank, blankIndex) => buildDictationBlankGuideHtml(blank, blankIndex, index, meta.level)).join('')}
            </div>
          `}
          ${buildDictationCommentaryHtml(sentenceEntry, guide, index)}
        `}
      </article>
    `;
  }).join('');
  renderDictationLineButtons();
  populateDictationVoices();
  highlightDictationLineButton(dictTTSState.currentIndex >= 0 ? dictTTSState.currentIndex : 0);
  Object.entries(dictConceptExplorerState).forEach(([lineIndex, state]) => {
    if (state.open) {
      renderDictationConceptExplorer(Number(lineIndex));
    }
  });
  renderDictationSentenceModalList();
}

function syncDictationTTSFromScript() {
  const scriptText = document.getElementById('dict-script')?.textContent || '';
  dictTTSState.lines = parseDictationLines(scriptText);
  dictSentenceEntries = dictTTSState.lines.map((line, index) => dictSentenceEntries[index] || { text: line, guide: null, blanks: [] });
  dictTTSState.currentIndex = -1;
  dictTTSState.playingAll = false;
  dictTTSState.pendingNextIndex = dictTTSState.lines.length ? 0 : -1;
  dictTTSState.isPaused = false;
  ensureDictationLineTTSSettings();
  updateDictationSentenceModalTrigger();
  renderDictationLineButtons();
  renderDictationSentenceModalList();
  renderDictationPracticeCards();
  closeDictationSentenceModal({ stopAudio: false });
  if (!supportsDictationTTS()) {
    setDictationTTSStatus('이 브라우저는 TTS 미지원', 'warn');
    return;
  }
  if (!dictTTSState.lines.length) {
    setDictationTTSStatus('스크립트 생성 후 듣기 가능');
    return;
  }
  setDictationTTSStatus('');
}

function stopDictationTTS(options = {}) {
  if (!supportsDictationTTS()) return;
  const { preserveStatus = false } = options;
  window.speechSynthesis.cancel();
  window.speechSynthesis.onvoiceschanged = null;
  dictTTSState.currentIndex = -1;
  dictTTSState.playingAll = false;
  dictTTSState.pendingNextIndex = dictTTSState.lines.length ? 0 : -1;
  dictTTSState.isPaused = false;
  highlightDictationLineButton(-1);
  setActiveDictationSentenceModalItem(-1);
  if (!preserveStatus) {
    setDictationTTSStatus(
      dictTTSState.lines.length ? '' : '스크립트 생성 후 듣기 가능'
    );
  }
  syncDictationAllPlaybackToggle();
}

function createDictationUtterance(text, index) {
  const utterance = new SpeechSynthesisUtterance(text);
  const setting = getDictationLineTTSSetting(index);
  const selectedVoice = getDictationVoice(setting.voiceName);
  utterance.lang = selectedVoice?.lang || 'en-US';
  utterance.rate = Number(setting.rate) || 1;
  utterance.pitch = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onstart = () => {
    dictTTSState.currentIndex = index;
    dictTTSState.isPaused = false;
    highlightDictationLineButton(index);
    setDictationTTSStatus(`문장 ${index + 1} 재생 중`, 'active');
    if (dictSentenceModalState.open) setActiveDictationSentenceModalItem(index);
    syncDictationAllPlaybackToggle();
  };
  utterance.onend = () => {
    const nextIndex = index < dictTTSState.lines.length - 1 ? index + 1 : -1;
    const shouldContinue = dictTTSState.playingAll && nextIndex >= 0;
    dictTTSState.currentIndex = index;
    dictTTSState.pendingNextIndex = nextIndex;
    highlightDictationLineButton(index);
    if (shouldContinue) {
      setDictationTTSStatus(`문장 ${index + 1} 완료 · 다음 문장 재생`, 'active');
      setActiveDictationSentenceModalItem(-1);
      window.setTimeout(() => {
        if (!dictTTSState.playingAll || dictTTSState.pendingNextIndex !== nextIndex) return;
        speakDictationText(dictTTSState.lines[nextIndex], nextIndex);
      }, 120);
      return;
    }
    dictTTSState.playingAll = false;
    dictTTSState.isPaused = false;
    setDictationTTSStatus(nextIndex >= 0 ? `문장 ${index + 1} 완료 · 답안 입력` : '마지막 문장 완료', 'active');
    setActiveDictationSentenceModalItem(-1);
    syncDictationAllPlaybackToggle();
  };
  utterance.onerror = () => {
    dictTTSState.currentIndex = -1;
    dictTTSState.playingAll = false;
    dictTTSState.pendingNextIndex = index < dictTTSState.lines.length - 1 ? index + 1 : -1;
    dictTTSState.isPaused = false;
    highlightDictationLineButton(-1);
    setDictationTTSStatus('듣기 오류 · 다시 시도', 'warn');
    setActiveDictationSentenceModalItem(-1);
    syncDictationAllPlaybackToggle();
  };
  return utterance;
}

function speakDictationText(text, index) {
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  const doSpeak = () => {
    window.speechSynthesis.onvoiceschanged = null;
    window.speechSynthesis.speak(createDictationUtterance(text, index));
  };
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    doSpeak();
    return;
  }
  window.speechSynthesis.onvoiceschanged = () => {
    doSpeak();
  };
  window.setTimeout(() => {
    if (!window.speechSynthesis.speaking) doSpeak();
  }, 180);
}

function setDictationLineRate(index, value) {
  ensureDictationLineTTSSettings();
  const rate = Number(value) || 1;
  dictLineTTSSettings[index] = {
    ...getDictationLineTTSSetting(index),
    rate,
  };
  const label = document.getElementById(`dict-line-rate-label-${index}`);
  if (label) label.textContent = `${rate.toFixed(1)}x`;
  syncDictationGlobalTTSControls();
}

function setDictationLineVoice(index, value) {
  ensureDictationLineTTSSettings();
  dictLineTTSSettings[index] = {
    ...getDictationLineTTSSetting(index),
    voiceName: value || '',
  };
  syncDictationGlobalTTSControls();
}

function syncDictationGlobalTTSControls() {
  const setting = getDictationGlobalTTSSetting();
  const rateLabel = document.getElementById('dict-global-rate-label');
  const rateInput = document.querySelector('.dict-top-tts-controls input[type="range"]');
  const voiceSelect = document.getElementById('dict-global-voice-select');
  const modalRateLabel = document.getElementById('dict-modal-rate-label');
  const modalRateInput = document.querySelector('.dict-top-tts-controls--modal input[type="range"]');
  const modalVoiceSelect = document.getElementById('dict-modal-voice-select');
  if (rateLabel) rateLabel.textContent = `${setting.rate.toFixed(1)}x`;
  if (rateInput) rateInput.value = setting.rate.toFixed(1);
  if (voiceSelect) voiceSelect.value = setting.voiceName || '';
  if (modalRateLabel) modalRateLabel.textContent = `${setting.rate.toFixed(1)}x`;
  if (modalRateInput) modalRateInput.value = setting.rate.toFixed(1);
  if (modalVoiceSelect) modalVoiceSelect.value = setting.voiceName || '';
}

function setDictationGlobalRate(value) {
  ensureDictationLineTTSSettings();
  const rate = Number(value) || 1;
  dictLineTTSSettings = dictTTSState.lines.map((_, index) => ({
    ...getDictationLineTTSSetting(index),
    rate,
  }));
  syncDictationGlobalTTSControls();
}

function setDictationGlobalVoice(value) {
  ensureDictationLineTTSSettings();
  dictLineTTSSettings = dictTTSState.lines.map((_, index) => ({
    ...getDictationLineTTSSetting(index),
    voiceName: value || '',
  }));
  syncDictationGlobalTTSControls();
}

(function renderDictTopics() {
  const grid = document.getElementById('topic-grid');
  if (!grid) return;
  grid.innerHTML = DICT_TOPICS.map((t, i) => `
    <button type="button" class="topic-card topic-card--inline" id="dtc-${i}" onclick="selectDictTopic(${i})">
      <span class="topic-num">${t.num}</span>
      <span class="topic-title">${t.title}</span>
    </button>
  `).join('');
  if (!selectedDictTopic && DICT_TOPICS.length) selectDictTopic(0);
})();
function selectDictTopic(idx) {
  const topicIndex = Number(idx);
  selectedDictTopic = DICT_TOPICS[topicIndex];
  if (!selectedDictTopic) return;
  const examTopicSelect = document.getElementById('dict-exam-topic-select');
  if (examTopicSelect) examTopicSelect.value = String(topicIndex);
  document.querySelectorAll('#topic-grid .topic-card').forEach((card, index) => {
    card.classList.toggle('selected', index === topicIndex);
  });
  if (isDictationExamStandalonePage()) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('topic', String(topicIndex));
    window.history.replaceState({}, '', nextUrl);
  }
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
  const topicLabel = document.getElementById('dict-current-topic');
  if (!el || !box) return;
  stopDictationTTS({ preserveStatus: true });
  Object.keys(dictConceptExplorerState).forEach((key) => delete dictConceptExplorerState[key]);
  dictSentenceEntries = getDictationSentenceEntries(selectedDictTopic);
  const sourceLines = dictSentenceEntries.map((entry) => entry.text);
  dictLineLevels = sourceLines.map((_, index) => dictLineLevels[index] || selectedDictLevel);
  el.textContent = sourceLines.map((line, index) => `${index + 1}. ${line}`).join('\n');
  if (topicLabel) {
    topicLabel.textContent = `${selectedDictTopic.num} · ${selectedDictTopic.title} · ${selectedDictTopic.desc}`;
  }
  syncDictationSentenceModalHeader();
  syncDictationTTSFromScript();
  resetDictationFeedback();
}

function setDictationLineLevel(index, level) {
  selectedDictLevel = level;
  dictLineLevels = dictSentenceEntries.map(() => level);
  renderDictationPracticeCards();
  resetDictationFeedback();
}

async function generateDictation() {
  if (!selectedDictTopic) { showToast('주제를 먼저 선택하십시오'); return; }
  const el = document.getElementById('dict-script');
  const box = document.getElementById('dict-script-box');
  stopDictationTTS({ preserveStatus: true });
  box.style.display = 'block';
  dictSentenceEntries = getDictationSentenceEntries(selectedDictTopic);
  const sourceLines = dictSentenceEntries.map((entry) => entry.text);
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
  speakDictationText(dictTTSState.lines[0], 0);
}

function toggleDictationAllPlayback() {
  if (!dictTTSState.lines.length) { showToast('먼저 받아쓰기 스크립트를 생성하십시오'); return; }
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  if (dictTTSState.isPaused || window.speechSynthesis.paused) {
    resumeDictationTTS();
    return;
  }
  if (dictTTSState.currentIndex >= 0 && window.speechSynthesis.speaking) {
    pauseDictationTTS();
    return;
  }
  playDictationAll();
}

function playDictationSentence(index) {
  if (!dictTTSState.lines[index]) { showToast('해당 문장을 찾을 수 없습니다'); return; }
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  stopDictationTTS({ preserveStatus: true });
  dictTTSState.playingAll = false;
  dictTTSState.pendingNextIndex = index < dictTTSState.lines.length - 1 ? index + 1 : -1;
  speakDictationText(dictTTSState.lines[index], index);
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
  speakDictationText(dictTTSState.lines[nextIndex], nextIndex);
}

function pauseDictationTTS() {
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  if (!window.speechSynthesis.speaking || window.speechSynthesis.paused) { showToast('현재 재생 중인 음성이 없습니다'); return; }
  window.speechSynthesis.pause();
  dictTTSState.isPaused = true;
  setDictationTTSStatus('일시정지 · 이어듣기 가능', 'warn');
  syncDictationAllPlaybackToggle();
}

function resumeDictationTTS() {
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  if (!dictTTSState.isPaused && !window.speechSynthesis.paused) { showToast('이어들을 음성이 없습니다'); return; }
  window.speechSynthesis.resume();
  dictTTSState.isPaused = false;
  setDictationTTSStatus(
    dictTTSState.currentIndex >= 0 ? `문장 ${dictTTSState.currentIndex + 1} 재생 중` : '재생 중',
    'active'
  );
  syncDictationAllPlaybackToggle();
}

function revealDictationAnswer(index) {
  const toggle = document.getElementById(`dict-answer-toggle-${index}`);
  const label = document.getElementById(`dict-answer-toggle-label-${index}`);
  const meta = dictPracticeMeta[index];
  if (!toggle || !label || !meta) return;
  const willShow = label.textContent === '정답 보기';
  setDictationAnswerRevealState(index, willShow);
  toggle.classList.toggle('is-done', willShow);
  label.textContent = willShow ? '정답 숨기기' : '정답 보기';
}

function setDictationInputState(input, result) {
  if (!input) return;
  input.classList.remove('is-correct', 'is-partial', 'is-wrong');
  if (result === 'correct') input.classList.add('is-correct');
  if (result === 'partial') input.classList.add('is-partial');
  if (result === 'wrong') input.classList.add('is-wrong');
}

function setDictationAnswerRevealState(lineIndex, visible) {
  const meta = dictPracticeMeta[lineIndex];
  if (!meta || meta.isStudyMode) return;
  meta.blanks.forEach((blank, blankIndex) => {
    const answerWord = document.getElementById(`dict-answer-word-${lineIndex}-${blankIndex}`);
    const guideAnswer = document.getElementById(`dict-guide-answer-${lineIndex}-${blankIndex}`);
    const input = document.getElementById(`dict-answer-${lineIndex}-${blankIndex}`);
    if (answerWord) answerWord.hidden = !visible;
    if (guideAnswer) guideAnswer.hidden = !visible;
    if (!input) return;
    if (!visible) {
      setDictationInputState(input, null);
      return;
    }
    const result = gradeDictationBlankAnswer(input.value.trim(), blank.answer);
    setDictationInputState(input, result);
  });
}

function setDictationSentenceModalAnswerRevealState(visible) {
  dictPracticeMeta.forEach((meta, lineIndex) => {
    if (!meta || meta.isStudyMode) return;
    meta.blanks.forEach((blank, blankIndex) => {
      const answerWord = document.getElementById(`dict-modal-answer-word-${lineIndex}-${blankIndex}`);
      const input = document.getElementById(`dict-modal-answer-${lineIndex}-${blankIndex}`);
      if (answerWord) answerWord.hidden = !visible;
      if (!input) return;
      if (!visible) {
        setDictationInputState(input, null);
        return;
      }
      const result = gradeDictationBlankAnswer(input.value.trim(), blank.answer);
      setDictationInputState(input, result);
    });
  });
  const toggle = document.getElementById('dict-sentence-modal-answer-toggle');
  const label = document.getElementById('dict-sentence-modal-answer-toggle-label');
  if (toggle) toggle.classList.toggle('is-done', visible);
  if (label) label.textContent = visible ? '정답 전체 숨기기' : '정답 전체 보기';
}

function toggleDictationSentenceModalAnswers() {
  dictSentenceModalState.answersVisible = !dictSentenceModalState.answersVisible;
  setDictationSentenceModalAnswerRevealState(dictSentenceModalState.answersVisible);
}

function handleDictationInlineInput(lineIndex, blankIndex) {
  const toggleLabel = document.getElementById(`dict-answer-toggle-label-${lineIndex}`);
  if (!toggleLabel || toggleLabel.textContent !== '정답 숨기기') return;
  const meta = dictPracticeMeta[lineIndex];
  const input = document.getElementById(`dict-answer-${lineIndex}-${blankIndex}`);
  if (!meta || !input) return;
  const blank = meta.blanks[blankIndex];
  if (!blank) return;
  const result = gradeDictationBlankAnswer(input.value.trim(), blank.answer);
  setDictationInputState(input, result);
}

function handleDictationSentenceModalInput(lineIndex, blankIndex) {
  if (!dictSentenceModalState.answersVisible) return;
  const meta = dictPracticeMeta[lineIndex];
  const input = document.getElementById(`dict-modal-answer-${lineIndex}-${blankIndex}`);
  if (!meta || !input) return;
  const blank = meta.blanks[blankIndex];
  if (!blank) return;
  const result = gradeDictationBlankAnswer(input.value.trim(), blank.answer);
  setDictationInputState(input, result);
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
    let correct = 0;
    let partial = 0;
    let wrong = 0;
    const details = meta.blanks.map((blank, blankIndex) => {
      const result = gradeDictationBlankAnswer(answerSet[blankIndex], blank.answer);
      if (result === 'correct') correct += 1;
      else if (result === 'partial') partial += 1;
      else wrong += 1;
      return `- 빈칸 ${blankIndex + 1}: ${result.toUpperCase()} | 정답=${blank.answer} | 입력=${answerSet[blankIndex] || '(미입력)'}`;
    });
    const total = meta.blanks.length;
    const score = total ? Math.round((((correct * 1) + (partial * 0.5)) / total) * 100) : 0;
    return `문장 ${index + 1}: ${score}% · 정답 ${correct} / 부분정답 ${partial} / 오답 ${wrong}\n${details.join('\n')}`;
  });
  return `[문장별 빠른 체크]\n${rows.join('\n')}`;
}
async function gradeDictation() {
  const answers = getDictationAnswerValues();
  const el = document.getElementById('dict-feedback');
  if (dictPracticeMeta.every((meta) => meta.isStudyMode)) {
    showToast('쉬움 난이도는 전체 공개 모드입니다. 하·중·상에서 빈칸 채점을 사용하십시오');
    return;
  }
  if (!answers.flat().some(Boolean)) { showToast('빈칸 답안을 먼저 입력하십시오'); return; }
  dictPracticeMeta.forEach((meta, index) => {
    if (!meta || meta.isStudyMode) return;
    const toggle = document.getElementById(`dict-answer-toggle-${index}`);
    const label = document.getElementById(`dict-answer-toggle-label-${index}`);
    setDictationAnswerRevealState(index, true);
    if (toggle) toggle.classList.add('is-done');
    if (label) label.textContent = '정답 숨기기';
  });
  el.textContent = buildDictationLocalReview(dictTTSState.lines, answers);
  el.classList.add('has-content');
}
function clearDictation() {
  stopDictationTTS({ preserveStatus: true });
  closeDictationSentenceModal({ stopAudio: false });
  dictPracticeMeta.forEach((meta, index) => {
    meta.blanks.forEach((_, blankIndex) => {
      const input = document.getElementById(`dict-answer-${index}-${blankIndex}`);
      if (input) {
        input.value = '';
        input.classList.remove('is-correct', 'is-partial', 'is-wrong');
      }
      const answerWord = document.getElementById(`dict-answer-word-${index}-${blankIndex}`);
      if (answerWord) answerWord.hidden = true;
      const guideAnswer = document.getElementById(`dict-guide-answer-${index}-${blankIndex}`);
      if (guideAnswer) guideAnswer.hidden = true;
    });
    const toggle = document.getElementById(`dict-answer-toggle-${index}`);
    if (toggle) {
      toggle.classList.remove('is-done');
    }
    const label = document.getElementById(`dict-answer-toggle-label-${index}`);
    if (label) label.textContent = '정답 보기';
    document.querySelectorAll(`#dict-card-${index} .dict-self-check-input`).forEach((input) => {
      input.checked = false;
    });
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
  if (!document.getElementById('sim-exam-val') || !document.getElementById('grade-msg')) return;
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
  const el = document.getElementById('sim-ai-feedback');
  const examEl = document.getElementById('sim-exam');
  const sentEl = document.getElementById('sim-sent');
  const dictEl = document.getElementById('sim-dict');
  const intEl = document.getElementById('sim-int');
  const totalEl = document.getElementById('res-total');
  if (!el || !examEl || !sentEl || !dictEl || !intEl || !totalEl) return;
  const exam = examEl.value;
  const sent = sentEl.value;
  const dict = dictEl.value;
  const int_ = intEl.value;
  const total = totalEl.textContent;
  const sys = `당신은 고등학교 영어 수행평가 전략 코치입니다. 최단시간 내 최대 점수 향상 전략을 제시하십시오.`;
  const usr = `현재 예상 점수:\n- 정기시험: ${exam}점 → 반영 후 ${Math.round(exam*0.4*10)/10}점\n- 문장완성: ${sent}/20점\n- 받아쓰기: ${dict}/20점\n- 영어면접: ${int_}/20점\n- 합계: ${total}/100점\n\n각 영역별 약점을 분석하고 지금 당장 실행할 수 있는 우선순위 3가지 훈련 계획을 구체적으로 제시하십시오.`;
  await callClaude(sys, usr, el);
}

window.addEventListener('beforeunload', () => {
  stopDictationTTS({ preserveStatus: true });
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Escape' && dictSentenceModalState.open && !isDictationExamStandalonePage()) {
    event.preventDefault();
    closeDictationSentenceModal();
    return;
  }
  if (event.code !== 'Space' || event.repeat) return;
  const target = event.target;
  const isTypingTarget = target instanceof HTMLElement && (
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'INPUT' ||
    target.isContentEditable
  );
  if (isTypingTarget) return;
  if (dictSentenceModalState.open && !isDictationExamStandalonePage()) return;
  if (!isDictationExamStandalonePage()) {
    const panel = document.getElementById('eng-s1');
    if (!panel || panel.style.display === 'none') return;
  }
  if (!dictTTSState.lines.length) return;
  event.preventDefault();
  playNextDictationSentence();
});
