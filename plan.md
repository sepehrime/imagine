# 🤖 "How AI Works" — Interactive Web App: Project Plan

## Overview
An interactive educational web application that teaches AI concepts to beginners through
live demos, visualizations, and plain-language explanations. Runs fully local with a
React frontend and Python/FastAPI backend.

---

## 📁 Project Structure

- [ ] Create root project folder: `imagine/` (or your preferred name)
- [ ] Create `frontend/` subfolder for the React app
- [ ] Create `backend/` subfolder for the FastAPI app
- [ ] Create a root `README.md` with setup instructions
- [ ] Create a root `.gitignore` covering Python, Node, and OS files
- [ ] Initialize a Git repository at the root level

---

## ⚙️ Phase 1: Environment Setup

### 1.1 Frontend Setup (React + Vite)
- [ ] Install Node.js (v18+) if not already installed
- [ ] Scaffold React app with Vite inside `frontend/`: `npm create vite@latest`
- [ ] Choose React + JavaScript (or TypeScript if preferred)
- [ ] Install dependencies:
  - [ ] `react-router-dom` — page routing
  - [ ] `tailwindcss` + `postcss` + `autoprefixer` — styling
  - [ ] `framer-motion` — animations and transitions
  - [ ] `recharts` — charts and data visualizations
  - [ ] `axios` — HTTP requests to the backend
  - [ ] `lucide-react` — icon library
- [ ] Configure Tailwind CSS (`tailwind.config.js`, `postcss.config.js`)
- [ ] Set up `vite.config.js` with proxy to backend (`http://localhost:8000`)
- [ ] Delete Vite boilerplate (default App.css, logo, etc.)
- [ ] Verify frontend runs: `npm run dev` → `localhost:5173`

### 1.2 Backend Setup (Python + FastAPI)
- [ ] Ensure Python 3.10+ is installed
- [ ] Create a virtual environment inside `backend/`: `python -m venv venv`
- [ ] Activate virtual environment
- [ ] Create `requirements.txt` with all dependencies:
  - [ ] `fastapi` — API framework
  - [ ] `uvicorn[standard]` — ASGI server to run FastAPI
  - [ ] `scikit-learn` — ML models (classification, regression)
  - [ ] `torch` + `torchvision` — deep learning (PyTorch)
  - [ ] `transformers` — Hugging Face NLP models
  - [ ] `tokenizers` — fast tokenization
  - [ ] `Pillow` — image processing
  - [ ] `numpy` — numerical computation
  - [ ] `matplotlib` — generating plots (returned as images)
  - [ ] `python-multipart` — file upload support
  - [ ] `pydantic` — request/response validation
- [ ] Install all requirements: `pip install -r requirements.txt`
- [ ] Create `main.py` as the FastAPI entry point
- [ ] Configure CORS middleware to allow requests from `localhost:5173`
- [ ] Add a `/health` endpoint to verify the backend is running
- [ ] Verify backend runs: `uvicorn main:app --reload` → `localhost:8000`
- [ ] Test CORS: confirm frontend can call backend `/health` endpoint

---

## 🎨 Phase 2: Frontend — Core Layout & Navigation

### 2.1 Global Layout
- [ ] Create `src/layouts/MainLayout.jsx` — shared wrapper with header and footer
- [ ] Build `src/components/Header.jsx`:
  - [ ] App logo/title ("How AI Works")
  - [ ] Navigation links to all modules
  - [ ] Dark/light mode toggle button
  - [ ] Mobile hamburger menu for small screens
- [ ] Build `src/components/Footer.jsx`:
  - [ ] Short description
  - [ ] Links to Glossary and About page
- [ ] Implement dark/light mode:
  - [ ] Use Tailwind's `dark:` variant
  - [ ] Store preference in `localStorage`
  - [ ] Apply `dark` class to `<html>` element on toggle
- [ ] Make layout fully responsive (mobile, tablet, desktop)

### 2.2 Routing
- [ ] Set up `src/App.jsx` with React Router `<BrowserRouter>`
- [ ] Define routes for:
  - [ ] `/` — Home page
  - [ ] `/module/1` — What is AI?
  - [ ] `/module/2` — How Machines Learn
  - [ ] `/module/3` — Neural Networks
  - [ ] `/module/4` — Classification & Regression
  - [ ] `/module/5` — Computer Vision
  - [ ] `/module/6` — Natural Language Processing
  - [ ] `/module/7` — AI Ethics & Limitations
  - [ ] `/module/8` — Playground
  - [ ] `/glossary` — Glossary of Terms
  - [ ] `/about` — About the App
