/**
 * neuronMath — pure functions for a single artificial neuron.
 *
 * SWE Design Patterns applied:
 * 1. Pure Business Logic: no React, no DOM, no side effects. Same inputs →
 *    same outputs, so Phase 7 can unit-test it with plain numbers.
 * 2. Strategy Pattern: each activation is an interchangeable strategy object
 *    ({ label, fn, yDomain }) looked up by key, so adding "Leaky ReLU" later
 *    means adding one entry — no `if/else` chains in the UI.
 * 3. Single Source of Truth: the diagram, the formula and the chart all read
 *    from the result of `computeNeuron`, so they can never disagree.
 */

// Slider bounds from plan.md (Section 1)
export const WEIGHT_RANGE = { min: -2, max: 2, step: 0.1 };
export const BIAS_RANGE = { min: -2, max: 2, step: 0.1 };
export const INPUT_RANGE = { min: 0, max: 1, step: 0.05 };

// Largest possible |z| = 3 inputs × max|x| × max|w| + max|b| = 3·1·2 + 2 = 8.
// The activation chart uses this as its x-domain so the dot is always visible.
export const Z_LIMIT =
  3 * INPUT_RANGE.max * WEIGHT_RANGE.max + BIAS_RANGE.max;

export const ACTIVATIONS = {
  relu: {
    label: "ReLU",
    fn: (z) => Math.max(0, z),
    yDomain: [0, Z_LIMIT],
    blurb: "Passes positive values through unchanged and blocks negatives (outputs 0).",
  },
  sigmoid: {
    label: "Sigmoid",
    fn: (z) => 1 / (1 + Math.exp(-z)),
    yDomain: [0, 1],
    blurb: "Squashes any number into the range 0 → 1, like a probability.",
  },
  tanh: {
    label: "Tanh",
    fn: (z) => Math.tanh(z),
    yDomain: [-1, 1],
    blurb: "Squashes any number into −1 → 1, centred on zero.",
  },
};

/**
 * Runs one neuron: z = Σ wᵢxᵢ + b, output = activation(z).
 * Also returns each input's individual contribution (wᵢxᵢ), which the
 * diagram uses to show which edge "pushes" the hardest.
 */
export function computeNeuron({ inputs, weights, bias, activation }) {
  const contributions = inputs.map((x, i) => x * weights[i]);
  const weightedSum = contributions.reduce((sum, c) => sum + c, 0) + bias;
  const output = ACTIVATIONS[activation].fn(weightedSum);
  return { contributions, weightedSum, output };
}

/**
 * Maps a neuron's output to a glow intensity between 0 (dark) and 1 (bright)
 * for the output node in the diagram.
 *
 * The tricky part: each activation has a different output range.
 *   - ReLU:    0 → 8 (unbounded in general, capped at Z_LIMIT here)
 *   - Sigmoid: 0 → 1
 *   - Tanh:   −1 → 1
 *
 * @param {number} output     The activated output value.
 * @param {string} activation One of the keys of ACTIVATIONS.
 * @returns {number} Glow intensity clamped to [0, 1].
 */
export function outputToGlow(output, activation) {
  // Min-max scaling over the activation's output range: the lowest possible
  // output is dark (0), the highest is fully lit (1). Keeps "brighter = higher"
  // consistent across all three activations.
  const [min, max] = ACTIVATIONS[activation].yDomain;
  const t = (output - min) / (max - min);
  return Math.min(1, Math.max(0, t));
}

/** Formats a number with a fixed number of decimals and an explicit sign. */
export function fmt(n, digits = 2) {
  const s = n.toFixed(digits);
  // Avoid showing "-0.00"
  return Number(s) === 0 ? (0).toFixed(digits) : s;
}
