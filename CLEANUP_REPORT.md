# Cleanup Report

Code quality and maintainability review of the whole repo (`frontend/` and `backend/`), done after Phase 9 and the Definition of Done. **No code has been changed.** Each batch below is applied only after approval.

## Overall verdict

The codebase is already lean. knip found **1** unused export across 95 frontend files, there are **no** unused files or components, and only 0.12% of the code is duplicated at default thresholds. The main win is on the backend: **six unused Python packages** (~190 MB installed) that make `pip install` much slower than it needs to be. The rest is small dead code and two repeated page-layout blocks.

## Evidence gathered

| Tool | Scope | Result |
|---|---|---|
| `knip` | frontend | 1 unused export (`api` in `client.js`); no unused files or dependencies |
| `depcheck` | frontend | Flagged `tailwindcss`, `postcss`, `autoprefixer` (**false positives**: loaded by `postcss.config.js`) and `@types/react-dom` |
| `jscpd` (default 6 lines) | frontend | 1 clone, 12 lines (0.12%) |
| `jscpd` (4 lines / 40 tokens) | frontend | 16 clones, almost all the section-page header + concept-card grid |
| `deptry` | backend | 7 unused deps (`scikit-learn` is a **false positive**: imported as `sklearn`) |
| `vulture` (60%) | backend | 30 hits; 28 are **false positives**: FastAPI routes (registered by decorator), Pydantic fields, validators, `nn.Module.forward` |
| `radon cc` (C or worse) | backend | 1 function: `TrainingSession._run` (C, 11) |
| `oxlint` | frontend | exit 0; 2 deliberate warnings |
| grep | both | each candidate searched across `src/`, `e2e/`, `scripts/`, `tests/`, config and docs |

`git log` age analysis isn't useful here: the whole project is a few weeks old.

---

## Findings

### F1. Six unused Python dependencies
- **Location:** `backend/requirements.txt` lines 5–8, 10–11 (`torchvision`, `transformers`, `tokenizers`, `Pillow`, `matplotlib`, `python-multipart`)
- **Category:** 1 (dead code: dependencies)
- **Why it's unnecessary:** `deptry` flags all six; grep finds zero imports of `torchvision`, `transformers`, `tokenizers`, `PIL`, `matplotlib`, or any `UploadFile`/`Form`/`File` usage (which is what `python-multipart` is for). These are leftovers from the project's earlier "How AI Works" scope (see lessons 6.3).
- **Confidence:** High
- **Impact of removal:** ~190 MB less in the venv (transformers 121 MB, matplotlib 33 MB, Pillow 13 MB, torchvision 10 MB, tokenizers 10 MB, plus `huggingface_hub` and its dependencies); much faster first-time setup for a new developer.
- **Risks:** ⚠️ **Hidden transitive dependency.** FastAPI's `TestClient` (Starlette 1.10) needs `httpx2`, and the **only** thing installing it today is `huggingface_hub`, which comes from `transformers`/`tokenizers`. Removing them naively breaks all 49 backend tests with `ImportError: The starlette.testclient module requires the httpx2 package`.
- **Cleanup plan:**
  1. Remove the six lines from `requirements.txt`.
  2. Add `httpx2` to `requirements-dev.txt` (test-only dependency).
  3. Verify in a **fresh** venv (not the existing one, which still has the packages): `python3 -m venv /tmp/v && /tmp/v/bin/pip install -r requirements-dev.txt && /tmp/v/bin/python -m pytest`; then run `npm run test:e2e` (it starts its own backend).
  4. Update lessons.md 6.3, which currently notes these packages as unused.

### F2. Section page header duplicated in all 5 section pages
- **Location:** `Neuron.jsx` 106–145, `Build.jsx` 87–114, `ForwardPass.jsx` 159–187, `Train.jsx` 136–169, `Boundary.jsx` 137–165
- **Category:** 2 (duplicate logic)
- **Why it's unnecessary:** jscpd reports the badge + "● Completed" + `<h1>` + intro block as clones between every pair of pages. Each one also hardcodes `"Section N of 5"` and the section's icon, which `SECTIONS_NAV` already holds, so changing the section order needs edits in 5 places. That defeats the single-source-of-truth design described in `CLAUDE.md`.
- **Confidence:** Medium (the structure is identical; per-section accent colours and intro text differ)
- **Impact of removal:** ~60–70 lines removed; one `<SectionHeader sectionId={n} accent="emerald" title=… >intro</SectionHeader>` per page; section number and icon derived from `SECTIONS_NAV`.
- **Risks:** Tailwind can't see class names built at runtime (lessons 4.27), so accents need a literal map (`{ emerald: "bg-emerald-100 text-emerald-800 …" }`), not `` `bg-${accent}-100` ``. Visual regressions are possible; e2e tests check `h1` text (`app.spec.js` "every route") and `"● Completed"`.
- **Cleanup plan:** create `components/SectionHeader.jsx` with an accent map; replace the five blocks; run `npm run lint && npm test && npm run test:e2e`; compare screenshots of each section in light and dark mode (`npm run screenshots`).