- [ ] Add a 404 Not Found page
- [ ] Add scroll-to-top behavior on route change

### 2.3 Shared Reusable Components
- [ ] `src/components/ModuleCard.jsx` — card linking to each module
- [ ] `src/components/ProgressBar.jsx` — shows % of modules completed
- [ ] `src/components/Badge.jsx` — completion badge per module
- [ ] `src/components/Tooltip.jsx` — hover tooltip for jargon terms
- [ ] `src/components/LoadingSpinner.jsx` — shown while API calls are pending
- [ ] `src/components/ErrorMessage.jsx` — displayed on API failures
- [ ] `src/components/KeyTakeaway.jsx` — highlighted summary box at module end
- [ ] `src/components/GlossaryTerm.jsx` — inline term with popup definition

### 2.4 Progress Tracking
- [ ] Store module completion state in `localStorage`
- [ ] Create `src/hooks/useProgress.js` — custom hook to get/set progress
- [ ] Show completion indicators on module cards (checkmark, color change)
- [ ] Show overall progress bar on Home page

---

## 🏠 Phase 3: Home Page

- [ ] Create `src/pages/Home.jsx`
- [ ] Hero section:
  - [ ] Bold headline: "Understand AI — No Math Degree Required"
  - [ ] Short subheadline describing the app
  - [ ] "Start Learning" CTA button → Module 1
  - [ ] Subtle animated background (e.g., floating nodes/network)
- [ ] Module overview grid:
  - [ ] Display all 8 module cards (icon, title, short description)
  - [ ] Show completion badge if module is done
  - [ ] Highlight the next suggested module
- [ ] Overall progress bar showing how many modules are completed
- [ ] "What You'll Learn" section — bullet list of key outcomes
- [ ] Short "No prior knowledge needed" reassurance section

---

## 📘 Phase 4: Module Pages (Frontend Shell)

> Each module follows the same 3-part structure:
> 1. **Concept Explainer** — illustrated, plain-language explanation
> 2. **Interactive Demo** — live input/output powered by the backend
> 3. **Key Takeaway** — summary card + "Mark as Complete" button

### 4.1 Module 1 — What is AI?
- [ ] Create `src/pages/modules/Module1.jsx`
- [ ] Concept section:
  - [ ] Explain AI, Machine Learning, Deep Learning with plain language
  - [ ] Animated Venn diagram (AI ⊃ ML ⊃ DL)
  - [ ] Timeline of key AI milestones (1950 → today)
- [ ] Interactive demo:
  - [ ] Show 10 real-world examples (Netflix, Spotify, Maps, Face ID, etc.)
  - [ ] User clicks an example → sees a short explanation of what AI does there
- [ ] Key Takeaway card + "Mark Complete" button

### 4.2 Module 2 — How Machines Learn
- [ ] Create `src/pages/modules/Module2.jsx`
- [ ] Concept section:
  - [ ] Explain training data, labels, and the learning loop
  - [ ] Illustrate the "Guess → Check → Improve" cycle
  - [ ] Define: training, testing, overfitting (with visual metaphors)
- [ ] Interactive demo:
  - [ ] Show 5 shapes (circle, square, triangle, star, pentagon)
  - [ ] User labels several shapes → clicks "Train Model"
  - [ ] Backend trains a simple model on those labels → returns accuracy
  - [ ] Show a confusion matrix of results
- [ ] Key Takeaway card + "Mark Complete" button

### 4.3 Module 3 — Neural Networks
- [ ] Create `src/pages/modules/Module3.jsx`
- [ ] Concept section:
  - [ ] Explain neurons, layers, weights, activations
  - [ ] Animated diagram: input → hidden layers → output
  - [ ] Explain how a single neuron computes its output
- [ ] Interactive demo:
  - [ ] Display an interactive neural network diagram (nodes + edges)
  - [ ] User sliders to adjust weights on connections
  - [ ] Show how the output value changes in real-time
  - [ ] Animate the "forward pass" (data flowing through the network)
- [ ] Key Takeaway card + "Mark Complete" button

