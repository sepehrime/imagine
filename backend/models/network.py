"""
Configurable fully connected PyTorch network.

Used by:
  - Section 3 (Forward Pass): run one input through and trace every layer.
  - Section 4 (Train): trained on a 2D dataset (planned).

Design notes:
  - `forward()` returns raw scores ("logits"), which is what PyTorch's loss
    functions expect during training. Probabilities are only computed for
    display, in `output_activation()` / `forward_with_trace()`.
  - Weights come from a local `torch.Generator` seeded per request, so the same
    seed always gives the same weights without touching PyTorch's global RNG
    (which a training thread may be using at the same time).
"""

from __future__ import annotations

import torch
from torch import nn

HIDDEN_ACTIVATIONS: dict[str, type[nn.Module]] = {
    "relu": nn.ReLU,
    "sigmoid": nn.Sigmoid,
    "tanh": nn.Tanh,
}


class ConfigurableNetwork(nn.Module):
    """Fully connected network: Linear → activation → … → Linear (logits)."""

    def __init__(self, layer_sizes: list[int], activation: str = "relu", seed: int | None = None):
        super().__init__()
        if len(layer_sizes) < 2:
            raise ValueError("A network needs at least an input and an output layer.")
        if activation not in HIDDEN_ACTIVATIONS:
            raise ValueError(f"Unknown activation '{activation}'.")

        self.layer_sizes = list(layer_sizes)
        self.activation_name = activation
        self.hidden_activation = HIDDEN_ACTIVATIONS[activation]()
        self.linears = nn.ModuleList(
            nn.Linear(n_in, n_out) for n_in, n_out in zip(layer_sizes[:-1], layer_sizes[1:])
        )
        if seed is not None:
            self.reset_parameters(seed)

    def reset_parameters(self, seed: int) -> None:
        """Re-initialise all weights and biases deterministically from `seed`."""
        generator = torch.Generator().manual_seed(seed)
        for layer in self.linears:
            # Xavier keeps activations in a sensible range for any layer width
            nn.init.xavier_uniform_(layer.weight, generator=generator)
            nn.init.uniform_(layer.bias, -0.2, 0.2, generator=generator)

    @property
    def output_activation_name(self) -> str:
        # One output → independent yes/no score; several → probabilities that sum to 1
        return "sigmoid" if self.layer_sizes[-1] == 1 else "softmax"

    def output_activation(self, logits: torch.Tensor) -> torch.Tensor:
        if self.output_activation_name == "sigmoid":
            return torch.sigmoid(logits)
        return torch.softmax(logits, dim=-1)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        last = len(self.linears) - 1
        for i, layer in enumerate(self.linears):
            x = layer(x)
            if i < last:
                x = self.hidden_activation(x)
        return x  # logits

    @torch.inference_mode()
    def forward_with_trace(self, x: torch.Tensor) -> list[tuple[torch.Tensor, torch.Tensor]]:
        """
        Runs a forward pass and records, for every non-input layer, the
        weighted sums `z` (before activation) and the activations `a` (after).
        """
        trace = []
        a = x
        last = len(self.linears) - 1
        for i, layer in enumerate(self.linears):
            z = layer(a)
            a = self.hidden_activation(z) if i < last else self.output_activation(z)
            trace.append((z, a))
        return trace
