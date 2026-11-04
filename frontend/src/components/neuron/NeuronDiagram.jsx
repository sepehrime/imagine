import { motion, useReducedMotion } from "framer-motion";
import { fmt, WEIGHT_RANGE } from "../../utils/neuronMath";

/**
 * NeuronDiagram Component
 *
 * SVG picture of one neuron: 3 input circles → Σ node → activation → output.
 *
 * SWE Design Patterns applied:
 * 1. Presentational Component: receives every value via props and owns no
 *    state, so the parent page is the single source of truth.
 * 2. Visual Encoding of Data: edge thickness = |weight|, edge colour = sign
 *    (blue positive, rose negative), output glow = output strength.
 * 3. Key-Based Animation Replay: `pulseKey` changes on every edit; using it as
 *    a React `key` remounts the pulse dots, which replays the "flow" animation.
 * 4. Progressive Enhancement: pulses are skipped under `prefers-reduced-motion`.
 */

const W = 520;
const H = 300;
const INPUT_X = 125;
const SUM_X = 320;
const OUT_X = 455;
const MID_Y = H / 2;
const INPUT_YS = [60, 150, 240];
const NODE_R = 26;

const FLOW_DURATION = 0.55; // seconds for a pulse to travel one edge

// Gap between an edge and its label, plus half the label's font height (12px)
const LABEL_GAP = 4 + 6;

/**
 * Places a label alongside the line a → b: rotated to the line's angle and
 * pushed sideways (along the line's normal) far enough to clear its stroke.
 * `side` picks which side; outer edges label outward so labels don't crowd
 * the space between edges.
 */
function edgeLabelPlacement(a, b, strokeWidth, side) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  // Unit normal (perpendicular). In SVG, y grows downward, so (dy, -dx)
  // points "above" a left-to-right line.
  let nx = dy / len;
  let ny = -dx / len;
  if (side === "below") {
    nx = -nx;
    ny = -ny;
  }
  const offset = strokeWidth / 2 + LABEL_GAP;
  const t = 0.45; // slightly toward the input, away from the crowded Σ end
  return {
    x: a.x + dx * t + nx * offset,
    y: a.y + dy * t + ny * offset,
    angle: (Math.atan2(dy, dx) * 180) / Math.PI,
  };
}