### F3. Concept-card grid duplicated (4 pages, 2 different implementations)
- **Location:** `Build.jsx` 115–131 (+ `CONCEPTS` at 45), `Train.jsx` 170–186 (+ 65), `Boundary.jsx` 166–182 (+ 50) map a `CONCEPTS` array inline; `ForwardPass.jsx` 188–202 uses its own local `ConceptCard` (414–427)
- **Category:** 2 (duplicate logic)
- **Why it's unnecessary:** the same card markup appears four times, differing only in accent colour. jscpd matches Build↔Train, Build↔Boundary and ForwardPass↔Train. (Neuron's "4 steps" block has a different layout and is correctly separate.)
- **Confidence:** Medium
- **Impact of removal:** ~40 lines; one shared `ConceptCard` with the same accent map as F2.
- **Risks:** same Tailwind-literal-class constraint as F2; visual only.
- **Cleanup plan:** move `ForwardPass`'s `ConceptCard` to `components/ConceptCard.jsx`, add an `accent` prop, and use it in the 3 mapped grids. Do this together with F2 so they share one accent map. Verify as for F2.

### F4. `LoadingSpinner` block variant and `md`/`lg` sizes are unused
- **Location:** `frontend/src/components/LoadingSpinner.jsx` 16–20, 34–49
- **Category:** 3 (unused UI)
- **Why it's unnecessary:** after Phase 9's skeletons, the only two callers (`ForwardPass.jsx:351`, `Boundary.jsx:276`) both pass `inline size="sm"`. The full-width block branch and the `md`/`lg` sizes have no callers.
- **Confidence:** High
- **Impact of removal:** ~20 lines; the component becomes a single inline spinner. Its `sizeClasses[…].split(" ")` string-splitting also goes away.
- **Risks:** none at runtime. The e2e "loading states" test now targets the skeleton's `role="status"`, not the spinner.
- **Cleanup plan:** drop the `inline`/`size` props and the block branch; remove `inline size="sm"` at the two call sites; run lint + e2e (`errors.spec.js`, `sections.spec.js`).

### F5. `markCompleted` in `useProgress` has no callers
- **Location:** `frontend/src/hooks/useProgress.js` 80–85, 116
- **Category:** 1 (dead code)
- **Why it's unnecessary:** grep finds 0 uses outside the hook; every page uses `toggleCompleted`.
- **Confidence:** High
- **Impact of removal:** 7 lines and a smaller hook API.
- **Risks:** none; not a public API.
- **Cleanup plan:** delete it and its return entry; run `npm run lint && npm run test:e2e`.

### F6. Legacy service name in `/health`
- **Location:** `backend/routers/health.py` 9
- **Category:** 5 (legacy)
- **Why it's unnecessary:** `SERVICE_NAME = "how-ai-works-backend"` is the project's old name, the only reference left in the code (lessons 6.3 fixed the rest).
- **Confidence:** Medium (it changes a response value)
- **Impact of removal:** consistency; nothing reads `service` (no test, frontend code or README sample asserts it).
- **Risks:** an external monitor matching the string, which is unlikely for a local educational app.
- **Cleanup plan:** rename to `"inside-the-network-backend"`; run `python -m pytest`.

### F7. `Tooltip`'s `position` prop is never passed
- **Location:** `frontend/src/components/Tooltip.jsx` 10, 29–42
- **Category:** 4 (overly complex)
- **Why it's unnecessary:** all 4 callers use the default `"top"`, so the `"bottom"` branches (two ternaries) never run.
- **Confidence:** High
- **Impact of removal:** ~6 lines; simpler class strings.
- **Risks:** none today; re-adding it later is easy.
- **Cleanup plan:** drop the prop and the two ternaries; check one tooltip visually and run e2e.

### F8. `api` exported from `client.js` but only used inside it
- **Location:** `frontend/src/api/client.js` 15
- **Category:** 1 (dead code: export)
- **Why it's unnecessary:** knip; grep confirms no importer. Keeping it unexported enforces the "every call goes through a named function" gateway rule in `CLAUDE.md`.
- **Confidence:** High
- **Impact of removal:** 1 word; a tighter module boundary.
- **Risks:** none.
- **Cleanup plan:** `export const api` → `const api`; run `npm run build`.

### F9. `ConfigurableNetwork.activation_name` is set but never read
- **Location:** `backend/models/network.py` 41
- **Category:** 1 (dead code)
- **Why it's unnecessary:** vulture; grep shows the only reads are of `output_activation_name` (a different property).
- **Confidence:** High
- **Impact of removal:** 1 line.
- **Risks:** none; not serialised anywhere.
- **Cleanup plan:** delete the line; run `python -m pytest`.

