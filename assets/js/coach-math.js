/* ── D-day ── */
document.addEventListener('DOMContentLoaded', () => {
  const now = new Date();
  const mathExam = new Date(2026, 3, 16);
  const diff = Math.ceil((mathExam - now) / 86400000);
  const el = document.getElementById('math-dday');
  if (el) el.textContent = diff < 0 ? '시험 완료' : diff === 0 ? '🔥 당일!' : diff;

  bindS1LiveCoach();
  initRubricClick('s4-rubric', 's4-bar-fill', 's4-bar-count', 'math');
});

const externalS1Samples = Array.isArray(window.MATH_S1_SAMPLES) ? window.MATH_S1_SAMPLES : [];
const externalS2Samples = Array.isArray(window.MATH_S2_SAMPLES) ? window.MATH_S2_SAMPLES : [];
const externalS3Patterns = Array.isArray(window.MATH_S3_PATTERNS) ? window.MATH_S3_PATTERNS : [];
const generatedVariants = Array.isArray(window.MATH_GENERATED_VARIANTS) ? window.MATH_GENERATED_VARIANTS : [];

/* ── STEP 1: 예시 문제 샘플 ── */
const s1Samples = externalS1Samples.length ? externalS1Samples : [
  {
    ref: '교과서 p.27 예제 5',
    prob: 'log₂(x-1) + log₂(x+1) = 3 을 만족하는 x의 값을 구하시오.',
    ans: 'log₂(x-1)(x+1) = 3 으로 합쳐서 x²-1 = 8, x² = 9, x = ±3 이므로 x = 3, x = -3 둘 다 답으로 썼음.'
  },
  {
    ref: '교과서 p.22 연습 #4',
    prob: '4^x - 3·2^x - 4 = 0 을 만족하는 x의 값을 구하시오.',
    ans: 't = 2^x 로 치환해서 t² - 3t - 4 = 0, (t-4)(t+1) = 0. t = 4 또는 t = -1 이라서 x = 2 또는 2^x = -1 이라고 썼는데 틀렸음.'
  },
  {
    ref: '교과서 p.35 연습 #7',
    prob: 'log_(1/3)(2x-1) ≥ log_(1/3)(x+2) 를 푸시오.',
    ans: '밑이 1/3 인데 그냥 2x-1 ≥ x+2 로 풀어서 x ≥ 3 이라고 썼음. 부등호 방향을 유지했음.'
  },
  {
    ref: '교과서 p.14 예제 2',
    prob: '√((-5)²) 의 값을 구하시오.',
    ans: '처음에 √((-5)²) = -5 라고 썼다가 고쳤음. n이 짝수일 때 절댓값 처리인지 헷갈렸음.'
  },
  {
    ref: '교과서 p.33 심화 #2',
    prob: 'log₂3 × log₃8 의 값을 구하시오.',
    ans: '밑이 달라서 어떻게 해야 할지 몰라서 log₂3 × 3 = log₂9 라고 잘못 계산했음.'
  }
];
function loadS1Sample(idx) {
  const s = s1Samples[idx];
  if (!s) return;
  document.getElementById('s1-problem-ref').value = s.ref;
  document.getElementById('s1-problem-text').value = s.prob;
  document.getElementById('s1-my-answer').value = s.ans;
  renderS1CoachAnalysis();
  showToast('예시 불러오기 완료 — 오른쪽 1타 강사 해설을 확인하십시오.');
}
function loadGeneratedVariant(idx) {
  const s = generatedVariants[idx];
  if (!s) return;
  document.getElementById('s1-problem-ref').value = s.ref;
  document.getElementById('s1-problem-text').value = s.prob;
  document.getElementById('s1-my-answer').value = s.ans;
  renderS1CoachAnalysis();
  showToast('변형문제를 불러왔습니다. 해설 패널이 함께 갱신됐습니다.');
}

