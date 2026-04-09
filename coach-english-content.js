const ENGLISH_CONTENT = `
<div id="sec-eng">
  <nav class="sub-tabbar">
    <button class="sub-tab eng active" data-stab="eng-s0" onclick="switchSubTab('eng','s0')">
      <span class="step-label">STEP 0</span><span>평가 개요</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab eng" data-stab="eng-s1" onclick="switchSubTab('eng','s1')">
      <span class="step-label">STEP 1</span><span>받아쓰기</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab eng" data-stab="eng-s2" onclick="switchSubTab('eng','s2')">
      <span class="step-label">STEP 2</span><span>문장완성</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab eng" data-stab="eng-s3" onclick="switchSubTab('eng','s3')">
      <span class="step-label">STEP 3</span><span>영어면접</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab eng" data-stab="eng-s4" onclick="switchSubTab('eng','s4')">
      <span class="step-label">STEP 4</span><span>점수시뮬레이터</span>
    </button>
    <span class="tab-arrow">›</span>
    <button class="sub-tab eng" data-stab="eng-s5" onclick="switchSubTab('eng','s5')">
      <span class="step-label">표현</span><span>핵심 암기</span>
    </button>
  </nav>

${window.ENG_S0 || ''}

${window.ENG_S1 || ''}

${window.ENG_S2 || ''}

${window.ENG_S3 || ''}

${window.ENG_S4 || ''}

${window.ENG_S5 || ''}

</div><!-- /sec-eng -->

<div class="toast" id="global-toast"></div>
`;

const englishAppRoot = document.getElementById('eng-app');
if (englishAppRoot) {
  englishAppRoot.innerHTML = ENGLISH_CONTENT;
}
