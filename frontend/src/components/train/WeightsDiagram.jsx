import { useMemo } from "react";
import { layoutNetwork, describeLayer } from "../../utils/architecture";

/**
 * WeightsDiagram Component
 *
 * The network being trained, with edges redrawn from the latest weights on
 * every poll, so you can watch connections strengthen, weaken or flip sign.
 *
 * SWE Design Patterns applied:
 * 1. Layout Reuse: positions come from the same `layoutNetwork` as Sections 2–3.
 * 2. Relative Rescaling: thickness = |w| / max|w| *at this moment*. Weights
 *    grow a lot during training; absolute thickness would start as hairlines
 *    and end as solid bars.
 * 3. CSS Transitions for Cheap Animation: `stroke-width` is a CSS property, so
 *    a 200 ms transition smooths the jump between polls with no JS animation.
 */

const W = 520;
const H = 300;

export default function WeightsDiagram({ architecture, weights, classNames }) {
  const { nodes, edges } = useMemo(
    () => layoutNetwork(architecture, { width: W, height: H, padX: 60, padY: 22, maxGap: 34 }),
    [architecture]
  );

  // Node radius shrinks for tall layers (up to 16 hidden neurons)
  const tallest = Math.max(...architecture);
  const gap = tallest > 1 ? Math.min(34, (H - 44) / (tallest - 1)) : 34;
  const r = Math.max(5, Math.min(12, gap / 2 - 2));

  const maxAbs = weights ? Math.max(1e-6, ...weights.flat(2).map(Math.abs)) : 1;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label={`Network ${architecture.join(", ")} with its current weights.`}>
        {edges.map((e) => {
          const w = weights ? weights[e.from.layer][e.to.index][e.from.index] : 0;
          const strength = Math.abs(w) / maxAbs;
          return (
            <line
              key={e.id}
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              className={w >= 0 ? "stroke-blue-500 dark:stroke-blue-400" : "stroke-rose-500 dark:stroke-rose-400"}
              style={{
                strokeWidth: 0.5 + strength * 4,
                opacity: 0.2 + strength * 0.75,
                transition: "stroke-width 200ms linear, opacity 200ms linear",
              }}
            />
          );
        })}
        {nodes.map((n) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={r}
            strokeWidth={2}
            className={`stroke-white dark:stroke-slate-900 ${
              n.role === "in" ? "fill-sky-500" : n.role === "out" ? "fill-amber-500" : "fill-violet-500"
            }`}
          />
        ))}
        {/* Output labels: which class each output node votes for */}
        {nodes
          .filter((n) => n.role === "out")
          .map((n) => (
            <text key={`lbl-${n.id}`} x={n.x + r + 6} y={n.y + 4} className="text-[11px] fill-slate-500 dark:fill-slate-400">
              {classNames?.[n.index]}
            </text>
          ))}
        {nodes
          .filter((n) => n.role === "in")
          .map((n) => (
            <text key={`lbl-${n.id}`} x={n.x - r - 6} y={n.y + 4} textAnchor="end" className="text-[11px] font-mono fill-slate-500 dark:fill-slate-400">
              {n.index === 0 ? "x" : "y"}
            </text>
          ))}
      </svg>
      <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 px-[8%]">
        {architecture.map((count, layer) => (
          <span key={layer}>
            {describeLayer(layer, architecture.length).name.replace(" layer", "")} ({count})
          </span>
        ))}
      </div>
    </div>
  );
}
