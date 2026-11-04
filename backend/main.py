import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import boundary, forward_pass, health, neuron, train

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s: %(message)s")

app = FastAPI(
    title="How AI Works — API",
    description="Interactive backend supporting live machine learning demonstrations and visualizations.",
    version="0.1.0",
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
