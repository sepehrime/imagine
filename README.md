# 🤖 How AI Works — Interactive Web App

An interactive educational platform designed to make Artificial Intelligence concepts accessible to beginners through live demos, visual feedback, and plain-language explanations.

---

## 🏛️ System Architecture

This project is organized as a **monorepo** containing two decoupled systems:

```text
imagine/
├── frontend/                # React (Vite) Single Page Application
│   ├── src/                 # Application source code
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks (e.g. useProgress)
│   │   ├── layouts/         # Page wrappers (Header, Footer)
│   │   └── pages/           # Route views & interactive module demos
│   ├── package.json         # Node.js dependencies & scripts
│   └── vite.config.js       # Vite configuration with backend proxy
│
├── backend/                 # Python (FastAPI) ASGI REST API
│   ├── main.py              # Application entrypoint & CORS setup
│   ├── routers/             # Module-specific API routes
│   ├── models/              # ML inference & pre-trained weight loaders
│   ├── schemas/             # Pydantic schemas (Request/Response DTOs)
│   ├── utils/               # Image processing & tensor transformations
│   └── requirements.txt     # Python dependencies
│
├── plan.md                  # Comprehensive implementation roadmap
├── .gitignore               # Multi-language Git ignore rules
└── README.md                # Project documentation
```

---

## 🛠️ Tech Stack & Key Choices

| Layer | Technology | Why We Chose It (SWE Rationale) |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Instant Hot Module Replacement (HMR), rich UI ecosystem, component-driven design. |
| **Styling** | Tailwind CSS | Rapid utility-first styling with dark/light theme support. |
| **Animations** | Framer Motion | Declarative animations to visualize neural signals and data flows. |
| **Backend** | Python + FastAPI | High performance, automatic OpenAPI documentation, clean async support. |
| **Machine Learning**| PyTorch, Scikit-Learn, Transformers | Industry-standard libraries for computer vision, classical ML, and NLP. |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **Git**

---

### 1. Backend Setup (FastAPI)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *Health Check:* Visit [http://localhost:8000/health](http://localhost:8000/health) or explore the interactive API docs at [http://localhost:8000/docs](http://localhost:8000/docs).

---

### 2. Frontend Setup (React + Vite)

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 💡 Software Engineering Principles in this Project

1. **Separation of Concerns:** Frontend handles visualization and user interactions; backend handles data processing, numerical computation, and model inference.
2. **Stateless API Design:** Endpoints process input payloads predictably without relying on server-side session memory, making them scalable and easy to test.
3. **Async Event-Loop Hygiene:** In FastAPI, CPU-heavy ML operations are isolated from the main async event loop to prevent server blocking.
4. **Defensive Input Validation:** All API boundaries are strictly validated using Pydantic DTOs before touching ML models.
