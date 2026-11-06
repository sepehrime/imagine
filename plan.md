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
  - [x] `python-multipart` — form data support (removed in the cleanup: no endpoint takes form data)
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

- [x] Create `src/pages/Home.jsx`
- [x] Hero section:
  - [x] Bold headline: "See How Neural Networks Think"
  - [x] Short subheadline: what the app does, who it's for
  - [x] "Start Exploring" CTA button → Section 1
  - [x] Animated background: a faint, slowly pulsing neural network
- [x] Section overview grid:
  - [x] Display all 5 section cards with icon, title, and one-line description
  - [x] Show completion badge if section is done
  - [x] Highlight the next suggested section
- [x] Overall progress bar showing how many sections are completed
- [x] "No math degree required" reassurance blurb

---

## 🔬 Phase 4: The Five Core Sections

### Section 1 — What is a Neuron?
**Goal:** Demystify the building block of every neural network.

**Page:** `src/pages/Neuron.jsx`

- [x] Concept explainer:
  - [x] Plain-language description: a neuron takes inputs, multiplies by weights, adds a bias, and produces an output
  - [x] Visual analogy: compare to a human decision (e.g., deciding to bring an umbrella)
- [x] Interactive animated diagram:
  - [x] Show a single neuron with 3 input nodes and 1 output node
  - [x] Inputs (x₁, x₂, x₃) displayed as labeled circles
  - [x] Weighted edges rendered as animated lines with thickness = weight magnitude
  - [x] Weight slider for each input (range -2.0 to 2.0, step 0.1)
  - [x] Bias slider (range -2.0 to 2.0)
  - [x] Activation function selector: ReLU, Sigmoid, Tanh (dropdown)
  - [x] Output value updates in real-time as user changes sliders
  - [x] Output node glows brighter as output value increases
  - [x] Display the math formula: `output = activation(w₁x₁ + w₂x₂ + w₃x₃ + b)`
  - [x] Animate the "flow" of data from inputs to output on each change
- [x] Show activation function graph:
  - [x] Small inline chart showing the shape of the selected activation function
  - [x] A dot on the curve showing where the current output lands
- [x] Key Takeaway card: summarize what a neuron does in 2 sentences
- [x] "Mark as Complete" button

---

### Section 2 — Build the Network
**Goal:** Let users construct any network architecture and see it render live.

**Page:** `src/pages/BuildNetwork.jsx`

- [x] Concept explainer:
  - [x] Explain layers: input layer, hidden layers, output layer
  - [x] Explain how neurons connect across layers (fully connected)
  - [x] Explain why depth matters (more layers = more complex patterns)
- [x] Network architecture controls:
  - [x] Slider: number of input nodes (1–4)
  - [x] Slider: number of hidden layers (1–4)
  - [x] Slider: number of nodes per hidden layer (1–8)
  - [x] Slider: number of output nodes (1–3)
  - [x] Dropdown: activation function applied to hidden layers
- [x] Live network diagram (D3.js):
  - [x] Renders a fully connected network matching the sliders
  - [x] Nodes shown as circles, edges as lines
  - [x] Updates instantly as sliders change (smooth animation)
  - [x] Nodes in each layer have a distinct color
  - [x] Hovering a node shows its layer name and position
  - [x] Hovering an edge shows "weight: (uninitialized)" label
- [x] Display network stats below the diagram:
  - [x] Total number of neurons
  - [x] Total number of weights (connections)
  - [x] Total number of layers
- [x] "Lock This Architecture" button to carry it forward to the next sections
- [x] Key Takeaway card + "Mark as Complete" button

---

### Section 3 — Forward Pass
**Goal:** Show how data travels through the network to produce a prediction.

**Page:** `src/pages/ForwardPass.jsx`

- [x] Concept explainer:
  - [x] Explain what a forward pass is: feeding input → getting output
  - [x] Explain that this is what happens every time AI makes a prediction
