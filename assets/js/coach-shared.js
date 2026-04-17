/* ═══════════════════════════════════
   수행평가 만점 코치 — 공유 JS
   coach-shared.js
═══════════════════════════════════ */

/* ── 서브탭 전환 (prefix 기반 범용) ── */
function switchSubTab(prefix, id) {
  const fullId = `${prefix}-${id}`;
  const clickedTab = document.querySelector(`[data-stab="${fullId}"]`);

  // 서브탭 버튼 활성화
  document.querySelectorAll(`[data-stab^="${prefix}-"]`).forEach(t => t.classList.remove('active'));
  clickedTab?.classList.add('active');

  // 패널 전환 — 섹션 div는 id="sec-{prefix}"
  const secMap = { lit: 'sec-lit', math: 'sec-math', eng: 'sec-eng' };
  const secId = secMap[prefix] || `sec-${prefix}`;
  const sec = document.getElementById(secId);
  if (sec) {
    sec.querySelectorAll('.inner-panel').forEach(p => p.style.display = 'none');
  } else {
    document.querySelectorAll('.inner-panel').forEach(p => p.style.display = 'none');
  }
  const target = document.getElementById(fullId);
  if (target) {
    target.style.display = 'block';
    bindAutoResizeTextareas(target);
    const tabbar = clickedTab?.closest('.sub-tabbar');
    const headerOffset = (document.querySelector('.page-header')?.offsetHeight || 0) + (tabbar?.offsetHeight || 0) + 16;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: Math.max(targetTop, 0), behavior: 'smooth' });
    clickedTab?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

function autoResizeFieldTextarea(el) {
  if (!el || el.tagName !== 'TEXTAREA') return;
  el.style.height = 'auto';
  el.style.overflowY = 'hidden';
  el.style.height = `${el.scrollHeight}px`;
}

function bindAutoResizeTextareas(root = document) {
  if (!root?.querySelectorAll) return;
  root.querySelectorAll('textarea.field-input').forEach((el) => {
    if (!el.dataset.autoresizeBound) {
      el.addEventListener('input', () => autoResizeFieldTextarea(el));
      el.dataset.autoresizeBound = 'true';
    }
    autoResizeFieldTextarea(el);
  });
}

