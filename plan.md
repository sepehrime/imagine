# 🧠 "Inside the Network" — Neural Networks Visualizer: Project Plan

## Overview
A visually rich, single-topic interactive web application that teaches users how
neural networks work by letting them **see, build, and train one in real-time**.
No prior knowledge required. Runs fully local with a React (Vite) frontend and
Python (FastAPI) backend.

---

## 📁 Project Structure

- [x] Create root project folder: `imagine/`
- [x] Create `frontend/` subfolder for the React app
- [x] Create `backend/` subfolder for the FastAPI app
- [x] Create a root `README.md` with setup instructions
- [x] Create a root `.gitignore` covering Python, Node, and OS files
- [x] Initialize a Git repository at the root level

---

## ⚙️ Phase 1: Environment Setup

### 1.1 Frontend Setup (React + Vite)
- [x] Install Node.js (v18+) if not already installed
- [x] Scaffold React app with Vite inside `frontend/`: `npm create vite@latest`
- [x] Choose React + JavaScript
- [x] Install dependencies:
  - [x] `react-router-dom` — page routing
  - [x] `tailwindcss` + `postcss` + `autoprefixer` — styling
  - [x] `framer-motion` — animations and transitions
  - [x] `recharts` — loss curve and confidence charts
  - [x] `axios` — HTTP requests to the backend
  - [x] `lucide-react` — icon library
  - [x] `d3` — custom network graph rendering (nodes + edges)
- [x] Configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`)
- [x] Set up `vite.config.js` with proxy to backend (`http://localhost:8000`)
- [x] Delete Vite boilerplate (default App.css, logo, etc.)
- [x] Verify frontend runs: `npm run dev` → `localhost:5173`

### 1.2 Backend Setup (Python + FastAPI)
- [x] Ensure Python 3.10+ is installed
- [x] Create a virtual environment inside `backend/`: `python -m venv venv`
- [x] Activate virtual environment
- [x] Create `requirements.txt` with all dependencies:
  - [x] `fastapi` — API framework
  - [x] `uvicorn[standard]` — ASGI server to run FastAPI
  - [x] `torch` — neural network training and inference
  - [x] `numpy` — numerical computation
  - [x] `scikit-learn` — dataset generation and preprocessing
  - [x] `pydantic` — request/response validation
  - [x] `python-multipart` — form data support
- [x] Install all requirements: `pip install -r requirements.txt`
- [x] Create `main.py` as the FastAPI entry point
- [x] Configure CORS middleware to allow requests from `localhost:5173`
- [x] Add a `/health` endpoint to verify the backend is running
- [x] Verify backend runs: `uvicorn main:app --reload` → `localhost:8000`
- [x] Test CORS: confirm frontend can call backend `/health` endpoint

---

## 🎨 Phase 2: Core Layout & Navigation

### 2.1 Global Layout
- [x] Create `src/layouts/MainLayout.jsx` — shared wrapper with header and footer
- [x] Build `src/components/Header.jsx`:
  - [x] App logo/title: "Inside the Network"
  - [x] Navigation links to all 5 sections
  - [x] Dark/light mode toggle button
  - [x] Mobile hamburger menu for small screens
- [x] Build `src/components/Footer.jsx`:
  - [x] Short tagline
  - [x] Link to Glossary and About page
- [x] Implement dark/light mode:
  - [x] Use Tailwind's `dark:` variant
  - [x] Store user preference in `localStorage`
  - [x] Apply `dark` class to `<html>` element on toggle
- [x] Make layout fully responsive (mobile, tablet, desktop)

### 2.2 Routing
- [x] Set up `src/App.jsx` with React Router `<BrowserRouter>`
- [x] Define routes for:
  - [x] `/` — Home / Landing page
  - [x] `/neuron` — Section 1: What is a Neuron?
  - [x] `/build` — Section 2: Build the Network
  - [x] `/forward-pass` — Section 3: Forward Pass
  - [x] `/train` — Section 4: Train & Watch it Learn
  - [x] `/boundary` — Section 5: Decision Boundary
  - [x] `/glossary` — Glossary of Terms
  - [x] `/about` — About the App
- [x] Add a 404 Not Found page
- [x] Add scroll-to-top behavior on route change
- [x] Add "Previous" and "Next" section navigation buttons on each page

