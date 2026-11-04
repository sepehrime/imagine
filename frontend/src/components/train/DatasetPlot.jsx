import { CLASS_STYLES } from "../../utils/classStyles";
import { useId } from "react";
import { PLOT_PAD, PLOT_SIZE, fromPx, fromPy, toPx, toPy } from "../../utils/plotScale";

/**
 * DatasetPlot Component
 *
 * Scatter plot of a 2D dataset in the square [-1, 1] × [-1, 1].
 *
 * SWE Design Patterns applied:
 * 1. Redundant Encoding: each class has a colour AND a shape (circle, square,
 *    triangle), so it stays readable for colour-blind users and in print.
 * 2. Composition Slot: `children` are drawn *under* the points in the same
 *    coordinate system — Section 5 passes its decision-boundary heatmap here.
 * 3. Fixed Domain: the plot always spans [-1, 1], so every dataset (and every
 *    boundary grid) lines up without per-dataset scale logic.
 * 4. Optional Capabilities: `predictions` (draw misclassified points as ✕),
 *    `overlay` (drawn above points) and `onPlotClick` (click → data coords)
 *    are all opt-in, so Section 4's simple previews stay unchanged.
 */

const SIZE = PLOT_SIZE;
const PAD = PLOT_PAD;

export function Marker({ x, y, classIndex, size = 3.2, className = "", variant = "filled" }) {
  const { shape, fill, stroke } = CLASS_STYLES[classIndex];
  if (variant === "cross") {
    // Misclassified point: an ✕ in its TRUE class colour, with a dark outline so it reads on any background
    const d = size * 1.1;
    const path = `M${x - d},${y - d}L${x + d},${y + d}M${x + d},${y - d}L${x - d},${y + d}`;
    return (
      <g className={className}>
        <path d={path} strokeWidth={size * 1.1} strokeLinecap="round" className="stroke-slate-900 dark:stroke-white" />
        <path d={path} strokeWidth={size * 0.55} strokeLinecap="round" className={stroke} />
      </g>
    );
  }
  const cls = `${fill} stroke-white dark:stroke-slate-900 ${className}`;
  if (shape === "square") {
    return <rect x={x - size} y={y - size} width={size * 2} height={size * 2} rx={0.6} strokeWidth={0.8} className={cls} />;
  }
  if (shape === "triangle") {
    const h = size * 1.15;
    return (
      <polygon
        points={`${x},${y - h} ${x + h},${y + h * 0.8} ${x - h},${y + h * 0.8}`}
        strokeWidth={0.8}
        className={cls}
      />
    );
  }
  return <circle cx={x} cy={y} r={size} strokeWidth={0.8} className={cls} />;
}

export default function DatasetPlot({
  dataset,
  markerSize = 3.2,
  className = "",
  children,
  overlay,
  predictions,
  onPlotClick,
  label,
}) {
  const clipId = useId();

  // Screen click → data coordinates in [-1, 1]
  const handleClick = onPlotClick
    ? (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * SIZE;
        const py = ((e.clientY - rect.top) / rect.height) * SIZE;
        const x = fromPx(px);
        const y = fromPy(py);
        if (Math.abs(x) <= 1 && Math.abs(y) <= 1) onPlotClick(x, y);
      }
    : undefined;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className={`w-full h-auto ${onPlotClick ? "cursor-crosshair" : ""} ${className}`}
      role="img"
      aria-label={label ?? `${dataset.label}: ${dataset.points.length} points in ${dataset.class_names.length} classes.`}
      onClick={handleClick}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={PAD} y={PAD} width={SIZE - 2 * PAD} height={SIZE - 2 * PAD} rx={6} />
        </clipPath>
      </defs>
      <rect
        x={PAD}
        y={PAD}
        width={SIZE - 2 * PAD}
        height={SIZE - 2 * PAD}
        rx={6}
        className="fill-slate-50 dark:fill-slate-950 stroke-slate-200 dark:stroke-slate-800"
      />
      {/* Background layers (e.g. decision boundary), clipped to the rounded plot area */}
      <g clipPath={`url(#${clipId})`}>{children}</g>
      {dataset.points.map(([x, y], i) => {
        const wrong = predictions && predictions[i] !== dataset.labels[i];
        return (
          <Marker
            key={i}
            x={toPx(x)}
            y={toPy(y)}
            classIndex={dataset.labels[i]}
            size={markerSize}
            variant={wrong ? "cross" : "filled"}
          />
        );
      })}
      {overlay}
    </svg>
  );
}

/** Legend: shape + colour + name for each class. */
export function ClassLegend({ classNames }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1">
      {classNames.map((name, i) => (
        <li key={name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
          <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true">
            <Marker x={6} y={6.5} classIndex={i} size={4} />
          </svg>
          {name}
        </li>
      ))}
    </ul>
  );
}