### F10. `backend/.gitkeep` placeholder
- **Location:** `backend/.gitkeep`
- **Category:** 7 (abandoned file)
- **Why it's unnecessary:** `.gitkeep` only exists to commit an empty folder; `backend/` now holds the whole API.
- **Confidence:** High
- **Impact of removal:** 1 file; less clutter.
- **Risks:** none.
- **Cleanup plan:** `git rm backend/.gitkeep`.

---

## Summary (sorted by impact × confidence)

| # | Finding | Category | Impact | Confidence | Batch |
|---|---|---|---|---|---|
| F1 | 6 unused Python deps (~190 MB) | Dead deps | **High** | High | 3 |
| F2 | Section header duplicated ×5 | Duplication | Medium | Medium | 4 |
| F3 | Concept-card grid duplicated ×4 | Duplication | Medium | Medium | 4 |
| F4 | `LoadingSpinner` unused variant/sizes | Unused UI | Low–Med | High | 1 |
| F5 | `markCompleted` unused | Dead code | Low | High | 1 |
| F7 | `Tooltip` `position` never passed | Complexity | Low | High | 1 |
| F8 | `api` export unused | Dead export | Low | High | 1 |
| F9 | `activation_name` never read | Dead code | Low | High | 2 |
| F10 | `backend/.gitkeep` | Abandoned file | Low | High | 2 |
| F6 | Legacy `how-ai-works-backend` name | Legacy | Low | Medium | 2 |

## Batches (each one commit, safest first)

1. ✅ **Applied:** **Frontend dead code** (F4, F5, F7, F8). No behaviour change. Verify: `npm run lint && npm test && npm run build && npm run test:e2e`. Result: 6 files, −60/+14 lines; lint exit 0, 31 unit + 31 e2e pass, knip reports 0 unused exports.
2. ✅ **Applied:** **Backend dead code and legacy name** (F9, F10, F6). Verify: `python -m pytest`, then `npm run test:e2e`. Result: 49 backend + 31 e2e pass; `/health` now returns `"service": "inside-the-network-backend"`.
3. ✅ **Applied:** **Remove unused Python dependencies** (F1, adding `httpx2` to dev deps). Verify in a **fresh venv**, then e2e. Result: fresh venv installs 23 fewer packages (~240 MB); none of the removed packages come back as hidden dependencies; 49 backend tests pass; all 31 e2e pass against a backend running from the trimmed venv. Exposed F11 below.
4. **Shared `SectionHeader` + `ConceptCard`** (F2, F3). The largest change, visual only. Verify: full test suite + light/dark screenshots of all 5 sections.

## New finding from Batch 3

### F11. Python dependencies have no version pins
- **Location:** `backend/requirements.txt`, `backend/requirements-dev.txt`
- **Category:** 8 (technical debt)
- **Evidence:** a fresh install picks up torch **2.15** (635 MB); the existing venv has **2.10** (402 MB). Every package floats to the latest release, so two developers following the README can end up with different libraries, and a future major release (as with Starlette moving `TestClient` from `httpx` to `httpx2`) can break a fresh setup with no change in this repo.
- **Confidence:** High that it's a risk; how much it matters is your call.
- **Options:** (a) pin exact versions with a lock file (`pip freeze > requirements.lock`, or `pip-tools`/`uv pip compile`): fully reproducible, but needs periodic updates; (b) add lower/upper bounds (`torch>=2.10,<3`): blocks breaking releases, stays flexible; (c) leave it unpinned, which suits a learning project that should always run on current libraries.

## Do not touch without a human decision

- **Boundary page makes two requests (`/status` then `/grid`).** It looks redundant, since `/grid` already returns 409 when there's no model, but it's **deliberate**: it keeps the browser console free of the 409 error the e2e fixture would fail on (lessons 4.25). To make it one request, change the API so `/grid` returns `200 { model: null }`. That's a public API change, so it's your call.
- **`@types/react`, `@types/react-dom` devDependencies.** The project has no TypeScript, but these power editor autocomplete for JSX in VS Code. Keep them if you rely on that.
- **`TrainingSession._run` complexity (radon C, 11).** It's long but linear and heavily commented as a teaching example of the training loop. Splitting it would hide the "one loop" story the code is meant to show. Recommend leaving it as is.
- **Lint warnings in `Header.jsx` / `ThemeContext.jsx` (`only-export-components`).** Fixing them means moving `SECTIONS_NAV` and `useTheme` into separate files, which changes the import path that `CLAUDE.md` documents as the single source of truth. Low value; only worth it if Fast Refresh glitches on those files.

## Checked and found clean

No unused files, components, routes or endpoints (every one of the 13 backend routes is called by the frontend and covered by tests). No N+1 or repeated fetches apart from the deliberate one above. No feature flags, migration shims or compatibility layers. `frontend/README.md` (fixed in Phase 8), `public/favicon.svg`, `scripts/capture-screenshots.cjs` and `e2e/global-teardown.js` are all referenced.