### 2.3 Shared Reusable Components
- [x] `src/components/SectionCard.jsx` — card linking to each section
- [x] `src/components/ProgressBar.jsx` — shows how far through the journey the user is
- [x] `src/components/Tooltip.jsx` — hover tooltip for jargon terms
- [x] `src/components/LoadingSpinner.jsx` — shown while API calls are pending
- [x] `src/components/ErrorMessage.jsx` — displayed on API failures
- [x] `src/components/KeyTakeaway.jsx` — highlighted summary box at section end
- [x] `src/components/GlossaryTerm.jsx` — inline term that opens a definition popup

### 2.4 Progress Tracking
- [x] Store section completion state in `localStorage`
- [x] Create `src/hooks/useProgress.js` — custom hook to get/set progress
- [x] Show completion indicators on section cards (checkmark, color change)
- [x] Show overall progress bar on the Home page

---

## 🏠 Phase 3: Home / Landing Page

- [ ] Create `src/pages/Home.jsx`
- [ ] Hero section:
  - [ ] Bold headline: "See How Neural Networks Think"
  - [ ] Short subheadline: what the app does, who it's for
  - [ ] "Start Exploring" CTA button → Section 1
  - [ ] Animated background: a faint, slowly pulsing neural network
- [ ] Section overview grid:
  - [ ] Display all 5 section cards with icon, title, and one-line description
  - [ ] Show completion badge if section is done
  - [ ] Highlight the next suggested section
- [ ] Overall progress bar showing how many sections are completed
- [ ] "No math degree required" reassurance blurb

---

## 🔬 Phase 4: The Five Core Sections

### Section 1 — What is a Neuron?
**Goal:** Demystify the building block of every neural network.

**Page:** `src/pages/Neuron.jsx`

- [ ] Concept explainer:
  - [ ] Plain-language description: a neuron takes inputs, multiplies by weights, adds a bias, and produces an output
  - [ ] Visual analogy: compare to a human decision (e.g., deciding to bring an umbrella)
- [ ] Interactive animated diagram:
  - [ ] Show a single neuron with 3 input nodes and 1 output node
  - [ ] Inputs (x₁, x₂, x₃) displayed as labeled circles
  - [ ] Weighted edges rendered as animated lines with thickness = weight magnitude
  - [ ] Weight slider for each input (range -2.0 to 2.0, step 0.1)
  - [ ] Bias slider (range -2.0 to 2.0)
  - [ ] Activation function selector: ReLU, Sigmoid, Tanh (dropdown)
  - [ ] Output value updates in real-time as user changes sliders
  - [ ] Output node glows brighter as output value increases
  - [ ] Display the math formula: `output = activation(w₁x₁ + w₂x₂ + w₃x₃ + b)`
  - [ ] Animate the "flow" of data from inputs to output on each change
- [ ] Show activation function graph:
  - [ ] Small inline chart showing the shape of the selected activation function
  - [ ] A dot on the curve showing where the current output lands
- [ ] Key Takeaway card: summarize what a neuron does in 2 sentences
- [ ] "Mark as Complete" button

---

### Section 2 — Build the Network
**Goal:** Let users construct any network architecture and see it render live.

**Page:** `src/pages/BuildNetwork.jsx`

- [ ] Concept explainer:
  - [ ] Explain layers: input layer, hidden layers, output layer
  - [ ] Explain how neurons connect across layers (fully connected)
  - [ ] Explain why depth matters (more layers = more complex patterns)
- [ ] Network architecture controls:
  - [ ] Slider: number of input nodes (1–4)
  - [ ] Slider: number of hidden layers (1–4)
  - [ ] Slider: number of nodes per hidden layer (1–8)
  - [ ] Slider: number of output nodes (1–3)
  - [ ] Dropdown: activation function applied to hidden layers
- [ ] Live network diagram (D3.js):
  - [ ] Renders a fully connected network matching the sliders
  - [ ] Nodes shown as circles, edges as lines
  - [ ] Updates instantly as sliders change (smooth animation)
  - [ ] Nodes in each layer have a distinct color
  - [ ] Hovering a node shows its layer name and position
  - [ ] Hovering an edge shows "weight: (uninitialized)" label
- [ ] Display network stats below the diagram:
  - [ ] Total number of neurons
  - [ ] Total number of weights (connections)
  - [ ] Total number of layers
