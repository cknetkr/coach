# SelfQ Migration Map

## Goal

Keep the current static prototype runnable in `test/`, while preparing a folder layout that can be moved into `selfq/src` later with less rework.

## Current static prototype

- `test/index.html`
- `test/pages/coach-korean.html`
- `test/pages/coach-math.html`
- `test/pages/coach-english.html`
- `test/pages/coach-korean-s3.html`
- `test/assets/css/coach-shared.css`
- `test/assets/css/coach-korean.css`
- `test/assets/css/coach-math.css`
- `test/assets/css/coach-english.css`
- `test/assets/js/coach-shared.js`

## New selfq-aligned source scaffold

- `test/src/pages/performance-coach/`
- `test/src/components/performance-coach/`
- `test/src/styles/performance-coach/`
- `test/src/lib/performance-coach/`
- `test/src/data/performance-coach/`
- `test/src/config/`

## File mapping

- Hub
  - Current: `test/index.html`
  - Later: `test/src/pages/performance-coach/PerformanceCoachHubPage.jsx`

- Korean
  - Current: `test/pages/coach-korean.html`
  - Later: `test/src/pages/performance-coach/PerformanceCoachKoreanPage.jsx`

- Math
  - Current: `test/pages/coach-math.html`
  - Later: `test/src/pages/performance-coach/PerformanceCoachMathPage.jsx`

- English
  - Current: `test/pages/coach-english.html`
  - Later: `test/src/pages/performance-coach/PerformanceCoachEnglishPage.jsx`

- Shared UI styles
  - Current: `test/assets/css/coach-shared.css`
  - Later: `test/src/styles/performance-coach/shared.css`

- Subject styles
  - Current: `test/assets/css/coach-korean.css`
  - Later: `test/src/styles/performance-coach/korean.css`
  - Current: `test/assets/css/coach-math.css`
  - Later: `test/src/styles/performance-coach/math.css`
  - Current: `test/assets/css/coach-english.css`
  - Later: `test/src/styles/performance-coach/english.css`

- Static JS helpers
  - Current: `test/assets/js/coach-shared.js`
  - Later split:
    - `test/src/lib/performance-coach/aiAdapters.js`
    - page-local handlers inside each React page

## Recommended migration order

1. Freeze static UX in `test/`
2. Extract shared copy/data into `src/data/performance-coach/`
3. Convert hub page to React
4. Convert math and english pages
5. Convert korean flow last because it has the heaviest local interaction state
6. Connect real AI adapters after UI boundaries are stable

## Important rule

Until migration starts for real, keep the current static prototype in `test/index.html`, `test/pages/`, and `test/assets/` as the source of truth for visual QA.

