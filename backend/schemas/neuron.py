"""Request/response models for POST /api/neuron/compute."""

from typing import Annotated, Literal

from pydantic import BaseModel, Field, model_validator

Value = Annotated[float, Field(ge=-10.0, le=10.0)]


class NeuronRequest(BaseModel):
    inputs: list[Value] = Field(..., min_length=1, max_length=8, examples=[[0.8, 0.6, 0.3]])
    weights: list[Value] = Field(..., min_length=1, max_length=8, examples=[[1.5, 0.8, -0.6]])
    bias: Value = Field(0.0, examples=[-0.5])
    activation: Literal["relu", "sigmoid", "tanh"] = "sigmoid"

    @model_validator(mode="after")
    def one_weight_per_input(self):
        if len(self.weights) != len(self.inputs):
            raise ValueError(
                f"Need one weight per input: got {len(self.inputs)} inputs and {len(self.weights)} weights."
            )
        return self


class NeuronResponse(BaseModel):
    weighted_sum: float = Field(..., description="z = Σ wᵢxᵢ + b")
    output: float = Field(..., description="activation(z)")
    activation_used: Literal["relu", "sigmoid", "tanh"]
    contributions: list[float] = Field(..., description="Each input's share of the sum, wᵢxᵢ.")