/* ── STEP 1: 1타 강사 라이브 코칭 ── */
const s1CoachProfiles = {
  'log-equation': {
    headline: '로그방정식은 계산보다 먼저 진수 조건을 잠그는 문제입니다.',
    summary: '후보 해가 몇 개 나오든, 진수 조건을 먼저 고정하지 않으면 허용되지 않는 해를 같이 적게 됩니다.',
    concepts: [
      'log_a M은 밑 > 0, 밑 ≠ 1, 진수 > 0이 먼저입니다.',
      '로그를 합칠 때도 각 진수 조건의 교집합을 먼저 써야 합니다.',
      '후보 해는 마지막에 조건과 원식 두 번으로 검산해야 안전합니다.',
    ],
    approach: [
      '각 진수 조건을 따로 적고 교집합 한 줄을 먼저 완성하십시오.',
      '그다음 로그 성질로 식을 하나로 모으고 전개하십시오.',
      '후보 해가 나오면 조건을 만족하는지 바로 걸러내십시오.',
    ],
    judgement: [
      'x = ±3 같은 값이 보이면 곧바로 정답이 아니라 임시 후보로 보아야 합니다.',
      '조건이 안 적힌 풀이에는 채점자 입장에서 근거가 보이지 않습니다.',
      '진수 조건은 계산 전, 검산은 계산 후라고 순서를 고정하십시오.',
    ],
    defaultMistakes: [
      '후보 해를 조건 검산 없이 모두 적어 음수 해까지 정답에 넣는 실수',
      '두 진수 조건의 교집합을 쓰지 않아 허용 범위를 놓치는 실수',
      '검산 없이 ∴ 결론으로 넘어가 감점되는 실수',
    ],
    drill: [
      '기본형 6문제를 연속으로 풀면서 첫 줄을 무조건 진수 조건으로 시작하십시오.',
      '숫자만 바꾼 변형 10문제를 더 풀어 후보 해를 조건으로 걸러내는 습관을 굳히십시오.',
      '대표 문제 3개는 풀이를 덮고 왜 음수 해를 버리는지 말로 설명해 보십시오.',
    ],
    meters: [
      { num: '6문제', label: '기본형 자동화' },
      { num: '10문제', label: '변형 누적' },
      { num: '3회', label: '말로 설명' },
    ],
    closing: '이 유형은 최소 16문제 정도는 손으로 풀어 보고, 후보 해가 나오면 반사적으로 조건부터 보는 수준까지 올려야 실전에서 흔들리지 않습니다.',
  },
  'log-inequality': {
    headline: '로그 부등식은 첫 줄에서 부등호 방향을 판정하는 문제입니다.',
    summary: '밑이 1보다 작은지 큰지에 따라 부등호 방향이 갈리므로, 계산보다 함수의 증가·감소를 먼저 판단해야 합니다.',
    concepts: [
      '밑 a > 1이면 방향 유지, 0 < a < 1이면 방향 역전입니다.',
      '진수 조건은 양변 각각 따로 구하고 마지막에 교집합을 취합니다.',
      '해집합은 부등식 해와 조건 해를 끝에서 결합해야 완성됩니다.',
    ],
    approach: [
      '밑이 1보다 큰지 작은지부터 표시하십시오.',
      '부등호 방향을 결정한 뒤에만 진수끼리 비교하십시오.',
      '마지막 줄에서 진수 조건과 결합해 범위를 닫으십시오.',
    ],
    judgement: [
      '밑이 1/2, 1/3처럼 보이면 방향 역전이 자동으로 떠올라야 합니다.',
      '조건 없는 부등식 해는 아직 반쪽짜리 답입니다.',
      '감소함수라는 말이 떠오르지 않으면 그래프를 머릿속에 먼저 그리십시오.',
    ],
    defaultMistakes: [
      '밑이 1보다 작은데 부등호를 그대로 유지하는 실수',
      '진수 조건을 마지막에 결합하지 않아 틀린 범위를 적는 실수',
      '방향만 맞고도 이유를 쓰지 않아 서술형 점수를 잃는 실수',
    ],
    drill: [
      '밑 > 1 유형 4문제와 밑 < 1 유형 4문제를 짝지어 풀며 방향 차이를 비교하십시오.',
      '변형 8문제는 진수 조건과 최종 해집합을 한 줄씩 따로 써 보십시오.',
      '대표 문제 3개는 그래프가 증가인지 감소인지 말로 먼저 설명해 보십시오.',
    ],
    meters: [
      { num: '8문제', label: '방향 판정 비교' },
      { num: '8문제', label: '변형 교집합' },
      { num: '3회', label: '그래프 설명' },
    ],
    closing: '이 유형은 방향 판정과 조건 결합이 한 몸처럼 붙어야 합니다. 최소 8문제 이상을 연속으로 풀어 "밑 확인 → 방향 결정"이 자동 반응이 되게 하십시오.',
  },
  'exp-equation': {
    headline: '지수방정식은 밑 통일 또는 치환 후 조건을 끝까지 지키는 문제입니다.',
    summary: '치환을 썼다면 t > 0 같은 조건까지 같이 가야 하고, 밑을 통일했다면 지수 비교가 가능한 이유를 보여줘야 합니다.',
    concepts: [
      '지수문제는 밑 통일이 최우선 전략입니다.',
      't = a^x 로 치환하면 지수함수는 항상 양수이므로 t > 0을 반드시 적어야 합니다.',
      '후보 값 중 음수 t는 즉시 제거 근거를 남겨야 합니다.',
    ],
    approach: [
      '먼저 밑 통일이 가능한지 보고, 어렵다면 치환 여부를 결정하십시오.',
      '치환을 썼다면 t > 0 조건을 바로 옆에 적으십시오.',
      '인수분해 후 나온 후보는 조건으로 제거하고 다시 x로 되돌리십시오.',
    ],
    judgement: [
      '2^x, 3^x, 4^x가 보이면 밑을 어떻게 맞출지 먼저 떠올리십시오.',
      '치환은 계산 편의를 위한 도구이지 조건을 없애 주는 마법이 아닙니다.',
      '2^x = -1 같은 식이 보이면 즉시 불가능 판단이 나와야 합니다.',
    ],
    defaultMistakes: [
      '치환 후 나온 음수 t를 그대로 해에 포함하는 실수',
      't > 0 조건을 답안에서 생략해 부분 점수를 놓치는 실수',
      '치환은 했지만 마지막에 x로 되돌리는 검산을 놓치는 실수',
    ],
    drill: [
      '밑 통일형 5문제, 치환형 5문제를 나눠 풀며 접근 차이를 손에 익히십시오.',
      '치환형 변형 8문제는 매번 t > 0을 첫 줄에 적고 시작하십시오.',
      '대표 문제 3개는 왜 음수 t가 버려지는지 식 없이 설명해 보십시오.',
    ],
    meters: [
      { num: '10문제', label: '통일·치환 분리' },
      { num: '8문제', label: '조건형 반복' },
      { num: '3회', label: '불가능 해 설명' },
    ],
    closing: '지수방정식은 계산이 아니라 조건 관리 게임입니다. 최소 10문제는 풀어 봐야 t > 0과 해 제거가 반사적으로 따라옵니다.',
  },
  radical: {
    headline: '거듭제곱근은 짝수·홀수 판정 하나로 절댓값과 부호가 갈리는 문제입니다.',
    summary: '근호를 보는 순간 n이 짝수인지 홀수인지 먼저 보고, 짝수라면 절댓값이 붙는 이유까지 같이 떠올려야 실수가 사라집니다.',
    concepts: [
      'n이 짝수면 √[n](a^n) = |a|, 홀수면 √[n](a^n) = a 입니다.',
      '짝수 근호는 원래 부호를 보존하지 않으므로 절댓값이 핵심입니다.',
      '분수 지수로 바꿀 때도 정의역과 부호 감각을 같이 가져가야 합니다.',
    ],
    approach: [
      '먼저 n의 홀짝을 확인하고 절댓값 필요 여부를 결정하십시오.',
      '가능하면 분수 지수 형태로 바꿔 규칙을 눈에 보이게 만드십시오.',
      '음수 예시 하나를 떠올려 본 뒤 부호 판단을 확정하십시오.',
    ],
    judgement: [
      '짝수 근호에서 "원래 수가 나온다"는 생각이 들면 바로 경계해야 합니다.',
      '예시로 -3을 대입해 보면 절댓값 여부가 훨씬 또렷해집니다.',
      '정답보다 먼저 왜 부호가 바뀌는지 설명할 수 있어야 실전에서도 덜 흔들립니다.',
    ],
    defaultMistakes: [
      '짝수 근호에서 절댓값을 빼고 원래 부호를 그대로 적는 실수',
      '분수 지수로 바꾼 뒤 부호 판단을 생략하는 실수',
      '정의는 기억하지만 반례를 못 떠올려 같은 오답을 반복하는 실수',
    ],
    drill: [
      '짝수·홀수 판정형 6문제를 번갈아 풀며 차이를 손에 익히십시오.',
      '절댓값이 걸리는 변형 10문제를 추가로 풀어 반례 감각을 키우십시오.',
      '대표 문제 3개는 음수 예시를 직접 말해 보며 왜 |a|가 나오는지 설명하십시오.',
    ],
    meters: [
      { num: '6문제', label: '홀짝 판정' },
      { num: '10문제', label: '절댓값 변형' },
      { num: '3회', label: '반례 설명' },
    ],
    closing: '거듭제곱근은 규칙이 단순하지만 반례를 못 떠올리면 계속 틀립니다. 최소 10문제 이상은 짝수·홀수를 섞어 훈련하십시오.',
  },
  'common-log': {
    headline: '상용로그·밑 변환은 수를 바로 만지지 말고 구조를 먼저 정리하는 문제입니다.',
    summary: '소인수분해, 밑 통일, 밑 변환 공식을 먼저 떠올리면 계산이 짧아지고, 식을 바로 건드리면 순서를 거꾸로 쓰기 쉽습니다.',
    concepts: [
      '상용로그는 먼저 수를 소인수분해해 log의 곱·거듭제곱 법칙으로 바꿉니다.',
      '밑 변환 공식은 "구하려는 것 b가 분자, 바꾸는 밑 a가 분모"입니다.',
      '밑이 다른 로그 곱은 공통 밑으로 모으면 약분 구조가 자주 나옵니다.',
    ],
    approach: [
      '72, 81 같은 수는 먼저 소인수분해하거나 지수 형태로 바꾸십시오.',
      '밑이 다르면 공통 밑 변환이 가능한지 먼저 보고 식을 정리하십시오.',
      '공식 적용 후에는 약분이 되는 구조인지 다시 한 번 눈으로 확인하십시오.',
    ],
    judgement: [
      '숫자를 바로 계산하고 싶을수록 한 번 멈추고 구조부터 나누십시오.',
      '밑 변환은 분자·분모를 뒤집는 실수가 가장 많으니 말로 읽어 보십시오.',
      '공통 밑으로 맞춘 뒤 약분될 때가 많다는 감각을 가져가십시오.',
    ],
    defaultMistakes: [
      '밑 변환 공식의 분자·분모 순서를 뒤집는 실수',
      '소인수분해를 건너뛰고 숫자를 바로 다루다 식을 길게 만드는 실수',
      '약분 구조를 놓쳐 쉬운 문제를 어렵게 푸는 실수',
    ],
    drill: [
      '상용로그 표현형 5문제는 소인수분해를 첫 줄에 적는 훈련부터 하십시오.',
      '밑 변환형 8문제는 공통 밑을 직접 써 보며 분자·분모 방향을 고정하십시오.',
      '대표 문제 2세트는 공식 없이 말로 읽으며 약분 구조를 설명해 보십시오.',
    ],
    meters: [
      { num: '5문제', label: '소인수분해형' },
      { num: '8문제', label: '밑 변환 반복' },
      { num: '2세트', label: '구조 말하기' },
    ],
    closing: '이 유형은 구조가 먼저 보이면 30초 안에 끝나고, 안 보이면 오래 헤맵니다. 최소 13문제 정도 풀며 소인수분해와 밑 변환을 자동화하십시오.',
  },
  graph: {
    headline: '그래프 문제는 계산 전에 이동·점근선 구조를 먼저 읽는 문제입니다.',
    summary: '점근선과 기준점을 먼저 잡으면 나머지 좌표 계산은 짧아집니다. 식만 대입하면 구조 점수를 놓치기 쉽습니다.',
    concepts: [
      'y = a^(x-p) + q 꼴은 점근선 y = q와 기준점 이동을 같이 봐야 합니다.',
      '지수함수는 항상 양수이므로 평행이동 후 치역 판단이 쉬워집니다.',
      '그래프 문제는 계산 결과보다 구조 해석 문장이 먼저입니다.',
    ],
    approach: [
      '기저 함수와 이동량을 먼저 적으십시오.',
      '점근선과 치역을 정한 뒤 필요한 좌표를 대입 계산하십시오.',
      '좌표 두 개를 구했으면 그래프 해석 문장까지 붙여 마무리하십시오.',
    ],
    judgement: [
      'x값 대입 전에 점근선이 먼저 떠올라야 그래프형 감점이 줄어듭니다.',
      '이동량과 기준점을 문장으로 설명할 수 있어야 구조가 잡혔다는 뜻입니다.',
      '좌표만 적고 끝내면 그래프 해석형 문제의 절반만 푼 셈입니다.',
    ],
    defaultMistakes: [
      '점근선이나 이동 구조를 안 쓰고 좌표 계산만 하는 실수',
      '기준점 이동을 혼동해 좌표는 맞아도 해석 점수를 잃는 실수',
      '그래프 의미를 문장으로 마무리하지 않아 서술형 완성도가 떨어지는 실수',
    ],
    drill: [
      '점근선 판단형 4문제와 좌표 대입형 4문제를 묶어 구조 먼저 쓰는 훈련을 하십시오.',
      '변형 6문제는 기저 함수, 이동량, 점근선을 한 세트로 적는 루틴을 유지하십시오.',
      '대표 문제 2개는 그래프를 그리지 않고 말로만 설명해 보십시오.',
    ],
    meters: [
      { num: '8문제', label: '구조 먼저 쓰기' },
      { num: '6문제', label: '변형 대입형' },
      { num: '2회', label: '말로 그래프 설명' },
    ],
    closing: '그래프 문제는 구조를 읽는 속도가 핵심입니다. 최소 8문제 정도는 점근선부터 쓰는 습관으로 훈련해 두어야 실전에서 계산이 짧아집니다.',
  },
  general: {
    headline: '이 문제는 먼저 단원 분류와 첫 줄 조건을 정리하는 훈련이 필요합니다.',
    summary: '개념 이름이 먼저 떠오르지 않으면 계산이 길어지고, 서술형에서도 무엇을 보여줘야 하는지 흐려집니다.',
    concepts: [
      '문제는 항상 단원 이름, 첫 줄 조건, 사용할 공식 순서로 분해하십시오.',
      '정답보다 먼저 "왜 이 식으로 가는지"를 말할 수 있어야 합니다.',
      '중간 줄 하나가 채점 기준 하나라는 감각으로 답안을 쓰십시오.',
    ],
    approach: [
      '문제를 단원 이름으로 먼저 분류하십시오.',
      '조건 또는 정의를 첫 줄에 적고, 사용할 공식을 둘째 줄에 밝히십시오.',
      '전개 후에는 검산과 결론을 따로 닫으십시오.',
    ],
    judgement: [
      '개념 이름이 안 떠오르면 먼저 STEP 0 핵심 특강을 다시 훑으십시오.',
      '첫 줄이 비어 있으면 대체로 조건 또는 정의를 놓친 상태입니다.',
      '모르면 계산부터 하지 말고 무엇을 묻는 문제인지 문장으로 바꾸십시오.',
    ],
    defaultMistakes: [
      '문제를 분류하지 않고 바로 계산에 들어가는 실수',
      '조건이나 정의를 답안에서 생략하는 실수',
      '검산과 결론을 한 줄로 뭉개 서술형 점수를 잃는 실수',
    ],
    drill: [
      '기본형 5문제는 단원 이름을 먼저 적고 시작하십시오.',
      '비슷한 변형 8문제를 묶어 첫 줄 조건과 둘째 줄 공식을 반복하십시오.',
      '대표 문제 3개는 식 없이 접근 순서를 말로 재현해 보십시오.',
    ],
    meters: [
      { num: '5문제', label: '단원 분류' },
      { num: '8문제', label: '첫 줄 루틴' },
      { num: '3회', label: '접근 설명' },
    ],
    closing: '개념 이름이 먼저 떠오르는 수준까지 가야 응용문제에도 흔들리지 않습니다. 최소 10문제 정도는 분류 훈련에 써 보십시오.',
  },
};

function escapeCoachHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderCoachList(targetId, items) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = items.map((item) => `<div class="math-coach-item">${escapeCoachHtml(item)}</div>`).join('');
}

function getS1ProfileKey(probText, ansText) {
  const combined = `${probText} ${ansText}`;
  const lower = combined.toLowerCase();
  if (/점근선|그래프|평행이동|지나는 두 점|함수/.test(combined)) return 'graph';
  if (/√|sqrt|거듭제곱근/.test(combined)) return 'radical';
  if (/(log|로그)/i.test(combined) && /[≥≤<>]/.test(combined)) return 'log-inequality';
  if (/(log|로그)/i.test(combined) && /밑 변환|상용|a, b|a,b|log72|log₂3|log2/.test(lower)) return 'common-log';
  if (/(4\^x|9\^x|2\^x|3\^x|지수방정식|치환|t\s*=)/.test(lower)) return 'exp-equation';
  if (/(log|로그)/i.test(combined)) return 'log-equation';
  return 'general';
}

function buildS1MistakeNotes(profileKey, probText, ansText) {
  const text = `${probText}\n${ansText}`;
  const lower = text.toLowerCase();
  const notes = [];

  if (!ansText.trim()) {
    return ['아직 내 풀이가 비어 있습니다. 먼저 본인이 무엇을 떠올렸는지 적으면 해설이 훨씬 정확해집니다.'];
  }

  if (profileKey === 'log-equation') {
    if (/±|둘 다 답|x\s*=\s*-\d/.test(ansText)) notes.push('후보 해를 조건 검산 없이 모두 적고 있습니다. 로그방정식에서는 이 단계가 가장 큰 감점 포인트입니다.');
    if (!/조건|교집합|>/.test(ansText)) notes.push('진수 조건을 답안에 드러내지 않아 왜 그 해만 남는지가 보이지 않습니다.');
  }

  if (profileKey === 'log-inequality') {
    if (/(1\/2|1\/3|1\/4)/.test(lower) && /x\s*[≥>]/.test(ansText) && !/역전|뒤집|감소/.test(ansText)) {
      notes.push('밑이 1보다 작은데도 부등호를 유지한 흔적이 보입니다. 방향 판정을 먼저 적어야 합니다.');
    }
    if (!/교집합|조건/.test(ansText)) notes.push('부등식 계산 뒤 진수 조건과 결합하는 마지막 줄이 빠질 가능성이 큽니다.');
  }

  if (profileKey === 'exp-equation') {
    if (/t\s*=\s*-\d|2\^x\s*=\s*-\d|3\^x\s*=\s*-\d/.test(lower)) {
      notes.push('치환 후 나온 음수 값을 그대로 남겼습니다. 지수함수는 항상 양수라서 t > 0을 근거로 제거해야 합니다.');
    }
    if (!/t\s*>\s*0|항상 양수|양수/.test(ansText)) notes.push('치환 조건 t > 0이 답안에 보이지 않습니다. 이 한 줄이 부분 점수를 지켜 줍니다.');
  }

  if (profileKey === 'radical') {
    if (/=\s*-\d|원래 수/.test(ansText)) notes.push('짝수 근호에서 절댓값 대신 원래 부호를 그대로 가져가려는 흔적이 보입니다.');
    if (!/절댓값|\|a\|/.test(ansText)) notes.push('짝수·홀수 분기 근거를 답안에 드러내지 않으면 같은 실수를 반복하기 쉽습니다.');
  }

  if (profileKey === 'common-log') {
    if (!/소인수|2\^|3\^|밑 변환|분자|분모/.test(ansText)) notes.push('구조 정리 없이 숫자를 바로 다루고 있어 식이 길어질 위험이 큽니다.');
    if (/log₂3\s*×\s*3|log2\s*3.*log2\s*9/.test(lower)) notes.push('밑 변환 대신 숫자를 억지로 곱해 처리하고 있습니다. 공통 밑으로 통일하는 구조를 먼저 보십시오.');
  }

  if (profileKey === 'graph') {
    if (!/점근선|y\s*=/.test(ansText)) notes.push('그래프 문제인데 점근선이나 이동 구조보다 좌표 계산만 먼저 적고 있습니다.');
  }

  if (!notes.length) {
    return s1CoachProfiles[profileKey].defaultMistakes;
  }
  return [...notes, ...s1CoachProfiles[profileKey].defaultMistakes].slice(0, 3);
}

