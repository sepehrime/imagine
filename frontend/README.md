# Inside the Network: Frontend

React 19 + Vite + Tailwind CSS app for the five interactive sections.

See the [root README](../README.md) for setup, the project overview and the folder structure.

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Dev server on http://localhost:5173 (proxies `/api` to the backend on :8000) |
| `npm run build` | Production build into `dist/` |
| `npm run lint` | oxlint |
| `npm test` | Unit tests (Vitest, `src/**/*.test.js`) |
| `npm run test:e2e` | End-to-end tests (Playwright, `e2e/`); starts its own servers |
| `npm run screenshots` | Re-capture the README screenshots (needs both dev servers running) |