- [ ] "Lock This Architecture" button to carry it forward to the next sections
- [ ] Key Takeaway card + "Mark as Complete" button

---

### Section 3 — Forward Pass
**Goal:** Show how data travels through the network to produce a prediction.

**Page:** `src/pages/ForwardPass.jsx`

- [ ] Concept explainer:
  - [ ] Explain what a forward pass is: feeding input → getting output
  - [ ] Explain that this is what happens every time AI makes a prediction
- [ ] Display the locked architecture from Section 2 (or a default if skipped)
- [ ] Input controls:
  - [ ] One numeric input field per input node (range 0.0–1.0)
  - [ ] "Randomize Inputs" button to auto-fill with random values
- [ ] "Run Forward Pass" button:
  - [ ] Sends inputs to the backend
  - [ ] Backend computes activations for every neuron layer by layer
  - [ ] Returns: activation values per node, weights used
- [ ] Animated visualization:
  - [ ] Activation value displayed inside each node
  - [ ] Node fill color intensity scales with activation (0 = dark, 1 = bright)
  - [ ] Animated pulses travel along edges from input to output, layer by layer
  - [ ] Animation plays sequentially (layer 1 → layer 2 → … → output)
  - [ ] Speed control slider (slow / normal / fast)
- [ ] Output display:
  - [ ] Show final output node values prominently
  - [ ] If multiple outputs, show which one has the highest value (the "prediction")
- [ ] "Step Through" mode:
  - [ ] User clicks "Next Layer" to advance the animation one layer at a time
  - [ ] Shows the computation happening at each layer (sum + activation)
- [ ] Key Takeaway card + "Mark as Complete" button

---

### Section 4 — Train & Watch it Learn
**Goal:** Show the training loop in action — loss drops, weights shift, the network improves.

**Page:** `src/pages/Train.jsx`

- [ ] Concept explainer:
  - [ ] Explain training: show examples, compare output to correct answer, adjust weights
  - [ ] Explain loss: how wrong the network is
  - [ ] Explain gradient descent: nudging weights in the right direction
  - [ ] Explain epochs: one full pass through the dataset
- [ ] Dataset selector:
  - [ ] Option A: XOR problem (classic non-linear problem)
  - [ ] Option B: Circle vs Square (2-class 2D dataset)
  - [ ] Option C: Three clusters (3-class 2D dataset)
  - [ ] Show a small preview scatter plot of the selected dataset
- [ ] Training controls:
  - [ ] Slider: learning rate (0.001 – 1.0, log scale)
  - [ ] Slider: number of epochs (10 – 500)
  - [ ] Slider: hidden layer size (2 – 16 neurons)
  - [ ] "Start Training" button
  - [ ] "Pause" and "Reset" buttons
- [ ] Live visualizations during training:
  - [ ] **Loss curve chart** (Recharts): loss value vs epoch, animates in real-time
  - [ ] **Accuracy chart** (Recharts): accuracy vs epoch, updates alongside loss
  - [ ] **Network diagram**: edge thickness updates to reflect current weights (rescaled)
  - [ ] **Epoch counter**: large number showing current epoch / total epochs
  - [ ] **Status label**: "Training…", "Paused", "Done ✓"
- [ ] Training runs in backend with polling:
  - [ ] Backend trains model epoch by epoch and stores metrics
  - [ ] Frontend polls `/api/train/status` every ~200ms during training
- [ ] After training completes:
  - [ ] Show final loss and accuracy prominently
  - [ ] Show "Training Complete 🎉" message
  - [ ] Enable "View Decision Boundary" button → navigates to Section 5
- [ ] Key Takeaway card + "Mark as Complete" button

---

### Section 5 — Decision Boundary
**Goal:** Show what the trained network has actually "learned" — how it divides the world.

**Page:** `src/pages/Boundary.jsx`

- [ ] Concept explainer:
  - [ ] Explain what a decision boundary is: the line (or surface) the network draws to separate classes
  - [ ] Explain how complex networks can draw complex, curved boundaries
