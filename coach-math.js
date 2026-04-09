/* ── D-day ── */
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const mathExam = new Date(2026, 3, 16);
  const diff = Math.ceil((mathExam - now) / 86400000);
  const el = document.getElementById('math-dday');
  if (el) el.textContent = diff < 0 ? '시험 완료' : diff === 0 ? '🔥 당일!' : diff;

  initRubricClick('s4-rubric', 's4-bar-fill', 's4-bar-count', 'math');
});

/* ── STEP 1: 예시 문제 샘플 ── */
const s1Samples = [
  {
    ref: '교과서 p.27 예제 5',
    prob: 'log₂(x-1) + log₂(x+1) = 3 을 만족하는 x의 값을 구하시오.',
    ans: 'log₂(x-1)(x+1) = 3 으로 합쳐서 x²-1 = 8, x² = 9, x = ±3 이므로 x = 3, x = -3 둘 다 답으로 썼음.'
  },
  {
    ref: '교과서 p.22 연습 #4',
    prob: '4^x - 3·2^x - 4 = 0 을 만족하는 x의 값을 구하시오.',
    ans: 't = 2^x 로 치환해서 t² - 3t - 4 = 0, (t-4)(t+1) = 0. t = 4 또는 t = -1 이라서 x = 2 또는 2^x = -1 이라고 썼는데 틀렸음.'
  },
  {
    ref: '교과서 p.35 연습 #7',
    prob: 'log_(1/3)(2x-1) ≥ log_(1/3)(x+2) 를 푸시오.',
    ans: '밑이 1/3 인데 그냥 2x-1 ≥ x+2 로 풀어서 x ≥ 3 이라고 썼음. 부등호 방향을 유지했음.'
  },
  {
    ref: '교과서 p.14 예제 2',
    prob: '√((-5)²) 의 값을 구하시오.',
    ans: '처음에 √((-5)²) = -5 라고 썼다가 고쳤음. n이 짝수일 때 절댓값 처리인지 헷갈렸음.'
  },
  {
    ref: '교과서 p.33 심화 #2',
    prob: 'log₂3 × log₃8 의 값을 구하시오.',
    ans: '밑이 달라서 어떻게 해야 할지 몰라서 log₂3 × 3 = log₂9 라고 잘못 계산했음.'
  }
];
function loadS1Sample(idx) {
  const s = s1Samples[idx];
  document.getElementById('s1-problem-ref').value = s.ref;
  document.getElementById('s1-problem-text').value = s.prob;
  document.getElementById('s1-my-answer').value = s.ans;
  showToast('예시 불러오기 완료 — AI 분석을 실행하십시오.');
}

/* ── STEP 1: 오답 분석 ── */
const errorLog = [];

async function analyzeStep1() {
  const ref  = document.getElementById('s1-problem-ref').value.trim();
  const prob = document.getElementById('s1-problem-text').value.trim();
  const ans  = document.getElementById('s1-my-answer').value.trim();
  const el   = document.getElementById('s1-feedback');
  if (!prob) { showToast('문제 내용을 입력하십시오'); return; }
  if (ref) { errorLog.push({ ref, prob, ans }); renderErrorList(); updateS1Rubric(); }
  const sys = `당신은 고등학교 대수(지수·로그) 수행평가 분석 전문가입니다. 다음 형식으로 피드백하십시오:\n[오류 유형]: 개념 오류 / 계산 실수 / 조건 누락 / 기타\n[구체적 오류]: 어느 단계에서 무엇이 틀렸는지\n[올바른 풀이]: 4단계(조건→공식→전개→검증) 구조로 서술\n[반복 주의사항]: 이 유형에서 자주 발생하는 함정`;
  await callClaude(sys, `문제 번호: ${ref||'미입력'}\n문제: ${prob}\n나의 풀이: ${ans||'(미입력)'}`, el);
  updateS1Rubric();
}

