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

*(This document is continuously updated as new features, architectural patterns, and engineering lessons are introduced.)*

