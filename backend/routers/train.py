"""
Section 4 — Train & Watch it Learn.

Training runs in a background thread (see utils/trainer.py). The frontend
starts a run, then polls GET /status/{id}?since=N every ~200 ms, receiving
only the epochs it hasn't seen yet.
"""

import logging

from fastapi import APIRouter, HTTPException, Query

from schemas.train import DatasetName, DatasetResponse, TrainingStatus, TrainStartRequest
from state import app_state
from utils.datasets import load_dataset
from utils.trainer import TrainConfig

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/train", tags=["Train"])


@router.get("/datasets/{name}", response_model=DatasetResponse)
def get_dataset(name: DatasetName) -> DatasetResponse:
    """The points a run on this dataset will train on (for the preview plot)."""
    d = load_dataset(name)
    return DatasetResponse(
        name=d.name,
        label=d.label,
        class_names=d.class_names,
        points=d.X.round(4).tolist(),
        labels=d.y.tolist(),
    )


@router.post("/start", response_model=TrainingStatus, status_code=201)
def start_training(req: TrainStartRequest) -> TrainingStatus:
    """Starts a new run (stopping any run in progress). Returns its first status, incl. `training_id`."""
    logger.info("train/start: %s", req.model_dump())
    session = app_state.start_training(TrainConfig(**req.model_dump()))
    return TrainingStatus(**session.snapshot())


@router.get("/status/{training_id}", response_model=TrainingStatus)
def training_status(
    training_id: str,
    since: int = Query(0, ge=0, description="Only return history entries from this index on."),
) -> TrainingStatus:
    session = app_state.get_session(training_id)
    if not session:
        raise HTTPException(404, "No training run with this id. It may have been reset or replaced.")
    return TrainingStatus(**session.snapshot(since))


def _require_current():
    session = app_state.current_session()
    if not session:
        raise HTTPException(409, "There is no training run. Start one first.")
    return session


@router.post("/pause", response_model=TrainingStatus)
def pause_training() -> TrainingStatus:
    session = _require_current()
    if not session.pause():
        raise HTTPException(409, f"Can't pause: training is {session.status}.")
    return TrainingStatus(**session.snapshot())


@router.post("/resume", response_model=TrainingStatus)
def resume_training() -> TrainingStatus:
    session = _require_current()
    if not session.resume():
        raise HTTPException(409, f"Can't resume: training is {session.status}.")
    return TrainingStatus(**session.snapshot())


@router.post("/reset", status_code=204)
def reset_training() -> None:
    """Stops the current run and clears every trained model."""
    app_state.reset()