export default function NeuronDiagram({
  inputs,
  weights,
  labels,
  weightedSum,
  output,
  activationLabel,
  glow,
  pulseKey,
}) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto select-none [--halo:#fff] dark:[--halo:#0f172a]"
      role="img"
      aria-label={`Neuron diagram. Weighted sum ${fmt(weightedSum)}, ${activationLabel} output ${fmt(output)}.`}
    >
      <defs>
        <radialGradient id="neuron-glow">
          <stop offset="0%" stopColor="#facc15" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Edges: input → Σ, thickness encodes |w| */}
      {INPUT_YS.map((y, i) => {
        const w = weights[i];
        const strength = Math.abs(w) / WEIGHT_RANGE.max; // 0 → 1
        const positive = w >= 0;
        const strokeWidth = 1 + strength * 7;
        const label = edgeLabelPlacement(
          { x: INPUT_X + NODE_R, y },
          { x: SUM_X - NODE_R, y: MID_Y },
          strokeWidth,
          y > MID_Y ? "below" : "above"
        );
        return (
          <g key={`edge-${i}`}>
            <line
              x1={INPUT_X + NODE_R}
              y1={y}
              x2={SUM_X - NODE_R}
              y2={MID_Y}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={w === 0 ? "4 6" : undefined}
              className={`transition-all duration-200 ${
                positive
                  ? "stroke-blue-500 dark:stroke-blue-400"
                  : "stroke-rose-500 dark:stroke-rose-400"
              }`}
              style={{ opacity: 0.25 + strength * 0.75 }}
            />
            {/* Weight label: rotated along the edge, offset to one side of it */}
            <text
              color="var(--halo)"
              x={label.x}
              y={label.y}
              transform={`rotate(${label.angle} ${label.x} ${label.y})`}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ transition: "all 200ms ease-out" }}
              stroke="currentColor"
              strokeWidth={4}
              paintOrder="stroke"
              className={`text-[12px] font-mono font-bold ${
                positive
                  ? "fill-blue-600 dark:fill-blue-300"
                  : "fill-rose-600 dark:fill-rose-300"
              }`}
            >
              w{"₁₂₃"[i]} = {fmt(w, 1)}
            </text>
          </g>
        );
      })}

      {/* Edge: Σ → output */}
      <line
        x1={SUM_X + NODE_R}
        y1={MID_Y}
        x2={OUT_X - NODE_R}
        y2={MID_Y}
        strokeWidth={3}
        className="stroke-slate-400 dark:stroke-slate-500"
      />
      <text
        x={(SUM_X + OUT_X) / 2}
        y={MID_Y - 12}
        textAnchor="middle"
        className="text-[11px] font-bold fill-violet-600 dark:fill-violet-300"
      >
        {activationLabel}
      </text>

      {/* Flow pulses — remounted on every change via pulseKey */}
      {!reduceMotion && (
        <g key={pulseKey}>
          {INPUT_YS.map((y, i) =>
            weights[i] === 0 || inputs[i] === 0 ? null : (
              <motion.circle
                key={`pulse-${i}`}
                r={5}
                className={weights[i] > 0 ? "fill-blue-400" : "fill-rose-400"}
                initial={{ cx: INPUT_X + NODE_R, cy: y, opacity: 0 }}
                animate={{ cx: SUM_X - NODE_R, cy: MID_Y, opacity: [0, 1, 1, 0] }}
                transition={{ duration: FLOW_DURATION, ease: "easeIn" }}
              />
            )
          )}
          <motion.circle
            r={6}
            className="fill-amber-400"
            initial={{ cx: SUM_X + NODE_R, cy: MID_Y, opacity: 0 }}
            animate={{ cx: OUT_X - NODE_R, cy: MID_Y, opacity: [0, 1, 1, 0] }}
            transition={{ duration: FLOW_DURATION, delay: FLOW_DURATION, ease: "easeOut" }}
          />
        </g>
      )}

      {/* Input nodes */}
      {INPUT_YS.map((y, i) => (
        <g key={`input-${i}`}>
          <circle
            cx={INPUT_X}
            cy={y}
            r={NODE_R}
            strokeWidth={2}
            className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-600"
          />
          <text
            x={INPUT_X}
            y={y - 4}
            textAnchor="middle"
            className="text-[11px] font-bold fill-slate-500 dark:fill-slate-400"
          >
            x{"₁₂₃"[i]}
          </text>
          <text
            x={INPUT_X}
            y={y + 12}
            textAnchor="middle"
            className="text-[12px] font-mono font-bold fill-slate-900 dark:fill-white"
          >
            {fmt(inputs[i])}
          </text>
          <text
            x={INPUT_X - NODE_R - 8}
            y={y + 4}
            textAnchor="end"
            className="text-[11px] fill-slate-500 dark:fill-slate-400"
          >
            {labels[i]}
          </text>
        </g>
      ))}

      {/* Σ (weighted sum) node */}
      <circle
        cx={SUM_X}
        cy={MID_Y}
        r={NODE_R + 4}
        strokeWidth={2}
        className="fill-blue-50 dark:fill-blue-950 stroke-blue-400 dark:stroke-blue-600"
      />
      <text
        x={SUM_X}
        y={MID_Y - 4}
        textAnchor="middle"
        className="text-[16px] font-bold fill-blue-700 dark:fill-blue-300"
      >
        Σ + b
      </text>
      <text
        x={SUM_X}
        y={MID_Y + 14}
        textAnchor="middle"
        className="text-[12px] font-mono font-bold fill-slate-900 dark:fill-white"
      >
        {fmt(weightedSum)}
      </text>

      {/* Output node with glow halo */}
      <circle
        cx={OUT_X}
        cy={MID_Y}
        r={NODE_R + 6 + glow * 18}
        fill="url(#neuron-glow)"
        style={{ opacity: glow, transition: "all 200ms ease-out" }}
      />
      <circle
        cx={OUT_X}
        cy={MID_Y}
        r={NODE_R + 4}
        strokeWidth={2}
        className="stroke-amber-400 dark:stroke-amber-500 fill-amber-50 dark:fill-slate-900"
      />
      <circle
        cx={OUT_X}
        cy={MID_Y}
        r={NODE_R + 4}
        className="fill-amber-400"
        style={{ opacity: glow * 0.85, transition: "opacity 200ms ease-out" }}
      />
      <text
        x={OUT_X}
        y={MID_Y - 4}
        textAnchor="middle"
        className="text-[11px] font-bold fill-slate-600 dark:fill-slate-300"
      >
        output
      </text>
      <text
        x={OUT_X}
        y={MID_Y + 13}
        textAnchor="middle"
        className="text-[13px] font-mono font-bold fill-slate-900 dark:fill-white"
      >
        {fmt(output)}
      </text>
    </svg>
  );
}
