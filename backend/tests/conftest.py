"""
Shared pytest fixtures.

- Training is unpaced (TRAINING_TARGET_SECONDS=0) so a run finishes in well
  under a second. This must be set before `main` is imported, because the
  trainer reads it at import time.
- `app_state` is a process-wide singleton, so every test resets it afterwards.
  Without this, a model trained in one test would leak into the next.
"""

import os
import time

os.environ["TRAINING_TARGET_SECONDS"] = "0"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from main import app  # noqa: E402
from state import app_state  # noqa: E402


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(autouse=True)
def reset_state():
    yield
    app_state.reset()


def wait_for_training(client, training_id, timeout=15.0):
    """Polls /status until the run leaves 'running'; returns the final status."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        status = client.get(f"/api/train/status/{training_id}").json()
        if status["status"] != "running":
            return status
        time.sleep(0.05)
    raise AssertionError(f"training {training_id} did not finish within {timeout}s")


@pytest.fixture
def trained(client):
    """A finished XOR run, stored as the trained model."""
    start = client.post(
        "/api/train/start", json={"dataset": "xor", "learning_rate": 0.5, "epochs": 60, "hidden_size": 8}
    ).json()
    final = wait_for_training(client, start["training_id"])
    assert final["status"] == "done"
    return final
