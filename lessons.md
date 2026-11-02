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

*(This document is continuously updated as new features, architectural patterns, and engineering lessons are introduced.)*

