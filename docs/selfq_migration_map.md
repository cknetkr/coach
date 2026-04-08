# SelfQ Migration Map

## Goal

Keep the current static prototype runnable in `test/`, while preparing a folder layout that can be moved into `selfq/src` later with less rework.

## Current static prototype

- `test/index.html`
- `test/coach-korean.html`
- `test/coach-math.html`
- `test/coach-english.html`
- `test/coach-korean-essay.html`
- `test/coach-shared.css`
- `test/coach-korean.css`
- `test/coach-math.css`
- `test/coach-english.css`
- `test/coach-shared.js`

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
  - Current: `test/coach-korean.html`
  - Later: `test/src/pages/performance-coach/PerformanceCoachKoreanPage.jsx`

- Math
  - Current: `test/coach-math.html`
  - Later: `test/src/pages/performance-coach/PerformanceCoachMathPage.jsx`

- English
  - Current: `test/coach-english.html`
  - Later: `test/src/pages/performance-coach/PerformanceCoachEnglishPage.jsx`

- Shared UI styles
  - Current: `test/coach-shared.css`
  - Later: `test/src/styles/performance-coach/shared.css`

- Subject styles
  - Current: `test/coach-korean.css`
  - Later: `test/src/styles/performance-coach/korean.css`
  - Current: `test/coach-math.css`
  - Later: `test/src/styles/performance-coach/math.css`
  - Current: `test/coach-english.css`
  - Later: `test/src/styles/performance-coach/english.css`

- Static JS helpers
  - Current: `test/coach-shared.js`
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

Until migration starts for real, keep the current root HTML prototype as the source of truth for visual QA.
