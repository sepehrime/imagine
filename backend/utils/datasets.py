"""
2D toy datasets for Section 4 (Train) and Section 5 (Decision Boundary).

Every dataset:
  - lives in the square [-1, 1] × [-1, 1], so the boundary grid in Section 5
    can always cover the same area;
  - is generated from a fixed seed, so the preview the learner sees is exactly
    the data the network trains on.
"""

from dataclasses import dataclass

import numpy as np
from sklearn.datasets import make_blobs

N_POINTS = 300
SEED = 7


@dataclass(frozen=True)
class Dataset:
    """A 2D classification dataset: points `X` and their class labels `y`."""

    name: str
    label: str
    class_names: list[str]
    X: np.ndarray  # shape (n, 2), float32
    y: np.ndarray  # shape (n,), int64

    @property
    def num_classes(self) -> int:
        return len(self.class_names)


def _xor(rng: np.random.Generator) -> tuple[np.ndarray, np.ndarray]:
    # Uniform points, label = "are x and y on different sides of zero?"
    # A small gap around the axes keeps the classes cleanly separable.
    X = rng.uniform(-1, 1, size=(N_POINTS * 2, 2))
    X = X[(np.abs(X[:, 0]) > 0.08) & (np.abs(X[:, 1]) > 0.08)][:N_POINTS]
    y = ((X[:, 0] > 0) ^ (X[:, 1] > 0)).astype(np.int64)
    return X, y


def _circle_vs_square(rng: np.random.Generator) -> tuple[np.ndarray, np.ndarray]:
    # Points inside a circle (class 0) vs. the rest of the square (class 1).
    # Radius 0.8 gives roughly a 50/50 split (π·0.8² ≈ 2.0 of the square's area 4).
    X = rng.uniform(-1, 1, size=(N_POINTS, 2))
    y = (np.hypot(X[:, 0], X[:, 1]) > 0.8).astype(np.int64)
    return X, y


def _three_clusters(_: np.random.Generator) -> tuple[np.ndarray, np.ndarray]:
    X, y = make_blobs(
        n_samples=N_POINTS,
        centers=[(-0.5, -0.45), (0.5, -0.45), (0.0, 0.5)],
        cluster_std=0.2,
        random_state=SEED,
    )
    return np.clip(X, -1, 1), y.astype(np.int64)


_SPECS = {
    "xor": ("XOR", ["Class A", "Class B"], _xor),
    "circle": ("Circle vs Square", ["Circle", "Square"], _circle_vs_square),
    "clusters": ("Three Clusters", ["Cluster 1", "Cluster 2", "Cluster 3"], _three_clusters),
}

DATASET_NAMES = tuple(_SPECS)

_cache: dict[str, Dataset] = {}


def load_dataset(name: str) -> Dataset:
    """Returns the (cached) dataset. Raises KeyError for unknown names."""
    if name not in _cache:
        label, class_names, generate = _SPECS[name]
        X, y = generate(np.random.default_rng(SEED))
        _cache[name] = Dataset(name, label, class_names, X.astype(np.float32), y)
    return _cache[name]
