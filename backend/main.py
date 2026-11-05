"""
Inside the Network — FastAPI entry point.

This file only wires things together (see lessons 2.7):
  1. logging, so every router's `logger.info(...)` shows in the terminal;
  2. CORS, so the Vite dev server may call the API from another port;
  3. one router per section, each owning its own /api/<section> prefix.

Run it with:  uvicorn main:app --reload --port 8000
Interactive docs (generated from the routers, schemas and docstrings): /docs
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import boundary, forward_pass, health, neuron, train

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")

# Shown as the groups on /docs. Each router sets `tags=[...]` to land in one.
TAGS = [
    {"name": "System", "description": "Health check: is the server up?"},
    {"name": "Neuron", "description": "Section 1: one artificial neuron, z = Σ wᵢxᵢ + b → activation(z)."},
    {"name": "Forward Pass", "description": "Section 3: run inputs through a network and trace every layer."},
    {"name": "Train", "description": "Section 4: train a small network in a background thread and poll its progress."},
    {"name": "Decision Boundary", "description": "Section 5: what the trained network predicts across the whole plane."},
]

app = FastAPI(
    title="Inside the Network — API",
    description=(
        "Backend for an interactive explainer of how neural networks work. "
        "Every endpoint is used by one of the five sections of the frontend."
    ),
    version="1.0.0",
    openapi_tags=TAGS,
)

# -----------------------------------------------------------------------------
# CORS (Cross-Origin Resource Sharing) Configuration
# -----------------------------------------------------------------------------
# Browsers enforce the Same-Origin Policy. Since Vite runs on port 5173 and
# FastAPI runs on port 8000, they are considered different origins.
# CORSMiddleware injects Access-Control-Allow-* headers to permit frontend calls.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------------------------------------------------------
# Routers: one per section, each owning its own /api/<section> prefix
# -----------------------------------------------------------------------------
app.include_router(health.router)
app.include_router(neuron.router)
app.include_router(forward_pass.router)
app.include_router(train.router)
app.include_router(boundary.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
