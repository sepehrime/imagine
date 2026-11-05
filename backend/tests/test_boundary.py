import pytest


def test_no_model_yet(client):
    assert client.get("/api/boundary/status").json() == {"has_model": False, "model": None}
    r = client.get("/api/boundary/grid")
    assert r.status_code == 409
    assert "No trained model" in r.json()["detail"]
    assert client.post("/api/boundary/predict-point", json={"x": 0, "y": 0}).status_code == 409


def test_grid_is_full_100_by_100(client, trained):
    g = client.get("/api/boundary/grid").json()
    assert g["resolution"] == 100
    assert len(g["predictions"]) == len(g["confidence"]) == 100 * 100
    assert set(g["predictions"]) <= {0, 1}
    assert all(0.5 <= c <= 1 for c in g["confidence"])  # 2 classes: confidence ≥ a coin flip
    assert len(g["point_predictions"]) == len(g["labels"]) == 300
    assert g["accuracy"] > 0.9


def test_grid_rows_run_top_to_bottom(client, trained):
    # XOR: top-left (x<0, y>0) and top-right (x>0, y>0) must be different classes
    g = client.get("/api/boundary/grid").json()
    row, n = 10, 100  # row 10 ≈ y = +0.79
    assert g["predictions"][row * n + 10] != g["predictions"][row * n + 90]


@pytest.mark.parametrize("x, y, expected", [(-0.5, 0.5, 1), (0.5, 0.5, 0), (0.5, -0.5, 1), (-0.5, -0.5, 0)])
def test_point_prediction_returns_class_and_confidence(client, trained, x, y, expected):
    p = client.post("/api/boundary/predict-point", json={"x": x, "y": y}).json()
    assert p["predicted_class"] == expected
    assert p["class_name"] in ("Class A", "Class B")
    assert 0.5 <= p["confidence"] <= 1
    assert sum(p["probabilities"]) == pytest.approx(1.0, abs=1e-3)


def test_status_reports_the_model(client, trained):
    s = client.get("/api/boundary/status").json()
    assert s["has_model"] is True
    assert s["model"]["training_id"] == trained["training_id"]


def test_pretrained_default(client):
    r = client.post("/api/boundary/default")
    assert r.status_code == 201
    assert r.json()["dataset"] == "xor"
    assert client.get("/api/boundary/grid").json()["accuracy"] > 0.9
