import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { layoutNetwork, describeLayer } from "../../utils/architecture";

/**
 * ForwardPassDiagram Component
 *
 * Network diagram that "lights up" layer by layer as a forward pass plays.
 *
 * SWE Design Patterns applied:
 * 1. Layout Reuse: node/edge positions come from the same pure
 *    `layoutNetwork` used in Section 2, so both diagrams line up exactly.
 * 2. Controlled Animation State: the parent owns `revealed` (how many layers
 *    are visible) — this component just draws that frame. Auto-play and
 *    step-through mode are the same picture driven by different controllers.
 * 3. Visual Encoding: node brightness = |activation|, colour = sign; edge
 *    thickness = |weight| (relative to the largest), colour = sign — the same
 *    language as Section 1.
 * 4. Key-Based Replay: each layer's pulses are keyed by `runId` + layer, so a
 *    new run or a replay restarts them (see lessons 4.4).
 * 5. HTML Overlay for Tooltips: the floating label is a normal <div> placed over
 *    the SVG using percentage coordinates (x / W, y / H), so it scales with the
 *    responsive viewBox and can wrap text — which SVG <text> can't.
 * 6. Keyboard Parity: every computed node is focusable (Tab), shows the same
 *    tooltip on focus as on hover, and clickable nodes respond to Enter/Space.
 */

const W = 720;
const H = 380;
const NODE_R = 17;