/* ── 아코디언 ── */
function initAccordion() {
  document.querySelectorAll('.acc-header').forEach(h => {
    h.addEventListener('click', () => {
      const item = h.closest('.acc-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── 토스트 ── */
function showToast(msg) {
  const t = document.getElementById('global-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

/* ══════════════════════════════════════════════════════
   템플릿 엔진 — API 연결 전 목업
   나중에 callClaude() 내부만 실제 fetch로 교체하면 됨
══════════════════════════════════════════════════════ */
async function callClaude(system, user, el) {
  el.textContent = '분석 중...';
  el.classList.add('loading');
  el.classList.remove('has-content');
  await new Promise(r => setTimeout(r, 600 + Math.random() * 500));
  const text = _tpl(system, user);
  el.textContent = text;
  el.classList.remove('loading');
  el.classList.add('has-content');
  return text;
}

/* ── 컨텍스트 라우터 ── */
function _tpl(sys, usr) {
  if (sys.includes('오류 유형') || (sys.includes('분석 전문가') && sys.includes('대수')))
    return _tplMathError(usr);
  if (sys.includes('채점관') && (sys.includes('서술형') || sys.includes('4단계')))
    return _tplMathEssay(usr);
  if (sys.includes('학습 전략') || sys.includes('복습 계획'))
    return _tplMathPattern(usr);
  if (sys.includes('받아쓰기 연습'))
    return _tplDictGen(usr);
  if (sys.includes('받아쓰기 채점'))
    return _tplDictGrade(usr);
  if (sys.includes('문장완성') && sys.includes('4가지'))
    return _tplSentenceAnalyze(usr);
  if (sys.includes('힌트') || sys.includes('정답을 알려주지'))
    return _tplSentenceHint(usr);
  if (sys.includes('면접 출제') || sys.includes('질문만 출력'))
    return _tplIntQuestion(usr);
  if (sys.includes('면접 채점관'))
    return _tplIntAnalyze(usr);
  if (sys.includes('전략 코치') && sys.includes('영어'))
    return _tplSimStrategy(usr);
  return '(템플릿 응답 — API 연결 후 실제 분석이 제공됩니다)';
}

/* ─────────── 수학 템플릿 ─────────── */

function _tplMathError(usr) {
  const hasCond  = /조건|>0|>1|밑|진수/.test(usr);
  const hasCalc  = /계산|숫자|값/.test(usr);
  const hasLog   = /log|로그/.test(usr.toLowerCase());
  const type = hasCond ? '조건 누락' : hasCalc ? '계산 실수' : '개념 오류';
  return `[오류 유형]: ${type}
[구체적 오류]: ${hasCond
  ? '풀이 첫 단계에서 로그 조건(밑 > 0, 밑 ≠ 1, 진수 > 0)을 명시하지 않고 바로 계산을 시작했습니다. 서술형 채점에서 조건 누락은 -2~3점 감점 항목입니다.'
  : hasCalc
  ? '계산 과정에서 부호 또는 지수 처리 오류가 있습니다. 중간 전개 단계를 생략하지 말고 한 줄씩 등호를 정렬해 서술하십시오.'
  : hasLog
  ? '로그의 정의나 성질(로그의 합·차·곱·지수 이동)을 잘못 적용했습니다. 공식을 먼저 명시한 뒤 적용하는 순서로 고치십시오.'
  : '개념 적용 단계에서 오류가 발생했습니다. 문제 조건을 다시 읽고 사용할 공식을 먼저 써봅시다.'}
[올바른 풀이 구조]:
  ① 조건: (밑 > 0, 밑 ≠ 1, 진수 > 0 명시)
  ② 공식: (사용할 지수·로그 법칙 명시)
  ③ 전개: (등호 정렬, 한 줄씩 변환)
  ④ 검산: ∴ 결론 (∴ 기호로 최종 답 서술)
[반복 주의사항]: ${hasLog
  ? '로그 문제 첫 줄에는 항상 진수·밑 조건을 쓰는 습관을 들이십시오. 조건이 있어야 부분 점수도 안전합니다.'
  : '서술형은 과정이 채점됩니다. 답이 맞아도 중간 단계 생략 시 감점될 수 있습니다.'}`;
}

function _tplMathEssay(usr) {
  const s1 = usr.match(/①조건[:\s]*(.*)/)?.[1] || '';
  const s2 = usr.match(/②공식[:\s]*(.*)/)?.[1] || '';
  const s3 = usr.match(/③전개[:\s]*(.*)/)?.[1] || '';
  const s4 = usr.match(/④검증[:\s]*(.*)/)?.[1] || '';
  const hasCond    = s1.length > 2;
  const hasFormula = s2.length > 2;
  const hasWork    = s3.length > 2;
  const hasThere   = /∴|따라서/.test(s4);
  const score = [hasCond, hasFormula, hasWork, s4.length>2, hasThere].filter(Boolean).length;
  return `[채점 결과 — 5개 항목 중 ${score}개 충족]

①조건 확인 — ${hasCond ? '✓ 진수·밑 조건 명시됨' : '✗ 조건 미명시. "밑 > 0, 밑 ≠ 1, 진수 > 0" 을 첫 줄에 반드시 쓸 것'}
②공식 명시 — ${hasFormula ? '✓ 사용 공식 서술됨' : '✗ 어떤 공식(법칙)을 적용하는지 한 줄로 먼저 써야 합니다'}
③풀이 전개 — ${hasWork ? '✓ 전개 과정 서술됨 — 등호 정렬 여부를 최종 확인하십시오' : '✗ 전개가 없습니다. 한 줄씩 변환 과정을 써야 부분 점수를 받을 수 있습니다'}
④검증·결론 — ${hasThere ? '✓ ∴ 결론 확인됨' : '✗ 최종 답 앞에 반드시 "∴" 를 붙이십시오. 누락 시 -1점'}

[종합 피드백]: ${score >= 4
  ? '서술 구조가 잘 갖춰졌습니다. 등호 정렬과 조건 3가지(밑·진수)를 마지막으로 확인하세요.'
  : score >= 2
  ? '풀이 구조가 부분적으로 갖춰졌으나 감점 위험 요소가 있습니다. 위 항목을 보완한 뒤 다시 검증하십시오.'
  : '기본 서술 구조(조건→공식→전개→결론)가 필요합니다. STEP 0의 감점 함정 TOP 4를 먼저 다시 읽어보십시오.'}`;
}

function _tplMathPattern(usr) {
  const hasCond  = /조건/.test(usr);
  const hasCalc  = /계산/.test(usr);
  const hasConc  = /∴|결론|마무리/.test(usr);
  return `[취약 개념 우선순위 분석]

${hasCond ? '1순위 — 로그 조건 누락\n   → "밑 > 0, 밑 ≠ 1, 진수 > 0" 3가지를 항상 첫 줄에 쓰는 훈련. 해당 조건을 소리 내어 말하면서 쓰기 반복.\n' : ''}${hasCalc ? '2순위 — 계산 실수 (지수·로그 변환)\n   → 거듭제곱근 n 홀수/짝수 분기, 로그 덧셈·뺄셈 규칙을 공식 카드로 암기 후 문제 적용.\n' : ''}${hasConc ? '3순위 — ∴ 결론 접속사 누락\n   → 최종 답을 쓰기 전 "∴" 를 습관적으로 먼저 쓰도록 훈련.\n' : ''}
[3일 집중 복습 계획]
Day 1: 교과서 p.10~18 거듭제곱근 — 조건 분기 5문제 반복
Day 2: p.19~30 지수·로그 법칙 — 서술형 4단계 구조로 3문제 작성
Day 3: p.31~39 지수·로그함수 — 기출 유형 타임어택 (각 문제 4분 제한)

[시험 전날 체크리스트]
□ 로그 조건 3가지 암기 확인
□ 서술형 답안 ∴ 기호 포함 여부
□ 등호(=) 정렬 시각적 확인`;
}

/* ─────────── 영어 템플릿 ─────────── */

const _DICT_BANK = {
  '잠재력': [
    "Every child has a unique talent that is waiting to be discovered.",
    "The picture book shows that potential grows when we believe in ourselves.",
    "She reminded her students that failure is just the first step toward success."
  ],
  '습관': [
    "Spending just five minutes a day on a new habit can change your life.",
    "He started his morning routine by writing three things he was grateful for.",
    "Small, consistent actions have a more powerful effect than occasional big efforts."
  ],
  '플라스틱': [
    "Scientists have developed a biodegradable alternative to single-use plastic bottles.",
    "The company replaced all its packaging with materials made from seaweed and cornstarch.",
    "Reducing plastic waste requires both individual choices and government policy."
  ],
  'ACT NOW': [
    "Young people around the world are taking action to protect the environment.",
    "The campaign encourages everyone to make one small change starting today.",
    "Together, we can create a future where clean air and water are available for all."
  ],
  '노동': [
    "Every worker deserves a safe environment and a fair wage for their labor.",
    "The right to work with dignity should be protected by law in every country.",
    "She argued that economic growth means nothing if workers cannot afford basic needs."
  ],
  '가짜뉴스': [
    "Always check the source before sharing information on social media.",
    "Critical thinking is the most important skill for navigating the digital age.",
    "A single piece of misinformation can spread to millions of people within hours."
  ],
  '혁신': [
    "The greatest innovations often come from questioning what everyone assumes to be true.",
    "He transformed a simple observation about shadows into a groundbreaking invention.",
    "Innovation is not just about technology — it is about solving human problems creatively."
  ],
  '오디오': [
    "Eriksson combines impossible scenes to challenge what we think photography can do.",
    "Each image tells a story that blurs the line between reality and imagination.",
    "Stand in front of the artwork and let your eyes travel from one detail to the next."
  ]
};

function _tplDictGen(usr) {
  const topicLine = (usr.match(/주제[:\s]+([^\n]+)/) || [])[1] || '';
  const countMatch = usr.match(/(\d+)문장/);
  const count = countMatch ? parseInt(countMatch[1]) : 3;
  const levelMatch = usr.match(/난이도[:\s]+([^\n]+)/);
  const level = levelMatch ? levelMatch[1] : '';

  let bank = null;
  for (const key of Object.keys(_DICT_BANK)) {
    if (topicLine.includes(key)) { bank = _DICT_BANK[key]; break; }
  }
  if (!bank) bank = _DICT_BANK['혁신'];

  const isHard = level.includes('복문') || level.includes('hard');
  const isMed  = level.includes('중문') || level.includes('normal');

  const lines = [];
  for (let i = 0; i < Math.min(count, 8); i++) {
    const base = bank[i % bank.length];
    let sentence = base;
    if (isHard && i % 2 === 1)
      sentence = base.replace(/\.$/, ', and that belief has the power to transform entire communities.');
    else if (isMed && i % 3 === 0)
      sentence = base.replace(/\.$/, ', which is something we should all think about.');
    else if (i >= bank.length)
      sentence = base.replace(/\.$/, i % 2 === 0 ? ', and it can make a real difference in everyday life.' : ', which is why many students find this topic meaningful.');
    lines.push(`${i + 1}. ${sentence}`);
  }
  return lines.join('\n');
}

function _tplDictGrade(usr) {
  const origLine = (usr.match(/원문[:\n]+([\s\S]*?)\n\n/) || [])[1] || '';
  const studLine = (usr.match(/학생 답안[:\n]+([\s\S]*)$/) || [])[1] || '';
  const normalizeDictationText = (text) => String(text || '')
    .replace(/^\s*\d+\.\s*/gm, '')
    .replace(/[“”"'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  const origWords = normalizeDictationText(origLine).split(/\s+/).filter(Boolean);
  const studWords = normalizeDictationText(studLine).split(/\s+/).filter(Boolean);
  const correct = origWords.filter((w, i) => studWords[i] && w.replace(/[,.!?]/g,'').toLowerCase() === studWords[i].replace(/[,.!?]/g,'').toLowerCase()).length;
  const total = origWords.length || 20;
  const pct = total > 0 ? Math.round(correct / total * 100) : 75;
  return `[정확도]: ${pct}% (${correct}/${total} 단어 정확)

[오류 유형 분석]:
• 철자 오류 — 소리가 비슷하지만 다른 단어(예: their/there/they're, its/it's)를 혼동하는 경우
• 발음 혼동 — 연음 처리된 단어를 분리해서 쓰는 경우 (예: "going to" → "gonna")
• 구두점 오류 — 쉼표(,) 또는 마침표(.) 위치 누락

[반복 훈련 포인트]:
1. 동음이의어 집중: their/there/they're · its/it's · to/too/two
2. 축약형 구분: it's=it is, I've=I have, won't=will not
3. 구두점 패턴: 접속사(and, but, because) 앞 쉼표 여부 확인

※ API 연결 후에는 원문과 학생 답안을 단어 단위로 비교해 정확한 오류 목록을 제공합니다.`;
}

function _tplSentenceAnalyze(usr) {
  const answer = (usr.match(/학생 답안[:\s]+(.*)/) || [])[1] || usr;
  const len = answer.length;
  const hasPrep = /first|second|because|therefore|for example|in conclusion/i.test(answer);
  const hasOpinion = /think|believe|feel|consider/i.test(answer);
  const sc1 = len > 30 ? 4 : 3;
  const sc2 = hasOpinion ? 4 : 3;
  const sc3 = len > 20 && /[.!?]$/.test(answer.trim()) ? 4 : 3;
  const sc4 = hasPrep ? 4 : 3;
  const total = sc1 + sc2 + sc3 + sc4;
  return `[문장완성 채점 결과]

①과제완성 (${sc1}/5): ${sc1 >= 4 ? '주어진 조건을 충족하는 문장을 작성했습니다.' : '주어진 빈칸 조건을 더 명확히 충족시킬 필요가 있습니다.'}
②내용 (${sc2}/5): ${hasOpinion ? '자신의 의견(I think/believe)이 포함되어 내용 충실도가 높습니다.' : '"I think / I believe"와 같은 의견 표현을 추가하면 내용 점수가 올라갑니다.'}
③언어사용 (${sc3}/5): ${sc3 >= 4 ? '문법·철자가 대체로 올바릅니다.' : '문장 끝 마침표, 대문자 시작, 주어·동사 일치를 다시 확인하십시오.'}
④구성의 참신성 (${sc4}/5): ${hasPrep ? 'PREP 구조(주장→이유→예시→결론)가 드러납니다.' : '이유(because)나 예시(for example)를 추가하면 구성 점수가 올라갑니다.'}

[합계]: ${total}/20점 (예상)
[핵심 개선 포인트]: ${total < 16 ? '의견 표현 추가 + PREP 구조 적용' : '현재 구조를 유지하고 어휘 다양성을 높이십시오.'}

※ API 연결 후에는 문법 오류를 줄별로 지적하고 수정 예시를 제공합니다.`;
}

function _tplSentenceHint(usr) {
  const prompt = (usr.match(/문제[:\s]+(.*)/) || [])[1] || usr;
  return `[힌트 3가지]

힌트 ①  핵심 문법 포인트
→ 이 문장은 현재완료(have+pp) 또는 조건절(If+현재, 미래) 구조가 필요합니다. 동사 형태를 먼저 결정하세요.

힌트 ②  어울리는 어휘
→ "${prompt.substring(0,30).replace(/\n/,' ')}..." 맥락에서는 감정·상태를 나타내는 형용사(important, necessary, valuable 등) 또는 이유를 설명하는 접속사(because, since, as)가 자연스럽습니다.

힌트 ③  구조 힌트
→ PREP 구조를 떠올리세요: 주장 한 문장 → "because ___" 이유 → "For example, ___" 예시 순서로 작성하면 내용 점수를 지킬 수 있습니다.

※ API 연결 후에는 학생이 작성한 문장을 직접 보고 맞춤형 힌트를 제공합니다.`;
}

const _INT_Q_BANK = {
  dream_book:    "What is one book that influenced your way of thinking, and how did it change your perspective on life?",
  habit:         "Describe one small daily habit you have developed, and explain how it has affected your productivity or well-being.",
  plastic:       "What specific actions can individuals and companies take to reduce their dependence on single-use plastics?",
  act_now:       "If you were to start a social campaign, what issue would you address and why is it urgent?",
  privacy_right: "Do you think the right to be forgotten should be protected online? Explain why privacy and the public's right to know can come into conflict.",
  fake_news:     "How do you personally verify whether information you see online is reliable? Give a specific example.",
  innovation:    "Describe a problem in your daily life that you think could be solved through a creative or technological innovation.",
  art_guide:     "How can visual art challenge our perception of reality? Refer to a specific artwork or artist you find interesting."
};

function _tplIntQuestion(usr) {
  for (const [key, q] of Object.entries(_INT_Q_BANK)) {
    if (usr.includes(key) || usr.includes(_INT_Q_BANK[key].substring(0,10))) return q;
  }
  const topicMatch = Object.entries({
    '팟캐스트':'dream_book','습관':'habit','플라스틱':'plastic',
    'ACT NOW':'act_now','act_now':'act_now','잊힐':'privacy_right','프라이버시':'privacy_right',
    '가짜뉴스':'fake_news','혁신':'innovation','오디오':'art_guide','에릭':'art_guide'
  }).find(([k]) => usr.includes(k));
  return topicMatch ? _INT_Q_BANK[topicMatch[1]] : "What is the most important lesson you have learned so far this year, and how has it shaped the way you approach challenges?";
}

function _tplIntAnalyze(usr) {
  const s1 = (usr.match(/①도입[:\s]*(.*)/) || [])[1] || '';
  const s2 = (usr.match(/②핵심[:\s]*(.*)/) || [])[1] || '';
  const s3 = (usr.match(/③의견[:\s]*(.*)/) || [])[1] || '';
  const s4 = (usr.match(/④마무리[:\s]*(.*)/) || [])[1] || '';
  const hasOp   = /think|believe|opinion|perspective/i.test(s3);
  const hasConcl= /sum|conclusion|therefore|that's why/i.test(s4);
  const sc1 = s1.length > 5 ? 4 : 2;
  const sc2 = s2.length > 10 ? 4 : 3;
  const sc3 = hasOp ? 4 : 3;
  const sc4 = hasConcl ? 4 : 3;
  const total = sc1+sc2+sc3+sc4;
  return `[면접 답변 채점 결과]

①과제완성 (${sc1}/5): ${s1.length>5 ? '도입에서 질문에 직접 답변했습니다.' : '도입에서 질문에 직접 답하는 한 문장을 추가하십시오.'}
②내용 (${sc2}/5): ${s2.length>10 ? '핵심 내용이 충분히 서술되었습니다.' : '구체적인 예시나 이유(because / for example)를 추가하면 내용 점수가 올라갑니다.'}
③언어사용 (${sc3}/5): ${hasOp ? '"I think / I believe" 의견 표현이 확인됩니다.' : '의견 표현(I think, I believe, In my opinion)이 없습니다. 추가 시 +1점 가능.'}
④구성의 참신성 (${sc4}/5): ${hasConcl ? '"To sum up / In conclusion" 마무리 표현이 확인됩니다.' : '"To sum up, ..." 으로 마무리하면 구성 완성도가 높아집니다.'}

[예상 합계]: ${total * 5 / 4}/20점
[우선 수정]: ${!hasOp ? '③의견에 "I strongly believe that..." 추가' : !hasConcl ? '④마무리에 "To sum up, ..." 추가' : '전반적으로 좋습니다. 발음과 속도를 조절해 실전 연습을 진행하십시오.'}

※ API 연결 후에는 문법 오류와 어색한 표현을 줄별로 수정 제안합니다.`;
}

function _tplSimStrategy(usr) {
  const exam = parseInt((usr.match(/정기시험[:\s]*(\d+)/) || [])[1] || 80);
  const sent = parseInt((usr.match(/문장완성[:\s]*(\d+)/) || [])[1] || 16);
  const dict = parseInt((usr.match(/받아쓰기[:\s]*(\d+)/) || [])[1] || 14);
  const int_ = parseInt((usr.match(/영어면접[:\s]*(\d+)/) || [])[1] || 16);
  const weakest = dict <= sent && dict <= int_ ? '받아쓰기' : int_ <= sent ? '영어면접' : '문장완성';
  return `[최단시간 최대점수 전략]

현재 예상 합계: ${Math.round((exam*0.4 + sent + dict + int_)*10)/10}점

[우선순위 3가지 훈련 계획]

1순위 — ${weakest} 집중 (가장 빠른 점수 회수)
${weakest === '받아쓰기'
  ? '• 매일 1개 주제 스크립트 생성 → 숨기기 → 받아쓰기 반복\n• 동음이의어(their/there, it\'s/its) 오답 패턴 집중 교정\n• 목표: 현재보다 +3~4점 (2주 내 달성 가능)'
  : weakest === '영어면접'
  ? '• PREP 구조로 답변 2개 암기 (1분 이내)\n• "I think / To sum up" 표현 반드시 포함 연습\n• 목표: 현재보다 +2~3점 (1주 내 달성 가능)'
  : '• 주어진 문장 조건 꼼꼼히 읽고 PREP 구조 적용\n• because/for example 접속어 활용 연습\n• 목표: 현재보다 +2점 (3일 내 달성 가능)'}

2순위 — 정기시험 준비 (40% 반영)
• 수행평가와 병행하되 시험 1주 전 집중 전환
• 현재 예상 반영 점수: ${Math.round(exam*0.4*10)/10}점

3순위 — 전체 균형 점검
• 수행평가 3종(문장완성·받아쓰기·면접) 각각 최소 15점 이상 확보 목표
• 한 영역에서 10점 이하면 전체 등급에 큰 영향이 생깁니다

[A등급까지 필요한 점수]: ${Math.max(0, 90 - Math.round(exam*0.4 + sent + dict + int_))}점 부족
※ API 연결 후에는 실시간 점수 변화와 개인화된 약점 분석이 제공됩니다.`;
}

/* ── D-day 계산 유틸 ── */
function calcDday(targetDate) {
  const diff = Math.ceil((new Date(targetDate) - new Date()) / 86400000);
  return diff <= 0 ? '당일!' : `${diff}일 전`;
}

/* ── 루브릭 체크 토글 (클릭으로 체크) ── */
function initRubricClick(rubricId, barFillId, barCountId, colorClass) {
  const container = document.getElementById(rubricId);
  if (!container) return;
  const items = container.querySelectorAll('.rubric-item');
  items.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('done');
      if (colorClass) item.classList.toggle(colorClass, item.classList.contains('done'));
      updateRubricBar(rubricId, barFillId, barCountId);
    });
  });
}

function updateRubricBar(rubricId, barFillId, barCountId) {
  const container = document.getElementById(rubricId);
  if (!container) return;
  const items = container.querySelectorAll('.rubric-item');
  const done  = container.querySelectorAll('.rubric-item.done').length;
  const total = items.length;
  const fill  = document.getElementById(barFillId);
  const txt   = document.getElementById(barCountId);
  if (fill) fill.style.width = (done / total * 100) + '%';
  if (txt)  txt.textContent  = `${done} / ${total} 완료`;
}

/* ── 클립보드 복사 ── */
function copyText(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast('클립보드에 복사되었습니다!'))
    .catch(() => showToast('복사 실패 — 직접 선택 후 복사하십시오.'));
}

/* ── DOM 준비 후 공통 초기화 ── */
document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  bindAutoResizeTextareas();
});
