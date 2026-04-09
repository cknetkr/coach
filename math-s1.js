window.MATH_S1 = String.raw`<div id="math-s1" class="inner-panel" style="display:none;">
    <h2 class="panel-title">📚 범위 해체 &amp; 취약점 진단</h2>
    <p class="panel-desc">틀린 문제 또는 자신 없는 문제를 입력하십시오. AI가 오류 패턴을 분석합니다.</p>

    <!-- 빠른 예시 선택 -->
    <div class="mc" style="margin-bottom:0.75rem;">
      <div class="mc-title" style="margin-bottom:0.6rem;">⚡ 자주 틀리는 유형 — 바로 불러오기</div>
      <div style="display:flex;flex-wrap:wrap;gap:0.4rem;">
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS1Sample(0)">① 로그방정식 진수 조건 누락</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS1Sample(1)">② 지수방정식 치환 후 t>0 미확인</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS1Sample(2)">③ 로그 부등식 방향 역전 실수</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS1Sample(3)">④ 거듭제곱근 절댓값 누락</button>
        <button class="btn-secondary" style="font-size:0.75rem;padding:0.3rem 0.75rem;" onclick="loadS1Sample(4)">⑤ 밑 변환 공식 적용 실수</button>
      </div>
    </div>

    <div class="two-col">
      <div>
        <div class="mc">
          <div class="mc-title">문제 입력</div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">문제 번호 / 출처</label>
              <input type="text" class="field-input" id="s1-problem-ref" placeholder="예) p.23 예제 3" value="교과서 p.27 예제 5" style="resize:none;">
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">문제 내용</label>
              <textarea class="field-input" id="s1-problem-text" rows="4">log₂(x-1) + log₂(x+1) = 3 을 만족하는 x의 값을 구하시오.</textarea>
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--text-secondary);display:block;margin-bottom:0.4rem;">내 풀이 / 오답 과정</label>
              <textarea class="field-input" id="s1-my-answer" rows="4">log₂(x-1)(x+1) = 3 으로 합쳐서 x²-1 = 8, x² = 9, x = ±3 이므로 x = 3, x = -3 둘 다 답으로 썼음.</textarea>
            </div>
          </div>
          <div class="btn-row">
            <button class="btn-primary math" onclick="analyzeStep1()">🤖 AI 오답 분석</button>
            <button class="btn-secondary" onclick="clearStep1()">초기화</button>
          </div>
        </div>
        <div class="mc">
          <div class="ai-label" style="color:var(--math-primary);">AI 분석 결과</div>
          <div class="ai-feedback" id="s1-feedback">분석 결과가 여기에 표시됩니다.</div>
        </div>
      </div>
      <div>
        <div class="rubric-side">
          <h4>오답 분석 진행도</h4>
          <div id="r1-0" class="rubric-item math"><span class="ri-check">✓</span><span>오답 3개 이상 입력됨</span></div>
          <div id="r1-1" class="rubric-item math"><span class="ri-check">✓</span><span>개념 오류 유형 확인됨</span></div>
          <div id="r1-2" class="rubric-item math"><span class="ri-check">✓</span><span>계산 실수 유형 확인됨</span></div>
          <div id="r1-3" class="rubric-item math"><span class="ri-check">✓</span><span>조건 누락 유형 확인됨</span></div>
          <div id="r1-4" class="rubric-item math"><span class="ri-check">✓</span><span>로그 관련 오류 확인됨</span></div>
          <div class="rubric-bar-wrap">
            <div class="rubric-bar-track"><div class="rubric-bar-fill" id="s1-bar-fill" style="background:var(--math-primary);"></div></div>
            <p class="rubric-count-text" id="s1-bar-count">0 / 5 완료</p>
          </div>
        </div>
        <!-- 오답 누적 목록 -->
        <div class="mc" style="margin-top:0.75rem;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.6rem;">
            <div class="mc-title" style="margin:0;">누적 오답 목록 <span class="error-badge" id="error-count-badge">0</span></div>
            <button class="btn-secondary" style="font-size:0.72rem;padding:0.25rem 0.6rem;" onclick="clearAllErrors()">전체 삭제</button>
          </div>
          <div id="s1-error-list"><div class="empty-state">아직 입력된 오답이 없습니다.</div></div>
        </div>
      </div>
    </div>
  </div><!-- /math-s1 -->`;
