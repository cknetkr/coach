const mathS1DefaultSample = (window.MATH_S1_SAMPLES && window.MATH_S1_SAMPLES[0]) || {
  ref: '교과서 p.27 예제 5',
  prob: 'log₂(x-1) + log₂(x+1) = 3 을 만족하는 x의 값을 구하시오.',
  ans: 'log₂(x-1)(x+1) = 3 으로 합쳐서 x²-1 = 8, x² = 9, x = ±3 이므로 x = 3, x = -3 둘 다 답으로 썼음.',
};
const mathS1QuickButtons = ((window.MATH_S1_SAMPLES && window.MATH_S1_SAMPLES.length) ? window.MATH_S1_SAMPLES : [
  { quickLabel: '로그방정식 진수 조건 누락' },
  { quickLabel: '지수방정식 치환 후 t>0 미확인' },
  { quickLabel: '로그 부등식 방향 역전 실수' },
  { quickLabel: '거듭제곱근 절댓값 누락' },
  { quickLabel: '밑 변환 공식 적용 실수' },
]).map((item, index) => `
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS1Sample(${index})">${index + 1}. ${item.quickLabel}</button>
`).join('');
const mathGeneratedVariantButtons = (window.MATH_GENERATED_VARIANTS || []).map((item, index) => `
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadGeneratedVariant(${index})">${item.quickLabel}</button>
`).join('');

