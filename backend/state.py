"""
Shared application state.

A single `app_state` object lives for the whole server process. It holds:
  - `session`: the current (or most recent) training run, for /api/train/*;
  - `trained`: the last run that finished successfully, which Section 5
    (/api/boundary/*) uses to draw the decision boundary.

Keeping `trained` separate means starting a new run doesn't take away the
previous finished model until the new one completes.
"""

import logging
import threading

from utils.datasets import load_dataset
from utils.trainer import TrainConfig, TrainingSession

logger = logging.getLogger(__name__)


class AppState:
    def __init__(self) -> None:
        self._lock = threading.Lock()
        self.session: TrainingSession | None = None
        self.trained: TrainingSession | None = None

    def start_training(self, config: TrainConfig) -> TrainingSession:
        """Stops any run in progress and starts a new one."""
        session = TrainingSession(config, load_dataset(config.dataset), on_complete=self._set_trained)
        with self._lock:
            previous, self.session = self.session, session
        if previous:
            previous.stop()
        session.start()
        return session

    def get_session(self, training_id: str) -> TrainingSession | None:
        with self._lock:
            s = self.session
        return s if s and s.id == training_id else None

    def current_session(self) -> TrainingSession | None:
        with self._lock:
            return self.session

    def reset(self) -> None:
        """Stops the current run and forgets every model."""
        with self._lock:
            session, self.session, self.trained = self.session, None, None
        if session:
            session.stop()
        logger.info("state: reset")

    def _set_trained(self, session: TrainingSession) -> None:
        with self._lock:
            # Ignore a run that was replaced while it was finishing
            if self.session is session:
                self.trained = session


app_state = AppState()