### 4.4 Module 4 — Classification & Regression
- [ ] Create `src/pages/modules/Module4.jsx`
- [ ] Concept section:
  - [ ] Explain classification (discrete outputs) vs regression (continuous outputs)
  - [ ] Use relatable examples: email spam (classification), house prices (regression)
- [ ] Interactive demo — Classification:
  - [ ] Scatter plot with two color-coded groups of dots
  - [ ] User clicks to add new dots to either group
  - [ ] Backend trains a classifier → draws decision boundary on the chart
- [ ] Interactive demo — Regression:
  - [ ] Empty scatter plot
  - [ ] User clicks to add data points
  - [ ] Backend fits a regression line → shows it on the chart with equation
- [ ] Key Takeaway card + "Mark Complete" button

### 4.5 Module 5 — Computer Vision
- [ ] Create `src/pages/modules/Module5.jsx`
- [ ] Concept section:
  - [ ] Explain pixels, image grids, and how CNNs work
  - [ ] Visualize convolutional filters (edge detection, blur, etc.)
  - [ ] Show feature map animation: what the network "sees"
- [ ] Interactive demo — Digit Recognizer:
  - [ ] 28×28 pixel drawing canvas (mouse or touch)
  - [ ] "Predict" button → sends canvas image to backend
  - [ ] Backend runs PyTorch MNIST model → returns predicted digit + confidence scores
  - [ ] Display bar chart of confidence for all 10 digits (0–9)
  - [ ] "Clear" button to reset canvas
- [ ] Interactive demo — Image Classifier:
  - [ ] Upload an image (JPG/PNG)
  - [ ] Backend runs torchvision ResNet → returns top-5 predicted labels + confidence
  - [ ] Display results as a ranked list with progress bars
- [ ] Key Takeaway card + "Mark Complete" button

### 4.6 Module 6 — Natural Language Processing
- [ ] Create `src/pages/modules/Module6.jsx`
- [ ] Concept section:
  - [ ] Explain how computers understand text
  - [ ] Explain tokenization, embeddings, and attention in plain language
  - [ ] Analogy: words as coordinates in a "meaning space"
- [ ] Interactive demo — Tokenizer:
  - [ ] Text input field
  - [ ] User types any sentence → backend tokenizes it
  - [ ] Display each token as a colored chip with its ID number
  - [ ] Show token count
- [ ] Interactive demo — Sentiment Analysis:
  - [ ] Text input field
  - [ ] Backend runs a sentiment model (positive/negative/neutral)
  - [ ] Display result with confidence bar and emoji (😊 😐 😠)
- [ ] Interactive demo — Word Similarity:
  - [ ] Two text input fields for two words
  - [ ] Backend computes cosine similarity using embeddings
  - [ ] Display similarity score (0–1) with interpretation
- [ ] Interactive demo — Next Word Prediction:
  - [ ] User types partial sentence
  - [ ] Backend returns top-5 next word predictions with probabilities
  - [ ] Display as a ranked list
- [ ] Key Takeaway card + "Mark Complete" button

### 4.7 Module 7 — AI Ethics & Limitations
- [ ] Create `src/pages/modules/Module7.jsx`
- [ ] Concept section:
  - [ ] Explain bias: what it is, where it comes from, why it matters
  - [ ] Explain hallucinations in LLMs
  - [ ] Explain the "black box" problem
  - [ ] Discuss fairness, privacy, job displacement briefly
- [ ] Interactive demo — Biased Dataset:
  - [ ] Show two versions of a dataset (balanced vs biased)
  - [ ] Backend trains a model on each → compare accuracy across groups
  - [ ] Visualize the difference side by side
- [ ] Interactive demo — AI Limitations Quiz:
  - [ ] 5 multiple-choice scenarios: "Should you trust AI here?"
  - [ ] Each answer reveals an explanation
  - [ ] Show score at the end
- [ ] Key Takeaway card + "Mark Complete" button

### 4.8 Module 8 — Playground
- [ ] Create `src/pages/modules/Module8.jsx`
- [ ] Overview section explaining the playground concept
- [ ] Tabbed interface with mini-versions of demos from all modules:
  - [ ] Tab: Draw & Predict (digit recognizer)
  - [ ] Tab: Classify Points (scatter plot classifier)
  - [ ] Tab: Analyze Text (sentiment + tokenizer)
  - [ ] Tab: Image Upload (image classifier)
