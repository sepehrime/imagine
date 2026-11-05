"""
Section 5 — Decision Boundary.

Uses the model trained in Section 4 (kept in `app_state.trained`). Passing
`training_id` of a run in progress shows its live model, which is how the
frontend animates the boundary while retraining.
"""

import logging

import numpy as np
from fastapi import APIRouter, HTTPException, Query

from schemas.boundary import BoundaryGrid, BoundaryStatus, ModelInfo, PointPrediction, PointRequest
from state import app_state
from utils.boundary import GRID_RESOLUTION, grid_points, predict
from utils.trainer import TrainConfig

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/boundary", tags=["Decision Boundary"])

NO_MODEL = "No trained model yet. Train one in Section 4, or use the pretrained default."

# Used when the learner skipped Section 4
DEFAULT_CONFIG = TrainConfig(dataset="xor", learning_rate=0.3, epochs=200, hidden_size=8)


def _session_or_409(training_id: str | None):
    """The run to draw (see `AppState.boundary_session`), or a 409 if there's no model."""
    session = app_state.boundary_session(training_id)
    if not session:
        # 409 Conflict: the request is fine, but the server isn't in a state to answer it yet
        raise HTTPException(409, NO_MODEL)
    return session


def _model_info(session, epoch: int) -> ModelInfo:
    """Summary of the model being shown: its settings and how far it has trained."""
    cfg = session.config
    return ModelInfo(
        training_id=session.id,
        status=session.status,
        dataset=cfg.dataset,
        dataset_label=session.dataset.label,
        class_names=session.dataset.class_names,
        learning_rate=cfg.learning_rate,
        epochs=cfg.epochs,
        hidden_size=cfg.hidden_size,
        epoch=epoch,
    )


@router.get("/status", response_model=BoundaryStatus)
def boundary_status() -> BoundaryStatus:
    """
    Is there a trained model to draw? Always 200, so a page can check before
    asking for the grid (a 409 from /grid would show up as a console error).
    """
    session = app_state.boundary_session()
    if not session:
        return BoundaryStatus(has_model=False)
    return BoundaryStatus(has_model=True, model=_model_info(session, session.snapshot()["epoch"]))


@router.get("/grid", response_model=BoundaryGrid)
def boundary_grid(
    training_id: str | None = Query(None, description="Show this (possibly still running) run's model."),
) -> BoundaryGrid:
    """
    The model's prediction and confidence at every cell of a 100×100 grid over
    [-1, 1]², plus the training points and which of them it gets wrong.

    Without `training_id` this uses the last finished model. 409 if there is none.
    """
    # Read the epoch and copy the model up front, so both describe the same moment
    # even if a training thread is still updating the live model
    session = _session_or_409(training_id)
    epoch = session.snapshot()["epoch"]
    model = session.frozen_model()

    grid_pred, grid_conf, _ = predict(model, grid_points())  # 10,000 predictions in one batch
    data = session.dataset
    point_pred, _, _ = predict(model, data.X)

    return BoundaryGrid(
        model=_model_info(session, epoch),
        resolution=GRID_RESOLUTION,
        predictions=grid_pred.tolist(),
        confidence=np.round(grid_conf, 3).tolist(),
        points=data.X.round(4).tolist(),
        labels=data.y.tolist(),
        point_predictions=point_pred.tolist(),
        accuracy=float((point_pred == data.y).mean()),
    )


@router.post("/predict-point", response_model=PointPrediction)
def predict_point(req: PointRequest) -> PointPrediction:
    """Classifies one (x, y) point and returns the probability of every class."""
    session = _session_or_409(req.training_id)
    pred, conf, probs = predict(session.frozen_model(), np.array([[req.x, req.y]], dtype=np.float32))
    cls = int(pred[0])
    logger.info("boundary/predict-point: (%.2f, %.2f) → %s (%.2f)", req.x, req.y, cls, conf[0])
    return PointPrediction(
        x=req.x,
        y=req.y,
        predicted_class=cls,
        class_name=session.dataset.class_names[cls],
        confidence=float(conf[0]),
        probabilities=probs[0].round(4).tolist(),
    )


@router.post("/default", response_model=ModelInfo, status_code=201)
def train_default_model() -> ModelInfo:
    """Instantly trains a default XOR model so Section 5 works without Section 4."""
    session = app_state.train_default(DEFAULT_CONFIG)
    return _model_info(session, session.snapshot()["epoch"])
