const MATH_CONTENT = `
<div id="sec-math">
  <nav class="sub-tabbar">
    <button class="sub-tab math active" data-stab="math-s0" onclick="switchSubTab('math','s0')">
      <span class="step-label">STEP 0</span><span>시험 개요</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab math" data-stab="math-s1" onclick="switchSubTab('math','s1')">
      <span class="step-label">STEP 1</span><span>범위 해체</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab math" data-stab="math-s2" onclick="switchSubTab('math','s2')">
      <span class="step-label">STEP 2</span><span>서술형 방어</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab math" data-stab="math-s3" onclick="switchSubTab('math','s3')">
      <span class="step-label">STEP 3</span><span>오답 분석</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab math" data-stab="math-s4" onclick="switchSubTab('math','s4')">
      <span class="step-label">STEP 4</span><span>타임어택</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab math" data-stab="math-s5" onclick="switchSubTab('math','s5')">
      <span class="step-label">암기</span><span>공식 카드</span>
    </button>
  </nav>

${window.MATH_S0 || ''}

${window.MATH_S1 || ''}

${window.MATH_S2 || ''}

${window.MATH_S3 || ''}

${window.MATH_S4 || ''}

${window.MATH_S5 || ''}

</div><!-- /sec-math -->

<div class="toast" id="global-toast"></div>
`;

const mathAppRoot = document.getElementById('math-app');
if (mathAppRoot) {
  mathAppRoot.innerHTML = MATH_CONTENT;
}