function renderErrorList() {
  const list = document.getElementById('s1-error-list');
  const badge = document.getElementById('error-count-badge');
  if (badge) badge.textContent = errorLog.length;
  if (!errorLog.length) { list.innerHTML = '<div class="empty-state">아직 입력된 오답이 없습니다.</div>'; return; }
  list.innerHTML = errorLog.map((e,i) => `
    <div class="error-card">
      <div class="error-card-header">
        <span class="error-ref">${e.ref || '번호 미입력'}</span>
        <button class="error-del" onclick="deleteError(${i})">✕</button>
      </div>
      <div class="error-text">${e.prob.substring(0,80)}${e.prob.length>80?'...':''}</div>
    </div>
  `).join('');
}
function deleteError(i) { errorLog.splice(i,1); renderErrorList(); updateS1Rubric(); }
function clearAllErrors() { errorLog.length=0; renderErrorList(); updateS1Rubric(); }
function clearStep1() {
  ['s1-problem-ref','s1-problem-text','s1-my-answer'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('s1-feedback').textContent = '분석 결과가 여기에 표시됩니다.';
  document.getElementById('s1-feedback').classList.remove('has-content');
}
function updateS1Rubric() {
  const states = [errorLog.length >= 3, false, false, false, false];
  const fb = document.getElementById('s1-feedback').textContent;
  if (fb.includes('개념')) states[1] = true;
  if (fb.includes('계산')) states[2] = true;
  if (fb.includes('조건')) states[3] = true;
  if (fb.includes('로그')) states[4] = true;
  states.forEach((v,i) => { const el=document.getElementById(`r1-${i}`); if(el) el.classList.toggle('done',v); });
  const n = states.filter(Boolean).length;
  const fill = document.getElementById('s1-bar-fill');
  const txt = document.getElementById('s1-bar-count');
  if (fill) fill.style.width = (n/5*100)+'%';
  if (txt) txt.textContent = `${n} / 5 완료`;
}

/* ── STEP 2: 예시 문제 샘플 ── */
const s2Samples = [
  {
    prob: 'log₂(x-1) + log₂(x+1) = 3 을 만족하는 x의 값을 구하시오. (서술형 6점)',
    s1: '밑: 2 > 0, 2 ≠ 1 ✓\n진수 조건: x-1 > 0 → x > 1 … ①\n         x+1 > 0 → x > -1 … ②\n공통 조건 (교집합): x > 1',
    s2: '로그의 곱 법칙에 의해\nlog₂MN = log₂M + log₂N 을 역방향 적용',
    s3: 'log₂(x-1)(x+1) = 3\n       (x-1)(x+1) = 2³ = 8\n            x² - 1 = 8\n                x² = 9\n                 x = ±3',
    s4: 'x > 1 조건에서 x = -3 제외.\nx = 3 은 진수 3-1=2>0, 3+1=4>0 만족 ✓\n∴ x = 3'
  },
  {
    prob: '4^x - 3·2^x - 4 = 0 을 만족하는 x의 값을 구하시오. (서술형 6점)',
    s1: 't = 2^x 로 놓으면 지수함수는 항상 양수이므로 t > 0',
    s2: '지수법칙 (a^m)^n = a^mn 에 의해 4^x = (2²)^x = (2^x)² = t²\nt = 2^x 로 치환',
    s3: 't² - 3t - 4 = 0\n(t - 4)(t + 1) = 0\nt = 4  또는  t = -1',
    s4: 't > 0 조건에서 t = -1 제외.\nt = 4 이면 2^x = 2² 이므로 x = 2.\n∴ x = 2'
  },
  {
    prob: 'log_(1/3)(2x-1) ≥ log_(1/3)(x+2) 를 푸시오. (서술형 8점)',
    s1: '밑: 1/3 > 0, 1/3 ≠ 1 ✓\n진수 조건: 2x-1 > 0 → x > 1/2 … ①\n         x+2 > 0 → x > -2 … ②\n공통 조건: x > 1/2',
    s2: '밑 0 < a < 1 이면 log_a M ≥ log_a N → M ≤ N (부등호 방향 역전)\n밑이 1/3 < 1 이므로 부등호 역전 적용',
    s3: '2x - 1 ≤ x + 2\n      x ≤ 3',
    s4: '진수 조건 x > 1/2 와 x ≤ 3 의 교집합:\n∴ 1/2 < x ≤ 3'
  },
  {
    prob: 'y = 2^(x-1) + 3 의 점근선을 구하고, x=1, x=2 를 대입한 두 점의 좌표를 구하시오. (서술형 6점)',
    s1: '기저 함수 y = 2^x 를 x축으로 +1, y축으로 +3 평행이동한 함수.\n2^(x-1) > 0 이므로 y > 3 → 수평 점근선: y = 3',
    s2: '지수함수 y = a^x 의 평행이동 성질 적용:\ny = a^(x-p) + q 의 점근선은 y = q',
    s3: 'x=1 대입: y = 2^(1-1) + 3 = 2^0 + 3 = 1 + 3 = 4\nx=2 대입: y = 2^(2-1) + 3 = 2^1 + 3 = 2 + 3 = 5',
    s4: '점근선: y = 3\n두 점의 좌표: (1, 4), (2, 5)\n∴ 점근선 y = 3, 두 점 (1, 4), (2, 5)'
  },
  {
    prob: 'log2 = a, log3 = b 로 놓을 때, log72 를 a, b 로 나타내시오. (단답형 4점)',
    s1: '72 = 2³ × 3² (소인수분해)\nlog의 밑은 10 (상용로그), 진수 72 > 0 ✓',
    s2: '로그 곱 법칙: log MN = logM + logN\n로그 거듭제곱 법칙: log M^k = k·logM',
    s3: 'log72 = log(2³ × 3²)\n      = log2³ + log3²\n      = 3log2 + 2log3\n      = 3a + 2b',
    s4: 'log72 = 3a + 2b 확인: a=log2≈0.301, b=log3≈0.477\n3(0.301)+2(0.477) = 0.903+0.954 = 1.857 ≈ log72 ✓\n∴ log72 = 3a + 2b'
  },
  {
    prob: '지수방정식 9^x - 4·3^x - 45 = 0 을 만족하는 x의 값을 구하시오. (서술형 6점)',
    s1: 't = 3^x 로 놓으면 지수함수는 항상 양수이므로 t > 0',
    s2: '지수법칙 (a^m)^n = a^mn 에 의해 9^x = (3²)^x = (3^x)² = t²\nt = 3^x 로 치환',
    s3: 't² - 4t - 45 = 0\n(t-9)(t+5) = 0\nt = 9 또는 t = -5',
    s4: 't > 0 조건에서 t = -5 제외.\nt = 9이면 3^x = 9 = 3²\n∴ x = 2'
  },
  {
    prob: 'log₂(x+3) ≥ log₂(2x-1) 를 만족하는 x의 범위를 구하시오. (서술형 8점)',
    s1: '밑: 2 > 0, 2 ≠ 1 ✓\n진수 조건: x+3 > 0 → x > -3 … ①\n          2x-1 > 0 → x > 1/2 … ②\n공통 조건 (교집합): x > 1/2',
    s2: '밑 2 > 1 이므로 부등호 방향 유지\n로그 부등식: log₂M ≥ log₂N → M ≥ N (밑>1)',
    s3: 'x+3 ≥ 2x-1\n3+1 ≥ 2x-x\n4 ≥ x\nx ≤ 4',
    s4: '진수 조건 x > 1/2 와 결합:\nx > 1/2 이고 x ≤ 4\n∴ 1/2 < x ≤ 4'
  }
];
function loadS2Sample(idx) {
  const s = s2Samples[idx];
  document.getElementById('s2-problem').value = s.prob;
  document.getElementById('s2-step1').value = s.s1;
  document.getElementById('s2-step2').value = s.s2;
  document.getElementById('s2-step3').value = s.s3;
  document.getElementById('s2-step4').value = s.s4;
  ['warn-s2-1','warn-s2-2','warn-s2-4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'step-warn';
  });
  showToast('문제 불러오기 완료 — 4단계 검증을 실행하십시오.');
}

