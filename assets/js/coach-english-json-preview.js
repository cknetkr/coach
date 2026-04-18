const JSON_SAMPLE_PATH = '../data/english-dictation/topic01-the-dot/s01.json';

let jsonPreviewUtterance = null;
let jsonPreviewActiveButton = null;
let jsonPreviewActiveTab = 'litcoach';
let jsonPreviewSpeakFallbackTimer = null;

function supportsJsonPreviewTTS() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

function getJsonPreviewVoices() {
  if (!supportsJsonPreviewTTS()) return [];
  return window.speechSynthesis.getVoices()
    .filter((voice) => /^en(-|_)/i.test(voice.lang) || /English/i.test(voice.name));
}

function getPreferredJsonPreviewVoice() {
  const voices = getJsonPreviewVoices();
  if (!voices.length) return null;
  return voices.find((voice) => /en-us/i.test(voice.lang) || /Google US English/i.test(voice.name)) || voices[0];
}

function jsonPreviewEscapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setJsonPreviewStatus(message) {
  const el = document.getElementById('json-preview-status');
  if (!el) return;
  el.textContent = message;
}

function stopJsonPreviewTTS() {
  if (!supportsJsonPreviewTTS()) return;
  if (jsonPreviewSpeakFallbackTimer) {
    clearTimeout(jsonPreviewSpeakFallbackTimer);
    jsonPreviewSpeakFallbackTimer = null;
  }
  window.speechSynthesis.cancel();
  if (jsonPreviewActiveButton) {
    jsonPreviewActiveButton.classList.remove('is-playing');
    jsonPreviewActiveButton = null;
  }
  jsonPreviewUtterance = null;
}

function playJsonPreviewTTS(button, text, rate = 1, attempt = 0) {
  if (!supportsJsonPreviewTTS()) {
    setJsonPreviewStatus('이 브라우저는 TTS를 지원하지 않습니다.');
    return;
  }
  if (!String(text || '').trim()) {
    setJsonPreviewStatus('재생할 문장이 없습니다.');
    return;
  }
  stopJsonPreviewTTS();
  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = getPreferredJsonPreviewVoice();
  utterance.lang = selectedVoice?.lang || 'en-US';
  utterance.rate = Number(rate) || 1;
  utterance.pitch = 1;
  if (selectedVoice) utterance.voice = selectedVoice;
  utterance.onstart = () => {
    if (jsonPreviewSpeakFallbackTimer) {
      clearTimeout(jsonPreviewSpeakFallbackTimer);
      jsonPreviewSpeakFallbackTimer = null;
    }
    jsonPreviewUtterance = utterance;
    jsonPreviewActiveButton = button || null;
    if (jsonPreviewActiveButton) jsonPreviewActiveButton.classList.add('is-playing');
    setJsonPreviewStatus(`재생 중: ${text}`);
  };
  utterance.onend = () => {
    if (jsonPreviewSpeakFallbackTimer) {
      clearTimeout(jsonPreviewSpeakFallbackTimer);
      jsonPreviewSpeakFallbackTimer = null;
    }
    if (jsonPreviewActiveButton) jsonPreviewActiveButton.classList.remove('is-playing');
    jsonPreviewActiveButton = null;
    jsonPreviewUtterance = null;
    setJsonPreviewStatus('재생 완료');
  };
  utterance.onerror = () => {
    if (jsonPreviewSpeakFallbackTimer) {
      clearTimeout(jsonPreviewSpeakFallbackTimer);
      jsonPreviewSpeakFallbackTimer = null;
    }
    if (jsonPreviewActiveButton) jsonPreviewActiveButton.classList.remove('is-playing');
    jsonPreviewActiveButton = null;
    jsonPreviewUtterance = null;
    if (attempt < 1) {
      setJsonPreviewStatus('TTS 재시도 중...');
      playJsonPreviewTTS(button, text, rate, attempt + 1);
      return;
    }
    setJsonPreviewStatus('TTS 재생 중 오류가 발생했습니다.');
  };
  setJsonPreviewStatus(`TTS 준비 중: ${text}`);
  try {
    window.speechSynthesis.resume();
  } catch (error) {
    void error;
  }
  jsonPreviewSpeakFallbackTimer = window.setTimeout(() => {
    if (!jsonPreviewUtterance && attempt < 1) {
      setJsonPreviewStatus('TTS 시작이 지연되어 다시 시도합니다.');
      playJsonPreviewTTS(button, text, rate, attempt + 1);
    }
  }, 1500);
  window.setTimeout(() => {
    try {
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      if (jsonPreviewSpeakFallbackTimer) {
        clearTimeout(jsonPreviewSpeakFallbackTimer);
        jsonPreviewSpeakFallbackTimer = null;
      }
      setJsonPreviewStatus(`TTS 호출 실패: ${error.message}`);
    }
  }, 60);
}

