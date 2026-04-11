window.ENG_S1 = String.raw`<div id="eng-s1" class="inner-panel" style="display:none;">
    <h2 class="panel-title">🎧 받아쓰기 (Dictation) 훈련</h2>
    <p class="panel-desc">4월 4주 평가 · 8개 주제 중 선택하여 AI 받아쓰기 스크립트를 생성하고 자가 채점하십시오.</p>

    <div class="alert-box alert-amber">
      <strong>📌 고득점 전략:</strong> 스크립트를 <strong>숨긴 채</strong> 듣고 받아쓰기 → 채점 → 오류 유형 확인 → 3회 반복. 단순히 보고 베끼면 효과 없음.
    </div>

    <div class="mc">
      <div class="mc-title">주제 선택</div>
      <div class="topic-grid" id="topic-grid"></div>
    </div>
    <div class="mc">
      <div class="mc-title">난이도 &amp; 문장 수</div>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">난이도</label>
          <select class="field-input" id="dict-level" style="width:auto;resize:none;">
            <option value="easy">쉬움 (단문 20~25단어)</option>
            <option value="normal" selected>보통 (중문 30~40단어)</option>
            <option value="hard">어려움 (복문 50~60단어)</option>
          </select>
        </div>
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">문장 수</label>
          <select class="field-input" id="dict-count" style="width:auto;resize:none;">
            <option value="3">3문장</option>
            <option value="5" selected>5문장</option>
            <option value="8">8문장</option>
          </select>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-primary eng" onclick="generateDictation()">🎙️ 스크립트 생성</button>
      </div>
    </div>
    <div class="mc" id="dict-script-box" style="display:none;">
      <div class="dict-practice-intro">
        <div>
          <div class="ai-label" style="color:var(--eng-primary);">문장별 받아쓰기 훈련</div>
          <div class="dict-practice-caption">한 문장씩 듣고 바로 아래 칸에 적으세요. 정답 영어 문장은 화살표를 눌러 펼쳐 확인할 수 있습니다.</div>
        </div>
        <div class="dict-practice-shortcut"><strong>Space</strong>로 다음 문장</div>
      </div>
      <div class="dict-tts-panel">
        <div class="dict-tts-toolbar">
          <button class="btn-primary eng" type="button" onclick="playDictationAll()">🔊 순차 듣기</button>
          <button class="btn-secondary" type="button" onclick="pauseDictationTTS()">⏸ 일시정지</button>
          <button class="btn-secondary" type="button" onclick="resumeDictationTTS()">▶ 이어듣기</button>
          <button class="btn-secondary" type="button" onclick="playNextDictationSentence()">↳ 다음</button>
          <button class="btn-secondary" type="button" onclick="stopDictationTTS()">⏹ 정지</button>
        </div>
        <div class="dict-tts-options">
          <label class="dict-tts-option">
            <span>속도</span>
            <input type="range" id="dict-tts-rate" min="0.7" max="1.2" step="0.1" value="0.9" oninput="updateDictationTTSRateLabel()">
            <strong id="dict-tts-rate-label">0.9x</strong>
          </label>
          <label class="dict-tts-option">
            <span>음성</span>
            <select class="field-input" id="dict-tts-voice" style="width:auto;min-width:180px;resize:none;">
              <option value="">기본 음성</option>
            </select>
          </label>
        </div>
        <div class="dict-tts-status" id="dict-tts-status">스크립트 생성 후 듣기 가능</div>
        <div class="dict-tts-line-buttons" id="dict-tts-line-buttons"></div>
      </div>
      <div class="dict-practice-list" id="dict-practice-list"></div>
      <div class="dict-script-source" id="dict-script" hidden></div>
      <div class="btn-row">
        <button class="btn-primary eng" onclick="gradeDictation()">📊 자동 채점</button>
        <button class="btn-secondary" onclick="dictCountUp()">✓ 1회 완료 (<span id="dict-count-display">0</span>회)</button>
        <button class="btn-secondary" onclick="clearDictation()">초기화</button>
      </div>
    </div>
    <div class="mc">
      <div class="ai-label" style="color:var(--eng-primary);">채점 결과</div>
      <div class="ai-feedback" id="dict-feedback">스크립트를 생성하고 받아쓰기 후 채점을 실행하십시오.</div>
    </div>
  </div><!-- /eng-s1 -->`;
