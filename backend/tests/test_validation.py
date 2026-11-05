"""
Every endpoint that takes input must reject bad or missing input with 422
(never a 500). Each case names the rule it checks.
"""

import pytest

INVALID = [
    # (method, path, json body, rule being tested)
    ("post", "/api/neuron/compute", {}, "missing everything"),
    ("post", "/api/neuron/compute", {"inputs": [1, 2], "weights": [1]}, "one weight per input"),
    ("post", "/api/neuron/compute", {"inputs": [1], "weights": [1], "activation": "swish"}, "unknown activation"),
    ("post", "/api/neuron/compute", {"inputs": ["a"], "weights": [1]}, "inputs must be numbers"),
    ("post", "/api/forward-pass/run", {}, "missing architecture/inputs"),
    ("post", "/api/forward-pass/run", {"architecture": [2, 4, 1], "inputs": [0.5]}, "inputs must match input layer"),
    ("post", "/api/forward-pass/run", {"architecture": [2, 4, 1], "inputs": [0.5, 1.5]}, "inputs in [0, 1]"),
    ("post", "/api/forward-pass/run", {"architecture": [2, 1], "inputs": [0.5, 0.5]}, "needs a hidden layer"),
    ("post", "/api/forward-pass/run", {"architecture": [2, 9, 1], "inputs": [0.5, 0.5]}, "layer size ≤ 8"),
    ("post", "/api/train/start", {"dataset": "spiral"}, "unknown dataset"),
    ("post", "/api/train/start", {"learning_rate": 5}, "learning rate ≤ 1"),
    ("post", "/api/train/start", {"epochs": 5}, "epochs ≥ 10"),
    ("post", "/api/train/start", {"hidden_size": 1}, "hidden size ≥ 2"),
    ("post", "/api/boundary/predict-point", {}, "missing x/y"),
    ("post", "/api/boundary/predict-point", {"x": 3, "y": 0}, "x in [-1, 1]"),
    ("get", "/api/train/datasets/spiral", None, "unknown dataset in path"),
    ("get", "/api/train/status/abc?since=-1", None, "since ≥ 0"),
]


@pytest.mark.parametrize("method, path, body, rule", INVALID, ids=[case[3] for case in INVALID])
def test_invalid_input_returns_422(client, method, path, body, rule):
    r = client.request(method.upper(), path, json=body)
    assert r.status_code == 422, f"{rule}: got {r.status_code} {r.text}"
    assert isinstance(r.json()["detail"], list)  # FastAPI's structured validation errors
