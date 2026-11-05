# 📘 Software Engineering Knowledge Base & Lessons Learned

> **Project:** *Inside the Network* (Interactive Neural Network Visualizer)  
> **Purpose:** This document is a living repository of professional software engineering principles, design patterns, architecture decisions, and real-world debugging lessons applied while building this project.

---

## 📑 Table of Contents

1. [Architecture, Git, and Project Hygiene](#1-architecture-git-and-project-hygiene)
   - [1.1 Monorepo vs. Polyrepo Architecture](#11-monorepo-vs-polyrepo-architecture)
   - [1.2 Version Control Hygiene & `.gitignore` Architecture](#12-version-control-hygiene--gitignore-architecture)
   - [1.3 The 12-Factor App & Configuration Isolation](#13-the-12-factor-app--configuration-isolation)
   - [1.4 The "Front Door" of a Codebase (`README.md`)](#14-the-front-door-of-a-codebase-readmemd)
   - [1.5 Lockfiles (`package-lock.json`) & Deterministic Builds](#15-lockfiles-package-lockjson--deterministic-builds)
   - [1.6 Scaffolding Debt & Template Asset Hygiene](#16-scaffolding-debt--template-asset-hygiene)

2. [Backend Architecture & API Design](#2-backend-architecture--api-design)
   - [2.1 Architecture Decision Record (ADR): Why FastAPI?](#21-architecture-decision-record-adr-why-fastapi)
   - [2.2 Strict Data Contracts with Pydantic (Type Safety at Boundaries)](#22-strict-data-contracts-with-pydantic-type-safety-at-boundaries)
   - [2.3 Living API Documentation (OpenAPI / Swagger UI)](#23-living-api-documentation-openapi--swagger-ui)
   - [2.4 Concurrency in Python: ASGI vs. WSGI & The Threadpool Trap](#24-concurrency-in-python-asgi-vs-wsgi--the-threadpool-trap)
   - [2.5 In-Memory Integration Testing with `TestClient`](#25-in-memory-integration-testing-with-testclient)
   - [2.6 Binary Wheels & C-Extension Platform Compatibility](#26-binary-wheels--c-extension-platform-compatibility)
   - [2.7 Keep `main.py` Thin: Every Route Lives in a Router](#27-keep-mainpy-thin-every-route-lives-in-a-router)
   - [2.8 A Reference Implementation Endpoint (`/api/neuron/compute`)](#28-a-reference-implementation-endpoint-apineuroncompute)
   - [2.9 Verify the Checklist Against Running Code, Not Memory](#29-verify-the-checklist-against-running-code-not-memory)

3. [Frontend Architecture & State Management](#3-frontend-architecture--state-management)
   - [3.1 Dev Server Reverse Proxy vs. Cross-Origin Resource Sharing (CORS)](#31-dev-server-reverse-proxy-vs-cross-origin-resource-sharing-cors)
   - [3.2 Native ES Modules (ESM) & Vite vs. Legacy Bundlers (Webpack)](#32-native-es-modules-esm--vite-vs-legacy-bundlers-webpack)
   - [3.3 The Layout Wrapper Pattern (`MainLayout.jsx`)](#33-the-layout-wrapper-pattern-mainlayoutjsx)
   - [3.4 The Theme Provider Pattern & State Encapsulation (`ThemeContext.jsx`)](#34-the-theme-provider-pattern--state-encapsulation-themecontextjsx)
   - [3.5 Single Source of Truth (SSOT) for Navigation Data](#35-single-source-of-truth-ssot-for-navigation-data)
   - [3.6 Event Listeners, React Refs, and Memory Leak Prevention](#36-event-listeners-react-refs-and-memory-leak-prevention)
   - [3.7 Client-Side Routing (CSR) vs. Server-Side Routing (SSR)](#37-client-side-routing-csr-vs-server-side-routing-ssr)
   - [3.8 SPA Scroll Restoration Pattern (`ScrollToTop.jsx`)](#38-spa-scroll-restoration-pattern-scrolltotopjsx)
   - [3.9 Dynamic Flow Pagination & The DRY Principle (`SectionNavFooter.jsx`)](#39-dynamic-flow-pagination--the-dry-principle-sectionnavfooterjsx)
   - [3.10 Defensive Routing: Catch-All 404 Handlers & Recovery Pathways](#310-defensive-routing-catch-all-404-handlers--recovery-pathways)
   - [3.11 Presentational vs. Container Components (Props Down, Events Up)](#311-presentational-vs-container-components-props-down-events-up)
   - [3.12 Accessibility by Default: WAI-ARIA Roles for Dynamic UI](#312-accessibility-by-default-wai-aria-roles-for-dynamic-ui)
   - [3.13 Tooltip vs. Popover: Choosing the Right Overlay](#313-tooltip-vs-popover-choosing-the-right-overlay)
   - [3.14 Designing for Async States Before the API Exists](#314-designing-for-async-states-before-the-api-exists)
   - [3.15 Custom Hooks as a Storage Abstraction Layer (`useProgress.js`)](#315-custom-hooks-as-a-storage-abstraction-layer-useprogressjs)
   - [3.16 Never Trust Persisted Data: Validate at Every Boundary](#316-never-trust-persisted-data-validate-at-every-boundary)
   - [3.17 Cross-Tab Sync & The `storage` Event `null` Bug (Debugging Lesson)](#317-cross-tab-sync--the-storage-event-null-bug-debugging-lesson)
   - [3.18 Derived State, Functional Updates & Stable Callbacks](#318-derived-state-functional-updates--stable-callbacks)
   - [3.19 Hook Instances Don't Share State: When to Lift into Context](#319-hook-instances-dont-share-state-when-to-lift-into-context)
   - [3.20 Gap Analysis: Audit Existing Code Against the Spec Before Building](#320-gap-analysis-audit-existing-code-against-the-spec-before-building)
   - [3.21 Respecting `prefers-reduced-motion` & Decorative Graphics](#321-respecting-prefers-reduced-motion--decorative-graphics)
   - [3.22 Precompute Static Data Outside the Component](#322-precompute-static-data-outside-the-component)
   - [3.23 Isolating Business Rules in Pure Functions (`suggestNextSection`)](#323-isolating-business-rules-in-pure-functions-suggestnextsection)
   - [3.24 One Glossary, Many Readers: Content as a Single Source of Truth](#324-one-glossary-many-readers-content-as-a-single-source-of-truth)
   - [3.25 Deep Links in an SPA: Hashes vs. Scroll-to-Top](#325-deep-links-in-an-spa-hashes-vs-scroll-to-top)
   - [3.26 Hover + Click Toggle Fight (Debugging Lesson)](#326-hover--click-toggle-fight-debugging-lesson)
   - [3.27 Search, Letter Navigation & Responsive Sticky Bars](#327-search-letter-navigation--responsive-sticky-bars)
   - [3.28 Safe External Links: `target="_blank"` + `rel`](#328-safe-external-links-target_blank--rel)

4. [Interactive Visualizations (Phase 4)](#4-interactive-visualizations-phase-4)
   - [4.1 Compute on the Client When the Math Is Cheap](#41-compute-on-the-client-when-the-math-is-cheap)
   - [4.2 The Strategy Pattern for Swappable Algorithms (`ACTIVATIONS`)](#42-the-strategy-pattern-for-swappable-algorithms-activations)
   - [4.3 "D3 for Math, React for DOM"](#43-d3-for-math-react-for-dom)
   - [4.4 Replaying Animations with a Changing `key`](#44-replaying-animations-with-a-changing-key)
   - [4.5 Normalising Values with Different Ranges (Min-Max Scaling)](#45-normalising-values-with-different-ranges-min-max-scaling)
   - [4.6 Theme-Aware SVG: Tailwind Classes & CSS Variables](#46-theme-aware-svg-tailwind-classes--css-variables)
   - [4.7 Enter / Update / Exit Animations with Stable, Role-Based Keys](#47-enter--update--exit-animations-with-stable-role-based-keys)
   - [4.8 Invisible Hit Areas for Thin SVG Elements](#48-invisible-hit-areas-for-thin-svg-elements)
   - [4.9 Draft vs. Committed State ("Lock This Architecture")](#49-draft-vs-committed-state-lock-this-architecture)
   - [4.10 Counting Parameters Correctly (Domain Accuracy in the UI)](#410-counting-parameters-correctly-domain-accuracy-in-the-ui)
   - [4.11 Reproducible Randomness: Seeds & Local Generators](#411-reproducible-randomness-seeds--local-generators)
   - [4.12 Logits vs. Probabilities: Keep `forward()` Raw](#412-logits-vs-probabilities-keep-forward-raw)
   - [4.13 Routers, Schemas & Models: Structuring a FastAPI Feature](#413-routers-schemas--models-structuring-a-fastapi-feature)
   - [4.14 Async UI Safety: Cancellation, State Machines & Stale Results](#414-async-ui-safety-cancellation-state-machines--stale-results)
   - [4.15 Timer-Driven Animation with `useEffect` Cleanup](#415-timer-driven-animation-with-useeffect-cleanup)
   - [4.16 `white-space: nowrap` Swallowed the Line Break (Debugging Lesson)](#416-white-space-nowrap-swallowed-the-line-break-debugging-lesson)
   - [4.17 Background Threads in a Web Server: Locks, Events & Snapshots](#417-background-threads-in-a-web-server-locks-events--snapshots)
   - [4.18 Polling Done Right: `setTimeout` Chains & Incremental Sync](#418-polling-done-right-settimeout-chains--incremental-sync)
   - [4.19 Shared App State: "Current Run" vs. "Last Good Model"](#419-shared-app-state-current-run-vs-last-good-model)
   - [4.20 Failing Loudly in Worker Threads (and the NaN-in-JSON Trap)](#420-failing-loudly-in-worker-threads-and-the-nan-in-json-trap)
   - [4.21 Log-Scale Sliders](#421-log-scale-sliders)
   - [4.22 Chart Hygiene: One Measure per Chart & Redundant Encoding](#422-chart-hygiene-one-measure-per-chart--redundant-encoding)
   - [4.23 Reading a Model While Another Thread Trains It (Snapshot Copies)](#423-reading-a-model-while-another-thread-trains-it-snapshot-copies)
   - [4.24 Canvas for Pixels, SVG for Shapes](#424-canvas-for-pixels-svg-for-shapes)
   - [4.25 Empty States Are Not Errors: 409 "No Model Yet"](#425-empty-states-are-not-errors-409-no-model-yet)
   - [4.26 Self-Terminating Polling & Derived "After" State](#426-self-terminating-polling--derived-after-state)
   - [4.27 Tailwind Can't See Class Names You Build at Runtime (Debugging Lesson)](#427-tailwind-cant-see-class-names-you-build-at-runtime-debugging-lesson)

5. [Testing & Quality (Phase 7)](#5-testing--quality-phase-7)
   - [5.1 The Testing Pyramid: Unit, API & End-to-End](#51-the-testing-pyramid-unit-api--end-to-end)
   - [5.2 Isolated Test Servers & Config via Environment Variables](#52-isolated-test-servers--config-via-environment-variables)
   - [5.3 Route Mocks That Match Too Much (Debugging Lesson)](#53-route-mocks-that-match-too-much-debugging-lesson)
   - [5.4 Strict Locators: Ambiguity Is a Test Failure, Not a Guess](#54-strict-locators-ambiguity-is-a-test-failure-not-a-guess)
   - [5.5 When a Test Fails, Check the Test's Expectation First](#55-when-a-test-fails-check-the-tests-expectation-first)

6. [Documentation (Phase 8)](#6-documentation-phase-8)
   - [6.1 Docstrings That Do Double Duty: FastAPI's `/docs`](#61-docstrings-that-do-double-duty-fastapis-docs)
   - [6.2 Comment the *Why*, Not the *What*](#62-comment-the-why-not-the-what)
   - [6.3 Documentation Drift: Check Every Claim Against the Code](#63-documentation-drift-check-every-claim-against-the-code)
   - [6.4 Screenshots as Code](#64-screenshots-as-code)

---

## 1. Architecture, Git, and Project Hygiene

### 1.1 Monorepo vs. Polyrepo Architecture
* **The Concept:** A **monorepo** houses multiple related sub-projects (e.g. `frontend/` and `backend/`) within a single Git repository, whereas a **polyrepo** splits each service into separate repositories.
* **Why It Matters Here:**
  * For full-stack applications where frontend features directly consume backend APIs, a monorepo allows **atomic Git commits**. An API change and the UI update consuming it can be committed, reviewed, and deployed together.
* **The Golden Rule:** Keep dependency trees strictly decoupled. The frontend must have its own `package.json` and build toolchain; the backend its own virtual environment and `requirements.txt`. They must only communicate over standard HTTP/REST or WebSocket interfaces, never by directly importing source code across the boundary.

---

### 1.2 Version Control Hygiene & `.gitignore` Architecture
* **The Rule:** Never commit generated build artifacts (`dist/`), installed dependencies (`node_modules/`, `venv/`), environment secrets (`.env`), OS metadata (`.DS_Store`), or heavy binary model weights (`.pt`, `.bin`).
* **Why This Matters:**
  1. **Platform-Specific C-Extensions:** Libraries like NumPy, PyTorch, or Node packages with native bindings download pre-compiled C/C++ binaries tailored to your exact operating system and CPU architecture (e.g. macOS ARM64 vs Linux x86_64). Committing dependencies breaks the project on other machines.
  2. **Git Repository Bloat:** Git is an append-only object database optimized for text diffs. Committing large folders like `node_modules` (tens of thousands of tiny files) or model weights (gigabytes of binary blobs) permanently bloats repository clone and pull times.
  3. **Model Registries:** Pre-trained machine learning weights belong in dedicated model hubs (Hugging Face Hub, AWS S3, or GCS), not Git commits.

---

### 1.3 The 12-Factor App & Configuration Isolation
* **The Concept:** Rule III of the [Twelve-Factor App methodology](https://12factor.net/config) states: *Store configuration in the environment*.
* **Practice:** Code should be 100% agnostic to where it runs. Hostnames, ports, and API keys must be loaded from environment variables (e.g. `VITE_API_URL` or Pydantic `BaseSettings`), not hardcoded in JavaScript or Python strings.
* Provide committed `.env.example` templates with empty placeholder keys so collaborators know what configuration is needed without exposing real secrets.

---

### 1.4 The "Front Door" of a Codebase (`README.md`)
* **The Concept:** The root `README.md` is the developer interface to your codebase.
* **SWE Standard:** A production-grade README must provide:
  1. High-level architecture diagram.
  2. Concrete rationale for key technology choices.
  3. Strict list of prerequisites (Node version, Python version).
  4. Deterministic, copy-pasteable setup commands that work on a clean machine.

---

### 1.5 Lockfiles (`package-lock.json`) & Deterministic Builds
* **The Concept:** While `package.json` specifies broad version constraints (e.g. `^19.3.1`, where `^` permits minor/patch updates), `package-lock.json` pins the exact resolved version, nested dependency graph, and SHA-512 cryptographic checksums.
* **Why It Matters:** Without a lockfile, running `npm install` on Monday might install version `1.2.0`, while running it on Friday installs `1.2.1` which introduces a breaking bug. Lockfiles ensure byte-for-byte identical builds across local machines, staging environments, and CI/CD pipelines.

---

### 1.6 Scaffolding Debt & Template Asset Hygiene
* **The Trap:** Scaffolding generators (`create-vite`, `create-react-app`) generate sample logos (`react.svg`, `vite.svg`), starter templates, and default titles (`<title>frontend</title>`). Leaving these in place is called **scaffolding debt**.
* **Why Cleaning It Up Matters:**
  1. Eliminates 404 network warnings from dead asset links.
  2. Reduces production bundle size.
  3. Establishes clean domain identity and branding before feature development starts.

---

## 2. Backend Architecture & API Design

### 2.1 Architecture Decision Record (ADR): Why FastAPI?
In professional engineering, choosing a framework is documented as an **Architecture Decision Record**:

| Alternative | Trade-off Analysis |
| :--- | :--- |
| **Node.js / Express** | Excellent for asynchronous I/O, but lacks native machine learning support. Running PyTorch or Scikit-learn requires clumsy inter-process communication with Python scripts. |
| **Django** | "Batteries-included" monolith with built-in ORM, admin panel, and template engine. Far too heavy for a pure, stateless machine learning API. |
| **Flask** | Lightweight, but uses legacy synchronous WSGI by default, lacks built-in data validation, and requires 5+ third-party plugins (`flask-pydantic`, `flask-swagger`, `flask-cors`) to match FastAPI. |
| **FastAPI** | **Chosen.** Native Python ML support + built-in Pydantic validation + automatic Swagger UI + modern ASGI concurrency. |

---

### 2.2 Strict Data Contracts with Pydantic (Type Safety at Boundaries)
* **The Problem:** In ML systems, feeding malformed data (e.g. string instead of float, wrong tensor dimensions) causes cryptic internal C-level matrix crashes.
* **The Solution:** In FastAPI, incoming and outgoing data structures are declared as **Pydantic models (DTOs - Data Transfer Objects)**:
  ```python
  from pydantic import BaseModel, Field

  class Point2D(BaseModel):
      x: float = Field(..., description="X coordinate")
      y: float = Field(..., description="Y coordinate")
      label: int = Field(..., ge=0, le=1, description="Binary classification label")

  class ClassifyRequest(BaseModel):
      points: list[Point2D]
  ```
* **Benefits:**
  1. **Fail-Fast Validation:** If a client passes an invalid property, FastAPI intercepts it at the HTTP boundary and returns a clear `422 Unprocessable Entity` before Python ML code ever executes.
  2. **Self-Documenting Code:** Schemas clearly declare expected shapes to frontend developers and auto-generate API documentation.

---

### 2.3 Living API Documentation (OpenAPI / Swagger UI)
* FastAPI automatically inspects function signatures and Pydantic schemas to expose interactive documentation at `/docs` (Swagger UI) and `/redoc`.
* **SWE Best Practice:** Frontend and backend engineers should use `/docs` as a shared contract. Endpoints can be tested directly from the browser before frontend integration begins.

---

### 2.4 Concurrency in Python: ASGI vs. WSGI & The Threadpool Trap
* **The Mechanism:** FastAPI runs on **ASGI** (`uvicorn`), which uses a single-threaded `asyncio` event loop.
* **The Trap:** If you declare a route as `async def` and run heavy CPU computation (like PyTorch neural network training or matrix multiplication), **you block the single-threaded event loop**. While the model trains, the server cannot accept new connections or respond to `/health` requests.
* **The Solution:**
  * Declare CPU-bound ML endpoints as standard synchronous functions: `def train_model():` (omitting `async`).
  * FastAPI detects synchronous functions and automatically delegates them to Starlette's external worker **threadpool**, keeping the main event loop completely free.

---

### 2.5 In-Memory Integration Testing with `TestClient`
* **The Trap:** Manually spinning up a web server in a terminal, switching to another terminal or browser, and running `curl` to see if an endpoint works.
* **The SWE Solution:** Use `fastapi.testclient.TestClient`. It uses `httpx` to dispatch requests directly to the FastAPI ASGI application in memory.
* **Why This Matters:**
  * Runs tests in milliseconds.
  * No TCP port binding collisions (`EADDRINUSE: port 8000 already in use`).
  * Can be executed continuously in automated CI pipelines (GitHub Actions).

---

### 2.6 Binary Wheels & C-Extension Platform Compatibility
* Deep learning libraries (`torch`, `torchvision`, `numpy`, `scikit-learn`) are written in C/C++ with Python bindings.
* When a new Python version is released (e.g. Python 3.14), precompiled binary wheels (`.whl`) may not immediately exist on PyPI for every platform (such as Apple Silicon ARM64).
* In production engineering, always target stabilized Python versions (e.g. Python 3.10–3.12) where pre-built binary wheels are guaranteed, avoiding the need to compile complex C++ code from source on user machines.

---

### 2.7 Keep `main.py` Thin: Every Route Lives in a Router
* **Phase:** 5.1
* **The Concept:** `main.py` is the **composition root**: it creates the app, configures cross-cutting concerns (CORS, logging) and plugs routers in. It contains no endpoints itself:
  ```python
  app.include_router(health.router)
  app.include_router(neuron.router)
  app.include_router(forward_pass.router)
  app.include_router(train.router)
  app.include_router(boundary.router)
  ```
* **Why move even a 3-line `/health`?** Consistency is what makes a codebase navigable: "where's endpoint X?" always has the same answer (`routers/<feature>.py`). It also lets each router be tested, documented (`tags=`) and versioned on its own.
* **Every endpoint has a contract:** each route declares a Pydantic `response_model` (and request model for bodies), all in `schemas/`. The only exception is `POST /api/train/reset`, which returns **204 No Content**, so there's no body to describe.

---

### 2.8 A Reference Implementation Endpoint (`/api/neuron/compute`)
* **Phase:** 5.3
* **The Situation:** Section 1 deliberately computes the neuron in the browser for instant slider feedback (lesson 4.1). So why build the endpoint?
* **Its job is to be the reference:** the same formula computed by PyTorch (`float64`, `torch.sigmoid` etc.) gives a trusted answer to compare the JavaScript against. With the Section 1 defaults it returns `z = 1.0`, `output = 0.7311`, exactly what the page shows (`1.00`, `0.731`). Phase 7 can turn that into an automated cross-check.
* **Validate relationships, not just fields:** each field has a range, but the important rule spans two fields: *one weight per input*. That's a Pydantic `@model_validator(mode="after")`, so a mismatch is a clear 422 instead of a PyTorch shape error (500) deep inside the route.

---

### 2.9 Verify the Checklist Against Running Code, Not Memory
* **Phase:** 5 (closing the phase)
* **The Concept:** Before ticking a phase complete, every item was re-checked by **running** it, in one `TestClient` script: health, neuron math against `math.tanh` / sigmoid, forward-pass shape, start → pause → resume → finish → model saved, 100×100 grid, point prediction, reset, and the 409 empty state.
* **Introspect, don't eyeball:** "Do *all* endpoints have schemas?" was answered from the generated OpenAPI spec (`app.openapi()`), which lists each operation's request and response model. That's the same source `/docs` uses, so it can't disagree with what clients see.
* **Debugging note:** a first attempt looped over `app.routes` looking for `APIRoute` objects and printed *nothing*. This FastAPI version stores included routers as lazy wrappers. An empty result is not a pass: a check that can't fail isn't a check. Switching to the OpenAPI spec gave a real answer.
* **Honest ticking:** an earlier pass had ticked "schemas for all endpoints" before neuron/health existed; it was unticked until it was actually true.

---

## 3. Frontend Architecture & State Management

### 3.1 Dev Server Reverse Proxy vs. Cross-Origin Resource Sharing (CORS)
* **The Same-Origin Policy (SOP):** Web browsers prevent JavaScript running on origin `http://localhost:5173` from accessing resources on `http://localhost:8000` unless the server explicitly grants permission.
* **The Dual Defense Pattern:**
  1. **Development Proxy:** In `vite.config.js`, configure `server.proxy` to route `/api/*` and `/health` requests. The browser sends requests to `localhost:5173`, and Vite proxies them behind the scenes to `8000`. To the browser, all traffic is same-origin.
  2. **FastAPI CORSMiddleware:** Configures `Access-Control-Allow-Origin` headers for production or direct cross-origin calls.
  3. **Defensive Port Fallbacks:** If port `5173` is occupied by another local project, Vite automatically falls back to `5174`. Including both `5173` and `5174` in CORS allowed origins prevents silent connection failures.

---

### 3.2 Native ES Modules (ESM) & Vite vs. Legacy Bundlers (Webpack)
* **Legacy Bundlers (Webpack):** Crawl, bundle, and compile the entire application into monolithic bundle files before starting the development server. As codebases grow, cold-start times grow linearly to 30–60+ seconds.
* **Vite & Modern ESM:** The browser natively requests ES Modules on demand (`import`/`export`). Vite only transforms the single file requested. Changes reflect instantly in milliseconds via **Hot Module Replacement (HMR)**.

---

### 3.3 The Layout Wrapper Pattern (`MainLayout.jsx`)
* **The Anti-Pattern:** Importing `<Header />` and `<Footer />` inside every individual page component.
  * *Consequence:* Every route change unmounts and remounts the navigation bar and footer, causing visual flickering, resetting menu state, and re-running header effects.
* **The Pattern:** A single persistent layout wrapper:
  ```jsx
  export default function MainLayout({ children }) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-4">{children}</main>
        <Footer />
      </div>
    );
  }
  ```
  * Only `{children}` (the active page) swaps out during navigation.
  * `flex-1` on `<main>` guarantees a **sticky footer** that anchors to the bottom of the viewport even on pages with minimal content.

---

### 3.4 The Theme Provider Pattern & State Encapsulation (`ThemeContext.jsx`)
* **The Problem:** Dark mode is a global concern needed by HTML root classes, navigation icons, and future data visualization canvases.
* **The SWE Solution:** Encapsulate state inside a **React Context + Custom Hook** with progressive enhancement:
  1. Check `localStorage` for user preference.
  2. Fall back to the user's OS preference via `window.matchMedia('(prefers-color-scheme: dark)')`.
  3. Centralize the DOM mutation (`document.documentElement.classList.add('dark')`) inside a single controlled `useEffect`.
  4. Provide a defensive hook guard (`if (!context) throw new Error(...)`) to prevent silent runtime failures.

---

### 3.5 Single Source of Truth (SSOT) for Navigation Data
* **The Problem:** Duplicating link lists in both desktop navigation and mobile drawer navigation leads to **code drift** (e.g. updating a route in desktop navigation while leaving the mobile menu broken).
* **The Solution (DRY Principle):** Define navigation items once as a structured configuration array (`SECTIONS_NAV`). Both desktop dropdowns and mobile menus map over this single array.

---

### 3.6 Event Listeners, React Refs, and Memory Leak Prevention
* When adding global browser event listeners (such as closing a dropdown on click outside via `document.addEventListener("mousedown", handleClickOutside)`), always return a cleanup function in `useEffect`:
  ```javascript
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  ```
* **Memory Leak Prevention:** Omitting `removeEventListener` leaves orphaned listeners attached to the window every time the component re-mounts, consuming memory and triggering duplicate handler calls.

---

### 3.7 Client-Side Routing (CSR) vs. Server-Side Routing (SSR)
* **How Traditional Web Routing Works (SSR):** Clicking an `<a href="/neuron">` tag makes an HTTP request to the web server. The browser destroys the current page in memory, downloads new HTML, CSS, and JS, and rebuilds the DOM from scratch.
* **How Single Page Applications Work (CSR):** React Router uses the browser's HTML5 History API (`history.pushState` and `popstate` events):
  ```javascript
  import { Link, NavLink } from "react-router-dom";
  ```
  * `<Link>` and `<NavLink>` intercept click events and prevent the browser's default reload.
  * The URL bar updates instantly, and React only mounts and unmounts the components matching the new route.
  * **Benefit:** All in-memory client state, theme state, and loaded scripts remain active without the overhead of network roundtrips or white-screen flashes.
  * `<NavLink>` exposes an `isActive` callback to apply active navigational indicator classes automatically.

---

### 3.8 SPA Scroll Restoration Pattern (`ScrollToTop.jsx`)
* **The Problem:** In a multi-page website, moving to a new page naturally starts the viewport at the top `(0, 0)`. In an SPA, because the browser window never actually reloads, navigating from the bottom of Section 1 to Section 2 leaves the user scrolled halfway down the new page!
* **The SWE Solution:** Create a lightweight, dedicated scroll restoration component that subscribes to router state:
  ```javascript
  export default function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);
    return null;
  }
  ```
  * Mounting `<ScrollToTop />` directly inside `<BrowserRouter>` guarantees every route transition starts with a clean viewport.

---

### 3.9 Dynamic Flow Pagination & The DRY Principle (`SectionNavFooter.jsx`)
* **The Anti-Pattern:** Hardcoding "Previous" and "Next" buttons inside each individual page view (e.g. `Neuron.jsx` links to `/build`, `Build.jsx` links to `/forward-pass`).
  * *Why this is fragile:* If you insert a new section, reorder modules, or rename paths, you have to find and modify multiple files, making regressions likely.
* **The SWE Solution:** Derive pagination dynamically from the centralized `SECTIONS_NAV` array:
  ```javascript
  const currentIndex = SECTIONS_NAV.findIndex((s) => s.id === currentSectionId);
  const prevSection = currentIndex > 0 ? SECTIONS_NAV[currentIndex - 1] : null;
  const nextSection = currentIndex < SECTIONS_NAV.length - 1 ? SECTIONS_NAV[currentIndex + 1] : null;
  ```
  * Individual pages simply declare `<SectionNavFooter currentSectionId={2} />`.
  * If the curriculum order ever changes, the entire pagination pipeline updates automatically without touching page code (Don't Repeat Yourself).

---

### 3.10 Defensive Routing: Catch-All 404 Handlers & Recovery Pathways
* **The Principle:** In production web engineering, users may follow stale bookmarks, mistype URLs, or click broken links.
* **The Pattern:** Always provide a catch-all route at the very end of your `<Routes>` configuration:
  ```jsx
  <Route path="*" element={<NotFound />} />
  ```
* **UX Engineering:** A 404 page should never be a generic browser error or dead end. It must explain the issue and provide clear, accessible recovery pathways (e.g. "Back to Home", "Start Section 1") to keep the user engaged.

---

### 3.11 Presentational vs. Container Components (Props Down, Events Up)
* **Phase:** 2.3 — Shared Reusable Components
* **The Concept:** Split components into two roles:
  * **Presentational** (`SectionCard`, `ProgressBar`, `KeyTakeaway`) — receive data through props and render it. They never read `localStorage`, call APIs, or own business state.
  * **Container** (`Home.jsx`, section pages) — own the state (via `useProgress()`) and pass plain values down.
  ```jsx
  // Container decides WHAT; presentational component decides HOW it looks
  <SectionCard section={sec} isCompleted={isCompleted(sec.id)} />
  <KeyTakeaway sectionId={1} isCompleted={done} onToggleComplete={toggleCompleted} />
  ```
* **Why It Matters:**
  1. **Reusability:** `ProgressBar` works for curriculum progress today and could show training-epoch progress in Section 4 tomorrow, since it only knows about `percentage`.
  2. **Testability:** A presentational component is a pure function of its props, so it can be tested without mocking storage or the network.
  3. **Events Up:** Children never mutate parent state directly. They call a callback (`onToggleComplete`, `onRetry`), and the owner decides what happens.
* **Sensible Defaults:** Every prop has a default (`percentage = 0`, `onRetry = null`), so the component never crashes when a caller forgets one, and optional features (like the retry button) simply don't render.

---

### 3.12 Accessibility by Default: WAI-ARIA Roles for Dynamic UI
* **Phase:** 2.3
* **The Problem:** A sighted user sees a spinner, a red error box, or a filling bar. A screen-reader user sees *nothing* unless the markup tells assistive technology what those elements mean.
* **The Pattern:** Pick the ARIA role that matches the element's job:

| Component | Role | What a screen reader does |
| :--- | :--- | :--- |
| `ProgressBar` | `role="progressbar"` + `aria-valuenow/min/max` | Announces "40 percent" |
| `LoadingSpinner` | `role="status"` + `sr-only` "Loading..." text | Politely announces the loading state |
| `ErrorMessage` | `role="alert"` | Interrupts immediately to announce the error |
| `Tooltip` | `role="tooltip"` | Reads the hint associated with the trigger |
| `GlossaryTerm` | `<button aria-expanded>` | Announces "collapsed/expanded" |

* **Key Ideas:**
  * `sr-only` (Tailwind) hides text visually but keeps it in the accessibility tree — icons like `<Loader2>` carry no meaning on their own.
  * Use real `<button>` elements for interactive triggers: you get keyboard focus, Enter/Space activation, and correct semantics for free. Faking a button with `<span role="button" tabIndex={0}>` requires re-implementing all of that by hand.
  * Respond to `onFocus`/`onBlur`, not just mouse events, so keyboard users can reach hover content.

---

### 3.13 Tooltip vs. Popover: Choosing the Right Overlay
* **Phase:** 2.3
* **The Distinction:**
  * **Tooltip** (`Tooltip.jsx`) — short, non-interactive hint. Opens on hover/focus, closes on leave/blur, uses `pointer-events-none` so it never blocks clicks.
  * **Popover** (`GlossaryTerm.jsx`) — contains *interactive* content (a "Glossary" link). It must stay open long enough for the user to move into it and click.
* **The Close-Behavior Checklist for Popovers:**
  1. Toggle on click (works on touch devices, which have no hover).
  2. Close when the mouse leaves the whole wrapper (trigger + popup together, so moving into the popup doesn't close it).
  3. Close on click outside, via a `mousedown` listener on `document` with a cleanup function (see [3.6](#36-event-listeners-react-refs-and-memory-leak-prevention)).
* **Lesson from Review:** The first version of `GlossaryTerm` opened on `mouseenter` but only closed on an outside click — hovering across a paragraph left popups stuck open. Every "open" trigger needs a matching "close" trigger.

---

### 3.14 Designing for Async States Before the API Exists
* **Phase:** 2.3
* **The Concept:** Every network request has (at least) three UI states: **loading → success** or **loading → error**. Building `LoadingSpinner` and `ErrorMessage` in Phase 2, *before* any API endpoint exists, means Phase 5 can't "forget" the unhappy paths.
* **Actionable Error Recovery:** A good error message answers three questions:
  1. *What happened?* — `title` + plain-language `message`
  2. *Why?* — collapsible `<details>` with technical info, hidden from beginners but available for debugging
  3. *What can I do?* — an `onRetry` button, so the user recovers without refreshing (which would lose in-memory state like a trained model's UI)
* **Typical Usage Pattern (Phase 5):**
  ```jsx
  if (isLoading) return <LoadingSpinner label="Training network..." />;
  if (error) return <ErrorMessage message={error.message} details={error.response?.data} onRetry={refetch} />;
  return <Chart data={data} />;
  ```

---

### 3.15 Custom Hooks as a Storage Abstraction Layer (`useProgress.js`)
* **Phase:** 2.4 — Progress Tracking
* **The Problem:** If six pages each call `localStorage.getItem("inside_network_progress")` and `JSON.parse` directly, the storage key, data format, and error handling get duplicated six times. Changing to a backend database later would mean editing every page.
* **The Pattern:** Hide storage behind a custom hook that exposes a domain-level API:
  ```javascript
  const { isCompleted, toggleCompleted, percentage, resetProgress } = useProgress();
  ```
  Pages talk in terms of *sections and completion* — they don't know whether the data lives in `localStorage`, `IndexedDB`, or a server.
* **Lazy State Initialization:**
  ```javascript
  const [completed, setCompleted] = useState(() => readFromStorage());
  ```
  Passing a *function* to `useState` runs the (synchronous, relatively slow) storage read only on the first render, not on every re-render.
* **Defensive Storage Access:** `localStorage` can throw (Safari private mode, storage quota exceeded, disabled cookies). Wrap every read/write in `try/catch` and fall back to an empty state so the app still works — progress just isn't saved.

---

### 3.16 Never Trust Persisted Data: Validate at Every Boundary
* **Phase:** 2.4
* **The Concept:** `localStorage` is *external input*, just like an HTTP request body. Users can edit it in DevTools, old app versions may have written a different format, and other tabs can write to it at any time.
* **The Pattern:** Run every value entering the app through one sanitizer:
  ```javascript
  function sanitize(value) {
    if (!Array.isArray(value)) return [];
    return value.filter((id) => typeof id === "number" && id >= 1 && id <= TOTAL_SECTIONS);
  }
  ```
* **Lesson from Review:** The initial load path validated data, but the cross-tab sync path accepted raw parsed JSON. Two entry points, one validated — a classic gap. Extracting a single `sanitize()` helper guarantees both paths apply the same rules.
* **Connection:** This is the frontend twin of Pydantic validation on the backend ([2.2](#22-strict-data-contracts-with-pydantic-type-safety-at-boundaries)) — validate data where it crosses into your code, not deep inside business logic.

---

### 3.17 Cross-Tab Sync & The `storage` Event `null` Bug (Debugging Lesson)
* **Phase:** 2.4
* **The Mechanism:** When one tab writes to `localStorage`, the browser fires a `storage` event in **every other tab** of the same origin (never in the tab that made the change). Listening for it keeps open tabs in sync:
  ```javascript
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    ...
  });
  ```
* **The Bug:** The original guard was `if (event.key === STORAGE_KEY && event.newValue)`. But `resetProgress()` calls `localStorage.removeItem()`, and for a removal the event's `newValue` is **`null`**. The falsy check silently ignored resets — other tabs kept showing old progress.
* **The Fix:** Treat `null` as a meaningful value ("the data was deleted"), not as "nothing to do":
  ```javascript
  if (event.newValue === null) { setCompletedSections([]); return; }
  ```
* **General Lesson:** Be careful with truthiness checks (`&& value`) when `null`, `0`, or `""` carry meaning. Check for the exact case you mean (`=== null`, `=== undefined`).

---

### 3.18 Derived State, Functional Updates & Stable Callbacks
* **Phase:** 2.4
* **Derived State:** `useProgress` stores only one thing — the array of completed IDs. `completedCount`, `percentage`, and `isAllComplete` are *computed* from it on every render:
  ```javascript
  const percentage = Math.round((completedSections.length / TOTAL_SECTIONS) * 100);
  ```
  Storing `percentage` in its own `useState` would create two sources of truth that can disagree. **Rule:** if a value can be calculated from existing state, calculate it — don't store it.
* **Functional Updates:** `setCompletedSections((prev) => [...prev, id])` reads the *latest* state instead of a possibly stale value captured in a closure. This matters when updates happen in quick succession or inside callbacks created on an earlier render.
* **Stable Callbacks with `useCallback`:** `markCompleted` and `toggleCompleted` have an empty dependency list because they only use the functional updater. Their identity never changes, so child components receiving them as props won't re-render or re-run effects needlessly.
* **Immutability:** Always return a *new* array (`[...prev, id]`, `prev.filter(...)`) — React detects changes by reference, so mutating with `prev.push(id)` would not trigger a re-render.

---

### 3.19 Hook Instances Don't Share State: When to Lift into Context
* **Phase:** 2.4 — known limitation & future refactor
* **The Concept:** A custom hook shares *logic*, not *state*. Every component that calls `useProgress()` gets its own independent `useState` copy.
* **Why It Works Today:** Only one page is mounted at a time (Home *or* a section page), and each one re-reads `localStorage` when it mounts, so progress always appears consistent.
* **When It Breaks:** If two mounted components call the hook at once (e.g. a progress badge in the persistent `Header` plus the "Mark as Complete" button on a page), clicking the button updates only the page's copy. The header stays stale until reload — and the `storage` event won't help, because it never fires in the same tab.
* **The Fix When Needed:** Lift the state into a `ProgressProvider` (same pattern as `ThemeContext`, [3.4](#34-the-theme-provider-pattern--state-encapsulation-themecontextjsx)) and have `useProgress()` read from context. One owner, many readers.
* **SWE Takeaway:** Choose the simplest tool that fits current needs (a hook), but document the conditions that would force an upgrade (a context) so the next developer recognizes the symptom.

---

### 3.20 Gap Analysis: Audit Existing Code Against the Spec Before Building
* **Phase:** 3 — Home / Landing Page
* **The Situation:** Phase 3 said "Create `Home.jsx`", but `Home.jsx` already existed with a hero, progress bar, and card grid built during Phase 2.4.
* **The Practice:** Before writing code, walk the spec line by line and mark each item **done / partial / missing**. Here that left only three real gaps: the animated background, the "next section" highlight, and a dedicated reassurance blurb.
* **Why It Matters:**
  1. Avoids rewriting working code (and re-introducing bugs that were already fixed).
  2. Keeps the plan honest — a parent checkbox should only be ticked when *all* its children are done.
  3. Turns a vague task ("do Phase 3") into a short, concrete to-do list.

---

### 3.21 Respecting `prefers-reduced-motion` & Decorative Graphics
* **Phase:** 3
* **The Concept:** Some users (vestibular disorders, migraines, motion sensitivity) set their OS to reduce motion. Browsers expose this as the CSS media query `prefers-reduced-motion`, and Framer Motion exposes it as a hook:
  ```javascript
  const reduceMotion = useReducedMotion();
  const props = reduceMotion
    ? { initial: { opacity: 0.4 } }                       // still image
    : { animate: { opacity: [0.2, 0.75, 0.2] }, transition: { repeat: Infinity } };
  ```
* **Decorative vs. Informative Graphics:** The hero network is pure decoration — it carries no information. So it gets:
  * `aria-hidden="true"` — screen readers skip it (otherwise they'd announce 15 circles and 50 lines).
  * `pointer-events-none` — it never steals clicks from the CTA button above it.
  * `z-10` on the text layer — content always paints above decoration.
* **Motion with Meaning:** Each layer's pulse is delayed by `layer * 0.6s`, so the glow sweeps left → right. Even a background animation can quietly preview the concept taught later (the forward pass).

---

### 3.22 Precompute Static Data Outside the Component
* **Phase:** 3
* **The Concept:** The node and edge coordinates of the background network never change. Computing them at **module level** (outside the component function) means they're calculated exactly once when the file is imported:
  ```javascript
  const NODES = LAYERS.flatMap(/* ... */);   // runs once at import
  const EDGES = NODES.flatMap(/* ... */);

  export default function NetworkBackground() { /* just reads NODES/EDGES */ }
  ```
* **Decision Guide:**

| Data depends on… | Where to compute it |
| :--- | :--- |
| Nothing (constants) | Module level |
| Props/state, and it's expensive | `useMemo(() => ..., [deps])` |
| Props/state, and it's cheap | Inline in the render body |

* **Stable Keys:** Each node gets a deterministic `id` like `"2-3"` (layer-index) used as its React `key`, never an array index of a list that can change.

---

### 3.23 Isolating Business Rules in Pure Functions (`suggestNextSection`)
* **Phase:** 3
* **The Concept:** "Which section should we suggest next?" is a *business rule*, not a UI concern. It lives in `src/utils/suggestNextSection.js` as a **pure function**: same inputs → same output, no React, no storage, no side effects.
  ```javascript
  const suggestedId = suggestNextSection(SECTIONS_NAV, completedSections);
  <SectionCard isSuggested={sec.id === suggestedId} ... />
  ```
* **Why It Matters:**
  1. **Testability:** Phase 7 can unit-test every progress scenario with plain arrays — no rendering, no mocking `localStorage`.
  2. **Separation of Concerns:** `SectionCard` only knows "am I suggested?" (a boolean). It doesn't know *why*. The rule can change without touching any component.
  3. **Explicit "no answer":** Returning `null` (instead of throwing or returning a magic `-1`) gives callers a clear "highlight nothing" case — e.g. when everything is complete.
* **Design Decision:** Two reasonable rules only differ when a learner skips around:
  * *First incomplete section* (completed `[1, 3]` → suggest `2`) — fills gaps; fits a sequential curriculum.
  * *Section after the furthest completed* (completed `[1, 3]` → suggest `4`) — respects the learner's chosen path.
  * **Chosen:** first incomplete, because each section builds on the previous one. Implemented as a one-liner with `Array.prototype.find`:
  ```javascript
  const next = sections.find((section) => !completedIds.includes(section.id));
  return next ? next.id : null;
  ```

---

### 3.24 One Glossary, Many Readers: Content as a Single Source of Truth
* **Phase:** 6.1
* **The Problem:** Before Phase 6, each page passed its own `definition="..."` to `<GlossaryTerm>`. The same idea was explained in several places with different wording, and the Glossary page would have been a third copy.
* **The Solution:** `src/data/glossary.js` holds all 34 terms (`term`, `aliases`, `definition`, `sections`). Two readers consume it:
  * the **Glossary page** lists, searches and groups the entries;
  * **`<GlossaryTerm term="Weights">`** looks its definition up with `findTerm()`, matching aliases case-insensitively, so "Weights" finds the "Weight" entry.
  ```javascript
  const BY_NAME = new Map(GLOSSARY.flatMap((e) => [e.term, ...e.aliases].map((n) => [n.toLowerCase(), e])));
  export const findTerm = (name) => BY_NAME.get(name.toLowerCase()) ?? null;
  ```
* **Fail loudly in development:** if a page uses a term that isn't in the data, `GlossaryTerm` logs a `console.warn` in dev builds (`import.meta.env.DEV`), so typos are caught immediately instead of shipping an empty popup.
* **Verified by script:** a small Node check confirmed every term the pages use and all 31 planned terms resolve, with no duplicate slugs (duplicate `id`s would break deep links).

---

### 3.25 Deep Links in an SPA: Hashes vs. Scroll-to-Top
* **Phase:** 6.1
* **The Conflict:** `ScrollToTop` (lesson 3.8) scrolls to the top on every route change. That silently broke `/glossary#weight` links: the browser's native "jump to #id" doesn't happen in client-side navigation, and the scroll-to-top would undo it anyway.
* **The Fix (two halves):**
  1. `ScrollToTop` steps aside when the URL has a hash: `if (hash) return;`
  2. The Glossary page scrolls the target into view itself, *after* it has rendered:
  ```javascript
  useEffect(() => {
    if (!targetSlug) return;
    document.getElementById(targetSlug)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [targetSlug]);
  ```
* **URL as state:** the highlighted card is derived straight from `location.hash`, not copied into `useState`. Back/forward buttons and shared links just work, and there's nothing to keep in sync.
* **Sticky headers vs. anchors:** `scroll-mt-48` (`scroll-margin-top`) stops the target from hiding under the sticky site header and search bar.

---

### 3.26 Hover + Click Toggle Fight (Debugging Lesson)
* **Phase:** 6 (found while testing glossary deep links)
* **Symptom:** With a mouse, clicking an inline glossary word *closed* its popup.
* **Root Cause:** Two handlers changed the same state: `onMouseEnter` → open, then `onClick` → `setIsOpen(!isOpen)`. By the time the click arrives, hovering has already opened it, so the toggle closes it. On touch screens (no hover) it worked, which is why it went unnoticed.
* **Fix:** make click *idempotent*: it always opens. Closing has its own explicit triggers: mouse leave, a click outside, and **Escape** (also an accessibility win for keyboard users).
* **Lesson:** When several events drive one piece of state, avoid toggles. Give each event a clear intent ("open" / "close"), and test with both mouse and touch semantics.

---

### 3.27 Search, Letter Navigation & Responsive Sticky Bars
* **Phase:** 6.1
* **Derived pipeline:** `query → filter (term, aliases, definition) → group by first letter` runs in one `useMemo`. Only the query string is state.
* **Letter bar:** letters with no matching terms are `disabled` (not hidden), so the A–Z layout doesn't jump around while you type. Clicking scrolls with `scrollIntoView` instead of changing the URL hash, which keeps the address bar clean.
* **Announce results:** the "3 of 34 terms match" line is `aria-live="polite"`, so screen-reader users hear the effect of typing, and a dedicated empty state offers "Clear the search".
* **Responsive sticky bar:** on a phone the wrapped A–Z rows made the sticky bar ~200px tall (a quarter of the screen). On small screens it's now a single horizontally scrolling row (`overflow-x-auto`, buttons `shrink-0`), wrapping again from `sm:` up. The bar dropped to 146px.
* **Full-bleed inside a padded container:** the bar uses negative margins matching the layout's responsive padding (`-mx-4 sm:-mx-6 lg:-mx-8` with the same `px-*`), so its background reaches the edges at every breakpoint.

---

### 3.28 Safe External Links: `target="_blank"` + `rel`
* **Phase:** 6.2
* **The Risk:** A page opened with `target="_blank"` historically got a `window.opener` reference back to your tab and could redirect it to a phishing page ("reverse tabnabbing").
* **The Rule:** every outbound link uses `rel="noopener noreferrer"`. `noopener` cuts the `window.opener` link; `noreferrer` also hides which page sent the visitor. Modern browsers imply `noopener` for `_blank`, but writing it out documents the intent and protects older browsers.
* **Accessibility:** each new-tab link includes visually hidden text, `<span className="sr-only"> (opens in a new tab)</span>`, so screen-reader users aren't surprised by a new tab.
* **Content as data:** the tech stack, credits and resources on the About page are arrays rendered by small components (`StackList`, resource cards), and "The journey" is generated from `SECTIONS_NAV`.

---

## 4. Interactive Visualizations (Phase 4)

### 4.1 Compute on the Client When the Math Is Cheap
* **Phase:** 4 (Section 1)
* **The Concept:** The plan has a `/api/neuron/compute` endpoint, but one neuron is three multiplications and an exponent. Calling the backend on every slider tick would add network latency (and dozens of requests per second while dragging) for work the browser does in microseconds.
* **Decision Guide:**

| Work is… | Where it runs |
| :--- | :--- |
| Cheap, needs instant feedback (one neuron) | Browser |
| Heavy or needs PyTorch/state (training, boundary grid) | Backend |

* **Takeaway:** "Where does this run?" is an architecture decision, not a default. The backend endpoint can still be built later as a cross-check for the frontend math.

---

### 4.2 The Strategy Pattern for Swappable Algorithms (`ACTIVATIONS`)
* **Phase:** 4 (Section 1)
* **The Concept:** Each activation function is a *strategy* object in one lookup table, looked up by key:
  ```javascript
  export const ACTIVATIONS = {
    relu:    { label: "ReLU",    fn: (z) => Math.max(0, z),        yDomain: [0, Z_LIMIT] },
    sigmoid: { label: "Sigmoid", fn: (z) => 1 / (1 + Math.exp(-z)), yDomain: [0, 1] },
    tanh:    { label: "Tanh",    fn: (z) => Math.tanh(z),           yDomain: [-1, 1] },
  };
  const output = ACTIVATIONS[activation].fn(z);
  ```
* **Why It Matters:** The dropdown options, the chart's y-axis, the glow mapping and the math all read from the same entry. Adding "Leaky ReLU" means adding one object, with no `if/else` or `switch` scattered across components (the Open/Closed Principle: open for extension, closed for modification).

---

### 4.3 "D3 for Math, React for DOM"
* **Phase:** 4 (Section 1)
* **The Concept:** D3 and React both want to own the DOM. Mixing `d3.select(...).append(...)` with React rendering leads to elements React doesn't know about and stale updates. The clean split: use D3 only for **calculations** (scales, path strings) and let React render the SVG elements.
  ```javascript
  const x = scaleLinear().domain([-8, 8]).range([34, 386]); // pure function
  const d = line().x(([z]) => x(z)).y(([, v]) => y(v))(points); // returns a string
  return <path d={d} />; // React owns the element
  ```
* **Bonus:** The curve only depends on the activation, so it's wrapped in `useMemo(..., [fn, yDomain])` and isn't recomputed while sliders move.

---

### 4.4 Replaying Animations with a Changing `key`
* **Phase:** 4 (Section 1)
* **The Concept:** A Framer Motion `initial → animate` transition plays once, on mount. To replay the "data flows" animation on every change, the page keeps a counter and uses it as the `key` of the pulse group:
  ```javascript
  const [pulseKey, setPulseKey] = useState(0);
  const pulse = () => setPulseKey((k) => k + 1);
  // in NeuronDiagram:
  <g key={pulseKey}>{/* motion.circle pulses */}</g>
  ```
* **Why It Works:** When a `key` changes, React treats it as a *different* element: it unmounts the old one and mounts a fresh one, so the animation starts from `initial` again. No refs or imperative `.start()` calls needed.
* **Reminder:** The pulses are skipped entirely under `useReducedMotion()` (see 3.21).

---

### 4.5 Normalising Values with Different Ranges (Min-Max Scaling)
* **Phase:** 4 (Section 1)
* **The Problem:** The output node's glow needs a 0 → 1 intensity, but each activation produces a different range: Sigmoid 0 → 1, Tanh −1 → 1, ReLU 0 → 8.
* **The Solution:** Min-max scaling using each strategy's `yDomain`, then clamp:
  ```javascript
  const [min, max] = ACTIVATIONS[activation].yDomain;
  const t = (output - min) / (max - min);
  return Math.min(1, Math.max(0, t));
  ```
* **Design Decision:** Always map into [0, 1] with "brighter = higher" for every activation (so Tanh −1 is dark, not bright). The clamp is a defensive guard: if a slider range changes and the output exceeds `yDomain`, the glow still stays valid.
* **Trade-off noted:** With linear scaling, typical ReLU outputs (0–3) look fairly dim. A curve like `1 - Math.exp(-x)` would brighten small values, at the cost of consistency.

---

### 4.6 Theme-Aware SVG: Tailwind Classes & CSS Variables
* **Phase:** 4 (Section 1)
* **The Concept:** SVG attributes like `fill` and `stroke` can be styled with Tailwind utilities (`fill-slate-900 dark:fill-white`), so the diagram follows dark mode like the rest of the app.
* **The Halo Trick:** Weight labels sat on top of their edges and were hard to read. The fix is a text outline in the *background* colour, drawn behind the glyphs:
  ```jsx
  <svg className="[--halo:#fff] dark:[--halo:#0f172a]">
    <text color="var(--halo)" stroke="currentColor" strokeWidth={4} paintOrder="stroke" />
  ```
  `paint-order: stroke` paints the outline first and the fill on top, and the CSS variable switches the halo colour with the theme.
* **Debugging Lesson:** A chart drawn on a small `viewBox` (280 wide) but displayed in a wide card is scaled up, *including its text*. Size the `viewBox` close to the rendered size so fonts stay proportionate.

---

### 4.7 Enter / Update / Exit Animations with Stable, Role-Based Keys
* **Phase:** 4 (Section 2)
* **The Concept:** D3's classic *enter / update / exit* pattern (new elements appear, existing ones move, removed ones disappear) can be done in React with Framer Motion's `AnimatePresence`:
  ```jsx
  <AnimatePresence initial={false}>
    {nodes.map((n) => (
      <motion.circle key={n.id}
        initial={{ cx: n.x, cy: n.y, r: 0 }}   // enter: grow from nothing
        animate={{ cx: n.x, cy: n.y, r: 14 }}   // update: slide to new spot
        exit={{ r: 0, opacity: 0 }} />          // exit: shrink away
    ))}
  </AnimatePresence>
  ```
* **The Key Decision:** React matches elements between renders **by `key`**. If output nodes were keyed by layer index (`"3-0"`), adding a hidden layer would make them `"4-0"`: React would destroy the old outputs and create new ones, so they'd pop instead of slide. Keying by **role** (`"out-0"`, `"h2-3"`) keeps their identity, so they glide to the new position.
* **Rule of thumb:** A key should answer "is this the *same thing* as before?", not "where is it in the list?".

---

### 4.8 Invisible Hit Areas for Thin SVG Elements
* **Phase:** 4 (Section 2)
* **The Problem:** Edges are 1.25px lines, which are almost impossible to hover with a mouse (and impossible on touch).
* **The Solution:** Draw a second, transparent, 8px-wide line on top of each visible line and attach the hover handlers there:
  ```jsx
  <line {...coords} stroke="transparent" strokeWidth={8} onMouseEnter={...} />
  ```
* **Why separate them:** The visible line's look (thin, animated, dimmed) can change freely without affecting how easy it is to interact with. Visual design and interaction target are two different concerns.

---

### 4.9 Draft vs. Committed State ("Lock This Architecture")
* **Phase:** 4 (Section 2)
* **The Concept:** The sliders edit a local **draft** (`useState`); the Lock button **commits** it to `localStorage` through `useArchitecture`. Comparing the two drives a three-state UI:

| Draft vs. locked | UI shows |
| :--- | :--- |
| Nothing locked yet | "Lock This Architecture" |
| Equal | ✓ "Locked" (button disabled) |
| Different | "Unsaved changes; Section 3 still uses …" + "Update" |

* **Why not save on every slider move?** Section 3 should only ever see a network the learner *chose*, not a half-dragged intermediate. It's the same idea as a form's "Save" button or a Git commit vs. the working tree.
* **Lazy initialisation:** `useState(() => locked ?? DEFAULT_ARCHITECTURE)` starts the draft from the saved network, so returning learners see their own design.

---

### 4.10 Counting Parameters Correctly (Domain Accuracy in the UI)
* **Phase:** 4 (Section 2)
* **The Concept:** An educational UI must use the domain's real definitions. For a fully connected network with layer sizes `[4, 8, 8, 8, 8, 3]`:
  * **Weights** = Σ (layer size × next layer size) = 4·8 + 8·8·3 + 8·3 = **248**
  * **Neurons** = hidden + output nodes = **35**. Input nodes only *hold* data and compute nothing, so they aren't neurons and have no bias.
  * **Parameters** = weights + biases (one per neuron) = 248 + 35 = **283**. This matches what PyTorch reports via `sum(p.numel() for p in model.parameters())`.
* **Takeaway:** Put the counting rules in one pure function (`computeStats`) so they can be unit-tested against PyTorch's numbers in Phase 7, instead of scattering arithmetic through JSX.

---

### 4.11 Reproducible Randomness: Seeds & Local Generators
* **Phase:** 4 (Section 3) / Phase 5.4
* **The Problem:** The plan says "build a model with random weights". If every request got *new* random weights, running the same inputs twice would give two different answers. Learners would think the network is broken.
* **The Solution:** The request carries a `seed`. Same seed → same weights → same answer. "New random weights" just picks a new seed.
  ```python
  generator = torch.Generator().manual_seed(seed)          # local RNG
  nn.init.xavier_uniform_(layer.weight, generator=generator)
  ```
* **Why a *local* generator?** `torch.manual_seed()` changes PyTorch's **global** random state. Once Section 4 trains a model in a background thread, a forward-pass request calling `manual_seed` would silently change the training run's randomness. A local `Generator` keeps each request isolated: no shared mutable state.

---

### 4.12 Logits vs. Probabilities: Keep `forward()` Raw
* **Phase:** 4 (Section 3)
* **The Concept:** `ConfigurableNetwork.forward()` returns raw output scores (**logits**), not probabilities. Probabilities are computed separately, only for display:
  * 1 output → **sigmoid** (an independent 0–1 score)
  * 2+ outputs → **softmax** (probabilities that sum to 1; the highest is the prediction)
* **Why:** PyTorch's training losses (`nn.CrossEntropyLoss`, `nn.BCEWithLogitsLoss`) expect logits and apply softmax/sigmoid internally in a numerically stable way. Putting softmax inside `forward()` would make Section 4 apply it twice and train badly.
* **Design Principle:** One model class serves both inference (Section 3) and training (Section 4) because "compute" and "present" are kept separate.

---

### 4.13 Routers, Schemas & Models: Structuring a FastAPI Feature
* **Phase:** 5.4 (first real endpoint)
* **The Layout:** Each feature is split into three layers with one job each:

| File | Responsibility |
| :--- | :--- |
| `schemas/forward_pass.py` | The **contract**: what a valid request/response looks like (Pydantic) |
| `models/network.py` | The **domain logic**: the PyTorch network, no HTTP knowledge |
| `routers/forward_pass.py` | The **glue**: HTTP route → call model → shape the response |

  `main.py` just does `app.include_router(forward_pass.router)`.
* **Validate at the boundary:** a `@model_validator` checks that `len(inputs) == architecture[0]`. Bad requests get a 422 with a clear message *before* PyTorch ever runs, and the route body can trust its input.
* **`def`, not `async def`:** the route is CPU-bound PyTorch work, so a plain `def` makes FastAPI run it in a worker thread instead of blocking the event loop (see 2.4).
* **Tested in-memory** with `TestClient`: same seed is deterministic, softmax sums to 1, one weighted sum checked by hand, and four invalid payloads return 422.

---

### 4.14 Async UI Safety: Cancellation, State Machines & Stale Results
* **Phase:** 4 (Section 3)
* **1. Explicit state machine.** A single `status` (`idle → loading → success | error`) instead of separate `isLoading` / `hasError` booleans, which can contradict each other (loading *and* errored).
* **2. Cancel superseded requests.** Click Run twice quickly: if request #1 is slow, its response could arrive *after* #2 and overwrite the newer result (a **race condition**). Each run aborts the previous one:
  ```javascript
  abortRef.current?.abort();
  const controller = new AbortController();
  abortRef.current = controller;
  const data = await runForwardPass(payload, { signal: controller.signal });
  ```
  Cancelled requests throw, and `isCancel(err)` lets the code ignore them quietly. The same ref aborts the request on unmount.
* **3. Detect stale results.** The result stores the exact request it answers (`resultKey = JSON.stringify(payload)`). If the inputs change afterwards, the page says "inputs changed since this run" instead of showing numbers that belong to different inputs.
* **4. Normalise errors in one place.** `toApiError()` in `api/client.js` turns "server offline", FastAPI's 422 list and 500s into one `{ title, message, details }` shape for `<ErrorMessage>`, including a hint on how to start the backend.

---

### 4.15 Timer-Driven Animation with `useEffect` Cleanup
* **Phase:** 4 (Section 3)
* **The Concept:** Auto-play reveals one layer per tick. Instead of a `setInterval` that has to be managed by hand, an effect schedules exactly **one** timeout for the next step:
  ```javascript
  useEffect(() => {
    if (!result || mode !== "play" || revealed >= lastLayer) return;
    const timer = setTimeout(() => setRevealed((r) => r + 1), stepMs);
    return () => clearTimeout(timer);
  }, [result, runId, mode, revealed, lastLayer, stepMs]);
  ```
* **Why it's robust:** Every change (new step, switching to Step mode, changing speed, leaving the page) runs the cleanup first, so there's never more than one pending timer. Auto-play and Step-through share the same `revealed` state; they're just two different "controllers" for the same picture.

---

### 4.16 `white-space: nowrap` Swallowed the Line Break (Debugging Lesson)
* **Phase:** 4 (Section 3)
* **Symptom:** For a 6-input neuron, the equation `z = (w)(a) + … + b` ended in `(0.73)(−`, and one term was missing entirely.
* **Root Cause:** Each term was wrapped in `whitespace-nowrap` (to keep `(0.73)(0.25)` together) and the `" + "` separator was *inside* that span. So the line had **no legal break point** between terms. The text overflowed sideways and the `overflow-x-auto` container hid the rest.
* **Fix:** Move the separator *outside* the nowrap span. Terms still never split, but the spaces around `+` become wrap opportunities:
  ```jsx
  {i > 0 && " + "}
  <span className="whitespace-nowrap">({w})({a})</span>
  ```
* **Lesson:** `overflow: auto/hidden` can hide a layout bug instead of revealing it. Test with the *largest* realistic data (here: 6 inputs), not the default.

---

### 4.17 Background Threads in a Web Server: Locks, Events & Snapshots
* **Phase:** 4 (Section 4) / Phase 5.5
* **The Problem:** Training takes seconds; an HTTP request must answer in milliseconds. So `/api/train/start` launches a **background thread** and returns immediately. Now two threads touch the same `TrainingSession`: the trainer *writes* metrics every epoch, request threads *read* them for `/status`.
* **The Tools (`utils/trainer.py`):**
  * `threading.Lock`: every shared field (`status`, `epoch`, `history`, `weights`) is read and written inside `with self._lock:`, so a reader never sees a half-updated state (e.g. a new epoch number with the old loss).
  * **Snapshots:** `snapshot()` copies the state *under the lock* and returns plain data. The lock is held for microseconds and the HTTP layer never touches live objects.
  * `threading.Event` for control: pause = `_resume.clear()`, and the loop calls `_resume.wait()`, which *blocks* (0% CPU) instead of spinning on `while paused: sleep()`. Stop uses `_stop.wait(pace)` as an interruptible sleep, so Reset takes effect immediately.
* **Pacing:** Real training on 300 points takes milliseconds per epoch, too fast to watch. Each epoch is padded to ~8 seconds per run in total. That's a deliberate teaching choice, documented as a constant, not a hidden `sleep`.
* **Semantics to note:** pause takes effect *between* epochs, so one more epoch may finish after you click Pause.

---

### 4.18 Polling Done Right: `setTimeout` Chains & Incremental Sync
* **Phase:** 4 (Section 4)
* **`setTimeout` chain, not `setInterval`:** `setInterval(poll, 200)` fires every 200 ms *even if the last request hasn't returned*. On a slow network requests overlap and can arrive out of order. A chain schedules the next poll only after the previous response:
  ```javascript
  const tick = async () => {
    const status = await getTrainingStatus(id, sinceRef.current, { signal });
    apply(status);
    if (status.status === "running") timer = setTimeout(tick, POLL_MS);
  };
  ```
* **Incremental sync (`?since=N`):** the client says "I have N epochs" and the server returns only newer ones. Payloads stay tiny for a 500-epoch run, and the same merge function handles full snapshots (start/pause responses) by slicing off what it already has.
* **Lifecycle-bound:** the loop lives in a `useEffect` keyed on `[trainingId, isRunning]`. Pausing, finishing, starting a new run or leaving the page runs the cleanup (`clearTimeout` + `abort()`), so no orphan loops.
* **Alternatives considered:** WebSockets or Server-Sent Events would *push* updates instead of the client asking. They're better at scale, but polling is simpler, stateless, and the plan's requirement.

---

### 4.19 Shared App State: "Current Run" vs. "Last Good Model"
* **Phase:** 5.7
* **The Concept:** `state.py` holds one process-wide `app_state` with two slots:
  * `session`: the current (or latest) run, used by `/api/train/*`.
  * `trained`: the last run that **finished successfully**, used by Section 5.
* **Why two slots?** If Section 5 read `session` directly, it would see a half-trained model while a new run is in progress, or nothing after a failed run. Promoting a model only on success (via an `on_complete` callback) means Section 5 always gets a complete one.
* **Race guard:** `_set_trained` only promotes the session if it's *still* the current one, so a run that was replaced while finishing can't overwrite the newer state.
* **Limitation (by design):** state lives in memory, so restarting the server (including `--reload` after a code change) forgets the model. Fine for a local teaching app; a real service would persist models to disk or a database.

---

### 4.20 Failing Loudly in Worker Threads (and the NaN-in-JSON Trap)
* **Phase:** 4 (Section 4)
* **Silent thread death:** an exception inside a `threading.Thread` doesn't reach the HTTP client. It prints a traceback and the thread ends, so the UI would poll "running" forever. The training loop catches errors and records them as `status = "error"` plus a message, which the page shows.
* **The NaN trap:** a too-high learning rate can make the loss `inf`/`NaN`. Python's `json` can't produce valid JSON for those (FastAPI raises, so every `/status` poll returns 500). The loop checks `math.isfinite(loss)` and stops with a friendly "Training diverged, try a smaller learning rate" instead.
* **Lesson:** Anything that crosses a boundary (thread → HTTP, Python → JSON) needs its failure modes handled at that boundary.

---

### 4.21 Log-Scale Sliders
* **Phase:** 4 (Section 4)
* **The Problem:** Learning rates from 0.001 to 1.0 span three orders of magnitude. A linear slider would put 0.001–0.1 in the first 10% of the track, so the most interesting values would be nearly impossible to pick.
* **The Adapter:** The slider moves over integer *positions* 0–60; positions map to `10^(−3 + p/20)`, so each ×10 decade gets 20 equal steps:
  ```javascript
  const positionToLr = (p) => Number((10 ** (-3 + p / 20)).toPrecision(2));
  // 0 → 0.001, 20 → 0.01, 40 → 0.1, 60 → 1
  ```
* **`toPrecision(2)`** turns floating-point noise like `0.09999999` into a clean `0.1` for display *and* for the request.

---

### 4.22 Chart Hygiene: One Measure per Chart & Redundant Encoding
* **Phase:** 4 (Section 4)
* **One measure per chart:** loss (0–0.8) and accuracy (0–100%) have unrelated scales. Two y-axes on one chart invite false conclusions ("they cross at epoch 50!"), so they get two side-by-side charts.
* **Live data:** Recharts' entry animation is turned off (`isAnimationActive={false}`); with a new point every 200 ms it would restart constantly.
* **Validate colours, don't eyeball them:** the class colours were run through a colour-blindness validator for light and dark mode. One colour was below 3:1 contrast, so every class also gets a **shape** (circle / square / triangle) and a named legend. Colour is never the only cue.
* **Text in text colours:** the tooltip value was first drawn in the line's blue; it now uses normal text ink. Colour marks identify series, text stays readable.

---

### 4.23 Reading a Model While Another Thread Trains It (Snapshot Copies)
* **Phase:** 4 (Section 5) / Phase 5.6
* **The Problem:** "Animate the boundary as the network retrains" means the grid endpoint must run predictions on a model that the training thread is updating **in place** (`optimizer.step()` overwrites the weight tensors). Reading mid-update could mix weights from two different steps.
* **The Solution:** At the end of every epoch, *inside the lock*, the trainer stores a cloned copy of all parameters:
  ```python
  self._state = {k: v.detach().clone() for k, v in self.model.state_dict().items()}
  ```
  `frozen_model()` builds a fresh network and loads that copy. The grid endpoint works on its own private model, so it never shares tensors with the trainer.
* **Why it's cheap:** the network has ~50–100 parameters; cloning them is microseconds. For a large model you'd snapshot less often, or use a read/write lock.
* **General pattern:** *copy-on-publish*. The writer publishes immutable snapshots, readers only ever see complete ones. No reader ever needs to hold the lock while doing slow work.

---

### 4.24 Canvas for Pixels, SVG for Shapes
* **Phase:** 4 (Section 5)
* **The Problem:** The boundary is a 100×100 grid = **10,000 cells**, re-fetched every 400 ms while retraining. As SVG `<rect>`s, React would diff 10,000 elements per update.
* **The Solution:** Paint the grid into an offscreen 100×100 `<canvas>` with one `ImageData` write, convert it to a data URL, and place it in the SVG as **one** `<image>`:
  ```javascript
  const image = ctx.createImageData(n, n);
  image.data[i * 4 + 3] = alpha;            // RGBA bytes per cell
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL();                 // → <image href={...} />
  ```
* **Bonus:** the browser's smooth upscaling (100 px → plot size) blurs cell edges, so the boundary looks continuous for free.
* **Rule of thumb:** many uniform pixels → canvas. Few interactive shapes (points, crosshair, labels) → SVG. Combining them gets the best of both: the data points stay crisp, clickable SVG on top of the canvas image.
* **Encoding:** hue = predicted class, opacity = confidence rescaled from "pure guess" (1/k) to "certain" (1), so the boundary fades exactly where the network is unsure.

---

### 4.25 Empty States Are Not Errors: 409 "No Model Yet"
* **Phase:** 5.7
* **The Concept:** Visiting Section 5 before training anything is a *normal* situation, not a failure. The API signals it with **409 Conflict** ("the request is valid, but the server isn't in a state to answer it") and a clear message. The frontend treats 409 as its own **empty state** with two ways forward: "Go to Section 4" or "Use a pretrained network" (`POST /api/boundary/default`, which trains XOR unpaced in ~0.5 s).
* **Status code choice:**

| Code | Meaning here |
| :--- | :--- |
| 404 | This *resource* doesn't exist (e.g. unknown training id) |
| 409 | The *server state* conflicts with the request (no model trained yet) |
| 422 | The *request* itself is invalid (x outside [-1, 1]) |

* **Trade-off noticed:** browsers log every non-2xx response in DevTools, so the empty state shows a red "409" line in the console. If "zero console errors" (Phase 7.3) is required, add a `GET /api/boundary/status → { has_model }` check first, or return `200` with `{ model: null }`.

---

### 4.26 Self-Terminating Polling & Derived "After" State
* **Phase:** 4 (Section 5)
* **Self-terminating loop:** `useBoundaryGrid` keeps fetching only while the **response** says `model.status === "running"`. There's no separate "is retraining?" flag that could drift out of sync with the server; the data itself decides when the loop ends.
* **Derived, not stored:** the "What changed?" panel needs *before* and *after*:
  * **before** is a snapshot of the past (the grid at the moment you clicked Retrain), so it *must* be state: `setBefore(grid)`.
  * **after** is just "the current grid, once it belongs to the retrain run and that run is done", so it's derived on every render:
  ```javascript
  const after = before && model.training_id === retrainId && model.status === "done" ? grid : null;
  ```
* **Lazy defaults without effects:** the retrain sliders show the current model's settings until the learner moves them: `const shown = userValue ?? model.learning_rate`. No `useEffect` copying props into state, so there's no flash of wrong values and no sync bugs.

---

### 4.27 Tailwind Can't See Class Names You Build at Runtime (Debugging Lesson)
* **Phase:** 4 (Section 5)
* **Symptom (caught in review):** the misclassified ✕ marker built its colour with `fill.replaceAll("fill-", "stroke-")`, turning `fill-[#2a78d6]` into `stroke-[#2a78d6]`.
* **Root Cause:** Tailwind generates CSS by **scanning source files for complete class names** at build time. `stroke-[#2a78d6]` never appears literally in any file, so no CSS rule is generated and the stroke silently does nothing.
* **Fix:** store every variant as a full literal string in `classStyles.js`:
  ```javascript
  { fill: "fill-[#2a78d6] dark:fill-[#3987e5]", stroke: "stroke-[#2a78d6] dark:stroke-[#3987e5]" }
  ```
* **Rule:** In Tailwind, never concatenate or string-replace class names (`` `bg-${color}-500` ``). Map values to complete class strings instead. This is the same reason the layer colours in Sections 2–4 are written out in lookup tables.

---

## 5. Testing & Quality (Phase 7)

### 5.1 The Testing Pyramid: Unit, API & End-to-End
* **Phase:** 7
* **The Concept:** Each layer of tests answers a different question, at a different cost:

| Layer | Tool | Count | Runs in | Answers |
| :--- | :--- | :--- | :--- | :--- |
| Unit | Vitest (`src/**/*.test.js`) | 31 | ~0.2 s | Is this pure function right? (`neuronMath`, `architecture`, glossary data) |
| API | pytest + `TestClient` (`backend/tests/`) | 49 | seconds | Does each endpoint return the right shape, numbers and status codes (incl. 422 / 409)? |
| End-to-end | Playwright (`frontend/e2e/`) | 25 | ~30 s | Does a real browser, real frontend and real backend work together? |

* **The Pattern:** Put most checks at the cheap bottom of the pyramid; use E2E only for what nothing else can prove (the full journey, carried state between sections, no console errors, layout at 375px / 768px).
* **Exporting for testability:** `newEntries()` in `useTraining.js` was made `export`ed so its slicing logic is unit-testable without rendering a hook. This is the same idea as 3.23: pure functions are the easiest code to test.

---

### 5.2 Isolated Test Servers & Config via Environment Variables
* **Phase:** 7
* **The Problem:** The backend keeps **one shared training state**. If E2E tests ran against your dev server on `:8000`, they would reset your runs, and your runs would break theirs.
* **The Pattern:** `playwright.config.js` starts its *own* backend on `:8765` and frontend on `:5199`, and runs tests one at a time (`workers: 1`).
* **12-factor config (see 1.3):** two values became environment variables instead of constants:
  ```python
  TARGET_RUN_SECONDS = float(os.getenv("TRAINING_TARGET_SECONDS", "8"))  # tests: 0 or 2
  ```
  ```javascript
  const API_TARGET = process.env.API_TARGET ?? 'http://localhost:8000'  // vite.config.js
  ```
  The default keeps normal development unchanged; tests override it without touching code.
* **Auto fixtures as guards:** `e2e/fixtures.js` fails *any* test that logs a console error, and global teardown fails the run if the backend log contains a Python traceback. Phase 7.3 "no console errors / no unhandled exceptions" is checked on every test, not once by hand.

---

### 5.3 Route Mocks That Match Too Much (Debugging Lesson)
* **Phase:** 7
* **Symptom:** the three "backend offline" tests timed out waiting for the "Run Forward Pass" button. The page was blank.
* **Root Cause:** the mock `page.route("**/api/**", abort)` was meant to block API calls, but in Vite dev mode the browser also loads source files as separate modules, including **`/src/api/client.js`**. The glob matched it, the app's JavaScript never loaded, and nothing rendered.
* **Fix:** match on the URL *path* instead of a loose glob:
  ```javascript
  const isApiCall = (url) => url.pathname.startsWith("/api/");
  await page.route(isApiCall, (route) => route.abort("connectionrefused"));
  ```
* **Rule:** A mock should match exactly the requests you mean. When "everything is broken" after mocking, check what else your pattern caught (the Network tab or a Playwright trace shows it right away).

---

### 5.4 Strict Locators: Ambiguity Is a Test Failure, Not a Guess
* **Phase:** 7
* **The Concept:** Playwright locators are **strict**: if `getByText(...)` matches two elements, the action fails instead of picking one. That is a feature, since a test that silently clicks the wrong element gives false confidence.
* **Cases found:**
  * `getByRole("link", { name: "Start Exploring" })` matched the hero button **and** four section cards. Fix: `.first()` (the hero comes first in the DOM), with a comment saying why.
  * `/^output = Sigmoid\(/` matched the formula `Sigmoid(w₁x₁ …)` **and** the computed line `Sigmoid(1.000) = 0.731`. Fix: require a number after the bracket: `/^output = Sigmoid\(-?\d/`.
  * The "Next Section" button uses the short `SECTIONS_NAV` title ("Forward Pass", "Watch it Learn") while the `<h1>` says "The Forward Pass" / "Watch It Learn". Fix: the helper takes `navTitle` and `heading` separately and matches the link case-insensitively.
* **Rule:** Prefer roles and accessible names, and make the pattern describe *the one thing* you mean.

---

### 5.5 When a Test Fails, Check the Test's Expectation First
* **Phase:** 7
* **Symptom:** the Section 2 test expected `Weights 120` for a 2 → 6 → 6 → 6 → 1 network; the app showed `90`.
* **Root Cause:** the test's arithmetic was wrong. Weights between layers are `fan_in × fan_out`: `2·6 + 6·6 + 6·6 + 6·1 = 12 + 36 + 36 + 6 = 90`. The comment `6·6·2` was right but had been added up wrong.
* **Rule:** A failing test means the code and the expectation disagree, and either can be wrong. Recompute the expected value independently (by hand, or with a unit-tested helper) before "fixing" working code to match a bad test. All 6 E2E failures in this phase were test bugs; no app code changed.

---

## 6. Documentation (Phase 8)

### 6.1 Docstrings That Do Double Duty: FastAPI's `/docs`
* **Phase:** 8
* **The Concept:** FastAPI builds the OpenAPI spec (and the Swagger UI at `/docs`) from code you already write:

| Source in code | Appears on `/docs` as |
| :--- | :--- |
| Route handler docstring | The endpoint's description |
| `Query(..., description=...)` / `Field(..., description=...)` | Parameter and schema field help text |
| `APIRouter(tags=["Train"])` + `FastAPI(openapi_tags=[...])` | Grouped sections, each with a description |
| `response_model=` | The response schema and example |

* **The Pattern:** write the docstring for the *API consumer*: what it returns, and when it fails (`404 if the run was reset`, `409 unless it's running`). One string then serves both people reading the code and people calling the API.
* **Gotcha found:** a tag in `openapi_tags` only gets its description if the name matches the router's tag exactly. The health router uses `"System"`, so a `"Health"` entry would have shown up as an extra, empty group.

---

### 6.2 Comment the *Why*, Not the *What*
* **Phase:** 8
* **The Problem:** `optimizer.zero_grad()  # zero the gradients` repeats the code and teaches nothing.
* **The Pattern:** comment what the reader *can't* see from the line itself: the reason, the trade-off, or the trap:
  ```python
  optimizer.zero_grad()  # gradients add up in PyTorch, so clear last step's
  # Plain SGD (no momentum) so the learning-rate slider has a clear,
  # visible effect: too low crawls, too high diverges.
  optimizer = torch.optim.SGD(self.model.parameters(), lr=cfg.learning_rate)
  ```
* **Where comments pay off most:** concurrency (why the epoch is read *before* copying the model), design choices that look wrong out of context (no activation on the last layer, because `CrossEntropyLoss` applies softmax itself), and lifecycles (the `running ⇄ paused → done / stopped / error` diagram on `TrainingSession`).

---

### 6.3 Documentation Drift: Check Every Claim Against the Code
* **Phase:** 8
* **Symptom:** the root README still described an earlier version of the project: the title "How AI Works", "Transformers" for NLP, `utils/` for "image processing", and a "Stateless API" principle. The app now keeps training state in `AppState`, so that last claim was false. `main.py`'s API title and `CLAUDE.md` ("only `/health` exists today") were stale in the same way, and `frontend/README.md` was still the Vite template.
* **Root Cause:** docs aren't executed or tested, so nothing fails when they go out of date.
* **The Pattern:** treat each sentence in a README as a claim and verify it:
  * Folder tree → `ls` the real directories.
  * Prerequisites → read them from the tools (`vite`'s `engines.node` is `^20.19.0 || >=22.12.0`, so "Node 18+" was wrong).
  * "Works without the backend" → `grep` which pages import `api/client` (only Sections 3–5 do).
  * Dependencies → `grep` for imports. Six packages in `requirements.txt` (`transformers`, `torchvision`, …) are never imported, which makes setup much slower than it needs to be.
* **Rule:** update the docs in the same change as the code. The tests in 5.x catch code drift; for docs, only review catches it.

---

### 6.4 Screenshots as Code
* **Phase:** 8
* **The Problem:** hand-taken screenshots go stale after the first UI change, and nobody remembers which state they showed (which dataset? which network?).
* **The Pattern:** `frontend/scripts/capture-screenshots.cjs` drives a real browser with Playwright through a fixed script (reset → train Circle vs Square → open Section 5 → click the centre), so `npm run screenshots` reproduces every image exactly.
* **Details that matter:**
  * Force light mode with `addInitScript` so the images look consistent.
  * Scroll each target to a fixed offset below the sticky header instead of using `scrollIntoViewIfNeeded()`, which only scrolls "enough", so the target may land at the very bottom edge of the frame.
  * Reuse the accessible names the E2E tests use (`svg[aria-label^="Decision boundary"]`). Good ARIA labels make a page easy to automate as well as accessible.

---

*(This document is continuously updated as new features, architectural patterns, and engineering lessons are introduced.)*

