window.ENG_S5 = String.raw`<div id="eng-s5" class="inner-panel" style="display:none;">
    <h2 class="panel-title">🧠 핵심 표현 암기 카드</h2>
    <p class="panel-desc">면접·문장완성에 바로 쓸 수 있는 고득점 표현을 카드로 암기하십시오.</p>

    <div class="mc">
      <div class="mc-title">📌 도입 / 의견 / 마무리 필수 표현 (탭하여 확인)</div>
      <div class="phrase-cards">
        <div class="phrase-card" onclick="this.classList.toggle('revealed')">
          <div class="pc-cat">도입 — Introduction</div>
          <div class="pc-q">주제를 소개하는 표현 3선</div>
          <div class="pc-a">· I'd like to talk about...<br/>· The topic I want to address is...<br/>· Today, I'd like to share my thoughts on...</div>
          <div class="pc-hint">탭하여 확인</div>
        </div>
        <div class="phrase-card" onclick="this.classList.toggle('revealed')">
          <div class="pc-cat">이유 — Reason</div>
          <div class="pc-q">이유를 제시하는 표현 3선</div>
          <div class="pc-a">· This is mainly because...<br/>· The primary reason is that...<br/>· One key factor is...</div>
          <div class="pc-hint">탭하여 확인</div>
        </div>
        <div class="phrase-card" onclick="this.classList.toggle('revealed')">
          <div class="pc-cat">예시 — Example</div>
          <div class="pc-q">예시를 드는 표현 3선</div>
          <div class="pc-a">· For instance, ...<br/>· A good example of this is...<br/>· According to recent studies, ...</div>
          <div class="pc-hint">탭하여 확인</div>
        </div>
        <div class="phrase-card" onclick="this.classList.toggle('revealed')">
          <div class="pc-cat">의견 — Opinion ★필수</div>
          <div class="pc-q">I think / I believe 포함 표현</div>
          <div class="pc-a">· I strongly believe that...<br/>· In my opinion, ...<br/>· I think it is important to...</div>
          <div class="pc-hint">탭하여 확인</div>
        </div>
        <div class="phrase-card" onclick="this.classList.toggle('revealed')">
          <div class="pc-cat">마무리 — Conclusion ★필수</div>
          <div class="pc-q">To sum up / In conclusion 표현</div>
          <div class="pc-a">· To sum up, ...<br/>· In conclusion, ...<br/>· That is why I believe...</div>
          <div class="pc-hint">탭하여 확인</div>
        </div>
        <div class="phrase-card" onclick="this.classList.toggle('revealed')">
          <div class="pc-cat">압박 방어 — Counter</div>
          <div class="pc-q">양보-반박 패턴</div>
          <div class="pc-a">· That is a valid point. However, ...<br/>· I understand your concern. Nevertheless, ...<br/>· While it is true that..., I still believe...</div>
          <div class="pc-hint">탭하여 확인</div>
        </div>
        <div class="phrase-card" onclick="this.classList.toggle('revealed')">
          <div class="pc-cat">강조 — Emphasis</div>
          <div class="pc-q">강조 표현 3선</div>
          <div class="pc-a">· It is especially important that...<br/>· What matters most is...<br/>· Above all, ...</div>
          <div class="pc-hint">탭하여 확인</div>
        </div>
        <div class="phrase-card" onclick="this.classList.toggle('revealed')">
          <div class="pc-cat">PREP — 다짐</div>
          <div class="pc-q">Therefore + 다짐 표현</div>
          <div class="pc-a">· Therefore, I am committed to...<br/>· That is why I will dedicate myself to...<br/>· For these reasons, my goal is to...</div>
          <div class="pc-hint">탭하여 확인</div>
        </div>
      </div>
      <div class="btn-row" style="margin-top:1rem;">
        <button class="btn-secondary" onclick="document.querySelectorAll('.phrase-card').forEach(c=>c.classList.remove('revealed'))">🔄 전체 초기화</button>
        <button class="btn-secondary" onclick="document.querySelectorAll('.phrase-card').forEach(c=>c.classList.add('revealed'))">👁 전체 공개</button>
      </div>
    </div>

    <div class="mc">
      <div class="mc-title">받아쓰기 자주 틀리는 유형 정리</div>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <div class="phrase-box"><div class="ph-tag">축약형 혼동</div><div class="ph-en">it's ≠ its / they're ≠ their / you're ≠ your</div><div class="ph-kr">축약형과 소유격을 구분해서 받아쓰십시오</div></div>
        <div class="phrase-box"><div class="ph-tag">발음 혼동</div><div class="ph-en">than ≠ then / affect ≠ effect / accept ≠ except</div><div class="ph-kr">의미와 발음이 유사한 단어는 문맥으로 판단</div></div>
        <div class="phrase-box"><div class="ph-tag">구두점</div><div class="ph-en">쉼표(,) / 마침표(.) / 반드시 정확히 기재</div><div class="ph-kr">구두점도 채점 대상입니다</div></div>
      </div>
    </div>
  </div><!-- /eng-s5 -->`;
