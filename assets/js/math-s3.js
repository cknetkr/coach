window.MATH_S3 = String.raw`<div id="math-s3" class="inner-panel" style="display:none;">
    <h2 class="panel-title">🔍 오답 분석 — 약점 구조 해부</h2>
    <p class="panel-desc">오답은 틀린 기록이 아니라, 어떤 개념에서 매번 판단이 흔들리는지 보여주는 훈련 데이터입니다.</p>

    <section class="math-stage-card hero">
      <div class="math-stage-card-head">
        <div class="math-stage-card-kicker">STEP 3 · WEAKNESS MAP</div>
        <div class="math-stage-card-title">오답을 많이 보는 것이 아니라, 같은 실수를 구조로 묶어내는 것이 핵심입니다.</div>
        <div class="math-stage-card-desc">이 단계는 오답을 <strong>조건 누락형, 방향 오판형, 치환 조건 누락형, 서술형 형식 감점형</strong>으로 분류하고 복습 우선순위를 잡는 화면입니다.</div>
      </div>
      <div class="math-stage-note">오답을 15개 이상 모아야 패턴이 보입니다. 같은 실수 3개가 보이면 바로 대표 문제 2개씩 다시 푸는 식으로 연결하십시오.</div>
    </section>

    <div class="math-stage-shell">
      <div class="math-stage-main">

    <!-- 빠른 패턴 선택 -->
    <div class="mc" style="margin-bottom:0.75rem;">
      <div class="mc-title" style="margin-bottom:0.6rem;">⚡ 내 오답 유형 — 해당하는 것 선택 (중복 가능)</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.75rem;">
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="addS3Pattern(0)">➕ 로그 진수 조건 누락</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="addS3Pattern(1)">➕ 지수방정식 t>0 미확인</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="addS3Pattern(2)">➕ 로그 부등식 방향 역전 실수</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="addS3Pattern(3)">➕ 거듭제곱근 절댓값 누락</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="addS3Pattern(4)">➕ ∴ 결론 접속사 미사용</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="addS3Pattern(5)">➕ 등호(=) 정렬 불일치</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="addS3Pattern(6)">➕ 밑 변환 공식 적용 오류</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="addS3Pattern(7)">➕ 로그 조건 3개 중 일부 누락</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS3Full()">📋 전체 예시 불러오기</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="clearS3()">🗑 초기화</button>
      </div>
      <div style="font-size:0.75rem;color:var(--text-dim);">➕ 버튼을 클릭하면 해당 오류 유형이 아래 입력창에 추가됩니다.</div>
    </div>

    <div class="mc">
      <div class="mc-title">오답 유형 입력 <span style="font-size:0.72rem;font-weight:400;color:var(--text-dim);">(직접 수정도 가능)</span></div>
      <textarea class="field-input" id="s3-errors" rows="8">- p.27 로그방정식: 진수 조건 교집합을 구하지 않고 x=-3을 해로 포함함
- p.22 지수방정식: t=2^x 치환 후 t>0 조건 미명시, t=-1을 해로 포함함
- p.35 로그 부등식: 밑이 1/3인데 부등호 방향을 유지해서 x≥3 으로 오답
- p.14 거듭제곱근: n=2(짝수)일 때 √(a²)=|a| 처리 누락, 부호 오류 발생</textarea>
      <div class="btn-row" style="margin-top:0.75rem;">
        <button class="btn-primary math" onclick="analyzePatterns()">약점 패턴 브리핑 받기</button>
      </div>
    </div>

    <div class="mc">
      <div class="ai-label" style="color:var(--math-primary);">1타 강사 패턴 브리핑</div>
      <div class="ai-feedback" id="s3-feedback">위 오답 유형을 확인한 후 분석을 실행하십시오.</div>
    </div>

    <!-- 누적 오답 카드 패널 -->
    <div class="mc">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;">
        <div class="mc-title" style="margin:0;">📋 오답 누적 목록 <span class="error-badge" id="s3-error-badge">0</span></div>
        <div style="display:flex;gap:0.5rem;">
          <button class="btn-secondary" style="font-size:0.72rem;padding:0.25rem 0.6rem;" onclick="exportS3Errors()">📤 텍스트 복사</button>
          <button class="btn-secondary" style="font-size:0.72rem;padding:0.25rem 0.6rem;" onclick="clearS3Log()">🗑 전체 삭제</button>
        </div>
      </div>
      <div class="alert-box alert-info" style="font-size:0.79rem;margin-bottom:0.75rem;">
        ➕ 버튼으로 추가하거나, <strong>패턴 분석 실행 시 자동 저장</strong>됩니다. 오답을 쌓을수록 전략이 정교해집니다.
      </div>
      <div id="s3-error-log-list"><div class="empty-state">아직 저장된 오답 유형이 없습니다.</div></div>
    </div>

      </div>
      <aside class="math-stage-side">
        <div class="math-stage-sticky">
          <section class="math-masterclass-panel">
            <div class="math-masterclass-kicker">1타 강사 브리핑</div>
            <div class="math-masterclass-title">같은 실수가 반복되면 계산력이 아니라 판단 루틴이 흔들리고 있다는 뜻입니다.</div>
            <div class="math-masterclass-desc">오답은 개별 문제보다 <strong>왜 같은 실수가 다시 나왔는지</strong>로 묶어야 복습 효율이 올라갑니다.</div>
            <div class="math-coach-grid">
              <div class="math-coach-card">
                <div class="math-coach-label">핵심 개념</div>
                <div class="math-coach-list">
                  <div class="math-coach-item">조건 누락과 계산 실수는 처방이 다르므로 분리해 기록하십시오.</div>
                  <div class="math-coach-item">오답 하나마다 바로 대응하는 대표 문제를 다시 풀어야 패턴이 끊깁니다.</div>
                </div>
              </div>
              <div class="math-coach-card">
                <div class="math-coach-label">권장 공부량</div>
                <div class="math-coach-list">
                  <div class="math-coach-item">오답 15개 누적</div>
                  <div class="math-coach-item">최빈출 약점 3개 × 대표문제 2개 재풀이</div>
                  <div class="math-coach-item">3일 루틴 3회 반복</div>
                </div>
              </div>
            </div>
          </section>

          <!-- 자주 나오는 함정 요약 — 확장판 -->
          <div class="mc">
      <div class="mc-title">📌 고빈도 오류 유형 완전 정리 <span style="font-size:0.72rem;font-weight:400;color:var(--text-dim);">— 내 오답과 대조하십시오</span></div>
      <div style="display:flex;flex-direction:column;gap:0.6rem;font-size:0.83rem;">

        <div class="formula-box" style="margin:0;">
          <div class="formula-label">유형 A — 로그 조건 누락 ★최빈출</div>
          $\log_a M$에서 <strong>밑 조건 $a>0$, $a
eq1$ + 진수 조건 $M>0$</strong> 3가지 모두 첫 줄에 써야 합니다.<br/>
          로그가 2개면 각각 진수 조건을 구하고 <strong>교집합</strong>까지 써야 완전합니다.<br/>
          <span style="color:var(--danger);">❌ 자주 하는 실수:</span> 진수 조건 구하고 교집합 생략 → 음수 해 포함
        </div>

        <div class="formula-box" style="margin:0;">
          <div class="formula-label">유형 B — 지수방정식 치환 조건 누락</div>
          $t = 2^x$ 치환 시 <strong>$t > 0$을 반드시 명시</strong>해야 합니다. 지수함수는 항상 양수이기 때문입니다.<br/>
          $(t-4)(t+1)=0$에서 $t=-1$이 나와도 $t>0$ 조건으로 반드시 제거해야 합니다.<br/>
          <span style="color:var(--danger);">❌ 자주 하는 실수:</span> $t=-1$을 그대로 두고 $2^x=-1$이라고 쓰는 것
        </div>

        <div class="formula-box" style="margin:0;">
          <div class="formula-label">유형 C — 로그 부등식 부등호 방향 역전</div>
          밑 $0 &lt; a &lt; 1$이면 $\log_a M \geq \log_a N \Rightarrow M \leq N$ — <strong>부등호 방향이 반드시 뒤집힙니다.</strong><br/>
          이유: $y=\log_{1/2}x$는 감소함수 → $x$가 커질수록 $y$가 작아집니다.<br/>
          <span style="color:var(--danger);">❌ 자주 하는 실수:</span> 밑이 $1/3$인데 부등호 그대로 유지 → 정반대 범위
        </div>

        <div class="formula-box" style="margin:0;">
          <div class="formula-label">유형 D — 거듭제곱근 짝수/홀수 분기</div>
          $n$이 <strong>짝수</strong>: $\sqrt[n]{a^n} = |a|$ (절댓값 필수) &nbsp;|&nbsp; $n$이 <strong>홀수</strong>: $\sqrt[n]{a^n} = a$ (부호 유지)<br/>
          <span style="color:var(--danger);">❌ 자주 하는 실수:</span> $\sqrt{(-3)^2} = -3$ 으로 쓰는 것 → 정답은 $3$
        </div>

        <div class="formula-box" style="margin:0;">
          <div class="formula-label">유형 E — 서술형 기호·형식 감점</div>
          · <strong>∴ 없이 숫자만</strong> 쓰면 결론 점수 감점<br/>
          · <strong>등호(=) 세로 정렬</strong>이 맞지 않으면 가독성 감점<br/>
          · 중간 과정 생략하면 부분 점수 없음 → 단계마다 한 줄씩 전개
        </div>

        <div class="formula-box" style="margin:0;">
          <div class="formula-label">유형 F — 밑 변환 공식 오적용</div>
          $\log_a b = \dfrac{\log_c b}{\log_c a}$ — 분자·분모 순서를 반대로 쓰는 실수가 잦습니다.<br/>
          암기법: <strong>"구하려는 것(b)이 분자, 바꾸는 밑(a)이 분모"</strong><br/>
          <span style="color:var(--danger);">❌ 자주 하는 실수:</span> $\log_2 3 = \dfrac{\log_2 2}{\log_2 3}$ 처럼 뒤집어 쓰기
        </div>

      </div>
    </div>
        </div>
      </aside>
    </div>
  </div><!-- /math-s3 -->`;
