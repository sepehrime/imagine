import { motion, useReducedMotion } from "framer-motion";

/**
 * NetworkBackground Component
 *
 * Faint, slowly pulsing neural network drawn as an SVG behind the Home hero.
 *
 * SWE Design Patterns applied:
 * 1. Static Geometry Precomputation: node/edge coordinates are computed once at
 *    module load (they never change), so re-renders do no layout math.
 * 2. Progressive Enhancement / Reduced Motion: honours the OS
 *    `prefers-reduced-motion` setting via `useReducedMotion()` and renders a
 *    still image instead of an animation.
 * 3. Decorative Content Isolation: `aria-hidden` + `pointer-events-none` keep the
 *    graphic out of the accessibility tree and away from clicks.
 */

// Neurons per layer: input → hidden → hidden → output
const LAYERS = [3, 6, 5, 2];
const WIDTH = 500;
const HEIGHT = 400;
const PAD_X = 60;
const PAD_Y = 50;

// How long one "wave" takes to sweep across the network (seconds)
const PULSE_DURATION = 4;
const LAYER_DELAY = 0.6;

const NODES = LAYERS.flatMap((count, layer) => {
  const x = PAD_X + (layer * (WIDTH - 2 * PAD_X)) / (LAYERS.length - 1);
  const gap = (HEIGHT - 2 * PAD_Y) / (count + 1);
  return Array.from({ length: count }, (_, i) => ({
    id: `${layer}-${i}`,
    layer,
    x,
    y: PAD_Y + gap * (i + 1),
  }));
});

const EDGES = NODES.flatMap((from) =>
  NODES.filter((to) => to.layer === from.layer + 1).map((to) => ({
    id: `${from.id}->${to.id}`,
    layer: from.layer,
    from,
    to,
  }))
);

export default function NetworkBackground({ className = "" }) {
  const reduceMotion = useReducedMotion();

  // Each layer pulses slightly after the previous one, so the glow appears to
  // travel left → right like a forward pass.
  const pulse = (layer, low, high) =>
    reduceMotion
      ? { initial: { opacity: (low + high) / 2 } }
      : {
          initial: { opacity: low },
          animate: { opacity: [low, high, low] },
          transition: {
            duration: PULSE_DURATION,
            delay: layer * LAYER_DELAY,
            repeat: Infinity,
            ease: "easeInOut",
          },
        };

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none ${className}`}
    >
      {EDGES.map((e) => (
        <motion.line
          key={e.id}
          x1={e.from.x}
          y1={e.from.y}
          x2={e.to.x}
          y2={e.to.y}
          stroke="white"
          strokeWidth={1}
          {...pulse(e.layer, 0.08, 0.3)}
        />
      ))}
      {NODES.map((n) => (
        <motion.circle
          key={n.id}
          cx={n.x}
          cy={n.y}
          r={9}
          fill="white"
          {...pulse(n.layer, 0.2, 0.75)}
        />
      ))}
    </svg>
  );
}
