const JSON_SAMPLE_PATH_V2 = '../data/english-dictation/topic01-the-dot/s01.json';

const previewV2State = {
  sentence: null,
  activeTab: 'lit',
  currentButton: null,
  currentUtterance: null,
};

function pv2Escape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pv2Status(message) {
  const el = document.getElementById('json-preview-status');
  if (el) el.textContent = message;
}

function pv2SupportsTTS() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function pv2Voices() {
  if (!pv2SupportsTTS()) return [];
  return window.speechSynthesis.getVoices()
    .filter((voice) => /^en(-|_)/i.test(voice.lang) || /English/i.test(voice.name));
}

function pv2StopTTS() {
  if (!pv2SupportsTTS()) return;
  window.speechSynthesis.cancel();
  if (previewV2State.currentButton) previewV2State.currentButton.classList.remove('playing');
  previewV2State.currentButton = null;
  previewV2State.currentUtterance = null;
}

function pv2Speak(button, text, rate) {
  if (!pv2SupportsTTS()) {
    pv2Status('이 브라우저는 TTS를 지원하지 않습니다.');
    return;
  }
  const phrase = String(text || '').trim();
  if (!phrase) {
    pv2Status('재생할 문장이 없습니다.');
    return;
  }
  const wasSame = previewV2State.currentButton === button;
  pv2StopTTS();
  if (wasSame) return;
  const utterance = new SpeechSynthesisUtterance(phrase);
  utterance.lang = 'en-US';
  utterance.rate = Number(rate) || 1;
  const voice = pv2Voices().find((item) => /en-us/i.test(item.lang)) || pv2Voices()[0] || null;
  if (voice) utterance.voice = voice;
  utterance.onstart = () => {
    if (button) button.classList.add('playing');
    previewV2State.currentButton = button || null;
    previewV2State.currentUtterance = utterance;
    pv2Status(`재생 중: ${phrase}`);
  };
  utterance.onend = utterance.onerror = () => {
    if (button) button.classList.remove('playing');
    previewV2State.currentButton = null;
    previewV2State.currentUtterance = null;
    pv2Status('재생 완료');
  };
  window.speechSynthesis.resume();
  window.setTimeout(() => window.speechSynthesis.speak(utterance), 40);
}

function pv2Sentence(sentence) {
  const blankMap = new Map((sentence.blanks || []).map((blank) => [blank.tokenIndex, blank.answer]));
  return sentence.text.split(/\s+/).map((token, index) => {
    const plain = token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
    if (!plain || !blankMap.has(index)) return pv2Escape(token);
    const prefix = token.slice(0, token.indexOf(plain));
    const suffix = token.slice(token.indexOf(plain) + plain.length);
    return `${pv2Escape(prefix)}<span class="blank">${pv2Escape(blankMap.get(index))}</span>${pv2Escape(suffix)}`;
  }).join(' ');
}

function pv2TtsButtons(text, rates, labels) {
  const values = Array.isArray(rates) && rates.length ? rates : [1];
  return values.map((rate, index) => `
    <button class="tts-btn${index > 0 ? ' slow' : ''} js-pv2-tts" type="button" data-text="${pv2Escape(text)}" data-rate="${Number(rate)}">
      <span class="icon">▶</span>${pv2Escape(labels?.[index] || `${Number(rate).toFixed(1)}x 듣기`)}
    </button>
  `).join('');
}

