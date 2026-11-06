# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"Inside the Network" — an educational web app that teaches how neural networks work through five interactive sections (Neuron → Build → Forward Pass → Train → Decision Boundary). Monorepo with two fully decoupled halves that talk only over HTTP: `frontend/` (React 19 + Vite + Tailwind 3) and `backend/` (FastAPI + PyTorch/scikit-learn).

`plan.md` is the phase-by-phase roadmap with checkboxes — check it to see what's done and what comes next, and tick items off when you complete them. `lessons.md` is the author's running SWE knowledge base; new patterns or debugging lessons from this project get recorded there.

## Commands

Frontend (run from `frontend/`):
- `npm run dev` — Vite dev server on http://localhost:5173
- `npm run build` — production build
- `npm run lint` — oxlint (config in `.oxlintrc.json`: react + oxc plugins, `rules-of-hooks` is an error)

Backend (run from `backend/`, with `venv/` activated via `source venv/bin/activate`):
- `uvicorn main:app --reload --port 8000` — API server; Swagger docs at `/docs`, health check at `/health`

Tests:
- Backend (from `backend/`, venv active): `python -m pytest` — FastAPI `TestClient` tests in `tests/` (dev deps in `requirements-dev.txt`)
- Frontend unit (from `frontend/`): `npm test` — Vitest, files `src/**/*.test.js`
- End-to-end (from `frontend/`): `npm run test:e2e` — Playwright in `e2e/`; starts its own backend on :8765 and frontend on :5199, so it won't touch dev servers

## Architecture

**Frontend ↔ backend wiring.** Vite proxies `/api/*` to `http://localhost:8000` (`vite.config.js`), so frontend code should call relative `/api/...` paths. The backend also enables CORS for ports 5173/5174 in `main.py`. Every endpoint lives under `/api/<section>/...` except `/health`; all backend calls go through `src/api/client.js`. The README has an endpoint table, and `/docs` has the full schemas.

**Backend layout.** `main.py` only wires logging, CORS and routers. `routers/` (one per section, HTTP only), `schemas/` (Pydantic request/response models; docstrings and `Field` descriptions feed `/docs`), `models/network.py` (`ConfigurableNetwork`), `utils/` (`trainer.py` training loop, `datasets.py`, `boundary.py`), and `state.py` holding a global `AppState` so a model trained in Section 4 (`/api/train/*`, runs in a background thread, frontend polls status) is reused by Section 5 (`/api/boundary/*`). Keep CPU-heavy ML work off the async event loop: PyTorch handlers are plain `def`. `TRAINING_TARGET_SECONDS` (default 8) sets how long a paced training run takes; tests set it to 0 or 2.

**Frontend app shell.** `App.jsx` sets up `BrowserRouter` → `ScrollToTop` → `ThemeProvider` → `ProgressProvider` → `MotionConfig reducedMotion="user"` → `MainLayout` (persistent Header/Footer, `BackendStatusBanner`, `PageTransition`, `Celebration` confetti, shared `max-w-7xl` container) → `Routes`. Pages in `src/pages/` should not re-add page-level padding/containers.

**Section navigation is data-driven.** `SECTIONS_NAV` exported from `src/components/Header.jsx` is the single source of truth for the five sections (id 1–5, title, path, icon, desc). Header links, `SectionNavFooter` prev/next buttons, and section cards all derive from it — change section order/titles there, not in individual pages. Each section page renders `<SectionNavFooter currentSectionId={n} />`.

**Shared client state.**
- Theme: `src/context/ThemeContext.jsx` (`useTheme()`), persisted to `localStorage["theme"]`, toggles the `dark` class on `<html>`; Tailwind uses `darkMode: "class"`, so always pair light styles with `dark:` variants.
- Progress: `src/hooks/useProgress.js` holds the store (`useProgressStore`, called once by `<ProgressProvider>` in `src/context/ProgressContext.jsx`); components call `useProgress()`, which reads the context, so every component shares one state. Persisted to `localStorage["inside_network_progress"]` as an array of completed section ids, synced across tabs via the `storage` event. `TOTAL_SECTIONS` is hardcoded to 5 there — keep it in sync with `SECTIONS_NAV`.

Available frontend libs for visualizations: `framer-motion` (animation), `d3` (network graphs), `recharts` (loss/confidence charts), `axios` (API calls), `lucide-react` (icons).

## Conventions

- Components and hooks carry a JSDoc header listing the "SWE Design Patterns applied" — follow this style for new components/hooks, since the project doubles as a learning exercise.
- Never commit `venv/`, `node_modules/`, `dist/`, or model weight files (`.pt`, `.bin`).
