import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { layoutNetwork, describeLayer } from "../../utils/architecture";

/**
 * NetworkDiagram Component
 *
 * Live, fully connected network diagram that re-lays itself out whenever the
 * layer sizes change.
 *
 * SWE Design Patterns applied:
 * 1. Layout / Render Split: `layoutNetwork` (pure function) computes every
 *    coordinate; this component only maps them to SVG elements.
 * 2. Enter / Update / Exit Animation: AnimatePresence + role-based keys mean
 *    new nodes grow in, removed nodes shrink out, and surviving nodes slide to
 *    their new position. It's D3's classic enter/update/exit pattern, done in
 *    React.
 * 3. Hit-Area Separation: each edge has an invisible, wide "hit" line on top
 *    of its thin visible line, so 1px edges are still easy to hover.
 * 4. Progressive Enhancement: transitions become instant under
 *    `prefers-reduced-motion`.
 */

const W = 720;
const H = 380;
const NODE_R = 14;

// Full literal class names so Tailwind's scanner keeps them
const LAYER_STYLES = {
  in: { fill: "fill-sky-500", text: "text-sky-600 dark:text-sky-400" },
  h1: { fill: "fill-violet-500", text: "text-violet-600 dark:text-violet-400" },
  h2: { fill: "fill-indigo-500", text: "text-indigo-600 dark:text-indigo-400" },
  h3: { fill: "fill-fuchsia-500", text: "text-fuchsia-600 dark:text-fuchsia-400" },
  h4: { fill: "fill-teal-500", text: "text-teal-600 dark:text-teal-400" },
  out: { fill: "fill-amber-500", text: "text-amber-600 dark:text-amber-400" },
};

export default function NetworkDiagram({ layers, activationLabel }) {
  const reduceMotion = useReducedMotion();
  const [hover, setHover] = useState(null); // { kind: "node" | "edge", item }

  const { nodes, edges } = useMemo(
    () => layoutNetwork(layers, { width: W, height: H }),
    [layers]
  );

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.45, ease: "easeInOut" };

  // When a node is hovered, highlight the edges touching it
  const hoveredNodeId = hover?.kind === "node" ? hover.item.id : null;
  const hoveredEdgeId = hover?.kind === "edge" ? hover.item.id : null;
  const edgeState = (e) => {
    if (hoveredEdgeId) return e.id === hoveredEdgeId ? "active" : "dim";
    if (hoveredNodeId) return e.from.id === hoveredNodeId || e.to.id === hoveredNodeId ? "active" : "dim";
    return "idle";
  };

  // Tooltip anchor in % of the SVG, so it tracks the responsive size
  let tip = null;
  if (hover?.kind === "node") {
    const n = hover.item;
    tip = {
      x: n.x,
      y: n.y - NODE_R - 6,
      title: n.layerName,
      body: `Node ${n.index + 1} of ${layers[n.layer]}`,
    };
  } else if (hover?.kind === "edge") {
    const { from, to } = hover.item;
    tip = {
      x: (from.x + to.x) / 2,
      y: (from.y + to.y) / 2 - 6,
      title: `${shortName(from)} → ${shortName(to)}`,
      body: "weight: (uninitialized)",
    };
  }

  return (
    <div onMouseLeave={() => setHover(null)}>
      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label={`Fully connected network with layer sizes ${layers.join(", ")}.`}
        >
          {/* Edges */}
          <AnimatePresence initial={false}>
            {edges.map((e) => {
              const state = edgeState(e);
              const coords = { x1: e.from.x, y1: e.from.y, x2: e.to.x, y2: e.to.y };
              return (
                <motion.line
                  key={e.id}
                  initial={{ ...coords, opacity: 0 }}
                  animate={{
                    ...coords,
                    opacity: state === "active" ? 1 : state === "dim" ? 0.12 : 0.5,
                  }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                  strokeWidth={state === "active" ? 2.5 : 1.25}
                  className={
                    state === "active"
                      ? "stroke-indigo-500 dark:stroke-indigo-400"
                      : "stroke-slate-400 dark:stroke-slate-600"
                  }
                />
              );
            })}
          </AnimatePresence>

          {/* Invisible wide hit areas for edges (drawn above the visible lines) */}
          {edges.map((e) => (
            <line
              key={`hit-${e.id}`}
              x1={e.from.x}
              y1={e.from.y}
              x2={e.to.x}
              y2={e.to.y}
              stroke="transparent"
              strokeWidth={8}
              onMouseEnter={() => setHover({ kind: "edge", item: e })}
              onMouseLeave={() => setHover(null)}
            />
          ))}

          {/* Nodes */}
          <AnimatePresence initial={false}>
            {nodes.map((n) => {
              const style = LAYER_STYLES[n.role];
              const isHovered = n.id === hoveredNodeId;
              return (
                <motion.circle
                  key={n.id}
                  initial={{ cx: n.x, cy: n.y, r: 0 }}
                  animate={{ cx: n.x, cy: n.y, r: isHovered ? NODE_R + 3 : NODE_R }}
                  exit={{ r: 0, opacity: 0 }}
                  transition={transition}
                  strokeWidth={3}
                  className={`${style.fill} stroke-white dark:stroke-slate-900 cursor-pointer`}
                  onMouseEnter={() => setHover({ kind: "node", item: n })}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
          </AnimatePresence>
        </svg>

        {/* Hover tooltip */}
        {tip && (
          <div
            role="tooltip"
            className="absolute z-10 -translate-x-1/2 -translate-y-full pointer-events-none px-3 py-1.5 rounded-xl bg-slate-900/95 dark:bg-slate-800 text-white shadow-xl text-center"
            style={{ left: `${(tip.x / W) * 100}%`, top: `${(tip.y / H) * 100}%` }}
          >
            <div className="text-xs font-bold whitespace-nowrap">{tip.title}</div>
            <div className="text-[11px] font-mono text-slate-300 whitespace-nowrap">{tip.body}</div>
          </div>
        )}
      </div>

      {/* Layer labels, positioned under each column */}
      <div className="relative h-10 -mt-2">
        {layers.map((count, layer) => {
          const { role, name } = describeLayer(layer, layers.length);
          const x = nodes.find((n) => n.layer === layer)?.x ?? 0;
          const isHidden = role.startsWith("h");
          return (
            <div
              key={role}
              className="absolute -translate-x-1/2 text-center leading-tight transition-all duration-500"
              style={{ left: `${(x / W) * 100}%` }}
            >
              <div className={`text-[10px] sm:text-[11px] font-bold whitespace-nowrap ${LAYER_STYLES[role].text}`}>
                {name.replace(" layer", "")}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                {count} {count === 1 ? "node" : "nodes"}
                {isHidden && <span className="hidden sm:inline"> · {activationLabel}</span>}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

function shortName(node) {
  const base = node.role === "in" ? "Input" : node.role === "out" ? "Output" : `H${node.layer}`;
  return `${base} #${node.index + 1}`;
}