- [ ] "Experiment freely" messaging — no right or wrong answers
- [ ] Key Takeaway card + "Mark Complete" button

---

## 🐍 Phase 5: Backend — API Endpoints (FastAPI)

### 5.1 Project Structure
- [ ] Create `backend/main.py` — entry point, CORS config, route registration
- [ ] Create `backend/routers/` directory with one file per module:
  - [ ] `routers/health.py`
  - [ ] `routers/module2.py` — shape classification
  - [ ] `routers/module4.py` — classification & regression
  - [ ] `routers/module5.py` — computer vision
  - [ ] `routers/module6.py` — NLP
  - [ ] `routers/module7.py` — bias demo
- [ ] Create `backend/models/` directory for ML model loading logic:
  - [ ] `models/mnist_model.py` — PyTorch MNIST loader
  - [ ] `models/image_classifier.py` — ResNet loader
  - [ ] `models/nlp_models.py` — Hugging Face model loaders
- [ ] Create `backend/schemas/` directory for Pydantic request/response schemas
- [ ] Create `backend/utils/` directory for shared utility functions

### 5.2 Health Check
- [ ] `GET /health` → returns `{"status": "ok"}`

### 5.3 Module 2 Endpoints
- [ ] `POST /api/module2/train`
  - [ ] Input: list of labeled shape examples
  - [ ] Trains a scikit-learn classifier (e.g., Decision Tree)
  - [ ] Returns: accuracy score, confusion matrix data

### 5.4 Module 4 Endpoints
- [ ] `POST /api/module4/classify`
  - [ ] Input: list of 2D points with labels
  - [ ] Trains scikit-learn SVM or Logistic Regression
  - [ ] Returns: decision boundary coordinates, accuracy
- [ ] `POST /api/module4/regress`
  - [ ] Input: list of (x, y) data points
  - [ ] Fits a linear regression model
  - [ ] Returns: slope, intercept, R² score, predicted line points

### 5.5 Module 5 Endpoints
- [ ] `POST /api/module5/predict-digit`
  - [ ] Input: base64 encoded 28×28 image
  - [ ] Runs PyTorch MNIST model
  - [ ] Returns: predicted digit (0–9), confidence array for all digits
- [ ] `POST /api/module5/classify-image`
  - [ ] Input: uploaded image file
  - [ ] Runs torchvision ResNet50 (pretrained on ImageNet)
  - [ ] Returns: top-5 labels with confidence scores
- [ ] Pre-load both models at server startup (not on each request)

### 5.6 Module 6 Endpoints
- [ ] `POST /api/module6/tokenize`
  - [ ] Input: raw text string
  - [ ] Runs Hugging Face tokenizer (e.g., GPT-2 or BERT)
  - [ ] Returns: list of tokens with their IDs
- [ ] `POST /api/module6/sentiment`
  - [ ] Input: raw text string
  - [ ] Runs a sentiment analysis pipeline (Hugging Face)
  - [ ] Returns: label (positive/negative/neutral), confidence score
- [ ] `POST /api/module6/word-similarity`
  - [ ] Input: two words or phrases
  - [ ] Computes embeddings using `sentence-transformers`
  - [ ] Returns: cosine similarity score (0.0–1.0)
- [ ] `POST /api/module6/next-word`
  - [ ] Input: partial sentence string
  - [ ] Runs a masked or causal LM to predict next tokens
  - [ ] Returns: top-5 next word candidates with probabilities

### 5.7 Module 7 Endpoints
- [ ] `POST /api/module7/bias-demo`
  - [ ] Input: dataset type (balanced or biased, predefined)
  - [ ] Trains a classifier on the selected dataset
  - [ ] Returns: accuracy broken down by group for comparison

### 5.8 Model Loading Strategy
- [ ] Use FastAPI `lifespan` context manager to load all models on startup
- [ ] Store loaded models in a shared app state object
- [ ] Log model loading times to console
- [ ] Handle model load failures gracefully with clear error messages

---

## 📄 Phase 6: Glossary & About Pages

