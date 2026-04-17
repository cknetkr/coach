window.ENG_S1 = String.raw`<div id="eng-s1" class="inner-panel" style="display:none;">
    <h2 class="panel-title">🎧 받아쓰기 (Dictation) 훈련</h2>
    <p class="panel-desc"><code>docs/영어_수행.pdf</code> 원문 8개 주제 중 선택하여 받아쓰기 스크립트를 불러오고 자가 채점하십시오.</p>

    <div class="alert-box alert-amber">
      <strong>📌 고득점 전략:</strong> 스크립트를 <strong>숨긴 채</strong> 듣고 받아쓰기 → 채점 → 오류 유형 확인 → 3회 반복. 단순히 보고 베끼면 효과 없음.
    </div>

    <div class="mc">
      <div class="mc-title">주제 선택</div>
      <div class="topic-grid" id="topic-grid"></div>
      <div class="dict-config-note">주제를 누르면 해당 문장들이 바로 열리고, 각 문장 카드 안에서 난이도를 즉시 바꿀 수 있습니다.</div>
    </div>
    <div class="mc" id="dict-script-box" style="display:none;">
      <div class="dict-practice-intro">
        <div>
          <div class="ai-label" style="color:var(--eng-primary);">문장별 받아쓰기 훈련</div>
          <div class="dict-practice-caption">한 문장씩 듣고, 보이는 문장에서 가려진 부분만 채우세요. 각 문장마다 난이도를 따로 바꿀 수 있습니다.</div>
        </div>
        <div class="dict-practice-shortcut"><strong>Space</strong>로 다음 문장</div>
      </div>
      <div class="dict-tts-panel">
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
      <div class="ai-feedback" id="dict-feedback">스크립트를 불러오고 받아쓰기 후 채점을 실행하십시오.</div>
    </div>
  </div><!-- /eng-s1 -->`;