/* ── STEP 2: 서술형 방어 ── */
async function analyzeStep2() {
  const prob = document.getElementById('s2-problem').value.trim();
  const s1 = document.getElementById('s2-step1').value.trim();
  const s2 = document.getElementById('s2-step2').value.trim();
  const s3 = document.getElementById('s2-step3').value.trim();
  const s4 = document.getElementById('s2-step4').value.trim();
  const el = document.getElementById('s2-feedback');
  if (!s1 && !s2 && !s3 && !s4) { showToast('최소 1단계 이상 작성하십시오'); return; }
  const w1 = document.getElementById('warn-s2-1');
  const w2 = document.getElementById('warn-s2-2');
  const w4 = document.getElementById('warn-s2-4');
  const hasLogCond = s1.includes('>') || s1.includes('조건') || s1.includes('>0');
  if (s1 && !hasLogCond) { w1.textContent='⚠ 진수/밑 조건이 보이지 않습니다.'; w1.className='step-warn visible warn-red'; }
  else if (s1) { w1.textContent='✓ 조건 명시 확인됨'; w1.className='step-warn visible warn-blue'; }
  const hasFormula = s2.includes('의해') || s2.includes('법칙') || s2.includes('공식') || s2.includes('By');
  if (s2 && !hasFormula) { w2.textContent='⚠ 사용 공식을 명시하십시오.'; w2.className='step-warn visible warn-red'; }
  else if (s2) { w2.textContent='✓ 공식 명시 확인됨'; w2.className='step-warn visible warn-blue'; }
  const hasTherefore = s4.includes('∴') || s4.includes('따라서');
  if (s4 && !hasTherefore) { w4.textContent='⚠ ∴ 결론 접속사가 없습니다.'; w4.className='step-warn visible warn-red'; }
  else if (s4) { w4.textContent='✓ ∴ 결론 확인됨'; w4.className='step-warn visible warn-blue'; }
  const sys = `당신은 고등학교 대수 수행평가 채점관입니다. 학생의 4단계 서술형 답안을 검토하여:\n①조건 확인 완성도, ②공식 명시 여부, ③등호 정렬 적절성, ④검증 및 ∴ 결론 사용 여부를 기준으로 피드백하십시오.`;
  await callClaude(sys, `문제: ${prob||'미입력'}\n①조건: ${s1||'미입력'}\n②공식: ${s2||'미입력'}\n③전개: ${s3||'미입력'}\n④검증/결론: ${s4||'미입력'}`, el);
  updateS2Rubric(hasLogCond, hasFormula, s3.length>0, hasTherefore);
}
function updateS2Rubric(c1, c2, c3, c4) {
  const states = [!!c1, !!c2, !!c3, !!c4, document.getElementById('s2-step4').value.includes('∴')];
  states.forEach((v,i) => { const el=document.getElementById(`r2-${i}`); if(el) el.classList.toggle('done',v); });
  const n = states.filter(Boolean).length;
  const fill = document.getElementById('s2-bar-fill');
  const txt = document.getElementById('s2-bar-count');
  if (fill) fill.style.width = (n/5*100)+'%';
  if (txt) txt.textContent = `${n} / 5 완료`;
}
function clearStep2() {
  ['s2-problem','s2-step1','s2-step2','s2-step3','s2-step4'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  ['warn-s2-1','warn-s2-2','warn-s2-4'].forEach(id => { const el=document.getElementById(id); if(el) el.className='step-warn'; });
  const fb = document.getElementById('s2-feedback');
  fb.textContent = '4단계를 작성 후 검증을 실행하십시오.';
  fb.classList.remove('has-content');
}

/* ── STEP 3: 오답 패턴 버튼 데이터 ── */
const s3Patterns = [
  '- 로그방정식: 진수 조건 교집합을 구하지 않아 음수 해를 포함함 (조건 누락)',
  '- 지수방정식: t=2^x 치환 후 t>0 조건 미명시, t=-1을 해로 포함함 (치환 조건 오류)',
  '- 로그 부등식: 밑이 1/3인데 부등호 방향을 유지해서 오답 (방향 역전 미적용)',
  '- 거듭제곱근: n=2(짝수)일 때 √(a²)=|a| 처리 누락, 부호 오류 발생 (절댓값 조건)',
  '- 서술형: 마지막 답에 ∴ 없이 숫자만 써서 결론 감점 (기호 누락)',
  '- 서술형: 등호(=) 세로 정렬이 맞지 않아 채점자 가독성 감점 (형식 오류)',
  '- 로그 계산: 밑 변환 공식에서 분자·분모 순서를 반대로 적용함 (공식 역적용)',
  '- 로그 조건: 밑>0, 밑≠1, 진수>0 세 가지 중 진수 조건만 쓰고 밑 조건 생략 (조건 불완전)'
];
function addS3Pattern(idx) {
  const el = document.getElementById('s3-errors');
  const current = el.value.trim();
  el.value = current ? current + '\n' + s3Patterns[idx] : s3Patterns[idx];
  showToast('오류 유형이 추가됐습니다.');
}
function loadS3Full() {
  document.getElementById('s3-errors').value = s3Patterns.join('\n');
  showToast('전체 예시가 불러와졌습니다. 패턴 분석을 실행하십시오.');
}
function clearS3() {
  document.getElementById('s3-errors').value = '';
  const fb = document.getElementById('s3-feedback');
  fb.textContent = '위 오답 유형을 확인한 후 분석을 실행하십시오.';
  fb.classList.remove('has-content');
  showToast('초기화됐습니다.');
}

/* ── STEP 3: 패턴 분석 ── */
/* ── STEP 3 오답 누적 로그 ── */
const s3ErrorLog = [];

function renderS3ErrorLog() {
  const list = document.getElementById('s3-error-log-list');
  const badge = document.getElementById('s3-error-badge');
  if (badge) badge.textContent = s3ErrorLog.length;
  if (!s3ErrorLog.length) {
    list.innerHTML = '<div class="empty-state">아직 저장된 오답 유형이 없습니다.</div>';
    return;
  }
  list.innerHTML = s3ErrorLog.map((e, i) => `
    <div class="error-card">
      <div class="error-card-header">
        <span class="error-ref">오류 #${i+1} — ${e.date}</span>
        <button class="error-del" onclick="deleteS3Error(${i})">✕</button>
      </div>
      <div class="error-text">${e.text.substring(0,120)}${e.text.length>120?'...':''}</div>
    </div>
  `).join('');
}

function deleteS3Error(i) { s3ErrorLog.splice(i, 1); renderS3ErrorLog(); showToast('삭제됐습니다.'); }
function clearS3Log() { s3ErrorLog.length = 0; renderS3ErrorLog(); showToast('오답 목록을 초기화했습니다.'); }
function exportS3Errors() {
  if (!s3ErrorLog.length) { showToast('저장된 오답이 없습니다.'); return; }
  const text = s3ErrorLog.map((e,i) => `#${i+1} [${e.date}]\n${e.text}`).join('\n\n');
  copyText(text);
}

async function analyzePatterns() {
  const errors = document.getElementById('s3-errors').value.trim();
  const el = document.getElementById('s3-feedback');
  if (!errors) { showToast('오답 유형을 입력하십시오'); return; }
  // 오답 자동 저장
  const now = new Date();
  const dateStr = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  s3ErrorLog.push({ text: errors, date: dateStr });
  renderS3ErrorLog();
  const sys = `당신은 고등학교 대수 수행평가 학습 전략 전문가입니다. 학생의 오답 패턴을 분석하여 취약 개념 우선순위와 3일 이내 집중 복습 계획을 구체적으로 제시하십시오.`;
  await callClaude(sys, errors, el);
}


/* ── STEP 4 타임어택 문제 토글 ── */
function toggleTA(id) {
  const prob = document.getElementById(id);
  const ans  = document.getElementById(id + '-ans');
  const btn  = prob.querySelector('.ta-reveal-btn');
  if (!ans) return;
  const isOpen = ans.classList.contains('visible');
  ans.classList.toggle('visible', !isOpen);
  prob.classList.toggle('revealed', !isOpen);
  if (btn) {
    btn.textContent = isOpen ? '정답 확인' : '숨기기';
    btn.classList.toggle('open', !isOpen);
  }
}
function revealAllS4() {
  document.querySelectorAll('#math-s4 .ta-answer').forEach(a => {
    a.classList.add('visible');
    const prob = a.closest('.ta-problem');
    if (prob) prob.classList.add('revealed');
    const btn = prob?.querySelector('.ta-reveal-btn');
    if (btn) { btn.textContent = '숨기기'; btn.classList.add('open'); }
  });
  showToast('전체 풀이를 공개했습니다.');
}
function hideAllS4() {
  document.querySelectorAll('#math-s4 .ta-answer').forEach(a => {
    a.classList.remove('visible');
    const prob = a.closest('.ta-problem');
    if (prob) prob.classList.remove('revealed');
    const btn = prob?.querySelector('.ta-reveal-btn');
    if (btn) { btn.textContent = '정답 확인'; btn.classList.remove('open'); }
  });
  showToast('전체 풀이를 닫았습니다.');
}

/* ── STEP 4: 타이머 ── */
let timerTotal = 40*60, timerRemaining = timerTotal, timerInterval = null;
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerRemaining--;
    if (timerRemaining <= 0) { timerRemaining=0; clearInterval(timerInterval); timerInterval=null; showToast('⏰ 40분 종료!'); }
    updateTimerDisplay();
  }, 1000);
}
function pauseTimer() { clearInterval(timerInterval); timerInterval=null; }
function resetTimer() { pauseTimer(); timerRemaining=timerTotal; updateTimerDisplay(); }
function updateTimerDisplay() {
  const m=Math.floor(timerRemaining/60), s=timerRemaining%60;
  document.getElementById('timer-display').textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const pct = timerRemaining/timerTotal;
  const fill = document.getElementById('timer-bar');
  if (fill) {
    fill.style.width = (pct*100)+'%';
    fill.style.background = timerRemaining<300 ? 'var(--danger)' : timerRemaining<600 ? 'var(--warning)' : 'var(--math-primary)';
  }
}
(function initProblemGrid() {
  const grid = document.getElementById('problem-grid');
  if (!grid) return;
  const types = [
    '거듭제곱근','지수 계산','로그 계산','지수방정식',
    '로그방정식','지수함수','로그함수','로그 부등식',
    '지수 부등식','밑 변환 공식','치환형 방정식','응용 문제'
  ];
  const timeHints=['3분','3분','3분','4분','4분','4분','4분','5분','5분','3분','5분','6분'];
  grid.innerHTML = types.map((t,i) => `
    <div class="problem-card" id="pc-${i}" onclick="toggleProblem(${i})">
      <div class="pc-num">문제 ${i+1} <span style="color:var(--text-dim);font-size:0.62rem;">· ${timeHints[i]||'4분'}</span></div>
      <div class="pc-type">${t}</div>
      <div class="pc-status pending" id="pcs-${i}">미풀이</div>
    </div>
  `).join('');
})();
function toggleProblem(idx) {
  const card = document.getElementById(`pc-${idx}`);
  const status = document.getElementById(`pcs-${idx}`);
  if (card.classList.contains('solved')) {
    card.classList.replace('solved','skipped'); status.textContent='스킵'; status.className='pc-status skip';
  } else if (card.classList.contains('skipped')) {
    card.classList.remove('skipped'); status.textContent='미풀이'; status.className='pc-status pending';
  } else {
    card.classList.add('solved'); status.textContent='완료 ✓'; status.className='pc-status ok';
  }
}
function calcFinalScore() {
  const shortCorrect = parseInt(document.getElementById('s4-short-correct').value) || 0;
  const essayPct = parseFloat(document.getElementById('s4-essay-pct').value) || 0;
  const shortScore = Math.round((shortCorrect/8)*16*10)/10;
  let essayScore = 13;
  if (essayPct>=100) essayScore=20; else if (essayPct>=94) essayScore=19;
  else if (essayPct>=88) essayScore=18; else if (essayPct>=82) essayScore=17;
  else if (essayPct>=76) essayScore=16; else if (essayPct>=70) essayScore=15;
  else if (essayPct>=64) essayScore=14;
  const total = shortScore + essayScore;
  document.getElementById('pred-short').textContent = `${shortScore}점`;
  document.getElementById('pred-essay').textContent = `${essayScore}점`;
  document.getElementById('pred-total').textContent = `${total}점`;
  document.getElementById('score-result').style.display = 'block';
  // 등급 계산 (수행평가 36점 만점 기준 — 실제 등급은 학교 기준 따라 다름)
  const pct = (total / 36) * 100;
  let grade, msg, color;
  if (pct >= 97)       { grade='A+'; msg='만점 수준입니다! 실수 없이 제출하세요.'; color='#34d399'; }
  else if (pct >= 92)  { grade='A';  msg='목표 달성권입니다. 서술형 조건 누락만 없으면 됩니다.'; color='#34d399'; }
  else if (pct >= 85)  { grade='B+'; msg='로그 조건과 ∴ 결론 2가지만 잡으면 A 진입 가능합니다.'; color='#38bdf8'; }
  else if (pct >= 77)  { grade='B';  msg='오답 패턴 분석을 한 번 더 돌려보십시오.'; color='#f59e0b'; }
  else                 { grade='C';  msg='서술형 4단계 구조를 다시 훈련하십시오.'; color='#ef4444'; }
  const gtext = document.getElementById('score-grade-text');
  const gmsg  = document.getElementById('score-grade-msg');
  const gbox  = document.getElementById('score-grade-box');
  if (gtext) { gtext.textContent = grade; gtext.style.color = color; }
  if (gmsg)  { gmsg.textContent  = msg; }
  if (gbox)  { gbox.style.borderColor = color + '66'; gbox.style.background = color + '11'; }
  showToast(`예상 합계 ${total}점 — 등급 ${grade}`);
}
