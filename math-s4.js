window.MATH_S4 = String.raw`<div id="math-s4" class="inner-panel" style="display:none;">
    <h2 class="panel-title">⏱️ 타임어택 — 40분 실전 시뮬레이션</h2>
    <p class="panel-desc">타이머를 시작하고 시험지처럼 문제를 풀어보십시오. 풀이가 끝나면 버튼을 눌러 정답을 확인합니다.</p>

    <!-- 타이머 + 체크 고정 바 -->
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
          <h4>시험 전 최종 체크 <span style="color:var(--text-dim);font-weight:400;font-size:0.7rem;">(클릭 체크)</span></h4>
          <div id="s4-rubric">
            <div class="rubric-item math"><span class="ri-check">✓</span><span>로그 3조건 암기됨</span></div>
            <div class="rubric-item math"><span class="ri-check">✓</span><span>등호 정렬 연습 완료</span></div>
            <div class="rubric-item math"><span class="ri-check">✓</span><span>∴ 결론 습관화됨</span></div>
            <div class="rubric-item math"><span class="ri-check">✓</span><span>오답 패턴 분석 완료</span></div>
            <div class="rubric-item math"><span class="ri-check">✓</span><span>40분 시뮬레이션 완료</span></div>
          </div>
          <div class="rubric-bar-wrap">
            <div class="rubric-bar-track"><div class="rubric-bar-fill" id="s4-bar-fill" style="background:var(--math-primary);"></div></div>
            <p class="rubric-count-text" id="s4-bar-count">0 / 5 완료</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── 시험지 ── -->
    <div class="mc">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.5rem;margin-bottom:1rem;">
        <div class="mc-title" style="margin:0;">📄 2026 대수 1차 수행평가 — 시험지</div>
        <div style="font-size:0.75rem;color:var(--text-dim);">단답형 8문항 16점 · 서술형 4문항 20점 · 40분</div>
      </div>
      <div class="alert-box alert-amber" style="margin-bottom:1.25rem;">
        <strong>⚠ 실전 규칙:</strong> 종이에 직접 풀이를 쓰면서 진행하십시오. 풀이 완료 후 <strong>[정답 확인]</strong> 버튼을 눌러 채점하십시오.
      </div>

      <!-- ══ 단답형 ══ -->
      <div style="border-left:3px solid var(--math-primary);padding-left:1rem;margin-bottom:1.5rem;">
        <div style="font-size:0.72rem;font-weight:800;color:var(--math-primary);letter-spacing:0.07em;text-transform:uppercase;margin-bottom:0.75rem;">단답형 — 각 2점 × 8문항 = 16점</div>

        <!-- 단답 1 -->
        <div class="ta-problem" id="ta-p1">
          <div class="ta-q-row">
            <span class="ta-num">1</span>
            <div class="ta-q-body">
              <div class="ta-q-text">$\sqrt{(-5)^2}$ 의 값을 구하시오.</div>
              <div class="ta-meta"><span class="ta-tag">거듭제곱근</span><span class="ta-pts">2점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p1')">정답 확인</button>
          </div>
          <div class="ta-answer" id="ta-p1-ans">
            <div class="ta-ans-label">정답</div>
            <div class="ta-ans-val">$5$</div>
            <div class="ta-ans-reason">$n=2$ (짝수)이므로 $\sqrt[n]{a^n}=|a|$. 따라서 $\sqrt{(-5)^2}=|-5|=5$</div>
            <div class="ta-trap">⚠ 함정: $-5$로 쓰면 0점. 짝수 제곱근은 반드시 절댓값.</div>
          </div>
        </div>

        <!-- 단답 2 -->
        <div class="ta-problem" id="ta-p2">
          <div class="ta-q-row">
            <span class="ta-num">2</span>
            <div class="ta-q-body">
              <div class="ta-q-text">$\sqrt[3]{-27}$ 의 값을 구하시오.</div>
              <div class="ta-meta"><span class="ta-tag">거듭제곱근</span><span class="ta-pts">2점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p2')">정답 확인</button>
          </div>
          <div class="ta-answer" id="ta-p2-ans">
            <div class="ta-ans-label">정답</div>
            <div class="ta-ans-val">$-3$</div>
            <div class="ta-ans-reason">$n=3$ (홀수)이므로 $\sqrt[n]{a^n}=a$. $-27=(-3)^3$이므로 $\sqrt[3]{-27}=-3$</div>
            <div class="ta-trap">⚠ 함정: 홀수 제곱근은 음수도 가능. 절댓값 처리하면 오답.</div>
          </div>
        </div>

        <!-- 단답 3 -->
        <div class="ta-problem" id="ta-p3">
          <div class="ta-q-row">
            <span class="ta-num">3</span>
            <div class="ta-q-body">
              <div class="ta-q-text">$\sqrt[3]{2} 	imes \sqrt[4]{2} \div \sqrt[6]{2}$ 를 계산하시오.</div>
              <div class="ta-meta"><span class="ta-tag">지수 계산</span><span class="ta-pts">2점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p3')">정답 확인</button>
          </div>
          <div class="ta-answer" id="ta-p3-ans">
            <div class="ta-ans-label">정답</div>
            <div class="ta-ans-val">$\sqrt[12]{32}$</div>
            <div class="ta-ans-reason">$2^{1/3} 	imes 2^{1/4} \div 2^{1/6} = 2^{4/12+3/12-2/12} = 2^{5/12} = \sqrt[12]{2^5} = \sqrt[12]{32}$</div>
            <div class="ta-trap">⚠ 분수 지수 통분 실수 주의. 공통 분모 12.</div>
          </div>
        </div>

        <!-- 단답 4 -->
        <div class="ta-problem" id="ta-p4">
          <div class="ta-q-row">
            <span class="ta-num">4</span>
            <div class="ta-q-body">
              <div class="ta-q-text">$\log_3 81$ 의 값을 구하시오.</div>
              <div class="ta-meta"><span class="ta-tag">로그 계산</span><span class="ta-pts">2점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p4')">정답 확인</button>
          </div>
          <div class="ta-answer" id="ta-p4-ans">
            <div class="ta-ans-label">정답</div>
            <div class="ta-ans-val">$4$</div>
            <div class="ta-ans-reason">$81 = 3^4$이므로 $\log_3 3^4 = 4$</div>
            <div class="ta-trap">⚠ $\log_3 81 = 81/3 = 27$ 같은 나눗셈 오류 주의.</div>
          </div>
        </div>

        <!-- 단답 5 -->
        <div class="ta-problem" id="ta-p5">
          <div class="ta-q-row">
            <span class="ta-num">5</span>
            <div class="ta-q-body">
              <div class="ta-q-text">$\log 2 = a$, $\log 3 = b$ 일 때, $\log 72$ 를 $a$, $b$로 나타내시오.</div>
              <div class="ta-meta"><span class="ta-tag">로그 값 계산</span><span class="ta-pts">2점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p5')">정답 확인</button>
          </div>
          <div class="ta-answer" id="ta-p5-ans">
            <div class="ta-ans-label">정답</div>
            <div class="ta-ans-val">$3a + 2b$</div>
            <div class="ta-ans-reason">$72 = 2^3 	imes 3^2$이므로 $\log 72 = 3\log 2 + 2\log 3 = 3a+2b$</div>
            <div class="ta-trap">⚠ 소인수분해를 먼저 해야 법칙 적용 가능.</div>
          </div>
        </div>

        <!-- 단답 6 -->
        <div class="ta-problem" id="ta-p6">
          <div class="ta-q-row">
            <span class="ta-num">6</span>
            <div class="ta-q-body">
              <div class="ta-q-text">$\log_2 3 	imes \log_3 8$ 의 값을 구하시오.</div>
              <div class="ta-meta"><span class="ta-tag">밑 변환 공식</span><span class="ta-pts">2점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p6')">정답 확인</button>
          </div>
          <div class="ta-answer" id="ta-p6-ans">
            <div class="ta-ans-label">정답</div>
            <div class="ta-ans-val">$3$</div>
            <div class="ta-ans-reason">밑 변환: $\log_3 8 = \dfrac{\log_2 8}{\log_2 3}$이므로 $\log_2 3 	imes \dfrac{\log_2 8}{\log_2 3} = \log_2 8 = \log_2 2^3 = 3$</div>
            <div class="ta-trap">⚠ 밑이 다를 때 바로 계산 불가. 밑 변환 공식 필수.</div>
          </div>
        </div>

        <!-- 단답 7 -->
        <div class="ta-problem" id="ta-p7">
          <div class="ta-q-row">
            <span class="ta-num">7</span>
            <div class="ta-q-body">
              <div class="ta-q-text">지수방정식 $3^{2x} = 27$ 의 해를 구하시오.</div>
              <div class="ta-meta"><span class="ta-tag">지수방정식</span><span class="ta-pts">2점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p7')">정답 확인</button>
          </div>
          <div class="ta-answer" id="ta-p7-ans">
            <div class="ta-ans-label">정답</div>
            <div class="ta-ans-val">$x = \dfrac{3}{2}$</div>
            <div class="ta-ans-reason">$27 = 3^3$이므로 $3^{2x} = 3^3$. 밑이 같으므로 $2x = 3$, $x = \dfrac{3}{2}$</div>
            <div class="ta-trap">⚠ 밑을 통일한 뒤 지수끼리 비교. 밑이 다른 채로 계산 금지.</div>
          </div>
        </div>

        <!-- 단답 8 -->
        <div class="ta-problem" id="ta-p8">
          <div class="ta-q-row">
            <span class="ta-num">8</span>
            <div class="ta-q-body">
              <div class="ta-q-text">지수함수 $y = 2^{x-1}+3$ 의 점근선의 방정식을 구하시오.</div>
              <div class="ta-meta"><span class="ta-tag">지수함수</span><span class="ta-pts">2점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p8')">정답 확인</button>
          </div>
          <div class="ta-answer" id="ta-p8-ans">
            <div class="ta-ans-label">정답</div>
            <div class="ta-ans-val">$y = 3$</div>
            <div class="ta-ans-reason">$2^{x-1} > 0$이므로 $y = 2^{x-1}+3 > 3$. 수평 점근선은 $y = 3$.</div>
            <div class="ta-trap">⚠ $y=0$ 또는 $y=1$로 쓰는 실수 주의. 평행이동 후 점근선은 +3 이동.</div>
          </div>
        </div>
      </div><!-- /단답형 -->

      <!-- ══ 서술형 ══ -->
      <div style="border-left:3px solid var(--warning);padding-left:1rem;">
        <div style="font-size:0.72rem;font-weight:800;color:var(--warning);letter-spacing:0.07em;text-transform:uppercase;margin-bottom:0.75rem;">서술형 — 각 5점 × 4문항 = 20점 (채점기준 달성률로 환산)</div>

        <!-- 서술 1 -->
        <div class="ta-problem ta-essay" id="ta-p9">
          <div class="ta-q-row">
            <span class="ta-num" style="background:rgba(245,158,11,0.15);color:var(--warning);border-color:rgba(245,158,11,0.3);">9</span>
            <div class="ta-q-body">
              <div class="ta-q-text">다음 방정식을 풀어라. 풀이 과정을 반드시 서술하시오.<br/>$\log_2(x-1) + \log_2(x+1) = 3$</div>
              <div class="ta-meta"><span class="ta-tag" style="background:rgba(245,158,11,0.12);color:var(--warning);border-color:rgba(245,158,11,0.3);">로그방정식</span><span class="ta-pts" style="color:var(--warning);">5점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p9')">풀이 확인</button>
          </div>
          <div class="ta-answer" id="ta-p9-ans">
            <div class="ta-ans-label" style="color:var(--warning);">모범 풀이</div>
            <div style="font-size:0.82rem;line-height:2.1;font-family:var(--font-serif);">
              <strong style="color:var(--text);">① 조건 확인</strong><br/>
              밑: $2 > 0$, $2 
eq 1$ ✓<br/>
              진수 조건: $x-1 > 0 \Rightarrow x > 1$ ··· ①<br/>
              &emsp;&emsp;&emsp;&emsp;&ensp;$x+1 > 0 \Rightarrow x > -1$ ··· ②<br/>
              ①, ②의 교집합: $x > 1$<br/><br/>
              <strong style="color:var(--text);">② 공식 명시</strong><br/>
              로그의 곱 법칙에 의해: $\log_2 MN = \log_2 M + \log_2 N$<br/><br/>
              <strong style="color:var(--text);">③ 전개 (등호 정렬)</strong><br/>
              $\log_2(x-1)(x+1) = 3$<br/>
              &emsp;&emsp;&emsp;$(x^2-1) = 2^3 = 8$<br/>
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;$x^2 = 9$<br/>
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&ensp;$x = \pm3$<br/><br/>
              <strong style="color:var(--text);">④ 검증 + ∴ 결론</strong><br/>
              $x > 1$ 조건에서 $x = -3$ 제외.<br/>
              $x = 3$: 진수 $3-1=2>0$, $3+1=4>0$ 만족 ✓<br/>
              ∴ $x = 3$
            </div>
            <div class="ta-score-guide">
              <div class="ta-score-row"><span>조건 명시</span><span>1점</span></div>
              <div class="ta-score-row"><span>공식 근거</span><span>1점</span></div>
              <div class="ta-score-row"><span>전개 과정</span><span>2점</span></div>
              <div class="ta-score-row"><span>∴ 결론</span><span>1점</span></div>
            </div>
          </div>
        </div>

        <!-- 서술 2 -->
        <div class="ta-problem ta-essay" id="ta-p10">
          <div class="ta-q-row">
            <span class="ta-num" style="background:rgba(245,158,11,0.15);color:var(--warning);border-color:rgba(245,158,11,0.3);">10</span>
            <div class="ta-q-body">
              <div class="ta-q-text">다음 방정식을 풀어라. 풀이 과정을 반드시 서술하시오.<br/>$4^x - 3 \cdot 2^x - 4 = 0$</div>
              <div class="ta-meta"><span class="ta-tag" style="background:rgba(245,158,11,0.12);color:var(--warning);border-color:rgba(245,158,11,0.3);">지수방정식 치환형</span><span class="ta-pts" style="color:var(--warning);">5점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p10')">풀이 확인</button>
          </div>
          <div class="ta-answer" id="ta-p10-ans">
            <div class="ta-ans-label" style="color:var(--warning);">모범 풀이</div>
            <div style="font-size:0.82rem;line-height:2.1;font-family:var(--font-serif);">
              <strong style="color:var(--text);">① 조건 확인</strong><br/>
              $t = 2^x$로 놓으면, 지수함수는 항상 양수이므로 $t > 0$.<br/><br/>
              <strong style="color:var(--text);">② 공식 명시</strong><br/>
              지수법칙 $(a^m)^n = a^{mn}$에 의해 $4^x = (2^2)^x = (2^x)^2 = t^2$.<br/><br/>
              <strong style="color:var(--text);">③ 전개 (등호 정렬)</strong><br/>
              $t^2 - 3t - 4 = 0$<br/>
              $(t-4)(t+1) = 0$<br/>
              $t = 4$ 또는 $t = -1$<br/><br/>
              <strong style="color:var(--text);">④ 검증 + ∴ 결론</strong><br/>
              $t > 0$ 조건에서 $t = -1$ 제외.<br/>
              $t = 4$이면 $2^x = 4 = 2^2$<br/>
              ∴ $x = 2$
            </div>
            <div class="ta-score-guide">
              <div class="ta-score-row"><span>$t>0$ 조건 명시</span><span>1점</span></div>
              <div class="ta-score-row"><span>치환 및 공식 근거</span><span>1점</span></div>
              <div class="ta-score-row"><span>인수분해 전개</span><span>1점</span></div>
              <div class="ta-score-row"><span>음수 해 제거 + ∴ 결론</span><span>2점</span></div>
            </div>
          </div>
        </div>

        <!-- 서술 3 -->
        <div class="ta-problem ta-essay" id="ta-p11">
          <div class="ta-q-row">
            <span class="ta-num" style="background:rgba(245,158,11,0.15);color:var(--warning);border-color:rgba(245,158,11,0.3);">11</span>
            <div class="ta-q-body">
              <div class="ta-q-text">다음 부등식을 풀어라. 풀이 과정을 반드시 서술하시오.<br/>$\log_{1/3}(2x-1) \geq \log_{1/3}(x+2)$</div>
              <div class="ta-meta"><span class="ta-tag" style="background:rgba(245,158,11,0.12);color:var(--warning);border-color:rgba(245,158,11,0.3);">로그 부등식</span><span class="ta-pts" style="color:var(--warning);">5점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p11')">풀이 확인</button>
          </div>
          <div class="ta-answer" id="ta-p11-ans">
            <div class="ta-ans-label" style="color:var(--warning);">모범 풀이</div>
            <div style="font-size:0.82rem;line-height:2.1;font-family:var(--font-serif);">
              <strong style="color:var(--text);">① 조건 확인</strong><br/>
              밑: $rac{1}{3} > 0$, $rac{1}{3} 
eq 1$ ✓<br/>
              진수 조건: $2x-1 > 0 \Rightarrow x > rac{1}{2}$ ··· ①<br/>
              &emsp;&emsp;&emsp;&emsp;&ensp;$x+2 > 0 \Rightarrow x > -2$ ··· ②<br/>
              공통 조건: $x > rac{1}{2}$<br/><br/>
              <strong style="color:var(--text);">② 공식 명시</strong><br/>
              밑 $0 &lt; rac{1}{3} &lt; 1$이므로 부등호 방향 역전.<br/>
              $\log_{1/3} M \geq \log_{1/3} N \Rightarrow M \leq N$<br/><br/>
              <strong style="color:var(--text);">③ 전개 (등호 정렬)</strong><br/>
              $2x - 1 \leq x + 2$<br/>
              &emsp;&emsp;&emsp;$x \leq 3$<br/><br/>
              <strong style="color:var(--text);">④ 검증 + ∴ 결론</strong><br/>
              진수 조건 $x > rac{1}{2}$과 결합:<br/>
              ∴ $rac{1}{2} &lt; x \leq 3$
            </div>
            <div class="ta-score-guide">
              <div class="ta-score-row"><span>진수 조건 + 교집합</span><span>1점</span></div>
              <div class="ta-score-row"><span>부등호 역전 근거 명시</span><span>2점</span></div>
              <div class="ta-score-row"><span>전개 과정</span><span>1점</span></div>
              <div class="ta-score-row"><span>∴ 결론 (범위 표현)</span><span>1점</span></div>
            </div>
          </div>
        </div>

        <!-- 서술 4 -->
        <div class="ta-problem ta-essay" id="ta-p12">
          <div class="ta-q-row">
            <span class="ta-num" style="background:rgba(245,158,11,0.15);color:var(--warning);border-color:rgba(245,158,11,0.3);">12</span>
            <div class="ta-q-body">
              <div class="ta-q-text">지수함수 $y = 2^{x-1}+3$ 에 대하여, 점근선을 구하고 $x=1$, $x=2$ 일 때 함수값을 각각 구하시오. 풀이 과정을 서술하시오.</div>
              <div class="ta-meta"><span class="ta-tag" style="background:rgba(245,158,11,0.12);color:var(--warning);border-color:rgba(245,158,11,0.3);">지수함수 그래프</span><span class="ta-pts" style="color:var(--warning);">5점</span></div>
            </div>
            <button class="ta-reveal-btn" onclick="toggleTA('ta-p12')">풀이 확인</button>
          </div>
          <div class="ta-answer" id="ta-p12-ans">
            <div class="ta-ans-label" style="color:var(--warning);">모범 풀이</div>
            <div style="font-size:0.82rem;line-height:2.1;font-family:var(--font-serif);">
              <strong style="color:var(--text);">① 기저 함수 확인</strong><br/>
              $y = 2^x$를 $x$축 방향으로 $+1$, $y$축 방향으로 $+3$ 평행이동.<br/><br/>
              <strong style="color:var(--text);">② 점근선</strong><br/>
              $2^{x-1} > 0$이므로 $y = 2^{x-1}+3 > 3$.<br/>
              수평 점근선: $y = 3$<br/><br/>
              <strong style="color:var(--text);">③ 함수값 계산</strong><br/>
              $x=1$: $y = 2^{1-1}+3 = 2^0+3 = 1+3 = 4$<br/>
              $x=2$: $y = 2^{2-1}+3 = 2^1+3 = 2+3 = 5$<br/><br/>
              <strong style="color:var(--text);">④ ∴ 결론</strong><br/>
              점근선: $y = 3$<br/>
              ∴ $x=1$일 때 $y=4$, $x=2$일 때 $y=5$
            </div>
            <div class="ta-score-guide">
              <div class="ta-score-row"><span>점근선 $y=3$ 도출 과정</span><span>2점</span></div>
              <div class="ta-score-row"><span>$x=1$ 함수값</span><span>1점</span></div>
              <div class="ta-score-row"><span>$x=2$ 함수값</span><span>1점</span></div>
              <div class="ta-score-row"><span>∴ 결론 정리</span><span>1점</span></div>
            </div>
          </div>
        </div>

      </div><!-- /서술형 -->
    </div><!-- /시험지 mc -->

    <!-- 점수 예측 -->
    <div class="mc" style="margin-top:1.25rem;">
      <div class="mc-title">📊 최종 점수 예측</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">단답형 맞은 개수 (/ 8)</label>
          <input type="number" class="field-input" id="s4-short-correct" min="0" max="8" value="7">
        </div>
        <div>
          <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">서술형 예상 달성률 (%)</label>
          <input type="number" class="field-input" id="s4-essay-pct" min="0" max="100" value="94">
        </div>
      </div>
      <div class="btn-row">
        <button class="btn-primary math" onclick="calcFinalScore()">📊 점수 계산</button>
      </div>
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