- [ ] Display the trained model from Section 4 (or a pretrained default if skipped)
- [ ] Decision boundary visualization:
  - [ ] 2D scatter plot of the dataset (same dataset selected in Section 4)
  - [ ] Background is colored by the network's predicted class at every point (heatmap)
  - [ ] Data points overlaid as dots, color-coded by their true label
  - [ ] Correct predictions shown as filled dots; misclassifications shown with an X
  - [ ] Color gradient in the background shows the model's confidence (intensity = confidence)
- [ ] Interactive exploration:
  - [ ] User can click anywhere on the plot → backend returns the model's prediction + confidence for that point
  - [ ] Clicked point appears on the chart with its predicted label shown
- [ ] Retrain controls:
  - [ ] Compact sliders for learning rate and epochs
  - [ ] "Retrain" button → reruns training and re-renders the boundary
  - [ ] Animate the boundary shifting as the new model trains
- [ ] "What Changed?" panel:
  - [ ] Side-by-side comparison: boundary before vs after retraining
  - [ ] Shows final accuracy for each
- [ ] Key Takeaway card + "Mark as Complete" button

---

## 🐍 Phase 5: Backend — API Endpoints (FastAPI)

### 5.1 Project Structure
- [ ] `backend/main.py` — entry point, CORS config, route registration
- [ ] `backend/routers/` directory:
  - [ ] `routers/health.py`
  - [ ] `routers/neuron.py` — single neuron computation
  - [ ] `routers/forward_pass.py` — full network forward pass
  - [ ] `routers/train.py` — training loop with polling
  - [ ] `routers/boundary.py` — decision boundary grid + point prediction
- [ ] `backend/models/network.py` — PyTorch network class (configurable architecture)
- [ ] `backend/schemas/` — Pydantic request/response models for all endpoints
- [ ] `backend/state.py` — shared app state to hold the trained model between requests
- [ ] `backend/utils/` — helper functions (weight extraction, boundary grid generation)

### 5.2 Health Check
- [ ] `GET /health` → `{"status": "ok"}`

### 5.3 Neuron Endpoint (Section 1)
- [ ] `POST /api/neuron/compute`
  - [ ] Input: `inputs` (list of floats), `weights` (list of floats), `bias` (float), `activation` (string: relu/sigmoid/tanh)
  - [ ] Computes: weighted sum + activation
  - [ ] Returns: `weighted_sum` (float), `output` (float), `activation_used` (string)

### 5.4 Forward Pass Endpoint (Section 3)
- [ ] `POST /api/forward-pass/run`
  - [ ] Input: `architecture` (layer sizes), `inputs` (list of floats), `activation` (string)
  - [ ] Builds a PyTorch model with random weights
  - [ ] Runs a forward pass
  - [ ] Returns: `node_activations` (per layer), `weights` (per edge), `output` (final values)

### 5.5 Training Endpoints (Section 4)
- [ ] `POST /api/train/start`
  - [ ] Input: `dataset` (name), `learning_rate` (float), `epochs` (int), `hidden_size` (int)
  - [ ] Generates the selected dataset (using scikit-learn)
  - [ ] Trains a PyTorch model in a background thread
  - [ ] Saves trained model to backend app state
  - [ ] Returns a `training_id` string
- [ ] `GET /api/train/status/{training_id}`
  - [ ] Returns current epoch, loss, accuracy (for polling)
- [ ] `POST /api/train/pause` — pauses the training loop
- [ ] `POST /api/train/reset` — clears the current training session and model

### 5.6 Boundary Endpoints (Section 5)
- [ ] `GET /api/boundary/grid`
  - [ ] Uses the trained model from app state
  - [ ] Computes predictions on a 100×100 grid of points
  - [ ] Returns: grid predictions + confidence values for heatmap rendering
- [ ] `POST /api/boundary/predict-point`
  - [ ] Input: `x` (float), `y` (float)
  - [ ] Returns: predicted class, confidence score

### 5.7 Model & State Management
- [ ] Store training state (model, optimizer, epoch count) in a global `AppState` object
- [ ] Use Python background thread for the training loop
- [ ] Gracefully handle "no model trained yet" with a clear error response
- [ ] Log all endpoint calls and training progress to the console

---

## 📄 Phase 6: Glossary & About Pages

