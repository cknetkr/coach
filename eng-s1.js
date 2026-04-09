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
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
        <div class="ai-label" style="color:var(--eng-primary);">받아쓰기 스크립트</div>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.25rem 0.6rem;" onclick="toggleScript()">
          <span id="script-toggle-label">스크립트 숨기기</span>
        </button>
      </div>
      <div class="ai-feedback has-content" id="dict-script"></div>
    </div>
    <div class="mc">
      <div class="mc-title">내 받아쓰기 답안 입력</div>
      <textarea class="field-input" id="dict-my-answer" rows="6" placeholder="스크립트를 보지 않고 들으면서 받아쓰기한 내용을 입력하십시오."></textarea>
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
