import { useMemo } from "react";
import { CLASS_STYLES } from "../../utils/classStyles";
import { PLOT_PAD, PLOT_SIZE } from "../../utils/plotScale";

/**
 * BoundaryLayer Component
 *
 * The decision-boundary heatmap, drawn inside <DatasetPlot> as a background.
 *
 * SWE Design Patterns applied:
 * 1. Right Tool for the Pixel Count: 100×100 = 10,000 cells would be 10,000
 *    SVG <rect>s re-rendered on every live update. Instead the grid is painted
 *    into a 100×100 <canvas> (one byte array write), turned into an image, and
 *    placed in the SVG as a single <image>. The browser's smooth upscaling
 *    also softens the cell edges for free.
 * 2. Memoised Rendering: the image is rebuilt only when the grid or the theme
 *    changes, not on hover or unrelated re-renders.
 * 3. Encoding: hue = predicted class, opacity = confidence (rescaled so
 *    "pure guess" is transparent and "certain" is strongest).
 */

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const MAX_ALPHA = 0.55; // keep the data points readable on top

export default function BoundaryLayer({ grid, isDark }) {
  const href = useMemo(() => {
    const { resolution: n, predictions, confidence } = grid;
    const classes = grid.model.class_names.length;
    const chance = 1 / classes; // confidence of a pure guess
    const colors = CLASS_STYLES.map((c) => hexToRgb(isDark ? c.hex.dark : c.hex.light));

    const canvas = document.createElement("canvas");
    canvas.width = n;
    canvas.height = n;
    const ctx = canvas.getContext("2d");
    const image = ctx.createImageData(n, n);
    for (let i = 0; i < n * n; i++) {
      const [r, g, b] = colors[predictions[i]];
      const certainty = Math.max(0, (confidence[i] - chance) / (1 - chance)); // 0 = guess, 1 = sure
      image.data[i * 4] = r;
      image.data[i * 4 + 1] = g;
      image.data[i * 4 + 2] = b;
      image.data[i * 4 + 3] = Math.round(255 * MAX_ALPHA * (0.15 + 0.85 * certainty));
    }
    ctx.putImageData(image, 0, 0);
    return canvas.toDataURL();
  }, [grid, isDark]);

  return (
    <image
      href={href}
      x={PLOT_PAD}
      y={PLOT_PAD}
      width={PLOT_SIZE - 2 * PLOT_PAD}
      height={PLOT_SIZE - 2 * PLOT_PAD}
      preserveAspectRatio="none"
    />
  );
}
