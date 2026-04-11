window.ENG_S3 = String.raw`<div id="eng-s3" class="inner-panel" style="display:none;">
    <h2 class="panel-title">🗣️ 영어면접하기</h2>
    <p class="panel-desc">4단계 답변 구조(도입→핵심→의견→마무리)로 AI 면접 연습을 진행하십시오.</p>

    <div class="alert-box alert-purple">
      <strong>⭐ 고득점 필수:</strong> ③ Opinion 단계에 <strong>I think / I believe</strong> 포함 필수. ④ Conclusion에 <strong>To sum up / In conclusion</strong> 포함 필수.
    </div>
    <div class="mc">
      <div class="mc-title">면접에서 바로 체크할 것</div>
      <div class="guide-grid">
        <div class="guide-panel eng">
          <div class="guide-kicker">Speaking Mindset</div>
          <div class="guide-title">이 파트에서 꼭 고민할 것</div>
          <div class="guide-list">
            <div class="guide-item">지금 쓰는 문장이 <strong>입으로 바로 나올 길이</strong>인지 확인했는가.</div>
            <div class="guide-item">외운 티가 나는 긴 문장보다, 끊어 읽기 쉬운 짧은 문장으로 바꿨는가.</div>
            <div class="guide-item">꼬리 질문을 받았을 때 한 문장 더 덧붙일 준비가 되어 있는가.</div>
          </div>
        </div>
        <div class="guide-panel eng">
          <div class="guide-kicker">Ask Teacher</div>
          <div class="guide-title">선생님께 물어볼 질문</div>
          <div class="guide-ask">
            <strong>답변을 외운 듯 길게 말하는 것과 짧지만 자연스럽게 말하는 것 중 무엇을 더 보시나요?</strong>
            <strong>질문에 직접 답한 뒤 예시를 한 문장 덧붙이면 내용 점수에 도움이 되나요?</strong>
          </div>
        </div>
      </div>
      <div class="guide-example eng">
        <div class="guide-example-head">면접 예시</div>
        <div class="guide-example-body">
          <div><strong>읽기용 문장:</strong> I strongly believe that technological innovation plays an essential role in addressing environmental problems on a global scale.</div>
          <div><strong>말하기용 문장:</strong> I strongly believe technology can help solve environmental problems. It makes practical change possible.</div>
        </div>
      </div>
    </div>

    <div class="mc">
      <div class="mc-title">면접 주제 선택</div>
      <div class="topic-grid" id="int-topic-grid"></div>
    </div>
    <div class="mc" id="int-question-box" style="display:none;">
      <div class="ai-label" style="color:var(--eng-primary);">AI 생성 면접 질문</div>
      <div class="ai-feedback has-content" id="int-question"></div>
    </div>
    <div class="btn-row" style="margin-bottom:0.75rem;">
      <button class="btn-primary eng" onclick="generateInterviewQuestion()">🎙️ 면접 질문 생성</button>
    </div>
    <div class="step4-grid">
      <div class="step-block">
        <div class="step-block-header">
          <div class="step-num-badge s1">①</div>
          <div><div class="step-name">도입 (Introduction)</div></div>
          <span class="step-hint">주제 소개 + 입장 표명</span>
        </div>
        <div class="step-block-body">
          <textarea class="field-input" id="int-s1" rows="3" placeholder="I'd like to talk about... / The topic I want to address is..."></textarea>
        </div>
      </div>
      <div class="step-block">
        <div class="step-block-header">
          <div class="step-num-badge s2">②</div>
          <div><div class="step-name">핵심 근거 (Reason + Example)</div></div>
          <span class="step-hint">PREP 구조 적용</span>
        </div>
        <div class="step-block-body">
          <textarea class="field-input" id="int-s2" rows="3" placeholder="This is because... / For instance, ..."></textarea>
        </div>
      </div>
      <div class="step-block">
        <div class="step-block-header">
          <div class="step-num-badge s3">③</div>
          <div><div class="step-name">의견 표현 (Opinion)</div></div>
          <span class="step-hint">I think / I believe 필수 포함</span>
        </div>
        <div class="step-block-body">
          <textarea class="field-input" id="int-s3" rows="3" placeholder="In my opinion, / I strongly believe that..."></textarea>
          <div class="step-warn" id="int-warn-3"></div>
        </div>
      </div>
      <div class="step-block">
        <div class="step-block-header">
          <div class="step-num-badge s4">④</div>
          <div><div class="step-name">마무리 (Conclusion)</div></div>
          <span class="step-hint">To sum up / In conclusion 필수</span>
        </div>
        <div class="step-block-body">
          <textarea class="field-input" id="int-s4" rows="3" placeholder="To sum up, / In conclusion, ..."></textarea>
          <div class="step-warn" id="int-warn-4"></div>
        </div>
      </div>
    </div>
    <div class="btn-row">
      <button class="btn-primary eng" onclick="analyzeInterview()">📊 4기준 채점</button>
      <button class="btn-secondary" onclick="clearInterview()">초기화</button>
    </div>
    <div class="mc" style="margin-top:0.75rem;">
      <div class="ai-label" style="color:var(--eng-primary);">면접 채점 결과</div>
      <div class="ai-feedback" id="int-feedback">주제를 선택하고 4단계 답변 후 채점을 실행하십시오.</div>
    </div>
    <div class="mc" style="margin-top:0.75rem;">
      <div class="mc-title">압박 질문 방어 — 양보-반박 구조</div>
      <div class="alert-box alert-purple">
        <strong>[상대 논리 인정]</strong> That is a valid point. / I understand concerns about [단점].<br/>
        <strong style="color:#a78bfa;">[재반박]</strong> However, the long-term benefits easily outweigh the initial costs because [새로운 근거].
      </div>
    </div>
  </div><!-- /eng-s3 -->`;