### 6.1 Glossary Page
- [ ] Create `src/pages/Glossary.jsx`
- [ ] Compile list of all AI terms used across modules (target: 40+ terms):
  - [ ] Algorithm, Artificial Intelligence, Attention, Backpropagation
  - [ ] Bias, Classification, Confidence Score, Confusion Matrix
  - [ ] Convolutional Neural Network (CNN), Data, Decision Boundary
  - [ ] Deep Learning, Embedding, Epoch, Feature, Feature Map
  - [ ] Gradient Descent, Hallucination, Hyperparameter, Label
  - [ ] Layer, Linear Regression, Loss Function, Machine Learning
  - [ ] Model, Neural Network, Neuron, Overfitting, Parameter
  - [ ] Prediction, Regression, Sentiment Analysis, Softmax
  - [ ] Supervised Learning, Token, Training Data, Transfer Learning
  - [ ] Underfitting, Unsupervised Learning, Validation, Weight
- [ ] Alphabetically sorted with letter jump navigation (A B C … Z)
- [ ] Search/filter input to find terms quickly
- [ ] Each term links back to the module where it was introduced
- [ ] Inline glossary tooltips in module pages link here

### 6.2 About Page
- [ ] Create `src/pages/About.jsx`
- [ ] Describe the purpose of the app
- [ ] List tech stack used
- [ ] Credit open-source libraries and datasets (MNIST, ImageNet, Hugging Face)
- [ ] Link to relevant learning resources (fast.ai, 3Blue1Brown, etc.)

---

## 🧪 Phase 7: Testing & Quality

### 7.1 Frontend
- [ ] Test all routes load without errors
- [ ] Test dark/light mode toggle persists on page refresh
- [ ] Test progress tracking saves correctly across sessions
- [ ] Test each module's demo with valid inputs
- [ ] Test each module's demo with empty or invalid inputs (error handling)
- [ ] Test responsive layout on mobile viewport (375px) and tablet (768px)
- [ ] Test all API calls handle loading and error states

### 7.2 Backend
- [ ] Test `/health` endpoint returns 200
- [ ] Test each endpoint with valid input → correct response shape
- [ ] Test each endpoint with invalid/missing input → returns a 422 error
- [ ] Test image upload with oversized file → returns graceful error
- [ ] Test CORS: frontend origin is accepted, others rejected
- [ ] Test model loading: all models load on startup without crashing
- [ ] Verify response times are acceptable (< 5s for heavy models)

### 7.3 End-to-End Checks
- [ ] Full user journey: Home → Module 1 → … → Module 8 → Playground
- [ ] All "Mark Complete" buttons update progress correctly
- [ ] All API-powered demos work end-to-end in the browser
- [ ] No console errors in the browser DevTools
- [ ] No unhandled exceptions in the backend terminal

---

## 📝 Phase 8: Documentation

- [ ] Write `README.md` at the project root with:
  - [ ] Project description and screenshot
  - [ ] Prerequisites (Node.js, Python versions)
  - [ ] Step-by-step local setup instructions (frontend + backend)
  - [ ] How to run the app
  - [ ] Overview of all modules
  - [ ] Folder structure explanation
- [ ] Add inline code comments to all backend route handlers
- [ ] Add JSDoc-style comments to complex React components
- [ ] Document all API endpoints with FastAPI's auto-generated `/docs` (Swagger UI)

---

## 🚀 Phase 9: Polish & Nice-to-Haves

- [ ] Add page transition animations (Framer Motion) between modules
- [ ] Add loading skeleton screens while API responses are pending
- [ ] Add keyboard navigation support (Tab, Enter) for interactive demos
- [ ] Add "Back" and "Next" module navigation buttons on each module page
- [ ] Add a floating "Help" button with quick tips on each page
- [ ] Add confetti animation when a user completes all 8 modules 🎉
- [ ] Add a print-friendly CSS stylesheet for the Glossary page
- [ ] Test and fix any accessibility issues (ARIA labels, color contrast)
- [ ] Optimize large model load times (lazy loading or background thread)
- [ ] Add error boundary component in React to catch rendering crashes

---

## ✅ Definition of Done

The project is complete when:
- [ ] All 8 modules are fully implemented with concept + demo + takeaway
- [ ] All API endpoints are working and tested
- [ ] The app runs locally with a single command per terminal
- [ ] Dark mode, progress tracking, and responsive layout all work
- [ ] The Glossary and About pages are complete
- [ ] The README allows a new developer to set up and run the project from scratch
