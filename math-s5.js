window.MATH_S5 = String.raw`<div id="math-s5" class="inner-panel" style="display:none;">
    <h2 class="panel-title">🧠 핵심 공식 암기 카드</h2>
    <p class="panel-desc">카드를 클릭하면 공식이 공개됩니다. 시험 전날 이 페이지에서 빠르게 점검하십시오.</p>

    <div class="mc">
      <div class="mc-title">📐 지수·로그 핵심 (탭하여 확인)</div>
      <div class="formula-cards">
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">로그의 정의란?</div>
          <div class="fc-a">$a^b = N \Leftrightarrow \log_a N = b$ (단, $a>0, a\neq1, N>0$)</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">로그의 곱·나눗셈 법칙은?</div>
          <div class="fc-a">$\log_a MN = \log_a M + \log_a N$<br/>$\log_a \frac{M}{N} = \log_a M - \log_a N$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">로그의 거듭제곱 법칙은?</div>
          <div class="fc-a">$\log_a M^k = k \log_a M$ (단, $M>0$)</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">밑 변환 공식은?</div>
          <div class="fc-a">$\log_a b = \frac{\log_c b}{\log_c a}$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">거듭제곱근 (n이 짝수일 때)?</div>
          <div class="fc-a">$\sqrt[n]{a^n} = |a|$ (절댓값 처리)</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">거듭제곱근 (n이 홀수일 때)?</div>
          <div class="fc-a">$\sqrt[n]{a^n} = a$ (부호 그대로)</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">서술형 4단계 구조는?</div>
          <div class="fc-a">①조건 확인 → ②공식 명시 → ③전개(등호 정렬) → ④검증 + ∴ 결론</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">로그 부등식에서 밑이 1보다 작을 때?</div>
          <div class="fc-a">부등호 방향이 뒤집힌다. $0 &lt; a &lt; 1$이면 $\log_a x > \log_a y \Rightarrow x &lt; y$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
      </div>
      <div class="btn-row" style="margin-top:1rem;">
        <button class="btn-secondary" onclick="document.querySelectorAll('#math-s5 .formula-cards .formula-card').forEach(c=>c.classList.remove('revealed'))">🔄 전체 초기화</button>
        <button class="btn-secondary" onclick="document.querySelectorAll('#math-s5 .formula-cards .formula-card').forEach(c=>c.classList.add('revealed'))">👁 전체 공개</button>
      </div>
    </div>

    <!-- 빠른 암산 연습 카드 -->
    <div class="mc">
      <div class="mc-title">⚡ 빠른 암산 연습 <span style="font-size:0.72rem;font-weight:400;color:var(--text-dim);">(탭하여 답 확인)</span></div>
      <div class="formula-cards">
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$\log_3 81$ = ?</div>
          <div class="fc-a">$\log_3 3^4 = 4$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$\log_2 \frac{1}{8}$ = ?</div>
          <div class="fc-a">$\log_2 2^{-3} = -3$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$\log_5 1$ = ?</div>
          <div class="fc-a">$\log_a 1 = 0$ (임의의 밑에서 성립)<br/>∴ $0$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$2^{3/2}$ 를 루트로 표현하면?</div>
          <div class="fc-a">$2^{3/2} = \sqrt{2^3} = \sqrt{8} = 2\sqrt{2}$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$\log_6 2 + \log_6 3$ = ?</div>
          <div class="fc-a">$\log_6 (2 \times 3) = \log_6 6 = 1$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$(\sqrt[3]{5})^6$ = ?</div>
          <div class="fc-a">$(5^{1/3})^6 = 5^{6/3} = 5^2 = 25$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">지수방정식 $3^{2x} = 27$ 의 해는?</div>
          <div class="fc-a">$3^{2x} = 3^3$<br/>$2x = 3$<br/>∴ $x = \dfrac{3}{2}$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$\log_{1/2} x > -3$ 의 해는?</div>
          <div class="fc-a">밑 $\frac{1}{2} &lt; 1$이므로 부등호 역전:<br/>$x &lt; \left(\frac{1}{2}\right)^{-3} = 2^3 = 8$<br/>진수 조건 $x > 0$ 결합<br/>∴ $0 &lt; x &lt; 8$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
      </div>
    </div>

    <!-- 지수·로그 함수 그래프 특성 카드 -->
    <div class="mc">
      <div class="mc-title">📈 지수·로그 함수 그래프 특성 <span style="font-size:0.72rem;font-weight:400;color:var(--text-dim);">(탭하여 확인)</span></div>
      <div class="formula-cards">
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$y=a^x$ (a&gt;1) 그래프 특징은?</div>
          <div class="fc-a">
            • 정의역: 모든 실수 / 치역: $y>0$<br/>
            • 점 $(0,1)$ 통과<br/>
            • 수평 점근선: $y=0$ (x축)<br/>
            • $x$ 증가 → $y$ 증가 (증가함수)
          </div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$y=a^x$ (0&lt;a&lt;1) 그래프 특징은?</div>
          <div class="fc-a">
            • 정의역: 모든 실수 / 치역: $y>0$<br/>
            • 점 $(0,1)$ 통과<br/>
            • 수평 점근선: $y=0$ (x축)<br/>
            • $x$ 증가 → $y$ 감소 (감소함수)
          </div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$y=\log_a x$ (a&gt;1) 그래프 특징은?</div>
          <div class="fc-a">
            • 정의역: $x>0$ / 치역: 모든 실수<br/>
            • 점 $(1,0)$ 통과<br/>
            • 수직 점근선: $x=0$ (y축)<br/>
            • 증가함수
          </div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$y=2^{x-p}+q$ 평행이동은?</div>
          <div class="fc-a">
            $y=2^x$를 $x$축 방향으로 $+p$, $y$축 방향으로 $+q$ 평행이동<br/>
            → 점근선: $y=q$<br/>
            → 기준점: $(p,\,q+1)$ 통과
          </div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">지수함수 $y=2^x$와 로그함수 $y=\log_2 x$의 관계는?</div>
          <div class="fc-a">
            서로 역함수 관계.<br/>
            직선 $y=x$에 대해 대칭.<br/>
            지수: $(0,1),(1,2),(2,4)$ → 로그: $(1,0),(2,1),(4,2)$
          </div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">$\log_a b = c$ 의미 3가지로 말하기</div>
          <div class="fc-a">
            ① "$a$를 $c$번 곱하면 $b$가 된다"<br/>
            ② "$a^c = b$" (지수 형태)<br/>
            ③ "밑이 $a$인 로그로 $b$를 보면 $c$"<br/>
            → 조건: $a>0, a
eq1, b>0$
          </div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
      </div>
      <div class="btn-row" style="margin-top:1rem;">
        <button class="btn-secondary" onclick="document.querySelectorAll('#s5-graph .formula-card').forEach(c=>c.classList.remove('revealed'))">🔄 전체 초기화</button>
        <button class="btn-secondary" onclick="document.querySelectorAll('#s5-graph .formula-card').forEach(c=>c.classList.add('revealed'))">👁 전체 공개</button>
      </div>
    </div>

    <!-- 서술형 실수 방지 최종 체크 카드 -->
    <div class="mc">
      <div class="mc-title">⚡ 서술형 실수 방지 — 5초 최종 체크카드 <span style="font-size:0.72rem;font-weight:400;color:var(--text-dim);">(탭하여 확인)</span></div>
      <div class="formula-cards">
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">로그 문제 풀기 전 첫 줄에 쓸 것은?</div>
          <div class="fc-a">밑: $a>0$, $a
eq1$ ✓<br/>진수: (진수식) $>0$ → $x>...$<br/>여러 진수면 교집합까지</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">치환 $t=2^x$ 사용 시 반드시 쓸 것은?</div>
          <div class="fc-a">$t=2^x>0$ (지수함수는 항상 양수)<br/>→ 음수 해($t=-1$ 등)는 반드시 제거<br/>→ 제거 근거도 한 줄로 명시</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">서술형 마지막 줄 형식은?</div>
          <div class="fc-a">검산: $x=...$이 조건 $x>...$를 만족 ✓<br/>결론: ∴ $x=...$<br/>※ ∴ 없으면 -1점!</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">거듭제곱근 $\sqrt[n]{a^n}$ — n에 따라 다른 점은?</div>
          <div class="fc-a">$n$ 짝수: $\sqrt[n]{a^n}=|a|$ (절댓값 필수!)<br/>$n$ 홀수: $\sqrt[n]{a^n}=a$ (부호 그대로)<br/>예: $\sqrt{(-3)^2}=|-3|=3$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">로그 부등식 — 부등호 방향 결정 규칙은?</div>
          <div class="fc-a">밑 $>1$: 부등호 방향 유지<br/>밑 $0&lt;a&lt;1$: 부등호 방향 역전 ⚠<br/>예: $\log_{1/2}x>-3$ → $x&lt;8$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
        <div class="formula-card" onclick="this.classList.toggle('revealed')">
          <div class="fc-q">밑이 다른 로그 계산 — 전략은?</div>
          <div class="fc-a">밑 변환 공식: $\log_a b=\dfrac{\log_c b}{\log_c a}$<br/>"구하려는 것(b)이 분자"<br/>예: $\log_2 3 	imes \log_3 8 = \log_2 8 = 3$</div>
          <div class="fc-hint">탭하여 확인</div>
        </div>
      </div>
    </div>
  </div><!-- /math-s5 -->`;
