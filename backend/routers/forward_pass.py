"""
Section 3 — Forward Pass.

POST /api/forward-pass/run builds a network with seeded random weights, runs
the given inputs through it, and returns every layer's values so the frontend
can animate the pass layer by layer.
"""

import logging

import torch
from fastapi import APIRouter

from models.network import ConfigurableNetwork
from schemas.forward_pass import ForwardPassRequest, ForwardPassResponse, LayerTrace

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/forward-pass", tags=["Forward Pass"])


def _layer_name(index: int, count: int) -> str:
    """Human-readable label for layer `index` of a `count`-layer network."""
    if index == 0:
        return "Input layer"
    if index == count - 1:
        return "Output layer"
    return f"Hidden layer {index}"


# Plain `def` (not `async def`): FastAPI runs it in a worker thread, so the
# PyTorch work never blocks the event loop (see lessons 2.4).
@router.post("/run", response_model=ForwardPassResponse)
def run_forward_pass(req: ForwardPassRequest) -> ForwardPassResponse:
    """
    Builds a network for `architecture` (weights seeded by `seed`), runs `inputs`
    through it and returns every layer's values, plus all weights and biases.

    The same seed always gives the same weights, so the frontend can replay a pass.
    """
    logger.info("forward-pass: architecture=%s activation=%s seed=%s", req.architecture, req.activation, req.seed)

    model = ConfigurableNetwork(req.architecture, req.activation, seed=req.seed)
    x = torch.tensor(req.inputs, dtype=torch.float32)
    trace = model.forward_with_trace(x)

    # Layer 0 is the input itself; it has no weights and no activation function
    count = len(req.architecture)
    layers = [
        LayerTrace(index=0, name=_layer_name(0, count), activation=req.inputs),
    ]
    # `trace` has one (z, a) pair per non-input layer: z = weighted sums, a = after activation
    last = len(trace) - 1
    for i, (z, a) in enumerate(trace):
        layers.append(
            LayerTrace(
                index=i + 1,
                name=_layer_name(i + 1, count),
                activation_fn=model.output_activation_name if i == last else req.activation,
                pre_activation=z.tolist(),
                activation=a.tolist(),
            )
        )

    # The prediction is the index of the strongest output node
    output = layers[-1].activation
    return ForwardPassResponse(
        architecture=req.architecture,
        seed=req.seed,
        layers=layers,
        weights=[layer.weight.detach().tolist() for layer in model.linears],
        biases=[layer.bias.detach().tolist() for layer in model.linears],
        output=output,
        prediction=max(range(len(output)), key=output.__getitem__),
    )
