"""
Section 1 — What is a Neuron?

POST /api/neuron/compute runs one artificial neuron: z = Σ wᵢxᵢ + b, then
output = activation(z).

The Section 1 page computes this in the browser for instant slider feedback
(see lessons 4.1). This endpoint is the same math done by PyTorch, so it can
serve as a reference implementation and a cross-check in tests.
"""

import logging

import torch
from fastapi import APIRouter

from schemas.neuron import NeuronRequest, NeuronResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/neuron", tags=["Neuron"])

ACTIVATIONS = {
    "relu": torch.relu,
    "sigmoid": torch.sigmoid,
    "tanh": torch.tanh,
}


@router.post("/compute", response_model=NeuronResponse)
def compute_neuron(req: NeuronRequest) -> NeuronResponse:
    x = torch.tensor(req.inputs, dtype=torch.float64)
    w = torch.tensor(req.weights, dtype=torch.float64)
    contributions = x * w
    z = contributions.sum() + req.bias
    output = ACTIVATIONS[req.activation](z)

    logger.info("neuron/compute: z=%.4f %s → %.4f", z.item(), req.activation, output.item())
    return NeuronResponse(
        weighted_sum=z.item(),
        output=output.item(),
        activation_used=req.activation,
        contributions=contributions.tolist(),
    )