function pv2PronGapCard(item) {
  return `
    <div class="pcard">
      <div class="pcard-header">
        <span class="pword">${pv2Escape(item.word || '')}</span>
        ${item.pos ? `<span class="ppos">${pv2Escape(item.pos)}</span>` : ''}
      </div>
      <div class="pcard-body">
        <div class="prow">
          <div class="prow-label label-know">외운<br>소리</div>
          <div class="prow-content">
            <div class="syllables">
              ${(item.known?.syllables || []).map((syllable) => `<span class="syl syl-${pv2Escape(syllable.type || 'normal')}">${pv2Escape(syllable.text || '')}</span>`).join('')}
            </div>
            ${item.known?.desc ? `<div class="pdesc">${pv2Escape(item.known.desc)}</div>` : ''}
            <div class="tts-row">
              ${pv2TtsButtons(item.known?.ttsText || item.word || '', [item.known?.ttsRate || 1, 0.6], ['보통 속도', '느리게'])}
            </div>
          </div>
        </div>
        <div class="prow">
          <div class="prow-label label-hear">실제<br>들리는 소리</div>
          <div class="prow-content">
            <div class="syllables">
              ${(item.actual?.syllables || []).map((syllable) => `<span class="syl syl-${pv2Escape(syllable.type || 'normal')}">${pv2Escape(syllable.text || '')}</span>`).join('')}
            </div>
            ${item.actual?.hearPoint ? `<div class="hear-point">${pv2Escape(item.actual.hearPoint)}</div>` : ''}
            <div class="tts-row">
              ${pv2TtsButtons(item.actual?.ttsText || item.word || '', [item.actual?.ttsRate || 1, item.actual?.ttsRateSlow || 0.75], ['실제 속도로 듣기', `${Number(item.actual?.ttsRateSlow || 0.75).toFixed(2).replace(/0$/, '')}x`])}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function pv2FlowBox(sentence) {
  const guide = sentence.guide || {};
  const units = Array.isArray(guide.flowUnits) ? guide.flowUnits : [];
  if (!units.length) return '';
  return `
    <div class="flow-box" style="margin-top:4px">
      <div style="font-size:12px;color:var(--color-text-tertiary);margin-bottom:10px">끊어 읽기 단위 ( / = 짧은 쉼 )</div>
      <div class="flow">
        ${units.map((unit, index) => `
          ${index ? '<span class="link-arrow">/</span>' : ''}
          <span class="fw fw-${pv2Escape(unit.tone || 'a')}${unit.subtle ? ' subtle' : ''}">${pv2Escape(unit.text || '')}</span>
        `).join('')}
      </div>
      ${guide.fullHeard ? `<div class="full-heard">${pv2Escape(guide.fullHeard)}</div>` : ''}
      <div class="tts-row" style="margin-top:10px">
        ${pv2TtsButtons(sentence.tts?.text || sentence.text, sentence.tts?.rates || [1, 0.7, 0.5], ['전체 문장 듣기', '0.7x 느리게', '0.5x 아주 느리게'])}
      </div>
      <div class="legend">
        <div class="lg-item"><span class="lg-dot fw-a"></span>강세 음절</div>
        <div class="lg-item"><span class="lg-dot fw-b"></span>약형/축약</div>
        <div class="lg-item"><span class="lg-dot fw-d"></span>연음 뭉침</div>
        <div class="lg-item"><span class="lg-dot lg-ghost"></span>거의 안 들림</div>
      </div>
    </div>
  `;
}

function pv2SelfCheck(items) {
  return items.map((item) => `
    <div class="sc-item">
      <div class="sc-top">
        <span class="sc-q">${pv2Escape(item.question || item || '')}</span>
        <div class="sc-btns">
          <button class="sc-btn-no js-pv2-toggle" type="button">못하겠어요</button>
          <button class="sc-btn-yes js-pv2-done" type="button">할 수 있어요</button>
        </div>
      </div>
      <div class="sc-sol">
        <div class="sc-sol-label">이렇게 연습해보세요</div>
        ${(item.solutions || []).map((solution) => `<div class="sc-sol-item"><span class="sc-sol-num">${pv2Escape(solution.step || '')}</span><span>${pv2Escape(solution.desc || '')}</span></div>`).join('')}
        ${item.goalTip ? `<div class="sc-goal">🎯 목표: ${pv2Escape(item.goalTip)}</div>` : ''}
      </div>
    </div>
  `).join('');
}

function pv2PriorityFocus(sentence) {
  const primary = sentence.guide?.m
    || sentence.commentary?.wrongReasons?.[0]
    || sentence.commentary?.learningGoal
    || '';
  if (!primary) return '';
  return `
    <div class="focus-card">
      <div class="focus-label">핵심 1개</div>
      <div class="focus-text">${pv2Escape(primary)}</div>
    </div>
  `;
}

function pv2CoachBrief(sentence) {
  const guide = sentence.guide || {};
  const items = [
    { label: '상황', value: guide.t },
    { label: '끊어 듣기', value: guide.p },
    { label: '놓치기 쉬운 점', value: guide.m },
    { label: '듣는 요령', value: guide.c },
  ].filter((item) => item.value);
  if (!items.length) return '';
  return `
    <div class="sec">
      <div class="sl">1타 해설 요약</div>
      <div class="coach-brief-grid">
        ${items.map((item) => `
          <div class="coach-brief-item">
            <div class="coach-brief-label">${pv2Escape(item.label)}</div>
            <div class="coach-brief-value">${pv2Escape(item.value)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function pv2PronSummary(sentence) {
  const pronunciation = sentence.commentary?.pronunciation || {};
  const items = [
    { label: '연음', value: pronunciation.linking },
    { label: '약형', value: pronunciation.weakForm },
    { label: '강세', value: pronunciation.stress },
  ].filter((item) => item.value);
  if (!items.length) return '';
  return `
    <div class="sec">
      <div class="sl">발음 3포인트</div>
      <div class="pron-summary-grid">
        ${items.map((item) => `
          <div class="pron-summary-card">
            <div class="pron-summary-tag">${pv2Escape(item.label)}</div>
            <div class="pron-summary-text">${pv2Escape(item.value)}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function pv2ExamFocus(kind, label, title, desc) {
  if (!title && !desc) return '';
  return `
    <div class="exam-focus-card ${pv2Escape(kind)}">
      <div class="exam-focus-label">${pv2Escape(label || '핵심')}</div>
      ${title ? `<div class="exam-focus-title">${pv2Escape(title)}</div>` : ''}
      ${desc ? `<div class="exam-focus-desc">${pv2Escape(desc)}</div>` : ''}
    </div>
  `;
}

function pv2ToeicQuickChecks(items) {
  if (!Array.isArray(items) || !items.length) return '';
  return `
    <div class="sec">
      <div class="sl">실전 3초 판별</div>
      <div class="toeic-question-list">
        ${items.map((item, index) => `
          <div class="toeic-question-card">
            <div class="toeic-question-top">
              <span class="toeic-question-badge">${pv2Escape(item.type || `Part 5 체크 ${index + 1}`)}</span>
              ${item.skill ? `<span class="ptag">${pv2Escape(item.skill)}</span>` : ''}
            </div>
            <div class="toeic-question-stem">${pv2Escape(item.stem || '')}</div>
            <div class="toeic-choice-list">
              ${(item.choices || []).map((choice) => `
                <div class="toeic-choice${choice.isAnswer ? ' is-answer' : ''}">
                  ${pv2Escape(choice.label || '')}. ${pv2Escape(choice.text || '')}
                </div>
              `).join('')}
            </div>
            <div class="toeic-solution">
              <strong>정답 근거</strong>
              <p>${pv2Escape(item.rationale || '')}</p>
              ${item.trap ? `<div class="toeic-trap">함정: ${pv2Escape(item.trap)}</div>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function pv2OpicPatternList(items) {
  if (!Array.isArray(items) || !items.length) return '';
  return `
    <div class="pattern-list">
      ${items.map((pattern) => `
        <div class="pattern-item">
          <strong>${pv2Escape(pattern.template || '')}</strong>
          <div>${pv2Escape(pattern.desc || '')}</div>
          ${(pattern.examples || []).length ? `<div style="margin-top:8px">${pattern.examples.map((item) => pv2Escape(item)).join('<br>')}</div>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function pv2OpicLineList(items) {
  if (!Array.isArray(items) || !items.length) return '';
  return `
    <div class="opic-line-list">
      ${items.map((item) => `
        <div class="opic-line-item">
          <strong>${pv2Escape(item.label || '')}</strong>
          <div>${pv2Escape(item.text || '')}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function pv2OpicAnswerGrid(answers) {
  if (!Array.isArray(answers) || !answers.length) return '';
  return `
    <div class="sec">
      <div class="sl">등급별 모범 답변</div>
      <div class="opic-answer-grid">
        ${answers.map((answer) => `
          <div class="opic-answer-box">
            <span class="opic-answer-label">${pv2Escape(answer.label || '')}</span>
            <p>${pv2Escape(answer.text || '')}</p>
            ${answer.coaching ? `<div class="toeic-trap">코칭: ${pv2Escape(answer.coaching)}</div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function pv2LitTab(sentence) {
  return `
    <div class="panel${previewV2State.activeTab === 'lit' ? ' active' : ''}" id="p-lit">
      <div class="sent">${pv2Sentence(sentence)}</div>
      ${pv2PriorityFocus(sentence)}
      ${pv2CoachBrief(sentence)}
      ${pv2PronSummary(sentence)}
      <div class="sec">
        <div class="sl">학습 목표</div>
        <div class="goal">${pv2Escape(sentence.commentary?.learningGoal || '')}</div>
      </div>
      <div class="sec">
        <div class="sl">발음 갭 — 외운 소리 vs 실제 들리는 소리</div>
        ${(sentence.commentary?.pronunciationGap || []).map(pv2PronGapCard).join('')}
        ${pv2FlowBox(sentence)}
      </div>
      <div class="sec">
        <div class="sl">한국어 표현</div>
        ${(sentence.guide?.chunkMeaning || []).map((item) => `
          <div class="mrow">
            <div class="mlabel">${pv2Escape(item.en || '')}</div>
            <div class="mval">${pv2Escape(item.ko || '')}</div>
          </div>
        `).join('')}
      </div>
      <div class="sec">
        <div class="sl">빈칸 정보</div>
        ${(sentence.blanks || []).map((blank, index) => `
          <div style="margin-bottom:14px">
            <div class="prow-basic"><span class="ptag">빈칸 ${index + 1}</span><span><strong>${pv2Escape(blank.answer || '')}</strong> — ${pv2Escape(blank.pos || '')}</span></div>
            <div class="prow-basic"><span class="ptag">난도</span><span>${pv2Escape(blank.difficulty?.basis || '')}</span></div>
            <div class="prow-basic"><span class="ptag">들을 때</span><span>${pv2Escape(blank.notes?.listen || '')}</span></div>
            <div class="prow-basic"><span class="ptag">함정</span><span>${pv2Escape(blank.notes?.trap || '')}</span></div>
            ${(blank.wrongPatterns || []).map((item) => `<div class="witem"><span class="wans">✕ "${pv2Escape(item.answer || '(무응답)')}"</span>— ${pv2Escape(item.reason || '')}</div>`).join('')}
          </div>
        `).join('')}
      </div>
      <div class="sec">
        <div class="sl">문장 전체 의미</div>
        <div class="mrow"><div class="mlabel">직역</div><div class="mval">${pv2Escape(sentence.fullMeaning?.literal || '')}</div></div>
        <div class="mrow"><div class="mlabel">자연</div><div class="mval">${pv2Escape(sentence.fullMeaning?.natural || '')}</div></div>
        <div class="mrow"><div class="mlabel">상황</div><div class="mval">${pv2Escape(sentence.fullMeaning?.context || '')}</div></div>
      </div>
      <div class="sec">
        <div class="sl">자기평가</div>
        ${pv2SelfCheck(sentence.commentary?.selfCheck || [])}
      </div>
    </div>
  `;
}

function pv2ToeicTab(sentence) {
  const toeic = sentence.examModes?.toeic || {};
  return `
    <div class="panel${previewV2State.activeTab === 'toeic' ? ' active' : ''}" id="p-toeic">
      <div class="sent">${pv2Sentence(sentence)}</div>
      ${pv2ExamFocus('toeic', '토익 1타 포인트', toeic.fastRule, toeic.coachLine)}
      <div class="sec">
        <div class="sl">학습 목표</div>
        <div class="goal">${pv2Escape(toeic.learningGoal || '')}</div>
      </div>
      ${pv2ToeicQuickChecks(toeic.quickChecks)}
      ${(toeic.grammarPoints || []).map((point) => `
        <div class="sec">
          <div class="sl">토익 포인트</div>
          <div style="font-size:13px;color:var(--color-text-secondary);margin-bottom:8px;line-height:1.6">
            <strong style="font-weight:500;color:var(--color-text-primary)">${pv2Escape(point.label || '')}</strong><br>
            ${pv2Escape(point.desc || '')}
          </div>
          ${(point.wrongOptions || []).map((item) => `<div class="witem"><span class="wans">✕ "${pv2Escape(item.answer || '')}"</span>— ${pv2Escape(item.reason || '')}</div>`).join('')}
        </div>
      `).join('')}
      <div class="sec">
        <div class="sl">핵심 패턴</div>
        ${(toeic.keyPatterns || []).map((item) => `<span class="chip">${pv2Escape(item)}</span>`).join('')}
      </div>
      <div class="sec">
        <div class="sl">쉐도잉 팁</div>
        <div class="tip">${pv2Escape(toeic.shadowingTip || '')}</div>
      </div>
      <div class="sec">
        <div class="sl">자기평가</div>
        ${pv2SelfCheck(toeic.selfCheck || [])}
      </div>
    </div>
  `;
}

function pv2OpicTab(sentence) {
  const opic = sentence.examModes?.opic || {};
  return `
    <div class="panel${previewV2State.activeTab === 'opic' ? ' active' : ''}" id="p-opic">
      <div class="sent">${pv2Sentence(sentence)}</div>
      ${pv2ExamFocus('opic', '오픽 1타 포인트', opic.fastRule, opic.coachLine)}
      <div class="sec">
        <div class="sl">학습 목표</div>
        <div class="goal">${pv2Escape(opic.learningGoal || '')}${opic.targetGrade ? ` (${pv2Escape(opic.targetGrade)})` : ''}</div>
      </div>
      <div class="sec">
        <div class="sl">오픽 활용 패턴</div>
        ${pv2OpicPatternList(opic.speakingPatterns)}
        <div class="tip" style="border-color:#7F77DD">${pv2Escape(opic.shadowingTip || '')}</div>
      </div>
      ${pv2OpicAnswerGrid(opic.sampleAnswers)}
      <div class="sec">
        <div class="sl">답변 프레임</div>
        ${pv2OpicLineList(opic.answerFlow)}
      </div>
      <div class="sec">
        <div class="sl">꼬리 질문 · 복구 문장</div>
        <div class="opic-card-grid">
          <div class="opic-card">
            <div class="toeic-question-top">
              <span class="opic-card-badge">Follow-up</span>
            </div>
            ${pv2OpicLineList(opic.followUps)}
          </div>
          <div class="opic-card">
            <div class="toeic-question-top">
              <span class="opic-card-badge">Recovery</span>
            </div>
            <div class="opic-sub-list">
              ${(opic.recoveryLines || []).map((item) => `<div class="opic-sub-item">${pv2Escape(item)}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="sec">
        <div class="sl">스피킹 발음 포인트</div>
        ${(opic.pronunciationTips || []).map((tip) => `<div class="prow-basic"><span class="ptag">${pv2Escape(tip.tag || '')}</span><span>${pv2Escape(tip.desc || '')}</span></div>`).join('')}
      </div>
      <div class="sec">
        <div class="sl">자기평가</div>
        ${pv2SelfCheck(opic.selfCheck || [])}
      </div>
    </div>
  `;
}

function pv2VocabularyCard(item) {
  return `
    <div class="vcard">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        <div class="vword">${pv2Escape(item.word || '')}</div>
        ${item.isMust ? '<span class="vmust">무조건 필수</span>' : ''}
      </div>
      <div class="vpron">${pv2Escape(item.pronunciation || '')} — ${pv2Escape(item.pos || '')}</div>
      <div class="vmeaning">${(item.meanings || []).map((meaning, index) => `${index === 0 ? '①' : '②'} ${pv2Escape(meaning)}`).join(' &nbsp; ')}</div>
      <div class="vex">${pv2Escape(item.exampleSentence || '')} — ${pv2Escape(item.exampleContext || '')}</div>
      ${item.collocations?.length || item.derivatives?.length ? `
        <div class="vocab-chip-grid" style="margin-top:10px">
          ${item.collocations?.length ? `
            <div class="vocab-chip-card">
              <strong>콜로케이션</strong>
              <div class="vocab-chip-list">
                ${item.collocations.map((term) => `<span class="vocab-chip">${pv2Escape(term)}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${item.derivatives?.length ? `
            <div class="vocab-chip-card">
              <strong>파생/변형</strong>
              <div class="vocab-chip-list">
                ${item.derivatives.map((term) => `<span class="vocab-chip">${pv2Escape(term)}</span>`).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}
      ${(item.confusables || []).length ? `
        <div class="confusable-list">
          ${(item.confusables || []).map((entry) => `<div class="confusable-item"><strong>${pv2Escape(entry.word || '')}</strong> — ${pv2Escape(entry.desc || '')}</div>`).join('')}
        </div>
      ` : ''}
      ${(item.synonyms || []).length ? `<div class="vsyn">유의어 ${(item.synonyms || []).map((synonym) => `<span>${pv2Escape(synonym)}</span>`).join('')}</div>` : ''}
      ${item.toeicNote ? `<div class="vtoeic">토익: ${pv2Escape(item.toeicNote)}</div>` : ''}
      ${item.opicNote ? `<div class="vopic">오픽: ${pv2Escape(item.opicNote)}</div>` : ''}
      <div class="tts-row" style="margin-top:8px">
        ${pv2TtsButtons(item.ttsText || item.word || '', [1, 0.7], ['보통 속도', '느리게'])}
      </div>
    </div>
  `;
}

function pv2VocabularyTab(sentence) {
  const voca = sentence.examModes?.voca || {};
  return `
    <div class="panel${previewV2State.activeTab === 'voca' ? ' active' : ''}" id="p-voca">
      <div class="sent">${pv2Sentence(sentence)}</div>
      ${pv2ExamFocus('voca', '어휘 1타 포인트', voca.fastRule, voca.coachLine)}
      <div style="display:inline-block;font-size:12px;padding:3px 10px;border-radius:20px;background:rgba(249,115,22,.16);color:#fdba74;font-weight:700;margin-bottom:14px">이 문장의 필수 어휘 ${(sentence.vocabulary || []).length}개</div>
      ${(sentence.vocabulary || []).map(pv2VocabularyCard).join('')}
      ${(voca.quickChecks || []).length ? `
        <div class="sec">
          <div class="sl">즉답 체크</div>
          <div class="vocab-quiz-list">
            ${(voca.quickChecks || []).map((item, index) => `
              <div class="vocab-quiz-card">
                <div class="vocab-quiz-top">
                  <span class="vocab-quiz-badge">Quick Check ${index + 1}</span>
                </div>
                <div class="vocab-quiz-question">${pv2Escape(item.question || '')}</div>
                <div class="vocab-support-box">
                  <strong>정답</strong>
                  <p>${pv2Escape(item.answer || '')}</p>
                  ${item.coaching ? `<div class="toeic-trap">코칭: ${pv2Escape(item.coaching)}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
      <div class="sec">
        <div class="sl">자기평가</div>
        ${pv2SelfCheck(voca.selfCheck || [
          { question: '핵심 단어의 의미를 두 가지 이상 말할 수 있나요?', solutions: [
            { step: 1, desc: '각 단어 의미를 읽고 다른 예문을 소리 내어 만들어보세요.' },
            { step: 2, desc: '유의어 중 하나를 골라 이 문장의 단어를 교체해 말해보세요.' },
          ], goalTip: '의미 두 가지를 막힘 없이 말할 수 있을 때까지' },
          { question: '단어를 발음 기호 없이 올바르게 발음할 수 있나요?', solutions: [
            { step: 1, desc: 'TTS를 1x → 0.7x 순서로 듣고 따라 말해보세요.' },
            { step: 2, desc: 'introduce 강세 위치를 과장해서 반복하세요.' },
          ]},
          { question: '토익·오픽에서 이 단어가 어떻게 출제되는지 설명할 수 있나요?', solutions: [
            { step: 1, desc: '토익/오픽 노트를 읽고 용도를 한 줄로 요약하세요.' },
            { step: 2, desc: '예문을 3번 듣고 그대로 받아써보세요.' },
          ], goalTip: '시험 유형마다 활용법이 즉시 떠오를 때까지' },
        ])}
      </div>
    </div>
  `;
}

function pv2Render() {
  const root = document.getElementById('json-preview-root');
  const sentence = previewV2State.sentence;
  if (!root || !sentence) return;
  root.innerHTML = `
    <h2 class="sr-only">s01 — LitCoach v2.0 4탭 학습</h2>
    <div style="padding:4px 0 20px">
      <div class="tabs">
        <button class="tab${previewV2State.activeTab === 'lit' ? ' active' : ''}" type="button" data-tab="lit">LitCoach <span class="badge blit">쉐도잉</span></button>
        <button class="tab${previewV2State.activeTab === 'toeic' ? ' active' : ''}" type="button" data-tab="toeic">토익 <span class="badge btoeic">Part 5</span></button>
        <button class="tab${previewV2State.activeTab === 'opic' ? ' active' : ''}" type="button" data-tab="opic">오픽 <span class="badge bopic">Speaking</span></button>
        <button class="tab${previewV2State.activeTab === 'voca' ? ' active' : ''}" type="button" data-tab="voca">어휘 <span class="badge bvoca">필수</span></button>
      </div>
      ${pv2LitTab(sentence)}
      ${pv2ToeicTab(sentence)}
      ${pv2OpicTab(sentence)}
      ${pv2VocabularyTab(sentence)}
    </div>
  `;
}

function pv2ToggleSolution(button) {
  const item = button.closest('.sc-item');
  if (!item) return;
  const solution = item.querySelector('.sc-sol');
  const yesButton = item.querySelector('.sc-btn-yes');
  const isOpen = solution.classList.contains('show');
  solution.classList.toggle('show');
  button.classList.toggle('open', !isOpen);
  button.textContent = isOpen ? '못하겠어요' : '닫기';
  if (!isOpen && yesButton) {
    yesButton.classList.remove('done');
    yesButton.textContent = '할 수 있어요';
  }
}

function pv2MarkDone(button) {
  const item = button.closest('.sc-item');
  if (!item) return;
  const solution = item.querySelector('.sc-sol');
  const noButton = item.querySelector('.sc-btn-no');
  if (solution) solution.classList.remove('show');
  if (noButton) {
    noButton.classList.remove('open');
    noButton.textContent = '못하겠어요';
  }
  button.classList.add('done');
  button.textContent = '완료 ✓';
}

async function pv2Init() {
  try {
    pv2Status('JSON 로딩 중...');
    const response = await fetch(JSON_SAMPLE_PATH_V2);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    previewV2State.sentence = await response.json();
    pv2Render();
    pv2Status(pv2Voices().length ? `JSON 로딩 완료 · 영어 음성 ${pv2Voices().length}개 감지` : 'JSON 로딩 완료 · 영어 음성 로딩 중');
  } catch (error) {
    console.error(error);
    pv2Status(`로딩 실패: ${error.message}`);
  }
}

document.addEventListener('click', (event) => {
  const tab = event.target.closest('.tab');
  if (tab) {
    previewV2State.activeTab = tab.dataset.tab || 'lit';
    pv2Render();
    return;
  }
  const ttsButton = event.target.closest('.js-pv2-tts');
  if (ttsButton) {
    pv2Speak(ttsButton, ttsButton.getAttribute('data-text') || '', Number(ttsButton.getAttribute('data-rate')) || 1);
    return;
  }
  const toggleButton = event.target.closest('.js-pv2-toggle');
  if (toggleButton) {
    pv2ToggleSolution(toggleButton);
    return;
  }
  const doneButton = event.target.closest('.js-pv2-done');
  if (doneButton) {
    pv2MarkDone(doneButton);
  }
});

document.addEventListener('DOMContentLoaded', pv2Init);
if (pv2SupportsTTS()) {
  window.speechSynthesis.onvoiceschanged = () => {
    pv2Status(pv2Voices().length ? `JSON 로딩 완료 · 영어 음성 ${pv2Voices().length}개 감지` : 'JSON 로딩 완료 · 영어 음성 로딩 중');
  };
}
window.addEventListener('beforeunload', pv2StopTTS);
