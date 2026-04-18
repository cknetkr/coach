const ENGLISH_CONTENT = `
<div id="sec-eng">
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