window.playJsonPreviewTTS = playJsonPreviewTTS;

function renderSentenceWithBlanks(sentence) {
  const blankMap = new Map((sentence.blanks || []).map((blank) => [blank.tokenIndex, blank.answer]));
  return sentence.text
    .split(/\s+/)
    .map((token, index) => {
      const plain = token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, '');
      if (!plain || !blankMap.has(index)) return jsonPreviewEscapeHtml(token);
      const prefix = token.slice(0, token.indexOf(plain));
      const suffix = token.slice(token.indexOf(plain) + plain.length);
      return `${jsonPreviewEscapeHtml(prefix)}<span class="preview-blank">${jsonPreviewEscapeHtml(blankMap.get(index))}</span>${jsonPreviewEscapeHtml(suffix)}`;
    })
    .join(' ');
}

function buildTtsButtons(text, rates) {
  const values = Array.isArray(rates) && rates.length ? rates : [1];
  return values.map((rate) => `
    <button
      type="button"
      class="tts-btn js-json-preview-tts"
      data-tts-text="${jsonPreviewEscapeHtml(text)}"
      data-tts-rate="${Number(rate)}"
    >${Number(rate).toFixed(1)}x 듣기</button>
  `).join('');
}

function buildPronunciationGapCard(item) {
  const knownButtons = item?.known?.ttsText
    ? `<div class="tts-buttons">${buildTtsButtons(item.known.ttsText, [item.known.ttsRate || 1])}</div>`
    : '';
  const actualButtons = item?.actual?.ttsText
    ? `<div class="tts-buttons">${buildTtsButtons(item.actual.ttsText, [item.actual.ttsRate || 1, item.actual.ttsRateSlow || 0.75])}</div>`
    : '';
  return `
    <article class="pron-card">
      <div class="pron-head">
        <strong>${jsonPreviewEscapeHtml(item.word || '')}</strong>
        <span>${jsonPreviewEscapeHtml(item.pos || '')}</span>
      </div>
      <div class="pron-body">
        <div class="pron-row">
          <label>외운 소리</label>
          <div class="syllables">
            ${(item.known?.syllables || []).map((syllable) => `<span class="syl is-${jsonPreviewEscapeHtml(syllable.type || 'normal')}">${jsonPreviewEscapeHtml(syllable.text || '')}</span>`).join('')}
          </div>
          ${item.known?.desc ? `<div class="pron-desc">${jsonPreviewEscapeHtml(item.known.desc)}</div>` : ''}
          ${knownButtons}
        </div>
        <div class="pron-row">
          <label>실제 소리</label>
          <div class="syllables">
            ${(item.actual?.syllables || []).map((syllable) => `<span class="syl is-${jsonPreviewEscapeHtml(syllable.type || 'normal')}">${jsonPreviewEscapeHtml(syllable.text || '')}</span>`).join('')}
          </div>
          ${item.actual?.hearPoint ? `<div class="pron-hear">${jsonPreviewEscapeHtml(item.actual.hearPoint)}</div>` : ''}
          ${actualButtons}
        </div>
      </div>
    </article>
  `;
}

function buildBlankCard(blank, index) {
  return `
    <article class="blank-card">
      <h4>빈칸 ${index + 1} — ${jsonPreviewEscapeHtml(blank.answer || '')}</h4>
      <p><strong>문법/역할:</strong> ${jsonPreviewEscapeHtml(blank.pos || '')}</p>
      <p><strong>난도 근거:</strong> ${jsonPreviewEscapeHtml(blank.difficulty?.basis || '')}</p>
      <p><strong>들을 때 포인트:</strong> ${jsonPreviewEscapeHtml(blank.notes?.listen || '')}</p>
      <p><strong>자주 틀리는 이유:</strong> ${jsonPreviewEscapeHtml(blank.notes?.trap || '')}</p>
    </article>
  `;
}