- [x] Display the locked architecture from Section 2 (or a default if skipped)
- [x] Input controls:
  - [x] One numeric input field per input node (range 0.0–1.0)
  - [x] "Randomize Inputs" button to auto-fill with random values
- [x] "Run Forward Pass" button:
  - [x] Sends inputs to the backend
  - [x] Backend computes activations for every neuron layer by layer
  - [x] Returns: activation values per node, weights used
- [x] Animated visualization:
  - [x] Activation value displayed inside each node
  - [x] Node fill color intensity scales with activation (0 = dark, 1 = bright)
  - [x] Animated pulses travel along edges from input to output, layer by layer
  - [x] Animation plays sequentially (layer 1 → layer 2 → … → output)
  - [x] Speed control slider (slow / normal / fast)
- [x] Output display:
  - [x] Show final output node values prominently
  - [x] If multiple outputs, show which one has the highest value (the "prediction")
- [x] "Step Through" mode:
  - [x] User clicks "Next Layer" to advance the animation one layer at a time
  - [x] Shows the computation happening at each layer (sum + activation)
- [x] Key Takeaway card + "Mark as Complete" button

---

### Section 4 — Train & Watch it Learn
**Goal:** Show the training loop in action — loss drops, weights shift, the network improves.

**Page:** `src/pages/Train.jsx`

- [x] Concept explainer:
  - [x] Explain training: show examples, compare output to correct answer, adjust weights
  - [x] Explain loss: how wrong the network is
  - [x] Explain gradient descent: nudging weights in the right direction
  - [x] Explain epochs: one full pass through the dataset
- [x] Dataset selector:
  - [x] Option A: XOR problem (classic non-linear problem)
  - [x] Option B: Circle vs Square (2-class 2D dataset)
  - [x] Option C: Three clusters (3-class 2D dataset)
  - [x] Show a small preview scatter plot of the selected dataset
- [x] Training controls:
  - [x] Slider: learning rate (0.001 – 1.0, log scale)
  - [x] Slider: number of epochs (10 – 500)
  - [x] Slider: hidden layer size (2 – 16 neurons)
  - [x] "Start Training" button
  - [x] "Pause" and "Reset" buttons
- [x] Live visualizations during training:
  - [x] **Loss curve chart** (Recharts): loss value vs epoch, animates in real-time
  - [x] **Accuracy chart** (Recharts): accuracy vs epoch, updates alongside loss
  - [x] **Network diagram**: edge thickness updates to reflect current weights (rescaled)
  - [x] **Epoch counter**: large number showing current epoch / total epochs
  - [x] **Status label**: "Training…", "Paused", "Done ✓"
- [x] Training runs in backend with polling:
  - [x] Backend trains model epoch by epoch and stores metrics
  - [x] Frontend polls `/api/train/status` every ~200ms during training
- [x] After training completes:
  - [x] Show final loss and accuracy prominently
  - [x] Show "Training Complete 🎉" message
  - [x] Enable "View Decision Boundary" button → navigates to Section 5
- [x] Key Takeaway card + "Mark as Complete" button

---

### Section 5 — Decision Boundary
**Goal:** Show what the trained network has actually "learned" — how it divides the world.

**Page:** `src/pages/Boundary.jsx`

- [x] Concept explainer:
  - [x] Explain what a decision boundary is: the line (or surface) the network draws to separate classes
  - [x] Explain how complex networks can draw complex, curved boundaries
- [x] Display the trained model from Section 4 (or a pretrained default if skipped)
- [x] Decision boundary visualization:
  - [x] 2D scatter plot of the dataset (same dataset selected in Section 4)
  - [x] Background is colored by the network's predicted class at every point (heatmap)
  - [x] Data points overlaid as dots, color-coded by their true label
  - [x] Correct predictions shown as filled dots; misclassifications shown with an X
  - [x] Color gradient in the background shows the model's confidence (intensity = confidence)
