"""
Request/response models for POST /api/forward-pass/run.

Pydantic validates every request before the route runs: wrong types, values
out of range, or an `inputs` list that doesn't match the input layer all
return a 422 with a clear message, and the route never sees bad data.
"""

from typing import Annotated, Literal

from pydantic import BaseModel, Field, model_validator

LayerSize = Annotated[int, Field(ge=1, le=8)]
InputValue = Annotated[float, Field(ge=0.0, le=1.0)]


class ForwardPassRequest(BaseModel):
    architecture: list[LayerSize] = Field(
        ...,
        min_length=3,
        max_length=6,
        description="Layer sizes from input to output, e.g. [2, 4, 4, 1].",
        examples=[[2, 4, 4, 1]],
    )
    inputs: list[InputValue] = Field(
        ..., description="One value per input node, each between 0 and 1.", examples=[[0.5, 0.8]]
    )
    activation: Literal["relu", "sigmoid", "tanh"] = Field(
        "relu", description="Activation used by the hidden layers."
    )
    seed: int = Field(
        42, ge=0, le=2**31 - 1, description="Same seed → same random weights."
    )

    @model_validator(mode="after")
    def inputs_match_input_layer(self):
        if len(self.inputs) != self.architecture[0]:
            raise ValueError(
                f"Expected {self.architecture[0]} inputs for the input layer, got {len(self.inputs)}."
            )
        return self


class LayerTrace(BaseModel):
    index: int
    name: str
    activation_fn: str | None = Field(None, description="None for the input layer.")
    pre_activation: list[float] | None = Field(
        None, description="Weighted sums z = W·a + b. None for the input layer."
    )
    activation: list[float] = Field(..., description="Node values after the activation.")


class ForwardPassResponse(BaseModel):
    architecture: list[int]
    seed: int
    layers: list[LayerTrace]
    weights: list[list[list[float]]] = Field(
        ...,
        description="weights[k][j][i] connects node i of layer k to node j of layer k+1.",
    )
    biases: list[list[float]] = Field(..., description="biases[k][j] belongs to node j of layer k+1.")
    output: list[float]
    prediction: int = Field(..., description="Index of the output node with the highest value.")
