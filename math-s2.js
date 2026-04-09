window.MATH_S2 = String.raw`<div id="math-s2" class="inner-panel" style="display:none;">
    <h2 class="panel-title">📝 서술형 4단계 방어</h2>
    <p class="panel-desc">채점관은 각 단계의 논리와 기호를 봅니다. 4단계 구조를 습관화하십시오.</p>

    <div class="alert-box alert-info">
      <strong>서술형 4단계 공식:</strong> ①조건 확인 → ②공식 명시 → ③전개(등호 정렬) → ④검증 + ∴ 결론
    </div>
    <div class="mc">
      <div class="mc-title">서술형에서 특히 봐야 할 것</div>
      <div class="guide-grid">
        <div class="guide-panel math">
          <div class="guide-kicker">Focus</div>
          <div class="guide-title">채점관이 실제로 보는 부분</div>
          <div class="guide-list">
            <div class="guide-item">조건을 적었는지, 공식 이름이나 근거를 밝혔는지, 결론 전에 검산을 했는지 봅니다.</div>
            <div class="guide-item">풀이가 맞아도 <strong>논리 점프</strong>가 있으면 감점될 수 있습니다.</div>
          </div>
        </div>
        <div class="guide-panel math">
          <div class="guide-kicker">Teacher Question</div>
          <div class="guide-title">선생님께 확인할 질문</div>
          <div class="guide-ask">
            <strong>이 유형은 공식 이름만 써도 되나요, 아니면 왜 쓰는지도 적어야 하나요?</strong>
            <strong>검산은 마지막 줄에 한 문장으로 써도 인정되나요?</strong>
          </div>
        </div>
      </div>
      <div class="guide-example math">
        <div class="guide-example-head">서술형 예시</div>
        <div class="guide-example-body">
          <div><strong>나쁜 답안:</strong> <code>x-1=8, x=9</code></div>
          <div><strong>좋은 답안:</strong> <code>x-1&gt;0</code>이므로 <code>x&gt;1</code>. 로그의 정의에 의해 <code>x-1=2³</code>. 따라서 <code>x=9</code>. <code>x=9</code>는 <code>x&gt;1</code>을 만족한다. <code>∴ x=9</code></div>
        </div>
      </div>
    </div>

    <!-- 빠른 문제 선택 -->
    <div class="mc" style="margin-bottom:0.75rem;">
      <div class="mc-title" style="margin-bottom:0.6rem;">⚡ 서술형 연습 문제 — 바로 불러오기</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(0)">① 로그방정식 기본형</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(1)">② 지수방정식 치환형</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(2)">③ 로그 부등식</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(3)">④ 지수함수 그래프</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(4)">⑤ 로그 값 계산</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(5)">⑥ 지수방정식 고급형</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(6)">⑦ 로그 부등식 응용</button>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="mc">
          <div class="mc-title">문제 입력</div>
          <textarea class="field-input" id="s2-problem" rows="3">log₂(x-1) + log₂(x+1) = 3 을 만족하는 x의 값을 구하시오. (서술형 6점)</textarea>
        </div>
        <div class="step4-grid">
          <div class="step-block">
            <div class="step-block-header">
              <div class="step-num-badge s1">①</div>
              <div><div class="step-name">조건 확인</div></div>
              <span class="step-hint">밑 &gt; 0, 밑 ≠ 1, 진수 &gt; 0</span>
            </div>
            <div class="step-block-body">
              <textarea class="field-input" id="s2-step1" rows="3">밑: 2 > 0, 2 ≠ 1 ✓
진수 조건: x-1 > 0 → x > 1 … ①
         x+1 > 0 → x > -1 … ②
공통 조건 (교집합): x > 1</textarea>
              <div class="step-warn" id="warn-s2-1"></div>
            </div>
          </div>
          <div class="step-block">
            <div class="step-block-header">
              <div class="step-num-badge s2">②</div>
              <div><div class="step-name">공식 명시</div></div>
              <span class="step-hint">로그·지수 법칙 명시</span>
            </div>
            <div class="step-block-body">
              <textarea class="field-input" id="s2-step2" rows="3">로그의 곱 법칙에 의해
log₂MN = log₂M + log₂N 을 역방향 적용</textarea>
              <div class="step-warn" id="warn-s2-2"></div>
            </div>
          </div>
          <div class="step-block">
            <div class="step-block-header">
              <div class="step-num-badge s3">③</div>
              <div><div class="step-name">전개 (등호 정렬)</div></div>
              <span class="step-hint">= 위치 일치시킬 것</span>
            </div>
            <div class="step-block-body">
              <textarea class="field-input" id="s2-step3" rows="5">log₂(x-1)(x+1) = 3
       (x-1)(x+1) = 2³ = 8
            x² - 1 = 8
                x² = 9
                 x = ±3</textarea>
            </div>
          </div>
          <div class="step-block">
            <div class="step-block-header">
              <div class="step-num-badge s4">④</div>
              <div><div class="step-name">검증 + ∴ 결론</div></div>
              <span class="step-hint">∴ 접속사 필수</span>
            </div>
            <div class="step-block-body">
              <textarea class="field-input" id="s2-step4" rows="3">x > 1 조건에서 x = -3 제외.
x = 3 은 진수 3-1=2>0, 3+1=4>0 만족 ✓
∴ x = 3</textarea>
              <div class="step-warn" id="warn-s2-4"></div>
            </div>
          </div>
        </div>
        <div class="btn-row">
          <button class="btn-primary math" onclick="analyzeStep2()">🤖 4단계 검증 &amp; AI 채점</button>
          <button class="btn-secondary" onclick="clearStep2()">초기화</button>
        </div>
        <div class="mc" style="margin-top:0.75rem;">
          <div class="ai-label" style="color:var(--math-primary);">AI 채점 결과</div>
          <div class="ai-feedback" id="s2-feedback">4단계를 작성 후 검증을 실행하십시오.</div>
        </div>
      </div>
      <div>
        <div class="rubric-side">
          <h4>서술형 채점 기준</h4>
          <div id="r2-0" class="rubric-item math"><span class="ri-check">✓</span><span>조건 명시됨 (밑·진수 조건)</span></div>
          <div id="r2-1" class="rubric-item math"><span class="ri-check">✓</span><span>공식 출처 명시됨</span></div>
          <div id="r2-2" class="rubric-item math"><span class="ri-check">✓</span><span>전개 단계 완성됨</span></div>
          <div id="r2-3" class="rubric-item math"><span class="ri-check">✓</span><span>검증 과정 포함됨</span></div>
          <div id="r2-4" class="rubric-item math"><span class="ri-check">✓</span><span>∴ 결론 접속사 사용됨</span></div>
          <div class="rubric-bar-wrap">
            <div class="rubric-bar-track"><div class="rubric-bar-fill" id="s2-bar-fill" style="background:var(--math-primary);"></div></div>
            <p class="rubric-count-text" id="s2-bar-count">0 / 5 완료</p>
          </div>
        </div>
        <!-- 핵심 공식 퀵뷰 -->
        <div class="mc" style="margin-top:0.75rem;">
          <div class="mc-title">핵심 공식 퀵뷰</div>
          <div class="formula-box">
            <div class="formula-label">로그 기본 성질</div>
            $\log_a MN = \log_a M + \log_a N$<br/>
            $\log_a \frac{M}{N} = \log_a M - \log_a N$<br/>
            $\log_a M^k = k\log_a M$
          </div>
          <div class="formula-box">
            <div class="formula-label">로그 조건 (필수 명시)</div>
            밑: $a > 0$, $a \neq 1$ &nbsp;|&nbsp; 진수: $M > 0$
          </div>
          <div class="formula-box">
            <div class="formula-label">지수 법칙</div>
            $a^m \cdot a^n = a^{m+n}$ &nbsp;|&nbsp; $(a^m)^n = a^{mn}$<br/>
            $\frac{a^m}{a^n} = a^{m-n}$
          </div>
        </div>
      </div>
    </div>
    <!-- ══ 예시 문제 세트 ══ -->
    <div class="mc" style="margin-top:1.25rem;">
      <div class="mc-title">📝 고2 대수 — 수행평가 예시 문제 세트 <span style="font-size:0.72rem;font-weight:400;color:var(--text-dim);">(클릭하면 풀이 공개)</span></div>
      <div class="alert-box alert-info" style="margin-bottom:1rem;">아래 문제들을 직접 STEP 2 입력창에 옮겨 4단계 풀이를 연습하십시오.</div>

      <!-- 문제 1 -->
      <div class="formula-card" onclick="this.classList.toggle('revealed')" style="margin-bottom:0.75rem;">
        <div class="fc-q">
          <span style="font-size:0.7rem;color:var(--math-primary);font-weight:700;display:block;margin-bottom:0.3rem;">【문제 1】 로그방정식 — 서술형 6점</span>
          다음 방정식을 푸시오.<br/>
          $\log_2(x-1) + \log_2(x+1) = 3$
        </div>
        <div class="fc-a" style="font-size:0.83rem;line-height:2;">
          <strong>① 조건 확인</strong><br/>
          밑: $2 > 0$, $2 \neq 1$ ✓<br/>
          진수 조건: $x-1 > 0 \Rightarrow x > 1$ … ①<br/>
          &emsp;&emsp;&emsp;&emsp;&emsp;$x+1 > 0 \Rightarrow x > -1$ … ②<br/>
          ①, ②의 교집합: $x > 1$<br/><br/>
          <strong>② 공식 명시</strong><br/>
          로그의 곱 법칙에 의해: $\log_2 MN = \log_2 M + \log_2 N$<br/><br/>
          <strong>③ 전개 (등호 정렬)</strong><br/>
          $\log_2(x-1)(x+1) = 3$<br/>
          $(x-1)(x+1) = 2^3 = 8$<br/>
          $x^2 - 1 = 8$<br/>
          $x^2 = 9$<br/>
          $x = \pm 3$<br/><br/>
          <strong>④ 검증 + ∴ 결론</strong><br/>
          $x > 1$ 조건에서 $x = -3$ 제외.<br/>
          $x = 3$: 진수 $3-1=2>0$, $3+1=4>0$ 만족 ✓<br/>
          ∴ $x = 3$
        </div>
        <div class="fc-hint">탭하여 풀이 공개</div>
      </div>

      <!-- 문제 2 -->
      <div class="formula-card" onclick="this.classList.toggle('revealed')" style="margin-bottom:0.75rem;">
        <div class="fc-q">
          <span style="font-size:0.7rem;color:var(--math-primary);font-weight:700;display:block;margin-bottom:0.3rem;">【문제 2】 지수방정식 — 서술형 6점</span>
          다음 방정식을 푸시오.<br/>
          $4^x - 3 \cdot 2^x - 4 = 0$
        </div>
        <div class="fc-a" style="font-size:0.83rem;line-height:2;">
          <strong>① 조건 확인</strong><br/>
          $4^x = (2^2)^x = (2^x)^2$ 로 치환 준비. $t = 2^x$로 놓으면 $t > 0$ (지수함수는 항상 양수).<br/><br/>
          <strong>② 공식 명시</strong><br/>
          지수법칙 $(a^m)^n = a^{mn}$ 적용 및 $t = 2^x$ 치환.<br/><br/>
          <strong>③ 전개 (등호 정렬)</strong><br/>
          $t^2 - 3t - 4 = 0$<br/>
          $(t-4)(t+1) = 0$<br/>
          $t = 4$ 또는 $t = -1$<br/><br/>
          <strong>④ 검증 + ∴ 결론</strong><br/>
          $t > 0$ 조건에서 $t = -1$ 제외.<br/>
          $t = 4$이면 $2^x = 4 = 2^2$<br/>
          ∴ $x = 2$
        </div>
        <div class="fc-hint">탭하여 풀이 공개</div>
      </div>

      <!-- 문제 3 -->
      <div class="formula-card" onclick="this.classList.toggle('revealed')" style="margin-bottom:0.75rem;">
        <div class="fc-q">
          <span style="font-size:0.7rem;color:var(--math-primary);font-weight:700;display:block;margin-bottom:0.3rem;">【문제 3】 로그 부등식 — 서술형 8점</span>
          다음 부등식을 푸시오.<br/>
          $\log_{1/3}(2x-1) \geq \log_{1/3}(x+2)$
        </div>
        <div class="fc-a" style="font-size:0.83rem;line-height:2;">
          <strong>① 조건 확인</strong><br/>
          밑: $\frac{1}{3} > 0$, $\frac{1}{3} \neq 1$ ✓<br/>
          진수 조건: $2x-1 > 0 \Rightarrow x > \frac{1}{2}$ … ①<br/>
          &emsp;&emsp;&emsp;&emsp;&emsp;$x+2 > 0 \Rightarrow x > -2$ … ②<br/>
          공통 조건: $x > \frac{1}{2}$<br/><br/>
          <strong>② 공식 명시</strong><br/>
          밑 $0 &lt; a &lt; 1$이면 $\log_a M \geq \log_a N \Rightarrow M \leq N$ (부등호 방향 역전).<br/><br/>
          <strong>③ 전개 (등호 정렬)</strong><br/>
          $2x-1 \leq x+2$<br/>
          $x \leq 3$<br/><br/>
          <strong>④ 검증 + ∴ 결론</strong><br/>
          진수 조건 $x > \frac{1}{2}$와 결합:<br/>
          ∴ $\frac{1}{2} &lt; x \leq 3$
        </div>
        <div class="fc-hint">탭하여 풀이 공개</div>
      </div>

      <!-- 문제 4 -->
      <div class="formula-card" onclick="this.classList.toggle('revealed')" style="margin-bottom:0.75rem;">
        <div class="fc-q">
          <span style="font-size:0.7rem;color:var(--math-primary);font-weight:700;display:block;margin-bottom:0.3rem;">【문제 4】 거듭제곱근 + 지수 계산 — 단답형 4점</span>
          다음을 계산하시오.<br/>
          $\sqrt[3]{2} \times \sqrt[4]{2} \div \sqrt[6]{2}$
        </div>
        <div class="fc-a" style="font-size:0.83rem;line-height:2;">
          <strong>① 조건 확인</strong><br/>
          밑이 모두 $2 > 0$으로 동일. 거듭제곱근을 분수 지수로 변환 가능.<br/><br/>
          <strong>② 공식 명시</strong><br/>
          $\sqrt[n]{a} = a^{1/n}$, 지수법칙 $a^m \cdot a^n = a^{m+n}$, $\frac{a^m}{a^n} = a^{m-n}$ 적용.<br/><br/>
          <strong>③ 전개 (등호 정렬)</strong><br/>
          $= 2^{1/3} \times 2^{1/4} \div 2^{1/6}$<br/>
          $= 2^{1/3 + 1/4 - 1/6}$<br/>
          $= 2^{4/12 + 3/12 - 2/12}$<br/>
          $= 2^{5/12}$<br/><br/>
          <strong>④ ∴ 결론</strong><br/>
          ∴ $2^{5/12} = \sqrt[12]{2^5} = \sqrt[12]{32}$
        </div>
        <div class="fc-hint">탭하여 풀이 공개</div>
      </div>

      <!-- 문제 5 -->
      <div class="formula-card" onclick="this.classList.toggle('revealed')" style="margin-bottom:0.75rem;">
        <div class="fc-q">
          <span style="font-size:0.7rem;color:var(--math-primary);font-weight:700;display:block;margin-bottom:0.3rem;">【문제 5】 로그 값 계산 — 단답형 4점</span>
          $\log 2 = a$, $\log 3 = b$ 로 놓을 때, $\log 72$ 를 $a$, $b$로 나타내시오.
        </div>
        <div class="fc-a" style="font-size:0.83rem;line-height:2;">
          <strong>① 소인수 분해</strong><br/>
          $72 = 8 \times 9 = 2^3 \times 3^2$<br/><br/>
          <strong>② 공식 명시</strong><br/>
          로그 곱 법칙: $\log_a MN = \log_a M + \log_a N$<br/>
          거듭제곱 법칙: $\log_a M^k = k\log_a M$<br/><br/>
          <strong>③ 전개</strong><br/>
          $\log 72 = \log(2^3 \times 3^2)$<br/>
          $= \log 2^3 + \log 3^2$<br/>
          $= 3\log 2 + 2\log 3$<br/>
          $= 3a + 2b$<br/><br/>
          <strong>④ ∴ 결론</strong><br/>
          ∴ $\log 72 = 3a + 2b$
        </div>
        <div class="fc-hint">탭하여 풀이 공개</div>
      </div>

      <!-- 문제 6 -->
      <div class="formula-card" onclick="this.classList.toggle('revealed')" style="margin-bottom:0.75rem;">
        <div class="fc-q">
          <span style="font-size:0.7rem;color:var(--math-primary);font-weight:700;display:block;margin-bottom:0.3rem;">【문제 6】 지수함수 그래프 해석 — 서술형 6점</span>
          지수함수 $y = 2^{x-1} + 3$ 의 점근선을 구하고, 그래프가 지나는 두 점을 구하시오. (단, $x = 1$, $x = 2$ 대입)
        </div>
        <div class="fc-a" style="font-size:0.83rem;line-height:2;">
          <strong>① 기저 함수 확인</strong><br/>
          $y = 2^x$를 $x$축으로 $+1$, $y$축으로 $+3$ 평행이동한 함수.<br/><br/>
          <strong>② 점근선</strong><br/>
          $2^{x-1} > 0$ 이므로 $y > 3$. 수평 점근선: $y = 3$<br/><br/>
          <strong>③ 두 점 계산</strong><br/>
          $x=1$: $y = 2^{1-1}+3 = 2^0+3 = 1+3 = 4$ → 점 $(1, 4)$<br/>
          $x=2$: $y = 2^{2-1}+3 = 2^1+3 = 2+3 = 5$ → 점 $(2, 5)$<br/><br/>
          <strong>④ ∴ 결론</strong><br/>
          점근선: $y = 3$<br/>
          ∴ 그래프는 점 $(1, 4)$, $(2, 5)$를 지난다.
        </div>
        <div class="fc-hint">탭하여 풀이 공개</div>
      </div>


      <!-- 문제 7 -->
      <div class="formula-card" onclick="this.classList.toggle('revealed')" style="margin-bottom:0.75rem;">
        <div class="fc-q">
          <span style="font-size:0.7rem;color:var(--math-primary);font-weight:700;display:block;margin-bottom:0.3rem;">【문제 7】 지수방정식 치환형 — 서술형 6점</span>
          다음 방정식을 푸시오.<br/>
          $9^x - 4 \cdot 3^x - 45 = 0$
        </div>
        <div class="fc-a" style="font-size:0.83rem;line-height:2;">
          <strong>① 조건 확인</strong><br/>
          $t = 3^x$로 놓으면 지수함수는 항상 양수이므로 $t > 0$.<br/><br/>
          <strong>② 공식 명시</strong><br/>
          지수법칙 $(a^m)^n = a^{mn}$에 의해 $9^x = (3^2)^x = (3^x)^2 = t^2$.<br/><br/>
          <strong>③ 전개 (등호 정렬)</strong><br/>
          $t^2 - 4t - 45 = 0$<br/>
          $(t-9)(t+5) = 0$<br/>
          $t = 9$ 또는 $t = -5$<br/><br/>
          <strong>④ 검증 + ∴ 결론</strong><br/>
          $t > 0$ 조건에서 $t = -5$ 제외.<br/>
          $t = 9$이면 $3^x = 9 = 3^2$<br/>
          ∴ $x = 2$
        </div>
        <div class="fc-hint">탭하여 풀이 공개</div>
      </div>

      <!-- 문제 8 -->
      <div class="formula-card" onclick="this.classList.toggle('revealed')" style="margin-bottom:0.75rem;">
        <div class="fc-q">
          <span style="font-size:0.7rem;color:var(--math-primary);font-weight:700;display:block;margin-bottom:0.3rem;">【문제 8】 로그 부등식 응용 — 서술형 8점</span>
          다음 부등식을 푸시오.<br/>
          $\log_2(x+3) \geq \log_2(2x-1)$
        </div>
        <div class="fc-a" style="font-size:0.83rem;line-height:2;">
          <strong>① 조건 확인</strong><br/>
          밑: $2 > 0$, $2 
eq 1$ ✓<br/>
          진수 조건: $x+3 > 0 \Rightarrow x > -3$ … ①<br/>
          &emsp;&emsp;&emsp;&emsp;&emsp;$2x-1 > 0 \Rightarrow x > rac{1}{2}$ … ②<br/>
          공통 조건: $x > rac{1}{2}$<br/><br/>
          <strong>② 공식 명시</strong><br/>
          밑 $2 > 1$이므로 부등호 방향 유지.<br/>
          $\log_2 M \geq \log_2 N \Rightarrow M \geq N$<br/><br/>
          <strong>③ 전개 (등호 정렬)</strong><br/>
          $x+3 \geq 2x-1$<br/>
          $4 \geq x$<br/>
          $x \leq 4$<br/><br/>
          <strong>④ 검증 + ∴ 결론</strong><br/>
          진수 조건 $x > rac{1}{2}$와 결합:<br/>
          ∴ $rac{1}{2} < x \leq 4$
        </div>
        <div class="fc-hint">탭하여 풀이 공개</div>
      </div>

      <div class="btn-row" style="margin-top:0.75rem;">
        <button class="btn-secondary" onclick="document.querySelectorAll('#math-s2 .formula-card').forEach(c=>c.classList.remove('revealed'))">🔄 전체 닫기</button>
        <button class="btn-secondary" onclick="document.querySelectorAll('#math-s2 .formula-card').forEach(c=>c.classList.add('revealed'))">👁 전체 풀이 공개</button>
      </div>
    </div>

  </div><!-- /math-s2 -->`;
