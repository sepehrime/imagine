import { useMemo } from "react";
import { scaleLinear, line } from "d3";
import { ACTIVATIONS, Z_LIMIT, fmt } from "../../utils/neuronMath";

/**
 * ActivationChart Component
 *
 * Small inline plot of the selected activation curve, with a dot marking
 * where the neuron's current weighted sum (z) lands on it.
 *
 * SWE Design Patterns applied:
 * 1. "D3 for math, React for DOM": d3 only computes scales and the SVG path
 *    string; React renders the elements. No d3.select(), so no fighting React
 *    over who owns the DOM.
 * 2. Memoised Derived Data: the curve path only depends on the activation, so
 *    it's wrapped in useMemo and not recomputed while sliders move.
 * 3. Strategy Lookup: reads fn + yDomain from the ACTIVATIONS strategy table.
 */

const W = 400;
const H = 230;
const PAD = { top: 14, right: 14, bottom: 26, left: 34 };
const SAMPLES = 161;

const x = scaleLinear()
  .domain([-Z_LIMIT, Z_LIMIT])
  .range([PAD.left, W - PAD.right]);

export default function ActivationChart({ activation, weightedSum, output }) {
  const { fn, yDomain, label } = ACTIVATIONS[activation];

  const { y, path } = useMemo(() => {
    const yScale = scaleLinear()
      .domain(yDomain)
      .range([H - PAD.bottom, PAD.top]);
    const points = Array.from({ length: SAMPLES }, (_, i) => {
      const z = -Z_LIMIT + (2 * Z_LIMIT * i) / (SAMPLES - 1);
      return [z, fn(z)];
    });
    const d = line()
      .x(([z]) => x(z))
      .y(([, v]) => yScale(v))(points);
    return { y: yScale, path: d };
  }, [fn, yDomain]);

  const yTicks = y.ticks(4);
  const xTicks = [-Z_LIMIT, -Z_LIMIT / 2, 0, Z_LIMIT / 2, Z_LIMIT];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`${label} curve. At z = ${fmt(weightedSum)} the output is ${fmt(output)}.`}
    >
      {/* Grid + axes */}
      {yTicks.map((t) => (
        <g key={`y-${t}`}>
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={y(t)}
            y2={y(t)}
            className={t === 0 ? "stroke-slate-400 dark:stroke-slate-500" : "stroke-slate-200 dark:stroke-slate-800"}
          />
          <text
            x={PAD.left - 6}
            y={y(t) + 3}
            textAnchor="end"
            className="text-[9px] fill-slate-500 dark:fill-slate-400 font-mono"
          >
            {t}
          </text>
        </g>
      ))}
      {xTicks.map((t) => (
        <g key={`x-${t}`}>
          <line
            x1={x(t)}
            x2={x(t)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            className={t === 0 ? "stroke-slate-400 dark:stroke-slate-500" : "stroke-slate-200 dark:stroke-slate-800"}
          />
          <text
            x={x(t)}
            y={H - PAD.bottom + 12}
            textAnchor="middle"
            className="text-[9px] fill-slate-500 dark:fill-slate-400 font-mono"
          >
            {t}
          </text>
        </g>
      ))}
      <text
        x={W - PAD.right}
        y={H - 3}
        textAnchor="end"
        className="text-[9px] italic fill-slate-500 dark:fill-slate-400"
      >
        z (weighted sum)
      </text>

      {/* Curve */}
      <path
        d={path}
        fill="none"
        strokeWidth={2.5}
        className="stroke-violet-500 dark:stroke-violet-400"
      />

      {/* Guide lines from axes to the current point */}
      <line
        x1={x(weightedSum)}
        x2={x(weightedSum)}
        y1={H - PAD.bottom}
        y2={y(output)}
        strokeDasharray="3 3"
        className="stroke-amber-500"
      />
      <line
        x1={PAD.left}
        x2={x(weightedSum)}
        y1={y(output)}
        y2={y(output)}
        strokeDasharray="3 3"
        className="stroke-amber-500"
      />

      {/* Current point */}
      <circle
        cx={x(weightedSum)}
        cy={y(output)}
        r={5.5}
        strokeWidth={2}
        className="fill-amber-400 stroke-white dark:stroke-slate-900"
        style={{ transition: "cx 150ms ease-out, cy 150ms ease-out" }}
      />
    </svg>
  );
}
