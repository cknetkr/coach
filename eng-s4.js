window.ENG_S4 = String.raw`<div id="eng-s4" class="inner-panel" style="display:none;">
    <h2 class="panel-title">📊 최종 점수 시뮬레이터</h2>
    <p class="panel-desc">현재 예상 점수를 입력하여 등급을 확인하고 AI 전략을 받으십시오.</p>
    <div class="mc">
      <div class="sim-row"><span class="sim-label">정기시험 (100점 기준)</span><span class="sim-val" id="sim-exam-val">80</span></div>
      <input type="range" min="0" max="100" value="80" id="sim-exam" oninput="updateSim()">
      <div class="sim-row" style="margin-top:0.75rem;"><span class="sim-label">문장완성하기 (/ 20)</span><span class="sim-val" id="sim-sent-val">16</span></div>
      <input type="range" min="0" max="20" value="16" id="sim-sent" oninput="updateSim()">
      <div class="sim-row" style="margin-top:0.75rem;"><span class="sim-label">받아쓰기 (/ 20)</span><span class="sim-val" id="sim-dict-val">14</span></div>
      <input type="range" min="0" max="20" value="14" id="sim-dict" oninput="updateSim()">
      <div class="sim-row" style="margin-top:0.75rem;"><span class="sim-label">영어면접 (/ 20)</span><span class="sim-val" id="sim-int-val">16</span></div>
      <input type="range" min="0" max="20" value="16" id="sim-int" oninput="updateSim()">
    </div>
    <div class="score-grid" style="margin-top:0.5rem;">
      <div class="score-block"><div class="sb-val" style="color:var(--eng-primary);font-size:1.6rem;" id="res-exam">-</div><div class="sb-lbl">정기시험 반영</div></div>
      <div class="score-block"><div class="sb-val" style="color:var(--eng-primary);font-size:1.6rem;" id="res-sa">-</div><div class="sb-lbl">수행평가 합계</div></div>
    </div>
    <div class="mc" style="text-align:center;">
      <div class="sb-val" style="color:#fff;font-size:2.5rem;font-family:var(--font-brand);" id="res-total">-</div>
      <div class="sb-lbl">총점 (/ 100)</div>
      <div id="grade-msg" style="margin-top:1rem;font-size:0.88rem;line-height:1.65;"></div>
    </div>
    <div class="btn-row" style="justify-content:center;">
      <button class="btn-primary eng" onclick="getSimStrategy()">🤖 AI 맞춤 전략 수립</button>
    </div>
    <div class="mc" style="margin-top:0.75rem;">
      <div class="ai-label" style="color:var(--eng-primary);">AI 맞춤 전략</div>
      <div class="ai-feedback" id="sim-ai-feedback">점수를 입력 후 전략 수립을 실행하십시오.</div>
    </div>
  </div><!-- /eng-s4 -->`;