function buildSelfCheckCard(item) {
  return `
    <article class="solution-card">
      <h4>${jsonPreviewEscapeHtml(item.question || '')}</h4>
      ${(item.solutions || []).map((solution) => `
        <div class="solution-step">
          <strong>${jsonPreviewEscapeHtml(solution.step || '')}</strong>
          <span>${jsonPreviewEscapeHtml(solution.desc || '')}</span>
        </div>
      `).join('')}
      ${item.goalTip ? `<div class="goal-tip">${jsonPreviewEscapeHtml(item.goalTip)}</div>` : ''}
    </article>
  `;
}

function buildToeicPanel(sentence) {
  const toeic = sentence.examModes?.toeic;
  if (!toeic) {
    return '<section class="preview-card"><div class="preview-empty">TOEIC 데이터가 아직 없습니다.</div></section>';
  }
  return `
    <section class="preview-card">
      <div class="preview-label">TOEIC 학습 목표</div>
      <div class="preview-meta">
        <div><strong>목표:</strong> ${jsonPreviewEscapeHtml(toeic.learningGoal || '')}</div>
        <div><strong>핵심 패턴:</strong> ${(toeic.keyPatterns || []).map((item) => `<span class="mini-chip">${jsonPreviewEscapeHtml(item)}</span>`).join(' ')}</div>
        <div><strong>쉐도잉 팁:</strong> ${jsonPreviewEscapeHtml(toeic.shadowingTip || '')}</div>
      </div>
    </section>

    <section class="preview-card">
      <div class="preview-label">TOEIC 문법 포인트</div>
      <div class="preview-row">
        ${(toeic.grammarPoints || []).map((point) => `
          <article class="mode-card">
            <h4>${jsonPreviewEscapeHtml(point.label || '')}</h4>
            <p>${jsonPreviewEscapeHtml(point.desc || '')}</p>
            <div class="mini-label">자주 나오는 오답</div>
            <div class="wrong-option-list">
              ${(point.wrongOptions || []).map((item) => `
                <div class="wrong-option">
                  <strong>${jsonPreviewEscapeHtml(item.answer || '')}</strong>
                  <span>${jsonPreviewEscapeHtml(item.reason || '')}</span>
                </div>
              `).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="preview-card">
      <div class="preview-label">TOEIC 자기 점검</div>
      <div class="preview-row">
        ${(toeic.selfCheck || []).map(buildSelfCheckCard).join('')}
      </div>
    </section>
  `;
}

function buildOpicPanel(sentence) {
  const opic = sentence.examModes?.opic;
  if (!opic) {
    return '<section class="preview-card"><div class="preview-empty">OPIC 데이터가 아직 없습니다.</div></section>';
  }
  return `
    <section class="preview-card">
      <div class="preview-label">OPIC 학습 목표</div>
      <div class="preview-meta">
        <div><strong>목표:</strong> ${jsonPreviewEscapeHtml(opic.learningGoal || '')}</div>
        <div><strong>권장 목표 등급:</strong> ${jsonPreviewEscapeHtml(opic.targetGrade || '')}</div>
        <div><strong>쉐도잉 팁:</strong> ${jsonPreviewEscapeHtml(opic.shadowingTip || '')}</div>
      </div>
    </section>

    <section class="preview-card">
      <div class="preview-label">말하기 패턴</div>
      <div class="preview-row">
        ${(opic.speakingPatterns || []).map((pattern) => `
          <article class="mode-card">
            <h4>${jsonPreviewEscapeHtml(pattern.template || '')}</h4>
            <p>${jsonPreviewEscapeHtml(pattern.desc || '')}</p>
            <div class="mini-label">예문</div>
            <div class="example-list">
              ${(pattern.examples || []).map((example) => `<div class="example-item">${jsonPreviewEscapeHtml(example)}</div>`).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="preview-card">
      <div class="preview-label">발화 포인트</div>
      <div class="preview-row">
        ${(opic.pronunciationTips || []).map((tip) => `
          <article class="mini-tip-card">
            <strong>${jsonPreviewEscapeHtml(tip.tag || '')}</strong>
            <span>${jsonPreviewEscapeHtml(tip.desc || '')}</span>
          </article>
        `).join('')}
      </div>
    </section>

    <section class="preview-card">
      <div class="preview-label">OPIC 자기 점검</div>
      <div class="preview-row">
        ${(opic.selfCheck || []).map(buildSelfCheckCard).join('')}
      </div>
    </section>
  `;
}

function buildVocabularyCard(item) {
  const ttsButtons = item?.ttsText
    ? `<div class="tts-buttons">${buildTtsButtons(item.ttsText, [1, 0.7])}</div>`
    : '';
  return `
    <article class="vocab-card">
      <div class="vocab-head">
        <div>
          <strong>${jsonPreviewEscapeHtml(item.word || '')}</strong>
          <span>${jsonPreviewEscapeHtml(item.pos || '')}</span>
        </div>
        ${item.isMust ? '<em class="must-chip">필수</em>' : ''}
      </div>
      <div class="vocab-meta">${jsonPreviewEscapeHtml(item.pronunciation || '')}</div>
      <div class="preview-chip-list">
        ${(item.meanings || []).map((meaning) => `<span class="mini-chip">${jsonPreviewEscapeHtml(meaning)}</span>`).join('')}
      </div>
      <p class="vocab-line"><strong>예문:</strong> ${jsonPreviewEscapeHtml(item.exampleSentence || '')}</p>
      <p class="vocab-line"><strong>상황:</strong> ${jsonPreviewEscapeHtml(item.exampleContext || '')}</p>
      <p class="vocab-line"><strong>동의어:</strong> ${(item.synonyms || []).map((synonym) => jsonPreviewEscapeHtml(synonym)).join(', ')}</p>
      <p class="vocab-line"><strong>TOEIC:</strong> ${jsonPreviewEscapeHtml(item.toeicNote || '')}</p>
      <p class="vocab-line"><strong>OPIC:</strong> ${jsonPreviewEscapeHtml(item.opicNote || '')}</p>
      ${ttsButtons}
    </article>
  `;
}

function buildVocabularyPanel(sentence) {
  const vocabulary = sentence.vocabulary || [];
  if (!vocabulary.length) {
    return '<section class="preview-card"><div class="preview-empty">어휘 데이터가 아직 없습니다.</div></section>';
  }
  return `
    <section class="preview-card">
      <div class="preview-label">핵심 어휘</div>
      <div class="preview-row">
        ${vocabulary.map(buildVocabularyCard).join('')}
      </div>
    </section>
  `;
}

function buildChunkMeaningPanel(sentence) {
  const chunkMeaning = Array.isArray(sentence.guide?.chunkMeaning) ? sentence.guide.chunkMeaning : [];
  if (!chunkMeaning.length) return '';
  return `
    <section class="preview-card">
      <div class="preview-label">끊어 읽기 + 한국어 표현</div>
      <div class="chunk-meaning-list">
        ${chunkMeaning.map((item) => `
          <div class="chunk-meaning-item">
            <strong>${jsonPreviewEscapeHtml(item.en || '')}</strong>
            <span>${jsonPreviewEscapeHtml(item.ko || '')}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

function buildLitcoachPanel(sentence) {
  return `
    <section class="preview-card">
      <div class="preview-label">전체 문장 TTS</div>
      <div class="tts-buttons">${buildTtsButtons(sentence.tts?.text || sentence.text, sentence.tts?.rates || [1, 0.7, 0.5])}</div>
    </section>

    ${buildChunkMeaningPanel(sentence)}

    <section class="preview-grid">
      <article class="preview-card">
        <div class="preview-label">문장 해설</div>
        <div class="preview-meta">
          <div><strong>학습 목표:</strong> ${jsonPreviewEscapeHtml(sentence.commentary?.learningGoal || '')}</div>
          <div><strong>연음:</strong> ${jsonPreviewEscapeHtml(sentence.commentary?.pronunciation?.linking || '')}</div>
          <div><strong>약형:</strong> ${jsonPreviewEscapeHtml(sentence.commentary?.pronunciation?.weakForm || '')}</div>
          <div><strong>강세:</strong> ${jsonPreviewEscapeHtml(sentence.commentary?.pronunciation?.stress || '')}</div>
          <div><strong>직역:</strong> ${jsonPreviewEscapeHtml(sentence.fullMeaning?.literal || '')}</div>
          <div><strong>자연번역:</strong> ${jsonPreviewEscapeHtml(sentence.fullMeaning?.natural || '')}</div>
          <div><strong>상황:</strong> ${jsonPreviewEscapeHtml(sentence.fullMeaning?.context || '')}</div>
        </div>
      </article>
      <article class="preview-card">
        <div class="preview-label">가이드</div>
        <div class="preview-meta">
          <div><strong>전체 해석:</strong> ${jsonPreviewEscapeHtml(sentence.guide?.t || '')}</div>
          <div><strong>귀에 걸어둘 소리:</strong> ${jsonPreviewEscapeHtml(sentence.guide?.p || '')}</div>
          <div><strong>시험 함정:</strong> ${jsonPreviewEscapeHtml(sentence.guide?.m || '')}</div>
          <div><strong>문장 쪼개기:</strong> ${jsonPreviewEscapeHtml(sentence.guide?.c || '')}</div>
          <div><strong>쉐도잉 팁:</strong> ${jsonPreviewEscapeHtml(sentence.commentary?.shadowingTip || '')}</div>
        </div>
      </article>
    </section>

    <section class="preview-card">
      <div class="preview-label">발음 갭 + TTS</div>
      <div class="preview-row">
        ${(sentence.commentary?.pronunciationGap || []).map(buildPronunciationGapCard).join('')}
      </div>
    </section>

    <section class="preview-card">
      <div class="preview-label">빈칸 정보</div>
      <div class="preview-row">
        ${(sentence.blanks || []).map(buildBlankCard).join('')}
      </div>
    </section>

    <section class="preview-card">
      <div class="preview-label">자기 점검</div>
      <div class="preview-row">
        ${(sentence.commentary?.selfCheck || []).map(buildSelfCheckCard).join('')}
      </div>
    </section>
  `;
}

function buildTabButtons() {
  const tabs = [
    { id: 'litcoach', label: 'LitCoach' },
    { id: 'toeic', label: 'TOEIC' },
    { id: 'opic', label: 'OPIC' },
    { id: 'vocabulary', label: 'Vocabulary' },
  ];
  return tabs.map((tab) => `
    <button
      type="button"
      class="preview-tab${jsonPreviewActiveTab === tab.id ? ' is-active' : ''}"
      onclick="switchJsonPreviewTab('${tab.id}')"
    >${tab.label}</button>
  `).join('');
}

function buildTabPanel(sentence) {
  if (jsonPreviewActiveTab === 'toeic') return buildToeicPanel(sentence);
  if (jsonPreviewActiveTab === 'opic') return buildOpicPanel(sentence);
  if (jsonPreviewActiveTab === 'vocabulary') return buildVocabularyPanel(sentence);
  return buildLitcoachPanel(sentence);
}

function renderJsonPreview(sentence) {
  const root = document.getElementById('json-preview-root');
  if (!root) return;
  window.jsonPreviewSentence = sentence;
  root.innerHTML = `
    <section class="preview-card">
      <div class="preview-label">문장</div>
      <div class="preview-sentence">${renderSentenceWithBlanks(sentence)}</div>
    </section>

    <section class="preview-card">
      <div class="preview-label">학습 모드</div>
      <div class="preview-tabs">
        ${buildTabButtons()}
      </div>
    </section>

    <div class="preview-tab-panel">
      ${buildTabPanel(sentence)}
    </div>
  `;
}

function switchJsonPreviewTab(tabId) {
  jsonPreviewActiveTab = tabId;
  if (window.jsonPreviewSentence) renderJsonPreview(window.jsonPreviewSentence);
}

window.switchJsonPreviewTab = switchJsonPreviewTab;

async function initJsonPreview() {
  try {
    setJsonPreviewStatus('JSON 로딩 중...');
    const response = await fetch(JSON_SAMPLE_PATH);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const sentence = await response.json();
    renderJsonPreview(sentence);
    const voiceCount = getJsonPreviewVoices().length;
    setJsonPreviewStatus(voiceCount
      ? `JSON 로딩 완료 · 영어 음성 ${voiceCount}개 감지`
      : 'JSON 로딩 완료 · 영어 음성 로딩 중');
  } catch (error) {
    console.error(error);
    setJsonPreviewStatus(`로딩 실패: ${error.message}`);
  }
}

document.addEventListener('DOMContentLoaded', initJsonPreview);
document.addEventListener('click', (event) => {
  const button = event.target.closest('.js-json-preview-tts');
  if (!button) return;
  playJsonPreviewTTS(
    button,
    button.getAttribute('data-tts-text') || '',
    Number(button.getAttribute('data-tts-rate')) || 1
  );
});
if (supportsJsonPreviewTTS()) {
  window.speechSynthesis.onvoiceschanged = () => {
    const voiceCount = getJsonPreviewVoices().length;
    setJsonPreviewStatus(voiceCount
      ? `JSON 로딩 완료 · 영어 음성 ${voiceCount}개 감지`
      : 'JSON 로딩 완료 · 영어 음성 로딩 중');
  };
}
window.addEventListener('beforeunload', stopJsonPreviewTTS);