function buildS1CoachData({ ref, prob, ans }) {
  const profileKey = getS1ProfileKey(prob, ans);
  const profile = s1CoachProfiles[profileKey] || s1CoachProfiles.general;
  const safeRef = ref ? `${ref} 기준으로 보면` : '지금 문제를 보면';
  const summary = prob
    ? `${safeRef} 이 문제는 ${profile.headline.replace(/\.$/, '')} 유형입니다. ${profile.summary}`
    : '문제 내용을 적으면 어떤 개념 문제인지부터 분류해서 설명합니다.';

  return {
    headline: profile.headline,
    summary,
    concepts: profile.concepts,
    approach: profile.approach,
    judgement: profile.judgement,
    mistakes: buildS1MistakeNotes(profileKey, prob, ans),
    drill: profile.drill,
    meters: profile.meters,
    closing: profile.closing,
  };
}

function renderS1CoachAnalysis() {
  const refEl = document.getElementById('s1-problem-ref');
  const probEl = document.getElementById('s1-problem-text');
  const ansEl = document.getElementById('s1-my-answer');
  if (!refEl || !probEl || !ansEl) return;

  const coach = buildS1CoachData({
    ref: refEl.value.trim(),
    prob: probEl.value.trim(),
    ans: ansEl.value.trim(),
  });

  const headline = document.getElementById('s1-coach-headline');
  const summary = document.getElementById('s1-coach-summary');
  const closing = document.getElementById('s1-coach-closing');
  if (headline) headline.textContent = coach.headline;
  if (summary) summary.textContent = coach.summary;
  if (closing) closing.textContent = coach.closing;

  renderCoachList('s1-coach-concepts', coach.concepts);
  renderCoachList('s1-coach-approach', coach.approach);
  renderCoachList('s1-coach-judgement', coach.judgement);
  renderCoachList('s1-coach-mistakes', coach.mistakes);
  renderCoachList('s1-coach-drill', coach.drill);

  coach.meters.forEach((meter, index) => {
    const numEl = document.getElementById(`s1-meter-num-${index}`);
    const labelEl = document.getElementById(`s1-meter-label-${index}`);
    if (numEl) numEl.textContent = meter.num;
    if (labelEl) labelEl.textContent = meter.label;
  });
}

function bindS1LiveCoach() {
  const ids = ['s1-problem-ref', 's1-problem-text', 's1-my-answer'];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el && !el.dataset.coachBound) {
      el.addEventListener('input', renderS1CoachAnalysis);
      el.dataset.coachBound = 'true';
    }
  });
  renderS1CoachAnalysis();
}

