import math

import pytest


def compute(client, **body):
    r = client.post("/api/neuron/compute", json=body)
    assert r.status_code == 200, r.text
    return r.json()


def test_section1_defaults_match_the_page(client):
    # Same numbers as the Section 1 sliders' defaults: z = 1.0 → sigmoid ≈ 0.731
    out = compute(client, inputs=[0.8, 0.6, 0.3], weights=[1.5, 0.8, -0.6], bias=-0.5, activation="sigmoid")
    assert out["weighted_sum"] == pytest.approx(1.0)
    assert out["output"] == pytest.approx(1 / (1 + math.exp(-1)))
    assert out["activation_used"] == "sigmoid"
    assert out["contributions"] == pytest.approx([1.2, 0.48, -0.18])


@pytest.mark.parametrize(
    "activation, z, expected",
    [
        ("relu", 2.0, 2.0),
        ("relu", -2.0, 0.0),  # negatives are clipped
        ("tanh", 0.5, math.tanh(0.5)),
        ("sigmoid", 0.0, 0.5),
    ],
)
def test_activations(client, activation, z, expected):
    out = compute(client, inputs=[1.0], weights=[z], bias=0.0, activation=activation)
    assert out["weighted_sum"] == pytest.approx(z)
    assert out["output"] == pytest.approx(expected)
