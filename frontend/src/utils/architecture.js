/**
 * architecture — pure functions describing a fully connected network.
 *
 * SWE Design Patterns applied:
 * 1. Pure Business Logic: layer sizes, stats and diagram layout are plain
 *    functions of a config object, so they can be unit-tested without React.
 * 2. Single Config Shape: every part of the app (sliders, diagram, storage,
 *    Section 3) speaks the same `{ inputs, hiddenLayers, hiddenSize, outputs,
 *    activation }` object, converted to layer sizes in exactly one place.
 * 3. Stable Identity: node ids are based on their *role* (in-0, h2-3, out-1),
 *    not their layer index, so adding a hidden layer slides the output nodes
 *    to their new spot instead of destroying and re-creating them.
 */

import { ACTIVATIONS } from "./neuronMath";

// Slider bounds from plan.md (Section 2)
export const ARCH_LIMITS = {
  inputs: { min: 1, max: 4 },
  hiddenLayers: { min: 1, max: 4 },
  hiddenSize: { min: 1, max: 8 },
  outputs: { min: 1, max: 3 },
};

export const DEFAULT_ARCHITECTURE = {
  inputs: 2,
  hiddenLayers: 2,
  hiddenSize: 4,
  outputs: 1,
  activation: "relu",
};

/** Config → layer sizes, e.g. { inputs: 2, hiddenLayers: 2, hiddenSize: 4, outputs: 1 } → [2, 4, 4, 1] */
export function toLayerSizes({ inputs, hiddenLayers, hiddenSize, outputs }) {
  return [inputs, ...Array(hiddenLayers).fill(hiddenSize), outputs];
}

/**
 * Counts for the stats panel.
 * Input nodes only hold data — they don't compute anything — so they are
 * not counted as neurons and have no bias.
 */
export function computeStats(layers) {
  let weights = 0;
  for (let i = 0; i < layers.length - 1; i++) weights += layers[i] * layers[i + 1];
  const neurons = layers.slice(1).reduce((a, b) => a + b, 0);
  return {
    layers: layers.length,
    hiddenLayers: layers.length - 2,
    inputNodes: layers[0],
    neurons,
    weights,
    biases: neurons, // one bias per computing neuron
    parameters: weights + neurons,
  };
}

/** Human-readable layer name and a short role key used for colours/ids. */
export function describeLayer(index, layerCount) {
  if (index === 0) return { role: "in", name: "Input layer" };
  if (index === layerCount - 1) return { role: "out", name: "Output layer" };
  return { role: `h${index}`, name: `Hidden layer ${index}` };
}

/**
 * Computes x/y positions for every node and edge of the diagram.
 * Layers are spread evenly left → right; nodes in a layer are centred
 * vertically with a capped gap, so small layers don't spread out too far.
 */
export function layoutNetwork(layers, { width, height, padX = 70, padY = 40, maxGap = 46 }) {
  const layerCount = layers.length;
  const usableH = height - 2 * padY;

  const nodes = layers.flatMap((count, layer) => {
    const { role, name } = describeLayer(layer, layerCount);
    const x = padX + (layer * (width - 2 * padX)) / (layerCount - 1);
    const gap = count > 1 ? Math.min(maxGap, usableH / (count - 1)) : 0;
    return Array.from({ length: count }, (_, i) => ({
      id: `${role}-${i}`,
      layer,
      index: i,
      role,
      layerName: name,
      x,
      y: height / 2 + (i - (count - 1) / 2) * gap,
    }));
  });

  // Fully connected: every node links to every node in the next layer
  const edges = [];
  for (const from of nodes) {
    for (const to of nodes) {
      if (to.layer === from.layer + 1) edges.push({ id: `${from.id}->${to.id}`, from, to });
    }
  }

  return { nodes, edges };
}

/** True when two configs describe the same architecture. */
export function sameArchitecture(a, b) {
  if (!a || !b) return false;
  return (
    a.inputs === b.inputs &&
    a.hiddenLayers === b.hiddenLayers &&
    a.hiddenSize === b.hiddenSize &&
    a.outputs === b.outputs &&
    a.activation === b.activation
  );
}

/**
 * Validates an architecture read from storage (never trust persisted data —
 * see lessons 3.16). Returns a clean config, or null if it's unusable.
 */
export function sanitizeArchitecture(value) {
  if (!value || typeof value !== "object") return null;
  const clean = {};
  for (const [key, { min, max }] of Object.entries(ARCH_LIMITS)) {
    const n = value[key];
    if (!Number.isInteger(n) || n < min || n > max) return null;
    clean[key] = n;
  }
  if (!(value.activation in ACTIVATIONS)) return null;
  clean.activation = value.activation;
  return clean;
}
