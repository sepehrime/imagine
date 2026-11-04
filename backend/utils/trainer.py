"""
One training run, executed in a background thread.

The request thread (FastAPI) and the training thread share a TrainingSession:
  - the training thread writes metrics after every epoch;
  - request threads read a consistent snapshot for /status polling.
Every shared field is read and written under `self._lock`.

Pause/resume/stop use threading.Event, so the training thread *waits* instead
of spinning in a loop checking a flag.
"""

from __future__ import annotations

import logging
import math
import threading
import time
import uuid
from dataclasses import dataclass
from typing import Callable

import torch
from torch import nn

from models.network import ConfigurableNetwork
from utils.datasets import Dataset

logger = logging.getLogger(__name__)

HIDDEN_ACTIVATION = "tanh"
BATCH_SIZE = 16
MODEL_SEED = 0

# Real training on 300 points takes milliseconds per epoch — far too fast to
# watch. Each epoch is padded so a full run takes a few seconds.
TARGET_RUN_SECONDS = 8.0
MIN_EPOCH_SECONDS = 0.015
MAX_EPOCH_SECONDS = 0.06


@dataclass(frozen=True)
class TrainConfig:
    dataset: str
    learning_rate: float
    epochs: int
    hidden_size: int


class TrainingSession:
    def __init__(
        self,
        config: TrainConfig,
        dataset: Dataset,
        on_complete: Callable[["TrainingSession"], None] | None = None,
    ):
        self.id = uuid.uuid4().hex[:12]
        self.config = config
        self.dataset = dataset
        self.architecture = [2, config.hidden_size, dataset.num_classes]
        self.model = ConfigurableNetwork(self.architecture, HIDDEN_ACTIVATION, seed=MODEL_SEED)
        self._on_complete = on_complete

        # Shared state (guarded by _lock)
        self._lock = threading.Lock()
        self.status = "running"  # running | paused | done | stopped | error
        self.epoch = 0
        self.history: list[dict] = []
        self.weights = self._weights_snapshot()
        self.error: str | None = None

        self._resume = threading.Event()
        self._resume.set()
        self._stop = threading.Event()
        self._thread = threading.Thread(target=self._run, name=f"train-{self.id}", daemon=True)

    # ------------------------------------------------------------------ control
    def start(self) -> None:
        self._thread.start()

    def pause(self) -> bool:
        with self._lock:
            if self.status != "running":
                return False
            self.status = "paused"
            self._resume.clear()
        logger.info("train %s: paused at epoch %d", self.id, self.epoch)
        return True

    def resume(self) -> bool:
        with self._lock:
            if self.status != "paused":
                return False
            self.status = "running"
            self._resume.set()
        logger.info("train %s: resumed", self.id)
        return True

    def stop(self) -> None:
        with self._lock:
            if self.status in ("running", "paused"):
                self.status = "stopped"
        self._stop.set()
        self._resume.set()  # wake the thread if it's paused, so it can exit
        if self._thread.is_alive() and self._thread is not threading.current_thread():
            self._thread.join(timeout=2)

    # ----------------------------------------------------------------- reading
    def snapshot(self, since: int = 0) -> dict:
        """Consistent copy of the shared state. `since` skips history already sent."""
        with self._lock:
            latest = self.history[-1] if self.history else None
            return {
                "training_id": self.id,
                "status": self.status,
                "dataset": self.config.dataset,
                "epoch": self.epoch,
                "total_epochs": self.config.epochs,
                "loss": latest["loss"] if latest else None,
                "accuracy": latest["accuracy"] if latest else None,
                "history": self.history[since:],
                "history_length": len(self.history),
                "architecture": self.architecture,
                "weights": self.weights,
                "error": self.error,
            }

    # ---------------------------------------------------------------- training
    def _weights_snapshot(self) -> list[list[list[float]]]:
        return [layer.weight.detach().tolist() for layer in self.model.linears]

    @torch.no_grad()
    def _evaluate(self, X: torch.Tensor, y: torch.Tensor, loss_fn: nn.Module) -> tuple[float, float]:
        logits = self.model(X)
        loss = loss_fn(logits, y).item()
        accuracy = (logits.argmax(dim=1) == y).float().mean().item()
        return loss, accuracy

    def _record(self, epoch: int, loss: float, accuracy: float) -> None:
        with self._lock:
            self.epoch = epoch
            self.history.append({"epoch": epoch, "loss": loss, "accuracy": accuracy})
            self.weights = self._weights_snapshot()

    def _run(self) -> None:
        torch.set_num_threads(1)  # tiny model; avoid fighting other threads for cores
        cfg = self.config
        logger.info(
            "train %s: start dataset=%s lr=%s epochs=%d hidden=%d",
            self.id, cfg.dataset, cfg.learning_rate, cfg.epochs, cfg.hidden_size,
        )
        try:
            X = torch.from_numpy(self.dataset.X)
            y = torch.from_numpy(self.dataset.y)
            loss_fn = nn.CrossEntropyLoss()
            optimizer = torch.optim.SGD(self.model.parameters(), lr=cfg.learning_rate)
            shuffle = torch.Generator().manual_seed(MODEL_SEED)
            pace = min(MAX_EPOCH_SECONDS, max(MIN_EPOCH_SECONDS, TARGET_RUN_SECONDS / cfg.epochs))

            # Epoch 0 = the untrained network, so the charts start from "before"
            self._record(0, *self._evaluate(X, y, loss_fn))

            for epoch in range(1, cfg.epochs + 1):
                self._resume.wait()  # blocks here while paused
                if self._stop.is_set():
                    return

                started = time.monotonic()
                order = torch.randperm(len(X), generator=shuffle)
                for i in range(0, len(X), BATCH_SIZE):
                    batch = order[i : i + BATCH_SIZE]
                    optimizer.zero_grad()
                    loss_fn(self.model(X[batch]), y[batch]).backward()
                    optimizer.step()

                loss, accuracy = self._evaluate(X, y, loss_fn)
                if not math.isfinite(loss):
                    # Learning rate too high: weights blew up. NaN can't be sent as JSON either.
                    raise FloatingPointError(
                        "Training diverged (the loss became infinite). Try a smaller learning rate."
                    )
                self._record(epoch, loss, accuracy)

                # Wait out the rest of the pacing interval (returns early on stop)
                if self._stop.wait(max(0.0, pace - (time.monotonic() - started))):
                    return

            with self._lock:
                self.status = "done"
            final = self.history[-1]
            logger.info(
                "train %s: done loss=%.4f accuracy=%.3f", self.id, final["loss"], final["accuracy"]
            )
            if self._on_complete:
                self._on_complete(self)
        except FloatingPointError as exc:  # expected with a too-high learning rate
            logger.warning("train %s: %s", self.id, exc)
            with self._lock:
                self.status = "error"
                self.error = str(exc)
        except Exception as exc:  # report instead of dying silently in the thread
            logger.exception("train %s: failed", self.id)
            with self._lock:
                self.status = "error"
                self.error = str(exc)
