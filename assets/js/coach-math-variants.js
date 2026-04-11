window.MATH_VARIANT_PROBLEMS = [
  {
    id: 'ta-1',
    kind: 'short',
    category: '거듭제곱근',
    source: 'p.12~17 변형',
    timeHint: '3분',
    title: '다음 거듭제곱근 중에서 실수인 것을 모두 구하시오.',
    expression: '(1) $-32$의 다섯제곱근  (2) $16$의 여섯제곱근',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $x^5 = -32$ 이고 $-32 = (-2)^5$ 이므로 홀수 제곱근은 실수 1개입니다.</p>
      <p>$\therefore \sqrt[5]{-32} = -2$</p>
      <hr style="border:none;border-top:1px solid var(--border);margin:0.5rem 0;">
      <p><strong>(2)</strong> $x^6 = 16$ 에서 $n=6$은 짝수이고 $16>0$ 이므로 실수 거듭제곱근은 두 개입니다.</p>
      <p>$\sqrt[6]{16} = \sqrt[6]{2^4} = 2^{4/6} = 2^{2/3}$</p>
      <p class="ta-ans-key">$\therefore$ (1) $-2$  (2) $\pm 2^{2/3}$</p>
    `,
    trap: '⚠ 함정: $\sqrt[6]{16}$ 을 2라고 쓰면 오답입니다. $2$는 $\sqrt[6]{64}$ 입니다.',
  },
  {
    id: 'ta-2',
    kind: 'short',
    category: '거듭제곱근 계산',
    source: 'p.15~17 변형',
    timeHint: '3분',
    title: '다음 식을 간단히 하시오.',
    expression: '(1) $\\sqrt[4]{3} \\times \\sqrt[4]{27}$  (2) $\\dfrac{\\sqrt[3]{250}}{\\sqrt[3]{2}}$  (3) $\\left(\\sqrt[6]{64}\\right)^2$  (4) $\\sqrt[3]{\\sqrt[4]{a^{12}}}$ $(a>0)$',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $\sqrt[4]{3 \times 27} = \sqrt[4]{81} = 3$</p>
      <p><strong>(2)</strong> $\sqrt[3]{\dfrac{250}{2}} = \sqrt[3]{125} = 5$</p>
      <p><strong>(3)</strong> $\sqrt[6]{64} = 2$ 이므로 $(\sqrt[6]{64})^2 = 4$</p>
      <p><strong>(4)</strong> $\sqrt[3]{\sqrt[4]{a^{12}}} = \sqrt[3]{a^3} = a$</p>
      <p class="ta-ans-key">$\therefore$ (1) $3$  (2) $5$  (3) $4$  (4) $a$</p>
    `,
    trap: '⚠ (3)은 괜히 복잡하게 전개하지 말고 $\sqrt[6]{64}=2$를 먼저 보는 게 가장 안전합니다.',
  },
  {
    id: 'ta-3',
    kind: 'short',
    category: '정수 지수',
    source: 'p.18~20 변형',
    timeHint: '3분',
    title: '다음 값을 구하시오.',
    expression: '(1) $(\\sqrt[3]{5})^0 - 3^{-2}$  (2) $(-2)^{-4}$  (3) $\\left(\\dfrac{2}{3}\\right)^{-3}$  (4) $5^3 \\times 5^{-4} \\div 5^{-2}$',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $1 - \dfrac{1}{9} = \dfrac{8}{9}$</p>
      <p><strong>(2)</strong> $(-2)^{-4} = \dfrac{1}{(-2)^4} = \dfrac{1}{16}$</p>
      <p><strong>(3)</strong> $\left(\dfrac{2}{3}\right)^{-3} = \left(\dfrac{3}{2}\right)^3 = \dfrac{27}{8}$</p>
      <p><strong>(4)</strong> $5^{3+(-4)-(-2)} = 5$</p>
      <p class="ta-ans-key">$\therefore$ (1) $\dfrac{8}{9}$  (2) $\dfrac{1}{16}$  (3) $\dfrac{27}{8}$  (4) $5$</p>
    `,
    trap: '⚠ 음의 지수는 분모/분자를 뒤집는 규칙으로 처리해야 합니다.',
  },
  {
    id: 'ta-4',
    kind: 'short',
    category: '유리수 지수',
    source: 'p.21~23 변형',
    timeHint: '4분',
    title: '다음 식을 간단히 하시오. (단, $a>0$, $b>0$)',
    expression: '(1) $3^{-1/2} \\times 3^{3/2}$  (2) $8^{2/3} \\div 4^{1/2}$  (3) $\\left(a^{1/3}b^{-1/2}\\right)^6$  (4) $a^{-3/4}b^{5/4}\\times\\left(a^{-1/4}b^{1/2}\\right)^{-2}$',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $3^{-1/2 + 3/2} = 3$</p>
      <p><strong>(2)</strong> $8^{2/3} = 4$, $4^{1/2} = 2$ 이므로 $2$</p>
      <p><strong>(3)</strong> $a^{2}b^{-3} = \dfrac{a^2}{b^3}$</p>
      <p><strong>(4)</strong> $\left(a^{-1/4}b^{1/2}\right)^{-2} = a^{1/2}b^{-1}$ 이므로 전체는 $a^{-1/4}b^{1/4}$</p>
      <p class="ta-ans-key">$\therefore$ (1) $3$  (2) $2$  (3) $\dfrac{a^2}{b^3}$  (4) $\dfrac{b^{1/4}}{a^{1/4}}$</p>
    `,
    trap: '⚠ 괄호 전체에 음수 지수를 곱할 때 부호가 뒤집히는 점을 자주 놓칩니다.',
  },
  {
    id: 'ta-5',
    kind: 'short',
    category: '지수법칙 종합',
    source: '중단원 변형',
    timeHint: '4분',
    title: '양수 $x$에 대하여 $x^{1/2} + x^{-1/2} = 4$ 일 때, $x^2 + x^{-2}$ 의 값을 구하시오.',
    expression: '',
    answerHtml: String.raw`
      <p><strong>1단계</strong> $\left(x^{1/2} + x^{-1/2}\right)^2 = x + 2 + x^{-1} = 16$</p>
      <p>$\therefore x + x^{-1} = 14$</p>
      <p><strong>2단계</strong> $(x + x^{-1})^2 = x^2 + 2 + x^{-2} = 196$</p>
      <p>$\therefore x^2 + x^{-2} = 194$</p>
      <p class="ta-ans-key">$\therefore 194$</p>
    `,
    trap: '⚠ 중간값 $x + x^{-1}$ 를 한 번 거쳐야 안정적으로 풀립니다.',
  },
  {
    id: 'ta-6',
    kind: 'short',
    category: '로그 정의',
    source: 'p.26~27 변형',
    timeHint: '3분',
    title: '다음 값을 구하시오.',
    expression: '(1) $\\log_3 243$  (2) $\\log_{1/2} 8$  (3) $\\log_4 \\sqrt[3]{16}$  (4) $\\log_8 \\dfrac{1}{32}$',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $3^x = 243 = 3^5$ 이므로 $5$</p>
      <p><strong>(2)</strong> $(1/2)^x = 8 = 2^3 = (1/2)^{-3}$ 이므로 $-3$</p>
      <p><strong>(3)</strong> $4^x = 16^{1/3} = 2^{4/3}$, $4^x = 2^{2x}$ 이므로 $x = 2/3$</p>
      <p><strong>(4)</strong> $8^x = 1/32 = 2^{-5}$, $8^x = 2^{3x}$ 이므로 $x = -5/3$</p>
      <p class="ta-ans-key">$\therefore$ (1) $5$  (2) $-3$  (3) $\dfrac{2}{3}$  (4) $-\dfrac{5}{3}$</p>
    `,
    trap: '⚠ 밑이 $1/2$일 때 지수가 음수로 바뀌는 감각을 놓치기 쉽습니다.',
  },
  {
    id: 'ta-7',
    kind: 'short',
    category: '로그 성질 계산',
    source: 'p.28~29 변형',
    timeHint: '4분',
    title: '다음 값을 구하시오.',
    expression: '(1) $3\\log_2 4 + \\log_2 \\dfrac{1}{2}$  (2) $2\\log_3 \\sqrt{6} - \\log_3 2 + \\log_3 \\sqrt{3}$',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $3\log_2 4 + \log_2 \dfrac{1}{2} = 3 \cdot 2 + (-1) = 5$</p>
      <p><strong>(2)</strong> $2\log_3 \sqrt{6} = \log_3 6$, $\log_3 \sqrt{3} = 1/2$</p>
      <p>$\log_3 6 - \log_3 2 + 1/2 = \log_3 3 + 1/2 = 3/2$</p>
      <p class="ta-ans-key">$\therefore$ (1) $5$  (2) $\dfrac{3}{2}$</p>
    `,
    trap: '⚠ 근호 안의 로그는 먼저 거듭제곱 법칙으로 바꾸면 계산이 훨씬 쉬워집니다.',
  },
  {
    id: 'ta-8',
    kind: 'short',
    category: '밑 변환 공식',
    source: 'p.30~31 변형',
    timeHint: '3분',
    title: '다음 값을 구하시오.',
    expression: '(1) $\\log_4 8$  (2) $\\log_9 27$  (3) $(\\log_2 3)(\\log_3 8)$',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $\log_4 8 = \dfrac{\log_2 8}{\log_2 4} = \dfrac{3}{2}$</p>
      <p><strong>(2)</strong> $\log_9 27 = \dfrac{\log_3 27}{\log_3 9} = \dfrac{3}{2}$</p>
      <p><strong>(3)</strong> $(\log_2 3)(\log_3 8) = \log_2 8 = 3$</p>
      <p class="ta-ans-key">$\therefore$ (1) $\dfrac{3}{2}$  (2) $\dfrac{3}{2}$  (3) $3$</p>
    `,
    trap: '⚠ 체인 형태 $(\\log_a b)(\\log_b c)=\\log_a c$ 를 바로 떠올리면 훨씬 빠릅니다.',
  },
  {
    id: 'ta-9',
    kind: 'short',
    category: 'a,b 표현',
    source: 'p.31 변형',
    timeHint: '4분',
    title: '$\\log_5 2 = a$, $\\log_5 7 = b$ 일 때 다음을 $a$, $b$ 로 나타내시오.',
    expression: '(1) $\\log_5 28$  (2) $\\log_{35} 4$',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $\log_5 28 = \log_5 (2^2 \times 7) = 2a + b$</p>
      <p><strong>(2)</strong> $\log_{35} 4 = \dfrac{\log_5 4}{\log_5 35} = \dfrac{2a}{1+b}$</p>
      <p class="ta-ans-key">$\therefore$ (1) $2a+b$  (2) $\dfrac{2a}{1+b}$</p>
    `,
    trap: '⚠ $\log_5 35 = 1+b$ 를 빼먹으면 식이 바로 무너집니다.',
  },
  {
    id: 'ta-10',
    kind: 'short',
    category: '상용로그',
    source: 'p.33~35 변형',
    timeHint: '3분',
    title: '$\\log 3.16 = 0.4997$ 일 때 다음 값을 구하시오.',
    expression: '(1) $\\log 31.6$  (2) $\\log 0.00316$',
    answerHtml: String.raw`
      <p><strong>(1)</strong> $\log(3.16 \times 10^1) = 0.4997 + 1 = 1.4997$</p>
      <p><strong>(2)</strong> $\log(3.16 \times 10^{-3}) = 0.4997 - 3 = -2.5003$</p>
      <p class="ta-ans-key">$\therefore$ (1) $1.4997$  (2) $-2.5003$</p>
    `,
    trap: '⚠ (2)는 지표가 $-3$, 가수가 $0.4997$ 이라서 $-2.5003$ 입니다.',
  },
  {
    id: 'ta-11',
    kind: 'essay',
    category: '서술형 대비',
    source: '로그방정식 변형',
    timeHint: '5분',
    title: '다음 방정식을 풀고, 풀이 과정을 4단계로 서술하시오.',
    expression: '$\\log_3(x-2) + \\log_3(x+2) = 2$',
    answerHtml: String.raw`
      <p><strong>① 조건 확인</strong><br/>밑: $3>0$, $3\neq1$ ✓<br/>진수 조건: $x-2>0 \Rightarrow x>2$, $x+2>0 \Rightarrow x>-2$<br/>공통 조건: $x>2$</p>
      <p><strong>② 공식 명시</strong><br/>로그의 곱 법칙에 의해 $\log_3 MN = \log_3 M + \log_3 N$</p>
      <p><strong>③ 전개</strong><br/>$\log_3\{(x-2)(x+2)\} = 2$<br/>$(x-2)(x+2)=3^2=9$<br/>$x^2-4=9$<br/>$x^2=13$<br/>$x=\pm\sqrt{13}$</p>
      <p><strong>④ 검증 + 결론</strong><br/>공통 조건 $x>2$ 에서 $-\sqrt{13}$ 은 제외, $\sqrt{13}>2$ 이므로 가능.<br/>$\therefore x=\sqrt{13}$</p>
    `,
    trap: '⚠ 로그를 합친 뒤에도 반드시 진수 조건으로 해를 다시 걸러야 합니다.',
  },
  {
    id: 'ta-12',
    kind: 'essay',
    category: '서술형 대비',
    source: '로그부등식 변형',
    timeHint: '5분',
    title: '다음 부등식을 풀고, 풀이 과정을 4단계로 서술하시오.',
    expression: '$\\log_{1/2}(x-1) > -3$',
    answerHtml: String.raw`
      <p><strong>① 조건 확인</strong><br/>밑: $1/2>0$, $1/2\neq1$ ✓<br/>진수 조건: $x-1>0 \Rightarrow x>1$</p>
      <p><strong>② 공식 명시</strong><br/>밑이 $0<a<1$ 인 로그함수는 감소하므로 부등호 방향이 역전됩니다.</p>
      <p><strong>③ 전개</strong><br/>$\log_{1/2}(x-1) > -3$ 이므로<br/>$x-1 < (1/2)^{-3} = 8$<br/>$\therefore x < 9$</p>
      <p><strong>④ 검증 + 결론</strong><br/>진수 조건 $x>1$ 과 결합하면<br/>$\therefore 1 < x < 9$</p>
    `,
    trap: '⚠ 밑이 $1/2$ 라서 부등호를 뒤집는 단계가 핵심입니다.',
  },
];

