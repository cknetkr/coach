# performance-coach-prototype

Static prototype for the performance coach flow before `selfq` integration.

## Current entry points

- `index.html`
- `pages/coach-korean.html`
- `pages/coach-korean-s3.html`
- `pages/coach-math.html`
- `pages/coach-english.html`

## Purpose

- Validate layout and copy in a real browser
- Iterate on subject-specific coach flows quickly
- Prepare a later migration into `selfq`

## Source of truth

- Runtime prototype: `test/index.html`, `test/pages/`, `test/assets/`
- Future `selfq`-aligned scaffold: `test/src/`
- Migration notes: `test/docs/selfq_migration_map.md`

## Operating docs

- Agent entry: `D:/workbox/test/CLAUDE.md`
- Project start guide: `docs/GUIDE_agents.md`
- Session playbook: `docs/GUIDE_playbook.md`
- PLAN hub: `docs/plan/README.md`

## Legacy reference

- `docs/playbook.md`
- `docs/next_session_handoff.md`

이 두 파일은 기존 handoff 기록이다. 앞으로의 세션 운영 기준은 `GUIDE_playbook.md`를 우선한다.
