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
    """
    Which training runs exist right now. One instance (`app_state`) is shared
    by every request; `_lock` guards the two references below.
    """

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
        """The current run if it has this id; None for unknown or replaced runs."""
        with self._lock:
            s = self.session
        return s if s and s.id == training_id else None

    def current_session(self) -> TrainingSession | None:
        """The current (or most recent) run, whatever its status."""
        with self._lock:
            return self.session

    def train_default(self, config: TrainConfig) -> TrainingSession:
        """
        Trains a model right now (unpaced, ~0.3 s) and makes it the trained
        model. Used by Section 5 when the learner skipped Section 4.
        """
        session = TrainingSession(config, load_dataset(config.dataset), paced=False)
        session.run_blocking()
        if session.status != "done":
            raise RuntimeError(session.error or "Default training failed.")
        with self._lock:
            previous, self.session, self.trained = self.session, session, session
        if previous and previous is not session:
            previous.stop()
        logger.info("state: pretrained default ready (%s)", session.id)
        return session

    def boundary_session(self, training_id: str | None = None) -> TrainingSession | None:
        """
        Which run the decision boundary should show: the run with `training_id`
        if it's the current one (live view while retraining), otherwise the
        last finished model.
        """
        with self._lock:
            if training_id and self.session and self.session.id == training_id:
                return self.session
            return self.trained

    def reset(self) -> None:
        """Stops the current run and forgets every model."""
        with self._lock:
            session, self.session, self.trained = self.session, None, None
        if session:
            session.stop()
        logger.info("state: reset")

    def _set_trained(self, session: TrainingSession) -> None:
        """Callback from the training thread when a run finishes successfully."""
        with self._lock:
            # Ignore a run that was replaced while it was finishing
            if self.session is session:
                self.trained = session


app_state = AppState()
