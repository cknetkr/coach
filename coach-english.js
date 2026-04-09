/* ── D-day ── */
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const dictTest = new Date(2026, 3, 27);
  const intTest  = new Date(2026, 5, 8);
  const dictEl = document.getElementById('eng-dday-dict');
  const intEl  = document.getElementById('eng-dday-int');
  if (dictEl) { const d=Math.ceil((dictTest-now)/86400000); dictEl.textContent = d<=0?'당일!':d+'일 전'; }
  if (intEl)  { const d=Math.ceil((intTest-now)/86400000);  intEl.textContent  = d<=0?'당일!':d+'일 전'; }
  updateDictationTTSRateLabel();
  populateDictationVoices();
  updateSim();
});

/* ── 받아쓰기 데이터 ── */
const DICT_TOPICS = [
  {icon:'🎙️',num:'주제 1',title:'잠재력 팟캐스트',desc:'그림책 소개·잠재력 주제'},
  {icon:'📱',num:'주제 2',title:'습관 브이로그',desc:'하루 5분 루틴·습관 형성'},
  {icon:'📰',num:'주제 3',title:'현장 보도',desc:'플라스틱 대체 제품 현장'},
  {icon:'📢',num:'주제 4',title:'ACT NOW 영상',desc:'사회 참여 홍보 스크립트'},
  {icon:'🗣️',num:'주제 5',title:'일할 권리 연설',desc:'노동권 관련 연설문'},
  {icon:'🎬',num:'주제 6',title:'가짜뉴스 영상',desc:'팩트체크·정보 리터러시'},
  {icon:'💡',num:'주제 7',title:'혁신 담화',desc:'엄청난 생각·혁신 사례'},
  {icon:'🎨',num:'주제 8',title:'오디오 가이드',desc:'에릭 요한슨 작품 세계'},
];
let selectedDictTopic = null, dictScriptVisible = true, dictCount = 0;
const dictTTSState = {
  lines: [],
  currentIndex: -1,
  playingAll: false
};

function supportsDictationTTS() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function setDictationTTSStatus(message, tone = '') {
  const el = document.getElementById('dict-tts-status');
  if (!el) return;
  el.textContent = message;
  el.className = `dict-tts-status${tone ? ` ${tone}` : ''}`;
}

function updateDictationTTSRateLabel() {
  const slider = document.getElementById('dict-tts-rate');
  const label = document.getElementById('dict-tts-rate-label');
  if (!slider || !label) return;
  label.textContent = `${Number(slider.value).toFixed(1)}x`;
}