function analyzeStep1() {
  renderS1CoachAnalysis();
  showToast('1타 강사 해설을 현재 입력값 기준으로 갱신했습니다.');
}

function clearStep1() {
  showToast('이 단계는 해설을 계속 유지하기 위해 초기화를 잠가 두었습니다.');
}

function clearAllErrors() {
  showToast('범위 해체 단계에서는 누적 오답 목록 대신 실시간 코칭에 집중합니다.');
}

/* ── STEP 2: 예시 문제 샘플 ── */
const s2Samples = externalS2Samples.length ? externalS2Samples : [
  {
    prob: 'log₂(x-1) + log₂(x+1) = 3 을 만족하는 x의 값을 구하시오. (서술형 6점)',
    s1: '밑: 2 > 0, 2 ≠ 1 ✓\n진수 조건: x-1 > 0 → x > 1 … ①\n         x+1 > 0 → x > -1 … ②\n공통 조건 (교집합): x > 1',
    s2: '로그의 곱 법칙에 의해\nlog₂MN = log₂M + log₂N 을 역방향 적용',
    s3: 'log₂(x-1)(x+1) = 3\n       (x-1)(x+1) = 2³ = 8\n            x² - 1 = 8\n                x² = 9\n                 x = ±3',
    s4: 'x > 1 조건에서 x = -3 제외.\nx = 3 은 진수 3-1=2>0, 3+1=4>0 만족 ✓\n∴ x = 3'
  },
  {
    prob: '4^x - 3·2^x - 4 = 0 을 만족하는 x의 값을 구하시오. (서술형 6점)',
    s1: 't = 2^x 로 놓으면 지수함수는 항상 양수이므로 t > 0',
    s2: '지수법칙 (a^m)^n = a^mn 에 의해 4^x = (2²)^x = (2^x)² = t²\nt = 2^x 로 치환',
    s3: 't² - 3t - 4 = 0\n(t - 4)(t + 1) = 0\nt = 4  또는  t = -1',
    s4: 't > 0 조건에서 t = -1 제외.\nt = 4 이면 2^x = 2² 이므로 x = 2.\n∴ x = 2'
  },
  {
    prob: 'log_(1/3)(2x-1) ≥ log_(1/3)(x+2) 를 푸시오. (서술형 8점)',
    s1: '밑: 1/3 > 0, 1/3 ≠ 1 ✓\n진수 조건: 2x-1 > 0 → x > 1/2 … ①\n         x+2 > 0 → x > -2 … ②\n공통 조건: x > 1/2',
    s2: '밑 0 < a < 1 이면 log_a M ≥ log_a N → M ≤ N (부등호 방향 역전)\n밑이 1/3 < 1 이므로 부등호 역전 적용',
    s3: '2x - 1 ≤ x + 2\n      x ≤ 3',
    s4: '진수 조건 x > 1/2 와 x ≤ 3 의 교집합:\n∴ 1/2 < x ≤ 3'
  },
  {
    prob: 'y = 2^(x-1) + 3 의 점근선을 구하고, x=1, x=2 를 대입한 두 점의 좌표를 구하시오. (서술형 6점)',
    s1: '기저 함수 y = 2^x 를 x축으로 +1, y축으로 +3 평행이동한 함수.\n2^(x-1) > 0 이므로 y > 3 → 수평 점근선: y = 3',
    s2: '지수함수 y = a^x 의 평행이동 성질 적용:\ny = a^(x-p) + q 의 점근선은 y = q',
    s3: 'x=1 대입: y = 2^(1-1) + 3 = 2^0 + 3 = 1 + 3 = 4\nx=2 대입: y = 2^(2-1) + 3 = 2^1 + 3 = 2 + 3 = 5',
    s4: '점근선: y = 3\n두 점의 좌표: (1, 4), (2, 5)\n∴ 점근선 y = 3, 두 점 (1, 4), (2, 5)'
  },
  {
    prob: 'log2 = a, log3 = b 로 놓을 때, log72 를 a, b 로 나타내시오. (단답형 4점)',
    s1: '72 = 2³ × 3² (소인수분해)\nlog의 밑은 10 (상용로그), 진수 72 > 0 ✓',
    s2: '로그 곱 법칙: log MN = logM + logN\n로그 거듭제곱 법칙: log M^k = k·logM',
    s3: 'log72 = log(2³ × 3²)\n      = log2³ + log3²\n      = 3log2 + 2log3\n      = 3a + 2b',
    s4: 'log72 = 3a + 2b 확인: a=log2≈0.301, b=log3≈0.477\n3(0.301)+2(0.477) = 0.903+0.954 = 1.857 ≈ log72 ✓\n∴ log72 = 3a + 2b'
  },
  {
    prob: '지수방정식 9^x - 4·3^x - 45 = 0 을 만족하는 x의 값을 구하시오. (서술형 6점)',
    s1: 't = 3^x 로 놓으면 지수함수는 항상 양수이므로 t > 0',
    s2: '지수법칙 (a^m)^n = a^mn 에 의해 9^x = (3²)^x = (3^x)² = t²\nt = 3^x 로 치환',
    s3: 't² - 4t - 45 = 0\n(t-9)(t+5) = 0\nt = 9 또는 t = -5',
    s4: 't > 0 조건에서 t = -5 제외.\nt = 9이면 3^x = 9 = 3²\n∴ x = 2'
  },
  {
    prob: 'log₂(x+3) ≥ log₂(2x-1) 를 만족하는 x의 범위를 구하시오. (서술형 8점)',
    s1: '밑: 2 > 0, 2 ≠ 1 ✓\n진수 조건: x+3 > 0 → x > -3 … ①\n          2x-1 > 0 → x > 1/2 … ②\n공통 조건 (교집합): x > 1/2',
    s2: '밑 2 > 1 이므로 부등호 방향 유지\n로그 부등식: log₂M ≥ log₂N → M ≥ N (밑>1)',
    s3: 'x+3 ≥ 2x-1\n3+1 ≥ 2x-x\n4 ≥ x\nx ≤ 4',
    s4: '진수 조건 x > 1/2 와 결합:\nx > 1/2 이고 x ≤ 4\n∴ 1/2 < x ≤ 4'
  }
];
function loadS2Sample(idx) {
  const s = s2Samples[idx];
  document.getElementById('s2-problem').value = s.prob;
  document.getElementById('s2-step1').value = s.s1;
  document.getElementById('s2-step2').value = s.s2;
  document.getElementById('s2-step3').value = s.s3;
  document.getElementById('s2-step4').value = s.s4;
  ['warn-s2-1','warn-s2-2','warn-s2-4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.className = 'step-warn';
  });
  bindAutoResizeTextareas(document.getElementById('math-s2'));
  showToast('문제 불러오기 완료 — 4단계 검증을 실행하십시오.');
}

