import { describe, expect, it } from "vitest";
import { ACTIVATIONS, Z_LIMIT, computeNeuron, fmt, outputToGlow } from "./neuronMath";

describe("computeNeuron", () => {
  it("matches the Section 1 defaults (z = 1.0, sigmoid ≈ 0.731)", () => {
    const r = computeNeuron({ inputs: [0.8, 0.6, 0.3], weights: [1.5, 0.8, -0.6], bias: -0.5, activation: "sigmoid" });
    expect(r.weightedSum).toBeCloseTo(1.0);
    expect(r.output).toBeCloseTo(1 / (1 + Math.exp(-1)));
    expect(r.contributions).toEqual([expect.closeTo(1.2), expect.closeTo(0.48), expect.closeTo(-0.18)]);
  });

  it("applies each activation", () => {
    const run = (activation, w) => computeNeuron({ inputs: [1], weights: [w], bias: 0, activation }).output;
    expect(run("relu", -2)).toBe(0);
    expect(run("relu", 2)).toBe(2);
    expect(run("tanh", 0.5)).toBeCloseTo(Math.tanh(0.5));
    expect(run("sigmoid", 0)).toBe(0.5);
  });
});

describe("outputToGlow", () => {
  it.each([
    ["sigmoid", 0, 0],
    ["sigmoid", 0.5, 0.5],
    ["sigmoid", 1, 1],
    ["tanh", -1, 0],
    ["tanh", 0, 0.5],
    ["relu", Z_LIMIT / 2, 0.5],
  ])("%s output %d → glow %d", (activation, output, glow) => {
    expect(outputToGlow(output, activation)).toBeCloseTo(glow);
  });

  it("always stays within [0, 1]", () => {
    expect(outputToGlow(99, "relu")).toBe(1);
    expect(outputToGlow(-5, "tanh")).toBe(0);
  });
});

describe("ACTIVATIONS / fmt", () => {
  it("chart domain covers every reachable weighted sum", () => {
    expect(Z_LIMIT).toBe(8); // 3 inputs × 1 × 2 + bias 2
    expect(ACTIVATIONS.relu.yDomain).toEqual([0, 8]);
  });

  it("never shows negative zero", () => {
    expect(fmt(-0.0001)).toBe("0.00");
    expect(fmt(-1.234, 1)).toBe("-1.2");
  });
});
