window.ENG_S1 = String.raw`<div id="eng-s1" class="inner-panel" style="display:none;">
    <div class="dict-step-inline">
      <strong>STEP 1 · 받아쓰기</strong>
      <span>숨기고 듣기 → 채점</span>
    </div>
    <div class="dict-topic-strip">
      <div class="dict-topic-line">
        <div class="dict-topic-label">주제</div>
        <div class="topic-grid topic-grid--inline" id="topic-grid"></div>
      </div>
    </div>
    <div class="mc" id="dict-script-box">
      <div class="dict-practice-intro">
        <div>
          <div class="ai-label" style="color:var(--eng-primary);">문장별 받아쓰기 훈련</div>
          <div class="dict-practice-caption" id="dict-current-topic">주제를 고르면 해당 문장과 메뉴가 바로 아래에 열립니다.</div>
        </div>
        <div class="dict-practice-shortcut"><strong>Space</strong>로 다음 문장</div>
      </div>
      <div class="dict-tts-toolbar">
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