### 6.1 Glossary Page
- [ ] Create `src/pages/Glossary.jsx`
- [ ] Compile all neural network terms used in the app (target: 25+ terms):
  - [ ] Activation Function, Architecture, Backpropagation, Bias
  - [ ] Classification, Convergence, Dataset, Decision Boundary
  - [ ] Deep Learning, Edge (connection), Epoch, Feature
  - [ ] Forward Pass, Gradient Descent, Hidden Layer, Input Layer
  - [ ] Layer, Learning Rate, Loss / Loss Function, Neural Network
  - [ ] Neuron / Node, Output Layer, Overfitting, Prediction
  - [ ] ReLU, Sigmoid, Tanh, Training, Underfitting, Weight
- [ ] Alphabetically sorted with letter jump navigation
- [ ] Search/filter input to find terms quickly
- [ ] Each term links back to the section where it appears

### 6.2 About Page
- [ ] Create `src/pages/About.jsx`
- [ ] Describe the purpose of the app
- [ ] List tech stack used (React, Vite, FastAPI, PyTorch, D3, Recharts, Framer Motion)
- [ ] Credit open-source tools and libraries
- [ ] Link to further learning resources (e.g., 3Blue1Brown Neural Networks playlist, fast.ai)

---

## 🧪 Phase 7: Testing & Quality

### 7.1 Frontend
- [ ] All routes load without errors
- [ ] Dark/light mode persists on page refresh
- [ ] Progress tracking saves correctly across sessions
- [ ] Section 1: sliders update neuron output in real-time
- [ ] Section 2: network diagram re-renders live on slider change
- [ ] Section 3: forward pass animation plays correctly
- [ ] Section 4: loss curve animates during training, pause/reset work
- [ ] Section 5: decision boundary heatmap renders, click prediction works
- [ ] All API calls handle loading and error states gracefully
- [ ] Responsive layout works on mobile (375px) and tablet (768px)

### 7.2 Backend
- [ ] `/health` returns 200
- [ ] Neuron compute returns correct output for known inputs
- [ ] Forward pass returns activations for all nodes
- [ ] Training runs to completion and saves the model to state
- [ ] Boundary grid endpoint returns a full 100×100 prediction grid
- [ ] Point prediction returns a class and confidence
- [ ] All endpoints return 422 for invalid or missing input
- [ ] CORS: requests from `localhost:5173` succeed

### 7.3 End-to-End
- [ ] Full journey: Home → Neuron → Build → Forward Pass → Train → Boundary
- [ ] Carry architecture from Section 2 into Section 3 (or verify default is used)
- [ ] Carry trained model from Section 4 into Section 5
- [ ] All "Mark as Complete" buttons update progress correctly
- [ ] No console errors in the browser DevTools
- [ ] No unhandled exceptions in the backend terminal

---

## 📝 Phase 8: Documentation

- [ ] Write root `README.md` with:
  - [ ] Project description and screenshots
  - [ ] Prerequisites (Node.js, Python 3.10+)
  - [ ] Step-by-step local setup (frontend + backend)
  - [ ] How to start both servers
  - [ ] Overview of all 5 sections
  - [ ] Folder structure explanation
- [ ] Inline comments on all backend route handlers and training logic
- [ ] JSDoc-style comments on complex React components (especially D3 network diagram)
- [ ] FastAPI auto-docs available at `localhost:8000/docs`

---

## 🚀 Phase 9: Polish & Nice-to-Haves

- [ ] Smooth page transition animations between sections (Framer Motion)
- [ ] Loading skeleton screens while API calls are pending
- [ ] Keyboard support: Tab + Enter for all interactive controls
- [ ] Confetti animation when all 5 sections are marked complete 🎉
- [ ] Floating tooltip labels on the D3 network (hover node → show activation value)
- [ ] Add "Explain this step" expandable panels next to each visualization
- [ ] Accessibility: ARIA labels on all interactive elements, sufficient color contrast
- [ ] Graceful degradation if backend is not running (show a "backend offline" warning)
- [ ] Add a "Reset All Progress" button in settings

---

## ✅ Definition of Done

The project is complete when:
- [ ] All 5 sections are fully implemented with explainer + interactive demo + takeaway
- [ ] All backend API endpoints are working and tested
- [ ] The app runs locally with one command per terminal
- [ ] Dark mode, progress tracking, and responsive layout work correctly
- [ ] The Glossary and About pages are complete
- [ ] The README allows a new developer to set up and run the project from scratch