function populateDictationVoices() {
  const select = document.getElementById('dict-tts-voice');
  if (!select) return;
  if (!supportsDictationTTS()) {
    select.innerHTML = '<option value="">브라우저 TTS 미지원</option>';
    setDictationTTSStatus('이 브라우저에서는 TTS를 지원하지 않습니다.', 'warn');
    return;
  }
  const voices = window.speechSynthesis.getVoices()
    .filter((voice) => /^en(-|_)/i.test(voice.lang) || /English/i.test(voice.name));
  const current = select.value;
  select.innerHTML = '<option value="">기본 영어 음성</option>' + voices.map((voice) => (
    `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
  )).join('');
  if (voices.some((voice) => voice.name === current)) select.value = current;
  if (!voices.length) {
    setDictationTTSStatus('영어 음성을 불러오는 중입니다. 잠시 후 다시 눌러보세요.', 'warn');
  } else if (!dictTTSState.lines.length) {
    setDictationTTSStatus('스크립트를 생성하면 TTS로 들을 수 있습니다.');
  }
}

if (supportsDictationTTS()) {
  window.speechSynthesis.onvoiceschanged = populateDictationVoices;
}

function getDictationVoice() {
  if (!supportsDictationTTS()) return null;
  const selectedName = document.getElementById('dict-tts-voice')?.value;
  if (!selectedName) return null;
  return window.speechSynthesis.getVoices().find((voice) => voice.name === selectedName) || null;
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
}

function renderDictationLineButtons() {
  const container = document.getElementById('dict-tts-line-buttons');
  if (!container) return;
  if (!dictTTSState.lines.length) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = dictTTSState.lines.map((_, index) => (
    `<button type="button" class="dict-tts-line-btn" onclick="playDictationSentence(${index})">문장 ${index + 1}</button>`
  )).join('');
  highlightDictationLineButton(dictTTSState.currentIndex);
}

function syncDictationTTSFromScript() {
  const scriptText = document.getElementById('dict-script')?.textContent || '';
  dictTTSState.lines = parseDictationLines(scriptText);
  dictTTSState.currentIndex = -1;
  dictTTSState.playingAll = false;
  renderDictationLineButtons();
  if (!supportsDictationTTS()) {
    setDictationTTSStatus('이 브라우저에서는 TTS를 지원하지 않습니다.', 'warn');
    return;
  }
  if (!dictTTSState.lines.length) {
    setDictationTTSStatus('스크립트를 생성하면 TTS로 들을 수 있습니다.');
    return;
  }
  setDictationTTSStatus(`TTS 준비 완료 · 총 ${dictTTSState.lines.length}문장`, 'active');
}

function stopDictationTTS(options = {}) {
  if (!supportsDictationTTS()) return;
  const { preserveStatus = false } = options;
  window.speechSynthesis.cancel();
  dictTTSState.currentIndex = -1;
  dictTTSState.playingAll = false;
  highlightDictationLineButton(-1);
  if (!preserveStatus) {
    setDictationTTSStatus(
      dictTTSState.lines.length ? '재생을 멈췄습니다. 다시 듣고 싶은 문장을 선택하세요.' : '스크립트를 생성하면 TTS로 들을 수 있습니다.'
    );
  }
}

function createDictationUtterance(text, index) {
  const utterance = new SpeechSynthesisUtterance(text);
  const slider = document.getElementById('dict-tts-rate');
  const selectedVoice = getDictationVoice();
  utterance.lang = selectedVoice?.lang || 'en-US';
  utterance.rate = slider ? Number(slider.value) : 0.9;
  utterance.pitch = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onstart = () => {
    dictTTSState.currentIndex = index;
    highlightDictationLineButton(index);
    setDictationTTSStatus(`문장 ${index + 1} 재생 중`, 'active');
  };
  utterance.onend = () => {
    if (dictTTSState.playingAll && index < dictTTSState.lines.length - 1) {
      window.speechSynthesis.speak(createDictationUtterance(dictTTSState.lines[index + 1], index + 1));
      return;
    }
    dictTTSState.currentIndex = -1;
    dictTTSState.playingAll = false;
    highlightDictationLineButton(-1);
    setDictationTTSStatus('재생이 끝났습니다. 필요한 문장을 다시 들어보세요.');
  };
  utterance.onerror = () => {
    dictTTSState.currentIndex = -1;
    dictTTSState.playingAll = false;
    highlightDictationLineButton(-1);
    setDictationTTSStatus('TTS 재생 중 문제가 생겼습니다. 다시 시도해보세요.', 'warn');
  };
  return utterance;
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
}
async function generateDictation() {
  if (!selectedDictTopic) { showToast('주제를 먼저 선택하십시오'); return; }
  const level = document.getElementById('dict-level').value;
  const count = document.getElementById('dict-count').value;
  const el = document.getElementById('dict-script');
  const box = document.getElementById('dict-script-box');
  stopDictationTTS({ preserveStatus: true });
  box.style.display = 'block'; dictScriptVisible = true;
  document.getElementById('script-toggle-label').textContent = '스크립트 숨기기';
  el.style.opacity = '1'; el.style.filter = 'none';
  const levelMap = {easy:'단문(20~25단어)',normal:'중문(30~40단어)',hard:'복문·관용표현(50~60단어)'};
  const sys = `당신은 영어 수행평가 받아쓰기 연습 전문가입니다. 고등학교 2학년 수준(CEFR B1~B2)의 받아쓰기 연습 문장을 생성하십시오.`;
  const usr = `주제: ${selectedDictTopic.title} (${selectedDictTopic.desc})\n난이도: ${levelMap[level]}\n문장 수: ${count}문장\n\n요구사항:\n- 각 문장은 번호(1. 2. 3...)를 붙여 한 줄씩 출력\n- 자연스러운 영어 구어체\n- 한국어 번역 포함 금지\n- 문장만 출력`;
  await callClaude(sys, usr, el);
  syncDictationTTSFromScript();
}

function playDictationAll() {
  if (!dictTTSState.lines.length) { showToast('먼저 받아쓰기 스크립트를 생성하십시오'); return; }
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  stopDictationTTS({ preserveStatus: true });
  dictTTSState.playingAll = true;
  window.speechSynthesis.speak(createDictationUtterance(dictTTSState.lines[0], 0));
}

function playDictationSentence(index) {
  if (!dictTTSState.lines[index]) { showToast('해당 문장을 찾을 수 없습니다'); return; }
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  stopDictationTTS({ preserveStatus: true });
  dictTTSState.playingAll = false;
  window.speechSynthesis.speak(createDictationUtterance(dictTTSState.lines[index], index));
}

function pauseDictationTTS() {
  if (!supportsDictationTTS()) { showToast('이 브라우저는 TTS를 지원하지 않습니다'); return; }
  if (!window.speechSynthesis.speaking || window.speechSynthesis.paused) { showToast('현재 재생 중인 음성이 없습니다'); return; }
  window.speechSynthesis.pause();
  setDictationTTSStatus('일시정지됨 · 이어듣기를 누르면 계속 재생합니다.', 'warn');
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

function toggleScript() {
  const el = document.getElementById('dict-script');
  const label = document.getElementById('script-toggle-label');
  dictScriptVisible = !dictScriptVisible;
  el.style.opacity = dictScriptVisible ? '1' : '0';
  el.style.userSelect = dictScriptVisible ? 'auto' : 'none';
  el.style.filter = dictScriptVisible ? 'none' : 'blur(8px)';
  label.textContent = dictScriptVisible ? '스크립트 숨기기' : '정답 확인하기';
}
async function gradeDictation() {
  const script = document.getElementById('dict-script').textContent;
  const myAnswer = document.getElementById('dict-my-answer').value.trim();
  const el = document.getElementById('dict-feedback');
  if (!myAnswer) { showToast('받아쓰기 답안을 먼저 입력하십시오'); return; }
  if (!script || script==='분석 중...') { showToast('먼저 스크립트를 생성하십시오'); return; }
  const sys = `당신은 영어 받아쓰기 채점 전문가입니다. 원문과 학생 답안을 비교하여:\n[정확도]: 전체 단어 대비 맞힌 단어 비율\n[오류 목록]: 틀린 단어·구두점 (원문|학생답 형식)\n[유형 분석]: 철자 오류/발음 혼동/축약형 오류/구두점 오류\n[반복 훈련 포인트]: 가장 많이 틀린 유형과 교정 방법`;
  await callClaude(sys, `원문:\n${script}\n\n학생 답안:\n${myAnswer}`, el);
}
function clearDictation() {
  stopDictationTTS({ preserveStatus: true });
  document.getElementById('dict-my-answer').value = '';
  const fb = document.getElementById('dict-feedback');
  fb.textContent = '스크립트를 생성하고 받아쓰기 후 채점을 실행하십시오.';
  fb.classList.remove('has-content');
}
function dictCountUp() {
  dictCount++;
  document.getElementById('dict-count-display').textContent = dictCount;
  showToast(`${dictCount}회 완료!`);
}

/* ── 문장완성 ── */
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
  {icon:'📚',key:'dream_book',title:'잠재력 그림책 소개'},
  {icon:'⏰',key:'habit',title:'하루 5분의 습관'},
  {icon:'♻️',key:'plastic',title:'플라스틱 대체 제품'},
  {icon:'📣',key:'act_now',title:'ACT NOW 활동'},
  {icon:'⚖️',key:'work_right',title:'일할 권리 연설'},
  {icon:'🔍',key:'fake_news',title:'가짜뉴스 판별법'},
  {icon:'💡',key:'innovation',title:'혁신 사례 담화'},
  {icon:'🎨',key:'art_guide',title:'에릭 요한슨 오디오'},
];
const INT_TOPIC_MAP = {dream_book:'잠재력 그림책 소개 팟캐스트',habit:'하루 5분 습관 브이로그',plastic:'플라스틱병 대체 제품 현장 보도',act_now:'ACT NOW 홍보 영상',work_right:'일할 권리 연설',fake_news:'가짜뉴스 판별 정보성 영상',innovation:'혁신 사례 담화',art_guide:'에릭 요한슨 작품 오디오 가이드'};
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
