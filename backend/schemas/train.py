"""Request/response models for /api/train/*."""

from typing import Literal

from pydantic import BaseModel, Field

DatasetName = Literal["xor", "circle", "clusters"]
TrainingStatusName = Literal["running", "paused", "done", "stopped", "error"]


class DatasetResponse(BaseModel):
    name: DatasetName
    label: str
    class_names: list[str]
    points: list[list[float]] = Field(..., description="[[x, y], ...], all within [-1, 1].")
    labels: list[int] = Field(..., description="Class index for each point.")


class TrainStartRequest(BaseModel):
    dataset: DatasetName = "xor"
    learning_rate: float = Field(0.1, ge=0.001, le=1.0)
    epochs: int = Field(200, ge=10, le=500)
    hidden_size: int = Field(8, ge=2, le=16)


class EpochMetrics(BaseModel):
    epoch: int
    loss: float
    accuracy: float = Field(..., ge=0, le=1)


class TrainingStatus(BaseModel):
    training_id: str
    status: TrainingStatusName
    dataset: DatasetName
    epoch: int
    total_epochs: int
    loss: float | None
    accuracy: float | None
    history: list[EpochMetrics] = Field(
        ..., description="Metrics for epochs after `since` (incremental polling)."
    )
    history_length: int = Field(..., description="Total epochs recorded so far, including epoch 0.")
    architecture: list[int]
    weights: list[list[list[float]]] = Field(
        ..., description="Current weights; weights[k][j][i] connects node i of layer k to node j of layer k+1."
    )
    error: str | None = None