/* ── STEP 2: 서술형 방어 ── */
async function analyzeStep2() {
  const prob = document.getElementById('s2-problem').value.trim();
  const s1 = document.getElementById('s2-step1').value.trim();
  const s2 = document.getElementById('s2-step2').value.trim();
  const s3 = document.getElementById('s2-step3').value.trim();
  const s4 = document.getElementById('s2-step4').value.trim();
  const el = document.getElementById('s2-feedback');
  if (!s1 && !s2 && !s3 && !s4) { showToast('최소 1단계 이상 작성하십시오'); return; }
  const w1 = document.getElementById('warn-s2-1');
  const w2 = document.getElementById('warn-s2-2');
  const w4 = document.getElementById('warn-s2-4');
  const hasLogCond = s1.includes('>') || s1.includes('조건') || s1.includes('>0');
  if (s1 && !hasLogCond) { w1.textContent='⚠ 진수/밑 조건이 보이지 않습니다.'; w1.className='step-warn visible warn-red'; }
  else if (s1) { w1.textContent='✓ 조건 명시 확인됨'; w1.className='step-warn visible warn-blue'; }
  const hasFormula = s2.includes('의해') || s2.includes('법칙') || s2.includes('공식') || s2.includes('By');
  if (s2 && !hasFormula) { w2.textContent='⚠ 사용 공식을 명시하십시오.'; w2.className='step-warn visible warn-red'; }
  else if (s2) { w2.textContent='✓ 공식 명시 확인됨'; w2.className='step-warn visible warn-blue'; }
  const hasTherefore = s4.includes('∴') || s4.includes('따라서');
  if (s4 && !hasTherefore) { w4.textContent='⚠ ∴ 결론 접속사가 없습니다.'; w4.className='step-warn visible warn-red'; }
  else if (s4) { w4.textContent='✓ ∴ 결론 확인됨'; w4.className='step-warn visible warn-blue'; }
  const sys = `당신은 고등학교 대수 수행평가 채점관입니다. 학생의 4단계 서술형 답안을 검토하여:\n①조건 확인 완성도, ②공식 명시 여부, ③등호 정렬 적절성, ④검증 및 ∴ 결론 사용 여부를 기준으로 피드백하십시오.`;
  await callClaude(sys, `문제: ${prob||'미입력'}\n①조건: ${s1||'미입력'}\n②공식: ${s2||'미입력'}\n③전개: ${s3||'미입력'}\n④검증/결론: ${s4||'미입력'}`, el);
  updateS2Rubric(hasLogCond, hasFormula, s3.length>0, hasTherefore);
}
function updateS2Rubric(c1, c2, c3, c4) {
  const states = [!!c1, !!c2, !!c3, !!c4, document.getElementById('s2-step4').value.includes('∴')];
  states.forEach((v,i) => { const el=document.getElementById(`r2-${i}`); if(el) el.classList.toggle('done',v); });
  const n = states.filter(Boolean).length;
  const fill = document.getElementById('s2-bar-fill');
  const txt = document.getElementById('s2-bar-count');
  if (fill) fill.style.width = (n/5*100)+'%';
  if (txt) txt.textContent = `${n} / 5 완료`;
}
function clearStep2() {
  ['s2-problem','s2-step1','s2-step2','s2-step3','s2-step4'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  ['warn-s2-1','warn-s2-2','warn-s2-4'].forEach(id => { const el=document.getElementById(id); if(el) el.className='step-warn'; });
  const fb = document.getElementById('s2-feedback');
  fb.textContent = '4단계를 작성 후 검증을 실행하십시오.';
  fb.classList.remove('has-content');
  bindAutoResizeTextareas(document.getElementById('math-s2'));
}

/* ── STEP 3: 오답 패턴 버튼 데이터 ── */
const s3Patterns = externalS3Patterns.length ? externalS3Patterns : [
  '- 로그방정식: 진수 조건 교집합을 구하지 않아 음수 해를 포함함 (조건 누락)',
  '- 지수방정식: t=2^x 치환 후 t>0 조건 미명시, t=-1을 해로 포함함 (치환 조건 오류)',
  '- 로그 부등식: 밑이 1/3인데 부등호 방향을 유지해서 오답 (방향 역전 미적용)',
  '- 거듭제곱근: n=2(짝수)일 때 √(a²)=|a| 처리 누락, 부호 오류 발생 (절댓값 조건)',
  '- 서술형: 마지막 답에 ∴ 없이 숫자만 써서 결론 감점 (기호 누락)',
  '- 서술형: 등호(=) 세로 정렬이 맞지 않아 채점자 가독성 감점 (형식 오류)',
  '- 로그 계산: 밑 변환 공식에서 분자·분모 순서를 반대로 적용함 (공식 역적용)',
  '- 로그 조건: 밑>0, 밑≠1, 진수>0 세 가지 중 진수 조건만 쓰고 밑 조건 생략 (조건 불완전)'
];
function addS3Pattern(idx) {
  const el = document.getElementById('s3-errors');
  const current = el.value.trim();
  el.value = current ? current + '\n' + s3Patterns[idx] : s3Patterns[idx];
  showToast('오류 유형이 추가됐습니다.');
}
function loadS3Full() {
  document.getElementById('s3-errors').value = s3Patterns.join('\n');
  showToast('전체 예시가 불러와졌습니다. 패턴 분석을 실행하십시오.');
}
function clearS3() {
  document.getElementById('s3-errors').value = '';
  const fb = document.getElementById('s3-feedback');
  fb.textContent = '위 오답 유형을 확인한 후 분석을 실행하십시오.';
  fb.classList.remove('has-content');
  showToast('초기화됐습니다.');
}

/* ── STEP 3: 패턴 분석 ── */
/* ── STEP 3 오답 누적 로그 ── */
const s3ErrorLog = [];

function renderS3ErrorLog() {
  const list = document.getElementById('s3-error-log-list');
  const badge = document.getElementById('s3-error-badge');
  if (badge) badge.textContent = s3ErrorLog.length;
  if (!s3ErrorLog.length) {
    list.innerHTML = '<div class="empty-state">아직 저장된 오답 유형이 없습니다.</div>';
    return;
  }
  list.innerHTML = s3ErrorLog.map((e, i) => `
    <div class="error-card">
      <div class="error-card-header">
        <span class="error-ref">오류 #${i+1} — ${e.date}</span>
        <button class="error-del" onclick="deleteS3Error(${i})">✕</button>
      </div>
      <div class="error-text">${e.text.substring(0,120)}${e.text.length>120?'...':''}</div>
    </div>
  `).join('');
}

function deleteS3Error(i) { s3ErrorLog.splice(i, 1); renderS3ErrorLog(); showToast('삭제됐습니다.'); }
function clearS3Log() { s3ErrorLog.length = 0; renderS3ErrorLog(); showToast('오답 목록을 초기화했습니다.'); }
function exportS3Errors() {
  if (!s3ErrorLog.length) { showToast('저장된 오답이 없습니다.'); return; }
  const text = s3ErrorLog.map((e,i) => `#${i+1} [${e.date}]\n${e.text}`).join('\n\n');
  copyText(text);
}

async function analyzePatterns() {
  const errors = document.getElementById('s3-errors').value.trim();
  const el = document.getElementById('s3-feedback');
  if (!errors) { showToast('오답 유형을 입력하십시오'); return; }
  // 오답 자동 저장
  const now = new Date();
  const dateStr = `${now.getMonth()+1}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  s3ErrorLog.push({ text: errors, date: dateStr });
  renderS3ErrorLog();
  const sys = `당신은 고등학교 대수 수행평가 학습 전략 전문가입니다. 학생의 오답 패턴을 분석하여 취약 개념 우선순위와 3일 이내 집중 복습 계획을 구체적으로 제시하십시오.`;
  await callClaude(sys, errors, el);
}

const mathVariantSets = Array.isArray(window.MATH_VARIANT_SETS) ? window.MATH_VARIANT_SETS : [];
const mathVariantProblemBank = Array.isArray(window.MATH_VARIANT_PROBLEMS) ? window.MATH_VARIANT_PROBLEMS : [];
let currentMathVariantSetId = mathVariantSets[0]?.id || null;

function getMathVariantSet(setId) {
  return mathVariantSets.find((set) => set.id === setId) || mathVariantSets[0] || null;
}

function getMathProblemsForSet(setId) {
  const set = getMathVariantSet(setId);
  if (!set) return [];
  return set.problemIds.map((id) => mathVariantProblemBank.find((problem) => problem.id === id)).filter(Boolean);
}

function renderMathVariantSetButtons() {
  const host = document.getElementById('math-s4-set-buttons');
  if (!host) return;
  host.innerHTML = mathVariantSets.map((set) => `
    <button
      class="btn-secondary variant-set-btn${set.id === currentMathVariantSetId ? ' active' : ''}"
      onclick="selectMathVariantSet('${set.id}')"
    >${set.label}</button>
  `).join('');
}

function renderMathVariantCard(problem, index) {
  const isEssay = problem.kind === 'essay';
  const numberStyle = isEssay
    ? 'background:rgba(245,158,11,0.15);color:var(--warning);border-color:rgba(245,158,11,0.3);'
    : '';
  const tagStyle = isEssay
    ? 'background:rgba(245,158,11,0.12);color:var(--warning);border-color:rgba(245,158,11,0.3);'
    : '';
  const label = isEssay ? '모범 풀이' : '풀이';
  const buttonText = isEssay ? '풀이 확인' : '정답 확인';
  return `
    <div class="ta-problem${isEssay ? ' ta-essay' : ''}" id="${problem.id}">
      <div class="ta-q-row">
        <span class="ta-num" style="${numberStyle}">${index + 1}</span>
        <div class="ta-q-body">
          <div class="ta-q-text">${problem.title}${problem.expression ? `<div class="ta-expr">${problem.expression}</div>` : ''}</div>
          <div class="ta-meta">
            <span class="ta-tag" style="${tagStyle}">${problem.category}</span>
            <span class="ta-pts">${problem.source}</span>
            <span class="ta-pts">${problem.timeHint}</span>
          </div>
        </div>
        <button class="ta-reveal-btn" data-default-label="${buttonText}" onclick="toggleTA('${problem.id}')">${buttonText}</button>
      </div>
      <div class="ta-answer" id="${problem.id}-ans">
        <div class="ta-ans-label"${isEssay ? ' style="color:var(--warning);"' : ''}>${label}</div>
        <div class="ta-ans-reason" style="font-size:0.82rem;line-height:2;">${problem.answerHtml}</div>
        <div class="ta-trap">${problem.trap}</div>
      </div>
    </div>
  `;
}

function renderMathProblemGrid(problems) {
  const grid = document.getElementById('problem-grid');
  if (!grid) return;
  grid.innerHTML = problems.map((problem, index) => `
    <div class="problem-card" id="pc-${index}" onclick="toggleProblem(${index})">
      <div class="pc-num">문제 ${index + 1} <span style="color:var(--text-dim);font-size:0.62rem;">· ${problem.timeHint}</span></div>
      <div class="pc-type">${problem.category}</div>
      <div class="pc-status pending" id="pcs-${index}">미풀이</div>
    </div>
  `).join('');
}

function rerenderMathIn(node) {
  if (!node || typeof renderMathInElement !== 'function') return;
  renderMathInElement(node, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
  });
}

function renderMathVariantSet(setId) {
  const set = getMathVariantSet(setId);
  if (!set) return;
  currentMathVariantSetId = set.id;
  const problems = getMathProblemsForSet(set.id);
  const shortCount = problems.filter((problem) => problem.kind === 'short').length;
  const essayCount = problems.filter((problem) => problem.kind === 'essay').length;
  const summary = document.getElementById('math-s4-set-summary');
  const title = document.getElementById('math-s4-pack-title');
  const meta = document.getElementById('math-s4-pack-meta');
  const list = document.getElementById('math-s4-variant-list');
  const shortLabel = document.getElementById('s4-short-label');
  const shortInput = document.getElementById('s4-short-correct');
  const essayLabel = document.getElementById('s4-essay-label');
  const essayInput = document.getElementById('s4-essay-pct');
  const scoreNote = document.getElementById('s4-score-note');
  const currentShortValue = parseInt(shortInput?.value, 10) || 0;
  const currentEssayValue = parseFloat(essayInput?.value) || 0;
  if (summary) summary.innerHTML = `<strong>${set.title}</strong><br>${set.description}`;
  if (title) title.textContent = set.title;
  if (meta) meta.textContent = `단답형 ${shortCount}문항 · 서술형 ${essayCount}문항 · 총 ${problems.length}문항`;
  if (shortLabel) shortLabel.textContent = shortCount ? `단답형 맞은 개수 (/ ${shortCount})` : '단답형 없음 (이 세트는 서술형 전용)';
  if (shortInput) {
    shortInput.max = String(shortCount || 0);
    shortInput.disabled = shortCount === 0;
    shortInput.value = shortCount ? String(Math.min(Math.max(currentShortValue, 0), shortCount)) : '0';
  }
  if (essayLabel) essayLabel.textContent = essayCount ? '서술형 예상 달성률 (%)' : '서술형 없음 (이 세트는 단답형 전용)';
  if (essayInput) {
    essayInput.disabled = essayCount === 0;
    essayInput.value = essayCount ? String(Math.min(Math.max(currentEssayValue, 0), 100)) : '0';
  }
  if (scoreNote) {
    const scoreParts = [];
    scoreParts.push(shortCount ? '단답형 최대 16점' : '단답형 제외');
    scoreParts.push(essayCount ? '서술형 최대 20점' : '서술형 제외');
    scoreNote.textContent = `현재 선택 세트 기준 환산: ${scoreParts.join(' · ')}`;
  }
  if (list) {
    list.innerHTML = problems.map((problem, index) => renderMathVariantCard(problem, index)).join('');
    rerenderMathIn(list);
  }
  renderMathProblemGrid(problems);
  renderMathVariantSetButtons();
}

function selectMathVariantSet(setId) {
  renderMathVariantSet(setId);
  showToast(`${getMathVariantSet(setId)?.label || '세트'}를 불러왔습니다.`);
}

/* ── STEP 4 타임어택 문제 토글 ── */
function toggleTA(id) {
  const prob = document.getElementById(id);
  if (!prob) return;
  const ans  = document.getElementById(id + '-ans');
  const btn  = prob.querySelector('.ta-reveal-btn');
  if (!ans) return;
  const isOpen = ans.classList.contains('visible');
  ans.classList.toggle('visible', !isOpen);
  prob.classList.toggle('revealed', !isOpen);
  if (btn) {
    btn.textContent = isOpen ? (btn.dataset.defaultLabel || '정답 확인') : '숨기기';
    btn.classList.toggle('open', !isOpen);
  }
}
function revealAllS4() {
  document.querySelectorAll('#math-s4 .ta-answer').forEach(a => {
    a.classList.add('visible');
    const prob = a.closest('.ta-problem');
    if (prob) prob.classList.add('revealed');
    const btn = prob?.querySelector('.ta-reveal-btn');
    if (btn) { btn.textContent = '숨기기'; btn.classList.add('open'); }
  });
  showToast('전체 풀이를 공개했습니다.');
}
function hideAllS4() {
  document.querySelectorAll('#math-s4 .ta-answer').forEach(a => {
    a.classList.remove('visible');
    const prob = a.closest('.ta-problem');
    if (prob) prob.classList.remove('revealed');
    const btn = prob?.querySelector('.ta-reveal-btn');
    if (btn) { btn.textContent = btn.dataset.defaultLabel || '정답 확인'; btn.classList.remove('open'); }
  });
  showToast('전체 풀이를 닫았습니다.');
}

/* ── STEP 4: 타이머 ── */
let timerTotal = 40*60, timerRemaining = timerTotal, timerInterval = null;
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerRemaining--;
    if (timerRemaining <= 0) { timerRemaining=0; clearInterval(timerInterval); timerInterval=null; showToast('⏰ 40분 종료!'); }
    updateTimerDisplay();
  }, 1000);
}
function pauseTimer() { clearInterval(timerInterval); timerInterval=null; }
function resetTimer() { pauseTimer(); timerRemaining=timerTotal; updateTimerDisplay(); }
function updateTimerDisplay() {
  const m=Math.floor(timerRemaining/60), s=timerRemaining%60;
  const display = document.getElementById('timer-display');
  if (display) display.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  const pct = timerRemaining/timerTotal;
  const fill = document.getElementById('timer-bar');
  if (fill) {
    fill.style.width = (pct*100)+'%';
    fill.style.background = timerRemaining<300 ? 'var(--danger)' : timerRemaining<600 ? 'var(--warning)' : 'var(--math-primary)';
  }
}

if (mathVariantSets.length) {
  renderMathVariantSet(currentMathVariantSetId);
}

function toggleProblem(idx) {
  const card = document.getElementById(`pc-${idx}`);
  const status = document.getElementById(`pcs-${idx}`);
  if (!card || !status) return;
  if (card.classList.contains('solved')) {
    card.classList.replace('solved','skipped'); status.textContent='스킵'; status.className='pc-status skip';
  } else if (card.classList.contains('skipped')) {
    card.classList.remove('skipped'); status.textContent='미풀이'; status.className='pc-status pending';
  } else {
    card.classList.add('solved'); status.textContent='완료 ✓'; status.className='pc-status ok';
  }
}
function calcFinalScore() {
  const activeProblems = getMathProblemsForSet(currentMathVariantSetId);
  const shortCount = activeProblems.filter((problem) => problem.kind === 'short').length;
  const essayCount = activeProblems.filter((problem) => problem.kind === 'essay').length;
  const shortInput = document.getElementById('s4-short-correct');
  const essayInput = document.getElementById('s4-essay-pct');
  const shortCorrect = Math.min(Math.max(parseInt(shortInput?.value, 10) || 0, 0), shortCount);
  const essayPct = Math.min(Math.max(parseFloat(essayInput?.value) || 0, 0), 100);
  if (shortInput) shortInput.value = String(shortCorrect);
  if (essayInput) essayInput.value = String(essayPct);
  const shortScore = shortCount ? Math.round((shortCorrect / shortCount) * 16 * 10) / 10 : 0;
  let essayScore = 0;
  if (essayCount) {
    essayScore = 13;
    if (essayPct>=100) essayScore=20; else if (essayPct>=94) essayScore=19;
    else if (essayPct>=88) essayScore=18; else if (essayPct>=82) essayScore=17;
    else if (essayPct>=76) essayScore=16; else if (essayPct>=70) essayScore=15;
    else if (essayPct>=64) essayScore=14;
  }
  const total = shortScore + essayScore;
  const totalMax = (shortCount ? 16 : 0) + (essayCount ? 20 : 0);
  document.getElementById('pred-short').textContent = `${shortScore}점`;
  document.getElementById('pred-essay').textContent = `${essayScore}점`;
  document.getElementById('pred-total').textContent = `${total}점`;
  document.getElementById('score-result').style.display = 'block';
  const pct = totalMax ? (total / totalMax) * 100 : 0;
  let grade, msg, color;
  if (pct >= 97)       { grade='A+'; msg='만점 수준입니다! 실수 없이 제출하세요.'; color='#34d399'; }
  else if (pct >= 92)  { grade='A';  msg='목표 달성권입니다. 서술형 조건 누락만 없으면 됩니다.'; color='#34d399'; }
  else if (pct >= 85)  { grade='B+'; msg='로그 조건과 ∴ 결론 두 가지만 더 안정화하면 A 진입 가능합니다.'; color='#38bdf8'; }
  else if (pct >= 77)  { grade='B';  msg='STEP 3 약점 브리핑으로 최빈출 실수를 다시 묶어 보십시오.'; color='#f59e0b'; }
  else                 { grade='C';  msg='서술형 4단계와 기본 개념 카드 회독을 다시 붙여야 합니다.'; color='#ef4444'; }
  const gtext = document.getElementById('score-grade-text');
  const gmsg  = document.getElementById('score-grade-msg');
  const gbox  = document.getElementById('score-grade-box');
  if (gtext) { gtext.textContent = grade; gtext.style.color = color; }
  if (gmsg)  { gmsg.textContent  = msg; }
  if (gbox)  { gbox.style.borderColor = color + '66'; gbox.style.background = color + '11'; }
  showToast(`예상 합계 ${total}점 — 등급 ${grade}`);
}