export default function ForwardPassDiagram({
  layers,
  result,
  revealed,
  runId,
  pulseDuration,
  selectedNode,
  onSelectNode,
}) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(null); // node under the pointer / keyboard focus
  const { nodes, edges } = useMemo(() => layoutNetwork(layers, { width: W, height: H }), [layers]);

  // Largest |weight| in this network, used to scale edge thickness
  const maxAbsWeight = useMemo(() => {
    if (!result) return 1;
    return Math.max(1e-6, ...result.weights.flat(2).map(Math.abs));
  }, [result]);

  const weightOf = (e) => result?.weights[e.from.layer][e.to.index][e.from.index] ?? 0;
  const valueOf = (n) => result?.layers[n.layer].activation[n.index];
  const isDone = result && revealed >= layers.length - 1;

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto select-none"
          role="group"
          aria-label={
            result
              ? `Forward pass, ${revealed + 1} of ${layers.length} layers computed.`
              : `Network with layer sizes ${layers.join(", ")}, not run yet.`
          }
        >
          {/* Edges */}
          {edges.map((e) => {
            const w = weightOf(e);
            const strength = Math.abs(w) / maxAbsWeight;
            const isCurrent = result && e.to.layer === revealed;
            const isPast = result && e.to.layer < revealed;
            return (
              <line
                key={e.id}
                x1={e.from.x}
                y1={e.from.y}
                x2={e.to.x}
                y2={e.to.y}
                strokeWidth={result ? 0.75 + strength * 3.5 : 1}
                className={`transition-all duration-300 ${
                  !result
                    ? "stroke-slate-300 dark:stroke-slate-700"
                    : w >= 0
                      ? "stroke-blue-500 dark:stroke-blue-400"
                      : "stroke-rose-500 dark:stroke-rose-400"
                }`}
                style={{ opacity: !result ? 0.6 : isCurrent ? 0.9 : isPast ? 0.35 : 0.12 }}
              />
            );
          })}

          {/* Pulses travelling into the layer that was just revealed */}
          {result && !reduceMotion && revealed >= 1 && (
            <g key={`${runId}-${revealed}`}>
              {edges
                .filter((e) => e.to.layer === revealed)
                .map((e) => (
                  <motion.circle
                    key={e.id}
                    r={3.5}
                    className={weightOf(e) >= 0 ? "fill-blue-400" : "fill-rose-400"}
                    initial={{ cx: e.from.x, cy: e.from.y, opacity: 0 }}
                    animate={{ cx: e.to.x, cy: e.to.y, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: pulseDuration, ease: "easeInOut" }}
                  />
                ))}
            </g>
          )}

          {/* Nodes */}
          {nodes.map((n) => {
            const shown = result && n.layer <= revealed;
            const value = shown ? valueOf(n) : null;
            const intensity = shown ? Math.min(1, Math.abs(value)) : 0;
            const negative = shown && value < 0;
            const isSelected = selectedNode && selectedNode.layer === n.layer && selectedNode.index === n.index;
            const isPrediction = isDone && n.role === "out" && n.index === result.prediction && layers.at(-1) > 1;
            const clickable = shown && n.layer > 0;
            return (
              <g
                key={n.id}
                onClick={clickable ? () => onSelectNode({ layer: n.layer, index: n.index }) : undefined}
                onKeyDown={
                  clickable
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          onSelectNode({ layer: n.layer, index: n.index });
                        }
                      }
                    : undefined
                }
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(n)}
                onBlur={() => setHovered(null)}
                tabIndex={shown ? 0 : undefined}
                role={shown ? (clickable ? "button" : "img") : undefined}
                aria-label={shown ? nodeLabel(n, value, clickable) : undefined}
                aria-pressed={clickable ? Boolean(isSelected) : undefined}
                className={`outline-none [&:focus-visible>circle:first-of-type]:stroke-cyan-500 ${clickable ? "cursor-pointer" : ""}`}
              >
                {(isSelected || isPrediction) && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={NODE_R + 5}
                    fill="none"
                    strokeWidth={2.5}
                    strokeDasharray={isSelected ? "4 3" : undefined}
                    className={isPrediction ? "stroke-amber-500" : "stroke-slate-900 dark:stroke-white"}
                  />
                )}
                {/* Base disc, then a coloured disc whose opacity = activation strength */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={NODE_R}
                  strokeWidth={2}
                  className="fill-white dark:fill-slate-900 stroke-slate-300 dark:stroke-slate-600"
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={NODE_R}
                  className={`transition-opacity duration-300 ${negative ? "fill-rose-500" : "fill-cyan-500"}`}
                  style={{ opacity: shown ? 0.12 + intensity * 0.88 : 0 }}
                />
                <text
                  x={n.x}
                  y={n.y + 3.5}
                  textAnchor="middle"
                  className={`text-[10px] font-mono font-bold pointer-events-none ${
                    shown && intensity > 0.55 ? "fill-white" : "fill-slate-600 dark:fill-slate-300"
                  }`}
                >
                  {shown ? value.toFixed(2) : result ? "?" : ""}
                </text>
              </g>
            );
          })}
        </svg>

        {hovered && (
          <NodeTooltip node={hovered} result={result} revealed={revealed} />
        )}
      </div>

      {/* Layer labels */}
      <div className="relative h-8 -mt-1">
        {layers.map((count, layer) => {
          const { role, name } = describeLayer(layer, layers.length);
          const x = nodes.find((n) => n.layer === layer)?.x ?? 0;
          const active = result && layer === revealed;
          return (
            <div
              key={role}
              className={`absolute -translate-x-1/2 text-[10px] sm:text-[11px] font-bold whitespace-nowrap transition-colors ${
                active ? "text-cyan-600 dark:text-cyan-400" : "text-slate-500 dark:text-slate-400"
              }`}
              style={{ left: `${(x / W) * 100}%` }}
            >
              {name.replace(" layer", "")}
              {active && " ●"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Screen-reader name for a node, e.g. "Hidden layer 1, neuron 2: 0.43. Press Enter to see the maths."
function nodeLabel(n, value, clickable) {
  const name = n.layer === 0 ? `Input ${n.index + 1}` : `${n.layerName}, neuron ${n.index + 1}`;
  return `${name}: ${value.toFixed(3)}.${clickable ? " Press Enter to see the maths." : ""}`;
}

/**
 * Floating label over a node: which neuron it is, its weighted sum z and
 * its activation a. Positioned in % so it tracks the responsive SVG.
 */
function NodeTooltip({ node, result, revealed }) {
  const computed = result && node.layer <= revealed;
  const trace = result?.layers[node.layer];
  const z = trace?.pre_activation?.[node.index];
  const a = trace?.activation[node.index];
  const title = node.layer === 0 ? `Input ${node.index + 1}` : `${node.layerName} · neuron ${node.index + 1}`;
  // Flip below the node when it's near the top edge so the label isn't clipped
  const below = node.y / H < 0.25;

  return (
    <div
      role="tooltip"
      className={`absolute z-10 -translate-x-1/2 pointer-events-none px-3 py-2 rounded-xl text-xs shadow-xl bg-slate-900/95 text-white dark:bg-slate-800 dark:text-slate-100 whitespace-nowrap ${
        below ? "mt-6" : "-translate-y-full -mt-6"
      }`}
      style={{ left: `${(node.x / W) * 100}%`, top: `${(node.y / H) * 100}%` }}
    >
      <p className="font-bold">{title}</p>
      {!computed ? (
        <p className="text-slate-300">{result ? "Not reached yet" : "Run the forward pass to see its value"}</p>
      ) : node.layer === 0 ? (
        <p className="font-mono">value = {a.toFixed(3)}</p>
      ) : (
        <>
          <p className="font-mono text-slate-300">z = Σ w·x + b = {z.toFixed(3)}</p>
          <p className="font-mono">
            a = {trace.activation_fn}(z) = <span className="font-bold text-cyan-300">{a.toFixed(3)}</span>
          </p>
        </>
      )}
    </div>
  );
}
