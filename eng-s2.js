window.ENG_S2 = String.raw`<div id="eng-s2" class="inner-panel" style="display:none;">
    <h2 class="panel-title">✏️ 문장완성하기</h2>
    <p class="panel-desc">주어진 문장을 완성하거나 빈칸을 채우는 논술형 평가입니다. PREP 구조로 고득점을 노리십시오.</p>
    <div class="mc">
      <div class="mc-title">문장완성에서 바로 체크할 것</div>
      <div class="guide-grid">
        <div class="guide-panel eng">
          <div class="guide-kicker">Focus</div>
          <div class="guide-title">이 단계에서 꼭 고민할 것</div>
          <div class="guide-list">
            <div class="guide-item">빈칸에 들어갈 문법만 맞추는 것이 아니라 <strong>앞뒤 문맥과 연결</strong>되는지 확인했는가.</div>
            <div class="guide-item">내 답안이 Point만 있고 <strong>Reason, Example</strong>가 비어 있지 않은가.</div>
          </div>
        </div>
        <div class="guide-panel eng">
          <div class="guide-kicker">Ask Teacher</div>
          <div class="guide-title">선생님께 물어볼 질문</div>
          <div class="guide-ask">
            <strong>이 문제는 정답 표현이 하나만 가능한가요, 비슷한 자연스러운 표현도 인정되나요?</strong>
            <strong>내용 점수를 받으려면 예시를 한 문장까지 넣어야 하나요?</strong>
          </div>
        </div>
      </div>
      <div class="guide-example eng">
        <div class="guide-example-head">문장완성 예시</div>
        <div class="guide-example-body">
          <div><strong>약한 답안:</strong> I want to help the environment.</div>
          <div><strong>더 강한 답안:</strong> I believe precision engineering is important because it can reduce waste in manufacturing. For example, better machinery can produce eco-friendly products more efficiently.</div>
        </div>
      </div>
    </div>

    <div class="prep-grid">
      <div class="prep-card">
        <div class="prep-tag">P — Point</div>
        <div class="prep-title">주장 / 핵심</div>
        <div class="prep-body">
          <span style="color:#6ee7b7;font-weight:600;">[Template]</span> I firmly believe that [주제] is crucial for [대상].<br><br>
          <span style="color:#fff;">[Example]</span> My goal is to solve urgent environmental issues through precision mechanical engineering.
        </div>
      </div>
      <div class="prep-card">
        <div class="prep-tag">R — Reason</div>
        <div class="prep-title">이유 / 논거</div>
        <div class="prep-body">
          <span style="color:#6ee7b7;font-weight:600;">[Template]</span> This is mainly because [원인/근거].<br><br>
          <span style="color:#fff;">[Example]</span> This is because high-precision manufacturing is the only way to scale up biodegradable packaging without defects.
        </div>
      </div>
      <div class="prep-card">
        <div class="prep-tag">E — Example</div>
        <div class="prep-title">사례 / 데이터</div>
        <div class="prep-body">
          <span style="color:#6ee7b7;font-weight:600;">[Template]</span> For instance, according to recent studies, [사례].<br><br>
          <span style="color:#fff;">[Example]</span> For instance, micro-level engineering can reduce plastic waste processing time by over 40%.
        </div>
      </div>
      <div class="prep-card">
        <div class="prep-tag">P — Point</div>
        <div class="prep-title">요약 / 다짐</div>
        <div class="prep-body">
          <span style="color:#6ee7b7;font-weight:600;">[Template]</span> Therefore, I am committed to [행동/목표].<br><br>
          <span style="color:#fff;">[Example]</span> Therefore, I will dedicate myself to designing machinery that makes sustainable manufacturing possible.
        </div>
      </div>
    </div>

    <div class="mc" style="margin-top:1.25rem;">
      <div class="mc-title">내 답안 AI 채점</div>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">주어진 문장 / 빈칸 문제</label>
          <textarea class="field-input" id="sent-prompt" rows="2" placeholder="시험지에 주어진 문장이나 빈칸 문제를 입력하십시오."></textarea>
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