- [x] Interactive exploration:
  - [x] User can click anywhere on the plot → backend returns the model's prediction + confidence for that point
  - [x] Clicked point appears on the chart with its predicted label shown
- [x] Retrain controls:
  - [x] Compact sliders for learning rate and epochs
  - [x] "Retrain" button → reruns training and re-renders the boundary
  - [x] Animate the boundary shifting as the new model trains
- [x] "What Changed?" panel:
  - [x] Side-by-side comparison: boundary before vs after retraining
  - [x] Shows final accuracy for each
- [x] Key Takeaway card + "Mark as Complete" button

---

## 🐍 Phase 5: Backend — API Endpoints (FastAPI)

### 5.1 Project Structure
- [x] `backend/main.py` — entry point, CORS config, route registration
- [x] `backend/routers/` directory:
  - [x] `routers/health.py`
  - [x] `routers/neuron.py` — single neuron computation
  - [x] `routers/forward_pass.py` — full network forward pass
  - [x] `routers/train.py` — training loop with polling
  - [x] `routers/boundary.py` — decision boundary grid + point prediction
- [x] `backend/models/network.py` — PyTorch network class (configurable architecture)
- [x] `backend/schemas/` — Pydantic request/response models for all endpoints
- [x] `backend/state.py` — shared app state to hold the trained model between requests
- [x] `backend/utils/` — helper functions (weight extraction, boundary grid generation)

### 5.2 Health Check
- [x] `GET /health` → `{"status": "ok"}`

### 5.3 Neuron Endpoint (Section 1)
- [x] `POST /api/neuron/compute`
  - [x] Input: `inputs` (list of floats), `weights` (list of floats), `bias` (float), `activation` (string: relu/sigmoid/tanh)
  - [x] Computes: weighted sum + activation
  - [x] Returns: `weighted_sum` (float), `output` (float), `activation_used` (string)

### 5.4 Forward Pass Endpoint (Section 3)
- [x] `POST /api/forward-pass/run`
  - [x] Input: `architecture` (layer sizes), `inputs` (list of floats), `activation` (string)
  - [x] Builds a PyTorch model with random weights
  - [x] Runs a forward pass
  - [x] Returns: `node_activations` (per layer), `weights` (per edge), `output` (final values)

### 5.5 Training Endpoints (Section 4)
- [x] `POST /api/train/start`
  - [x] Input: `dataset` (name), `learning_rate` (float), `epochs` (int), `hidden_size` (int)
  - [x] Generates the selected dataset (using scikit-learn)
  - [x] Trains a PyTorch model in a background thread
  - [x] Saves trained model to backend app state
  - [x] Returns a `training_id` string
- [x] `GET /api/train/status/{training_id}`
  - [x] Returns current epoch, loss, accuracy (for polling)
- [x] `POST /api/train/pause` — pauses the training loop
- [x] `POST /api/train/reset` — clears the current training session and model

### 5.6 Boundary Endpoints (Section 5)
- [x] `GET /api/boundary/grid`
  - [x] Uses the trained model from app state
  - [x] Computes predictions on a 100×100 grid of points
  - [x] Returns: grid predictions + confidence values for heatmap rendering
- [x] `POST /api/boundary/predict-point`
  - [x] Input: `x` (float), `y` (float)
  - [x] Returns: predicted class, confidence score

### 5.7 Model & State Management
- [x] Store training state (model, optimizer, epoch count) in a global `AppState` object
- [x] Use Python background thread for the training loop
- [x] Gracefully handle "no model trained yet" with a clear error response
- [x] Log all endpoint calls and training progress to the console

---

## 📄 Phase 6: Glossary & About Pages

### 6.1 Glossary Page
- [x] Create `src/pages/Glossary.jsx`
- [x] Compile all neural network terms used in the app (target: 25+ terms):
  - [x] Activation Function, Architecture, Backpropagation, Bias
  - [x] Classification, Convergence, Dataset, Decision Boundary
  - [x] Deep Learning, Edge (connection), Epoch, Feature
  - [x] Forward Pass, Gradient Descent, Hidden Layer, Input Layer
  - [x] Layer, Learning Rate, Loss / Loss Function, Neural Network
  - [x] Neuron / Node, Output Layer, Overfitting, Prediction
  - [x] ReLU, Sigmoid, Tanh, Training, Underfitting, Weight
