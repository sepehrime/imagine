import pytest

from state import app_state
from tests.conftest import wait_for_training


@pytest.mark.parametrize("name, classes", [("xor", 2), ("circle", 2), ("clusters", 3)])
def test_datasets(client, name, classes):
    d = client.get(f"/api/train/datasets/{name}").json()
    assert len(d["points"]) == len(d["labels"]) == 300
    assert len(d["class_names"]) == classes
    assert all(-1 <= v <= 1 for point in d["points"] for v in point)


def test_training_runs_to_completion_and_saves_model(client, trained):
    assert trained["epoch"] == trained["total_epochs"] == 60
    assert trained["accuracy"] > 0.9  # XOR is easy at lr 0.5
    assert app_state.trained is not None and app_state.trained.id == trained["training_id"]


def test_loss_goes_down(client, trained):
    history = client.get(f"/api/train/status/{trained['training_id']}").json()["history"]
    assert history[0]["epoch"] == 0  # the untrained "before" point
    assert history[-1]["loss"] < history[0]["loss"]


def test_incremental_polling_returns_only_new_epochs(client, trained):
    tid = trained["training_id"]
    full = client.get(f"/api/train/status/{tid}").json()
    tail = client.get(f"/api/train/status/{tid}", params={"since": 55}).json()
    assert full["history_length"] == 61  # epochs 0..60
    assert [h["epoch"] for h in tail["history"]] == [55, 56, 57, 58, 59, 60]


def test_pause_resume_and_reset(client, monkeypatch):
    # Pace this run so there's time to pause it mid-training
    monkeypatch.setattr("utils.trainer.TARGET_RUN_SECONDS", 5.0)
    start = client.post("/api/train/start", json={"dataset": "circle", "epochs": 100}).json()

    paused = client.post("/api/train/pause")
    assert paused.status_code == 200 and paused.json()["status"] == "paused"
    assert client.post("/api/train/pause").status_code == 409  # can't pause twice

    assert client.post("/api/train/resume").json()["status"] == "running"
    assert client.post("/api/train/reset").status_code == 204
    assert app_state.session is None and app_state.trained is None
    assert client.get(f"/api/train/status/{start['training_id']}").status_code == 404


def test_starting_a_new_run_replaces_the_old_one(client):
    first = client.post("/api/train/start", json={"epochs": 500}).json()
    second = client.post("/api/train/start", json={"epochs": 10}).json()
    assert client.get(f"/api/train/status/{first['training_id']}").status_code == 404
    assert wait_for_training(client, second["training_id"])["status"] == "done"


def test_controls_without_a_run_return_409(client):
    assert client.post("/api/train/pause").status_code == 409
    assert client.post("/api/train/resume").status_code == 409
