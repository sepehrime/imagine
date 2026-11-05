import math

import pytest

BODY = {"architecture": [2, 4, 3, 1], "inputs": [0.5, 0.8], "activation": "relu", "seed": 42}


def test_returns_activations_for_every_node(client):
    data = client.post("/api/forward-pass/run", json=BODY).json()
    assert [len(layer["activation"]) for layer in data["layers"]] == BODY["architecture"]
    assert data["layers"][0]["activation"] == BODY["inputs"]  # input layer = the inputs
    # weights[k] has shape [next layer][this layer]
    assert [(len(w), len(w[0])) for w in data["weights"]] == [(4, 2), (3, 4), (1, 3)]
    assert len(data["output"]) == 1 and 0 <= data["output"][0] <= 1  # sigmoid output


def test_weighted_sum_matches_hand_calculation(client):
    data = client.post("/api/forward-pass/run", json=BODY).json()
    w, b, x = data["weights"][0], data["biases"][0], BODY["inputs"]
    z = sum(w[0][i] * x[i] for i in range(2)) + b[0]
    assert data["layers"][1]["pre_activation"][0] == pytest.approx(z, rel=1e-5)
    assert data["layers"][1]["activation"][0] == pytest.approx(max(0.0, z), rel=1e-5)


def test_same_seed_same_result_different_seed_different_result(client):
    a = client.post("/api/forward-pass/run", json=BODY).json()["output"]
    b = client.post("/api/forward-pass/run", json=BODY).json()["output"]
    c = client.post("/api/forward-pass/run", json={**BODY, "seed": 7}).json()["output"]
    assert a == b
    assert a != c


def test_multi_output_uses_softmax(client):
    data = client.post("/api/forward-pass/run", json={**BODY, "architecture": [2, 4, 3]}).json()
    assert data["layers"][-1]["activation_fn"] == "softmax"
    assert math.fsum(data["output"]) == pytest.approx(1.0)
    assert data["prediction"] == data["output"].index(max(data["output"]))
