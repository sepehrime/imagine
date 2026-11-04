import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import forward_pass, train

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
app.include_router(forward_pass.router)
app.include_router(train.router)


@app.get("/health", tags=["System"])
def health_check():
    """
    Health check endpoint to verify that the API server is up and responsive.
    Note: We declare this as a standard synchronous function (`def`) or async (`async def`).
    Since this is a lightweight in-memory return, either is fast.
    """
    return {
        "status": "ok",
        "service": "how-ai-works-backend",
        "version": "0.1.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
