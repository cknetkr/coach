window.MATH_S2 = String.raw`<div id="math-s2" class="inner-panel" style="display:none;">
    <h2 class="panel-title">📝 서술형 방어 — 1타 채점관 시선</h2>
    <p class="panel-desc">서술형은 정답보다도 조건, 공식, 전개, 검산이 얼마나 보이게 쓰였는지에서 점수가 갈립니다.</p>

    <section class="math-stage-card hero">
      <div class="math-stage-card-head">
        <div class="math-stage-card-kicker">STEP 2 · WRITING STUDIO</div>
        <div class="math-stage-card-title">실습은 비우고, 코칭은 옆으로 빼서 서술형 4단계에만 집중하게 만듭니다.</div>
        <div class="math-stage-card-desc">이 단계는 <strong>조건 명시 → 공식 선언 → 등호 정렬 → 검산 + ∴ 결론</strong>만 반복해 손에 붙이는 화면입니다.</div>
      </div>
      <div class="math-stage-note">
        서술형 기본 공식: <strong>①조건 확인 → ②공식 명시 → ③전개(등호 정렬) → ④검증 + ∴ 결론</strong>
      </div>
    </section>

    <div class="math-stage-shell">
      <div class="math-stage-main">
        <section class="math-stage-card">
          <div class="math-stage-card-head">
            <div class="math-stage-card-kicker">Quick Start</div>
            <div class="math-stage-card-title">서술형 연습 문제 선택</div>
            <div class="math-stage-card-desc">하나만 골라 아래 워크스페이스에서 4단계 답안을 완성하십시오.</div>
          </div>
          <div class="math-stage-toolbar">
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(0)">① 로그방정식 기본형</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(1)">② 지수방정식 치환형</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(2)">③ 로그 부등식</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(3)">④ 지수함수 그래프</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(4)">⑤ 로그 값 계산</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(5)">⑥ 지수방정식 고급형</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS2Sample(6)">⑦ 로그 부등식 응용</button>
          </div>
        </section>

        <section class="math-stage-card">
          <div class="math-stage-card-head">
            <div class="math-stage-card-kicker">Practice Workspace</div>
            <div class="math-stage-card-title">문제 입력 + 4단계 작성</div>
            <div class="math-stage-card-desc">왼쪽 화면은 쓰는 데만 집중합니다. 각 단계는 짧고 단단하게 적고, 검증 버튼으로 빠르게 첨삭하십시오.</div>
          </div>
          <div>
            <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">문제</label>
          <textarea class="field-input" id="s2-problem" rows="3">log₂(x-1) + log₂(x+1) = 3 을 만족하는 x의 값을 구하시오. (서술형 6점)</textarea>
          </div>
        <div class="step4-grid" style="margin-top:0.85rem;">
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
        <div class="btn-row" style="margin-top:0.9rem;">
          <button class="btn-primary math" onclick="analyzeStep2()">4단계 코칭 검토</button>
          <button class="btn-secondary" onclick="clearStep2()">초기화</button>
        </div>
        <section class="math-stage-card" style="margin-top:0.85rem;">
          <div class="math-stage-card-head">
            <div class="math-stage-card-kicker">Coach Review</div>
            <div class="math-stage-card-title">1타 첨삭 코멘트</div>
            <div class="math-stage-card-desc">조건, 공식, 전개, 결론 중 어디가 비어 있는지 바로 피드백합니다.</div>
          </div>
          <div class="ai-feedback" id="s2-feedback">4단계를 작성 후 검증을 실행하십시오.</div>
        </section>
      </div>
      <aside class="math-stage-side">
        <div class="math-stage-sticky">
        <section class="math-masterclass-panel">
          <div class="math-masterclass-kicker">1타 강사 코칭</div>
          <div class="math-masterclass-title">채점관은 "맞았는가"보다 "왜 이 풀이가 안전한가"를 보고 점수를 줍니다.</div>
          <div class="math-masterclass-desc">설명은 이쪽에만 모아 두고, 실습 화면은 최대한 비워서 집중할 수 있게 정리했습니다.</div>
          <div class="math-coach-grid">
            <div class="math-coach-card">
              <div class="math-coach-label">핵심 개념</div>
              <div class="math-coach-list">
                <div class="math-coach-item">조건을 먼저 쓰면 논리 점프 감점을 막을 수 있습니다.</div>
                <div class="math-coach-item">공식 이름을 한 줄로 밝히면 풀이의 근거가 살아납니다.</div>
                <div class="math-coach-item">서술형은 마지막 숫자보다 중간 줄의 정리 상태가 중요합니다.</div>
              </div>
            </div>
            <div class="math-coach-card">
              <div class="math-coach-label">접근 순서</div>
              <div class="math-coach-list">
                <div class="math-coach-item">첫 줄 조건, 둘째 줄 공식, 셋째 줄부터 전개로 순서를 고정하십시오.</div>
                <div class="math-coach-item">등호 위치를 맞추면 채점관이 한눈에 풀이를 따라옵니다.</div>
                <div class="math-coach-item">후보 해가 나오면 검산 한 줄 뒤에만 ∴ 결론으로 닫으십시오.</div>
              </div>
            </div>
            <div class="math-coach-card">
              <div class="math-coach-label">자주 하는 감점 실수</div>
              <div class="math-coach-list">
                <div class="math-coach-item">조건을 머릿속으로만 처리하고 답안에는 안 적는 실수</div>
                <div class="math-coach-item">공식 이름 없이 식만 변형하는 실수</div>
                <div class="math-coach-item">∴ 없이 숫자만 적고 끝내는 실수</div>
              </div>
            </div>
            <div class="math-coach-card full">
              <div class="math-coach-label">권장 공부량</div>
              <div class="math-coach-list">
                <div class="math-coach-item">기본형 서술형 6문제를 같은 4단계 템플릿으로 손으로 끝까지 써 보십시오.</div>
                <div class="math-coach-item">변형 서술형 4문제는 7분 제한으로 써서 조건과 ∴ 결론이 자동으로 나오게 만드십시오.</div>
                <div class="math-coach-item">대표 문제 3개는 풀이를 덮고 말로 설명해 논리 순서를 입으로도 재현하십시오.</div>
              </div>
              <div class="math-coach-meter">
                <div class="math-coach-meter-box">
                  <div class="math-coach-meter-num">6문제</div>
                  <div class="math-coach-meter-label">기본형 손글씨</div>
                </div>
                <div class="math-coach-meter-box">
                  <div class="math-coach-meter-num">4문제</div>
                  <div class="math-coach-meter-label">실전 서술형</div>
                </div>
                <div class="math-coach-meter-box">
                  <div class="math-coach-meter-num">3회</div>
                  <div class="math-coach-meter-label">말로 재현</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div class="rubric-side math-side-rubric">
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
        <section class="math-stage-card">
          <div class="math-stage-card-head">
            <div class="math-stage-card-kicker">Quick View</div>
            <div class="math-stage-card-title">핵심 공식 퀵뷰</div>
          </div>
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
        </section>
        </div>
      </aside>
    </div>
    <!-- ══ 예시 문제 세트 ══ -->
    <section class="math-stage-card math-stage-library" style="margin-top:1.25rem;">
      <div class="math-stage-card-head">
        <div class="math-stage-card-kicker">Reference Library</div>
        <div class="math-stage-card-title">고2 대수 — 수행평가 예시 문제 세트</div>
        <div class="math-stage-card-desc">클릭하면 풀이가 열립니다. 답을 베끼기보다 어떤 줄에서 근거가 보이는지 비교해 보십시오.</div>
      </div>
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
    </section>

  </div><!-- /math-s2 -->`;
