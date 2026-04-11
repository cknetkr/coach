window.ENG_S2 = String.raw`<div id="eng-s2" class="inner-panel" style="display:none;">
    <h2 class="panel-title">✏️ 문장완성하기</h2>
    <p class="panel-desc">실전에서는 보통 <strong>문제 1개</strong>를 받고 4~5문장 정도로 답합니다. 아래에서 예시 문제를 하나 고르거나 시험지 문장을 그대로 붙여 넣어 연습하십시오.</p>

    <div class="alert-box alert-info">
      <strong>연습 방식:</strong> 예시 문제 1개 선택 → 해설 확인 → 내 답안 작성 → 4기준 채점 순서로 보면 됩니다.
    </div>

    <div class="mc">
      <div class="mc-title">실전 문제 선택</div>
      <div class="sent-sample-grid" id="sent-sample-grid"></div>
    </div>

    <div class="mc">
      <div class="mc-title">선택한 문제 해설</div>
      <div class="sent-guide-box" id="sent-guide-box">
        <div class="sent-guide-kicker" id="sent-guide-kicker">Sample Guide</div>
        <div class="sent-guide-title" id="sent-guide-title">예시 문제를 고르면 해설이 여기 표시됩니다.</div>
        <div class="sent-guide-list" id="sent-guide-list">
          <div class="sent-guide-item">문제를 먼저 고르면 요구사항, 답안 방향, 써야 할 표현을 바로 볼 수 있습니다.</div>
        </div>
        <div class="sent-guide-phrases" id="sent-guide-phrases"></div>
      </div>
    </div>

    <div class="mc">
      <div class="mc-title">PREP를 4문장으로 쓰기</div>
      <div class="sent-prep-grid">
        <div class="sent-prep-card">
          <strong>1. Point</strong>
          <span>질문에 직접 답하기</span>
          <code>I believe ... is important.</code>
        </div>
        <div class="sent-prep-card">
          <strong>2. Reason</strong>
          <span>왜 그런지 한 문장 붙이기</span>
          <code>This is because ...</code>
        </div>
        <div class="sent-prep-card">
          <strong>3. Example</strong>
          <span>예시나 사례 1개 넣기</span>
          <code>For example, ...</code>
        </div>
        <div class="sent-prep-card">
          <strong>4. Closing</strong>
          <span>짧게 정리하기</span>
          <code>Therefore, ...</code>
        </div>
      </div>
    </div>

    <div class="mc" style="margin-top:1.25rem;">
      <div class="mc-title">내 답안 AI 채점</div>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">주어진 문장 / 빈칸 문제</label>
          <textarea class="field-input" id="sent-prompt" rows="2" placeholder="시험지에 주어진 문장이나 빈칸 문제를 입력하십시오."></textarea>
          <div class="sent-problem-note" id="sent-current-sample">예시 문제를 고르거나 시험지 문장을 직접 붙여 넣으세요.</div>
        </div>
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">내 답안 (PREP 구조 적용)</label>
          <textarea class="field-input" id="sent-answer" rows="5" placeholder="PREP 구조로 작성한 나의 영어 답안을 입력하십시오."></textarea>
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-primary eng" onclick="analyzeSentence()">📊 4기준 채점 시작</button>
        <button class="btn-secondary" onclick="generateSentenceHint()">💡 힌트 요청</button>
      </div>
    </div>
    <div class="mc">
      <div class="ai-label" style="color:var(--eng-primary);">채점 결과 (과제완성/내용/언어사용/참신성 각 5점)</div>
      <div class="ai-feedback" id="sent-feedback">답안을 작성 후 채점을 실행하십시오.</div>
    </div>
  </div><!-- /eng-s2 -->`;
