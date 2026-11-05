"""Request/response models for /api/boundary/*."""

from pydantic import BaseModel, Field

from schemas.train import DatasetName, TrainingStatusName


class ModelInfo(BaseModel):
    training_id: str
    status: TrainingStatusName
    dataset: DatasetName
    dataset_label: str
    class_names: list[str]
    learning_rate: float
    epochs: int
    hidden_size: int
    epoch: int = Field(..., description="Epoch the grid was computed at.")


class BoundaryGrid(BaseModel):
    model: ModelInfo
    resolution: int
    predictions: list[int] = Field(
        ..., description="Predicted class per grid cell, row-major, row 0 at the top (y = +1)."
    )
    confidence: list[float] = Field(..., description="Probability of the predicted class per cell.")
    points: list[list[float]] = Field(..., description="Dataset points [[x, y], ...].")
    labels: list[int] = Field(..., description="True class of each point.")
    point_predictions: list[int] = Field(..., description="Model's prediction for each point.")
    accuracy: float


class PointRequest(BaseModel):
    x: float = Field(..., ge=-1.0, le=1.0)
    y: float = Field(..., ge=-1.0, le=1.0)
    training_id: str | None = Field(None, description="Use this run's live model instead of the last finished one.")


class PointPrediction(BaseModel):
    x: float
    y: float
    predicted_class: int
    class_name: str
    confidence: float
    probabilities: list[float]


class BoundaryStatus(BaseModel):
    has_model: bool = Field(..., description="False until a model has finished training.")
    model: ModelInfo | None = None
