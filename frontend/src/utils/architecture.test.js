import { describe, expect, it } from "vitest";
import {
  DEFAULT_ARCHITECTURE,
  computeStats,
  layoutNetwork,
  sameArchitecture,
  sanitizeArchitecture,
  toLayerSizes,
} from "./architecture";

describe("toLayerSizes", () => {
  it("expands the config into layer sizes", () => {
    expect(toLayerSizes(DEFAULT_ARCHITECTURE)).toEqual([2, 4, 4, 1]);
    expect(toLayerSizes({ inputs: 4, hiddenLayers: 4, hiddenSize: 8, outputs: 3 })).toEqual([4, 8, 8, 8, 8, 3]);
  });
});

describe("computeStats", () => {
  it("counts the largest network correctly (same numbers PyTorch reports)", () => {
    const s = computeStats([4, 8, 8, 8, 8, 3]);
    expect(s.weights).toBe(4 * 8 + 8 * 8 * 3 + 8 * 3); // 248
    expect(s.neurons).toBe(35); // input nodes aren't neurons
    expect(s.biases).toBe(35);
    expect(s.parameters).toBe(283);
    expect(s.layers).toBe(6);
    expect(s.hiddenLayers).toBe(4);
  });
});

describe("layoutNetwork", () => {
  const { nodes, edges } = layoutNetwork([2, 3, 1], { width: 700, height: 300 });

  it("creates every node and a fully connected set of edges", () => {
    expect(nodes).toHaveLength(6);
    expect(edges).toHaveLength(2 * 3 + 3 * 1);
  });

  it("uses role-based ids so outputs keep their identity when layers are added", () => {
    expect(nodes.map((n) => n.id)).toEqual(["in-0", "in-1", "h1-0", "h1-1", "h1-2", "out-0"]);
    const deeper = layoutNetwork([2, 3, 3, 1], { width: 700, height: 300 });
    expect(deeper.nodes.at(-1).id).toBe("out-0");
  });

  it("centres each layer vertically", () => {
    expect(nodes.find((n) => n.id === "out-0").y).toBe(150);
  });
});

describe("sameArchitecture / sanitizeArchitecture", () => {
  it("compares every field", () => {
    expect(sameArchitecture(DEFAULT_ARCHITECTURE, { ...DEFAULT_ARCHITECTURE })).toBe(true);
    expect(sameArchitecture(DEFAULT_ARCHITECTURE, { ...DEFAULT_ARCHITECTURE, activation: "tanh" })).toBe(false);
    expect(sameArchitecture(DEFAULT_ARCHITECTURE, null)).toBe(false);
  });

  it("rejects anything out of range or malformed from storage", () => {
    expect(sanitizeArchitecture(DEFAULT_ARCHITECTURE)).toEqual(DEFAULT_ARCHITECTURE);
    expect(sanitizeArchitecture({ ...DEFAULT_ARCHITECTURE, hiddenSize: 99 })).toBeNull();
    expect(sanitizeArchitecture({ ...DEFAULT_ARCHITECTURE, inputs: 1.5 })).toBeNull();
    expect(sanitizeArchitecture({ ...DEFAULT_ARCHITECTURE, activation: "swish" })).toBeNull();
    expect(sanitizeArchitecture("nonsense")).toBeNull();
    expect(sanitizeArchitecture(null)).toBeNull();
  });
});