- [x] Alphabetically sorted with letter jump navigation
- [x] Search/filter input to find terms quickly
- [x] Each term links back to the section where it appears

### 6.2 About Page
- [x] Create `src/pages/About.jsx`
- [x] Describe the purpose of the app
- [x] List tech stack used (React, Vite, FastAPI, PyTorch, D3, Recharts, Framer Motion)
- [x] Credit open-source tools and libraries
- [x] Link to further learning resources (e.g., 3Blue1Brown Neural Networks playlist, fast.ai)

---

## 🧪 Phase 7: Testing & Quality

### 7.1 Frontend
- [x] All routes load without errors
- [x] Dark/light mode persists on page refresh
- [x] Progress tracking saves correctly across sessions
- [x] Section 1: sliders update neuron output in real-time
- [x] Section 2: network diagram re-renders live on slider change
- [x] Section 3: forward pass animation plays correctly
- [x] Section 4: loss curve animates during training, pause/reset work
- [x] Section 5: decision boundary heatmap renders, click prediction works
- [x] All API calls handle loading and error states gracefully
- [x] Responsive layout works on mobile (375px) and tablet (768px)

### 7.2 Backend
- [x] `/health` returns 200
- [x] Neuron compute returns correct output for known inputs
- [x] Forward pass returns activations for all nodes
- [x] Training runs to completion and saves the model to state
- [x] Boundary grid endpoint returns a full 100×100 prediction grid
- [x] Point prediction returns a class and confidence
- [x] All endpoints return 422 for invalid or missing input
- [x] CORS: requests from `localhost:5173` succeed

### 7.3 End-to-End
- [x] Full journey: Home → Neuron → Build → Forward Pass → Train → Boundary
- [x] Carry architecture from Section 2 into Section 3 (or verify default is used)
- [x] Carry trained model from Section 4 into Section 5
- [x] All "Mark as Complete" buttons update progress correctly
- [x] No console errors in the browser DevTools
- [x] No unhandled exceptions in the backend terminal

---

## 📝 Phase 8: Documentation

- [x] Write root `README.md` with:
  - [x] Project description and screenshots
  - [x] Prerequisites (Node.js, Python 3.10+)
  - [x] Step-by-step local setup (frontend + backend)
  - [x] How to start both servers
  - [x] Overview of all 5 sections
  - [x] Folder structure explanation
- [x] Inline comments on all backend route handlers and training logic
- [x] JSDoc-style comments on complex React components (especially D3 network diagram)
- [x] FastAPI auto-docs available at `localhost:8000/docs`
 
---

## 🚀 Phase 9: Polish & Nice-to-Haves

- [x] Smooth page transition animations between sections (Framer Motion)
- [x] Loading skeleton screens while API calls are pending
- [x] Keyboard support: Tab + Enter for all interactive controls
- [x] Confetti animation when all 5 sections are marked complete 🎉
- [x] Floating tooltip labels on the D3 network (hover node → show activation value)
- [x] Add "Explain this step" expandable panels next to each visualization
- [x] Accessibility: ARIA labels on all interactive elements, sufficient color contrast
- [x] Graceful degradation if backend is not running (show a "backend offline" warning)
- [x] Add a "Reset All Progress" button in settings

---

## ✅ Definition of Done

The project is complete when:
- [x] All 5 sections are fully implemented with explainer + interactive demo + takeaway
- [x] All backend API endpoints are working and tested
- [x] The app runs locally with one command per terminal
- [x] Dark mode, progress tracking, and responsive layout work correctly
- [x] The Glossary and About pages are complete
- [x] The README allows a new developer to set up and run the project from scratch
