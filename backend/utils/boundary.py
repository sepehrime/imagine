"""
Decision-boundary helpers: evaluate a trained network over the whole plane.

Grid layout (row-major, row 0 at the TOP so the frontend can paint it
straight into an image):
    index = row * resolution + col
    x = -1 + (col + 0.5) * 2 / resolution
    y = +1 - (row + 0.5) * 2 / resolution
"""

import numpy as np
import torch

from models.network import ConfigurableNetwork

GRID_RESOLUTION = 100


def grid_points(resolution: int = GRID_RESOLUTION) -> np.ndarray:
    """Centre of every grid cell, shape (resolution², 2), in the order described above."""
    centers = -1 + (np.arange(resolution) + 0.5) * 2 / resolution
    xs, ys = np.meshgrid(centers, centers[::-1])  # row 0 = top (y = +1)
    return np.stack([xs.ravel(), ys.ravel()], axis=1).astype(np.float32)


@torch.inference_mode()
def predict(model: ConfigurableNetwork, points: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Returns (predicted class, confidence, all class probabilities) per point.
    Confidence = probability of the predicted class.
    """
    logits = model(torch.from_numpy(points))
    probs = torch.softmax(logits, dim=1)
    confidence, predicted = probs.max(dim=1)
    return predicted.numpy(), confidence.numpy(), probs.numpy()