window.MATH_VARIANT_SETS = [
  {
    id: 'all',
    label: '전체 세트',
    title: '교과서 변형 전체 세트',
    description: '거듭제곱근, 지수의 확장, 로그, 상용로그, 서술형까지 한 번에 점검하는 12문제 세트입니다.',
    problemIds: ['ta-1', 'ta-2', 'ta-3', 'ta-4', 'ta-5', 'ta-6', 'ta-7', 'ta-8', 'ta-9', 'ta-10', 'ta-11', 'ta-12'],
  },
  {
    id: 'roots-exp',
    label: '근호·지수',
    title: '거듭제곱근·지수 집중 세트',
    description: '거듭제곱근, 정수 지수, 유리수 지수, 지수법칙 종합 문제만 묶은 빠른 세트입니다.',
    problemIds: ['ta-1', 'ta-2', 'ta-3', 'ta-4', 'ta-5'],
  },
  {
    id: 'logs-common',
    label: '로그·상용로그',
    title: '로그·상용로그 집중 세트',
    description: '로그 정의, 로그 성질, 밑 변환, a·b 표현, 상용로그를 묶은 세트입니다.',
    problemIds: ['ta-6', 'ta-7', 'ta-8', 'ta-9', 'ta-10'],
  },
  {
    id: 'essay',
    label: '서술형 2문제',
    title: '서술형 4단계 집중 세트',
    description: '조건 확인 → 공식 명시 → 전개 → 검증/결론 흐름을 연습하는 서술형 세트입니다.',
    problemIds: ['ta-11', 'ta-12'],
  },
];
