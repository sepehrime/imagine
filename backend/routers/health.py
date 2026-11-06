"""System health check, used to confirm the API server is up."""

from fastapi import APIRouter

from schemas.health import HealthResponse

router = APIRouter(tags=["System"])

SERVICE_NAME = "inside-the-network-backend"
VERSION = "0.1.0"


@router.get("/health", response_model=HealthResponse)
def health_check() -> HealthResponse:
    """
    Lightweight liveness check: no database, no model, just "the process is
    up and answering requests". Plain `def` or `async def` would both be fine
    here since it does no blocking work.
    """
    return HealthResponse(status="ok", service=SERVICE_NAME, version=VERSION)
