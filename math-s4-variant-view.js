window.MATH_S4 = String.raw`<div id="math-s4" class="inner-panel" style="display:none;">
    <h2 class="panel-title">⏱️ 타임어택 — 교과서 변형 문제</h2>
    <p class="panel-desc">기본형은 이미 풀었다는 가정으로, 숫자와 조건을 바꾼 변형 문제 세트를 골라 실전 감각을 점검합니다.</p>

    <div class="engine-hero math">
      <div class="engine-kicker">STEP 4 · FINAL DRILL</div>
      <div class="engine-title">변형문제 선택형 타임어택</div>
      <div class="engine-desc">전체 세트, 근호·지수, 로그·상용로그, 서술형 2문제를 선택해 풀이할 수 있습니다. 현재 기본형은 교과서에 두고, 이 화면은 <strong>변형 문제 전용</strong>으로 분리했습니다.</div>
      <div class="mini-chip-row">
        <span class="mini-chip math">거듭제곱근 변형</span>
        <span class="mini-chip math">지수 확장 변형</span>
        <span class="mini-chip math">로그 성질 변형</span>
        <span class="mini-chip math">상용로그 변형</span>
        <span class="mini-chip math">서술형 4단계</span>
      </div>
    </div>

    <div class="mc" style="margin-bottom:1rem;">
      <div class="mc-title">🧩 변형문제 세트 선택</div>
      <div id="math-s4-set-buttons" style="display:flex;flex-wrap:wrap;gap:0.45rem;margin-bottom:0.75rem;"></div>
      <div class="alert-box alert-info" id="math-s4-set-summary">세트를 선택하면 해당 변형문제만 화면에 표시됩니다.</div>
    </div>

    <div class="two-col" style="margin-bottom:1.25rem;">
      <div>
        <div class="mc">
          <div class="mc-title">⏱️ 40분 타이머</div>
          <div class="timer-display" id="timer-display">40:00</div>
          <div class="timer-bar-track"><div class="timer-bar-fill" id="timer-bar" style="width:100%;"></div></div>
          <div class="btn-row" style="justify-content:center;margin-top:1rem;">
            <button class="btn-primary math" onclick="startTimer()">▶ 시작</button>
            <button class="btn-secondary" onclick="pauseTimer()">⏸ 일시정지</button>
            <button class="btn-secondary" onclick="resetTimer()">↺ 초기화</button>
            <button class="btn-secondary" onclick="revealAllS4()">👁 전체 풀이 공개</button>
            <button class="btn-secondary" onclick="hideAllS4()">🔒 전체 닫기</button>
          </div>
        </div>
      </div>
      <div>
        <div class="rubric-side">
          <h4>최종 체크 <span style="color:var(--text-dim);font-weight:400;font-size:0.7rem;">(클릭 체크)</span></h4>
          <div id="s4-rubric">
            <div class="rubric-item math"><span class="ri-check">✓</span><span>거듭제곱근 변형 2문제 완료</span></div>
            <div class="rubric-item math"><span class="ri-check">✓</span><span>지수 확장 변형 3문제 완료</span></div>
            <div class="rubric-item math"><span class="ri-check">✓</span><span>로그·상용로그 변형 5문제 완료</span></div>
            <div class="rubric-item math"><span class="ri-check">✓</span><span>서술형 2문제 자력 풀이</span></div>
            <div class="rubric-item math"><span class="ri-check">✓</span><span>타이머 기준 실전 시뮬레이션 완료</span></div>
          </div>
          <div class="rubric-bar-wrap">
            <div class="rubric-bar-track"><div class="rubric-bar-fill" id="s4-bar-fill" style="background:var(--math-primary);"></div></div>
            <p class="rubric-count-text" id="s4-bar-count">0 / 5 완료</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mc" style="margin-bottom:1.25rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
        <div class="mc-title" id="math-s4-pack-title" style="margin:0;">교과서 변형 전체 세트</div>
        <div id="math-s4-pack-meta" style="font-size:0.75rem;color:var(--text-dim);">문제 수 계산 중</div>
      </div>
      <div id="problem-grid" class="problem-grid"></div>
    </div>

    <div id="math-s4-variant-list"></div>

    <div class="mc" style="margin-top:1.25rem;">
      <div class="mc-title">📊 최종 점수 예측</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;" id="s4-short-label">단답형 맞은 개수</label>
          <input type="number" class="field-input" id="s4-short-correct" min="0" max="10" value="7">
        </div>
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;" id="s4-essay-label">서술형 예상 달성률 (%)</label>
          <input type="number" class="field-input" id="s4-essay-pct" min="0" max="100" value="90">
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-primary math" onclick="calcFinalScore()">📊 점수 계산</button>
      </div>
      <div id="s4-score-note" style="margin-top:0.55rem;font-size:0.76rem;color:var(--text-dim);">현재 선택 세트 기준으로 점수를 환산합니다.</div>
      <div id="score-result" style="display:none;margin-top:1rem;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.6rem;text-align:center;margin-bottom:0.75rem;">
          <div class="score-block"><div class="sb-val" style="color:var(--math-primary);font-size:1.5rem;" id="pred-short">-</div><div class="sb-lbl">단답형</div></div>
          <div class="score-block"><div class="sb-val" style="color:var(--math-primary);font-size:1.5rem;" id="pred-essay">-</div><div class="sb-lbl">서술형</div></div>
          <div class="score-block"><div class="sb-val" style="color:#fff;font-size:1.5rem;" id="pred-total">-</div><div class="sb-lbl">합계</div></div>
        </div>
        <div id="score-grade-box" style="background:var(--math-bg);border:1.5px solid var(--math-border);border-radius:var(--radius-sm);padding:0.9rem 1rem;text-align:center;">
          <div style="font-size:0.72rem;font-weight:700;color:var(--math-primary);letter-spacing:0.06em;text-transform:uppercase;margin-bottom:0.3rem;">예상 등급</div>
          <div id="score-grade-text" style="font-size:1.6rem;font-weight:800;color:#fff;">-</div>
          <div id="score-grade-msg" style="font-size:0.79rem;color:var(--text-secondary);margin-top:0.3rem;"></div>
        </div>
      </div>
    </div>
  </div><!-- /math-s4 -->`;