window.MATH_S1 = String.raw`<div id="math-s1" class="inner-panel" style="display:none;">
    <h2 class="panel-title">🎯 범위 해체 — 1타 강사 코칭</h2>
    <p class="panel-desc">버튼을 눌러 결과를 받는 화면이 아니라, 문제를 적는 순간부터 개념·접근·판단 실수를 옆에서 같이 짚어주는 해설 보드로 바꿨습니다.</p>

    <div class="engine-hero math">
      <div class="engine-kicker">STEP 1 · LIVE COACH</div>
      <div class="engine-title">이 문제를 어떤 개념 문제로 볼지 먼저 분류해야 계산 실수가 줄어듭니다.</div>
      <div class="engine-desc">같은 로그 문제라도 <strong>조건형인지, 방향 판정형인지, 밑 변환형인지</strong>를 먼저 나눠 봐야 합니다. 왼쪽에 문제와 내 풀이를 적으면 오른쪽 1타 강사 해설이 상시 노출되어 무엇부터 고쳐야 하는지 바로 확인할 수 있습니다.</div>
      <div class="mini-chip-row">
        <span class="mini-chip math">문제 분류</span>
        <span class="mini-chip math">핵심 개념</span>
        <span class="mini-chip math">접근 순서</span>
        <span class="mini-chip math">판단 포인트</span>
        <span class="mini-chip math">권장 공부량</span>
      </div>
    </div>

    <div class="math-masterclass-shell">
      <div>
        <div class="mc" style="margin-bottom:0.75rem;">
          <div class="mc-title" style="margin-bottom:0.6rem;">⚡ 자주 틀리는 유형 — 바로 불러오기</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
            ${mathS1QuickButtons}
          </div>
        </div>

        <div class="mc" style="margin-bottom:0.75rem;">
          <div class="mc-title" style="margin-bottom:0.6rem;">🧩 기본형 변형문제 — 바로 불러오기</div>
          <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
            ${mathGeneratedVariantButtons || '<div class="empty-state">아직 등록된 변형문제가 없습니다.</div>'}
          </div>
        </div>

        <div class="mc">
          <div class="mc-title">문제와 내 풀이 적기</div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">문제 번호 / 출처</label>
              <input type="text" class="field-input" id="s1-problem-ref" placeholder="예) p.23 예제 3" value="${mathS1DefaultSample.ref}">
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">문제 내용</label>
              <textarea class="field-input" id="s1-problem-text" rows="4">${mathS1DefaultSample.prob}</textarea>
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">내 풀이 / 헷갈린 지점</label>
              <textarea class="field-input" id="s1-my-answer" rows="5">${mathS1DefaultSample.ans}</textarea>
            </div>
          </div>
          <div class="btn-row">
            <button type="button" class="btn-primary math math-disabled-btn">AI 오답분석 비활성화</button>
            <button type="button" class="btn-secondary math-disabled-btn">초기화 비활성화</button>
          </div>
          <div class="math-disabled-note">이 단계는 분석 결과를 항상 보여주기 위해 버튼형 AI 분석과 초기화를 잠가 두었습니다. 입력을 바꾸면 오른쪽 해설이 즉시 갱신됩니다.</div>
        </div>

        <div class="mc" style="margin-top:0.75rem;">
          <div class="mc-title">문제를 볼 때 먼저 입으로 말할 3문장</div>
          <div class="guide-list">
            <div class="guide-item">이 문제는 무슨 개념 문제인지, 한 문장으로 먼저 분류하십시오.</div>
            <div class="guide-item">첫 줄에 써야 하는 조건이나 정의가 무엇인지 계산 전에 확인하십시오.</div>
            <div class="guide-item">후보 해가 나오면 곧바로 정답으로 가지 말고 어떤 기준으로 걸러야 하는지 끝까지 말해 보십시오.</div>
          </div>
        </div>
      </div>

      <div class="math-masterclass-panel sticky">
        <div class="math-masterclass-kicker">1타 강사 라이브 코칭</div>
        <div class="math-masterclass-title" id="s1-coach-headline">문제를 입력하면 여기에서 핵심 개념을 바로 짚어줍니다.</div>
        <div class="math-masterclass-desc" id="s1-coach-summary">지금 문제를 어떤 유형으로 읽어야 하는지, 무엇부터 써야 하는지, 몇 문제까지 훈련해야 안정권인지 바로 확인할 수 있습니다.</div>

        <div class="math-coach-grid">
          <div class="math-coach-card">
            <div class="math-coach-label">핵심 개념</div>
            <div class="math-coach-list" id="s1-coach-concepts"></div>
          </div>
          <div class="math-coach-card">
            <div class="math-coach-label">접근 순서</div>
            <div class="math-coach-list" id="s1-coach-approach"></div>
          </div>
          <div class="math-coach-card">
            <div class="math-coach-label">판단 포인트</div>
            <div class="math-coach-list" id="s1-coach-judgement"></div>
          </div>
          <div class="math-coach-card">
            <div class="math-coach-label">여기서 제일 많이 무너집니다</div>
            <div class="math-coach-list" id="s1-coach-mistakes"></div>
          </div>
          <div class="math-coach-card full">
            <div class="math-coach-label">권장 공부량</div>
            <div class="math-coach-list" id="s1-coach-drill"></div>
            <div class="math-coach-meter">
              <div class="math-coach-meter-box">
                <div class="math-coach-meter-num" id="s1-meter-num-0">6문제</div>
                <div class="math-coach-meter-label" id="s1-meter-label-0">기본형 자동화</div>
              </div>
              <div class="math-coach-meter-box">
                <div class="math-coach-meter-num" id="s1-meter-num-1">10문제</div>
                <div class="math-coach-meter-label" id="s1-meter-label-1">변형 누적</div>
              </div>
              <div class="math-coach-meter-box">
                <div class="math-coach-meter-num" id="s1-meter-num-2">3회</div>
                <div class="math-coach-meter-label" id="s1-meter-label-2">말로 설명</div>
              </div>
            </div>
          </div>
        </div>

        <div class="math-coach-note" id="s1-coach-closing">적어도 10문제 안팎은 손으로 풀고, 2~3문제는 식 없이 말로 설명할 수 있어야 시험장에서 흔들리지 않습니다.</div>
      </div>
    </div>
  </div><!-- /math-s1 -->`;
