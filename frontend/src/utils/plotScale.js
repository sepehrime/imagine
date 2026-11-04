/**
 * Coordinate mapping for the 2D dataset plots (Sections 4 and 5).
 * Every dataset lives in [-1, 1] × [-1, 1]; this maps it into a square SVG.
 */
export const PLOT_SIZE = 200;
export const PLOT_PAD = 8;

const span = PLOT_SIZE - 2 * PLOT_PAD;

/** Data x in [-1, 1] → SVG pixel x. */
export const toPx = (v) => PLOT_PAD + ((v + 1) / 2) * span;
/** Data y in [-1, 1] → SVG pixel y (flipped so +y points up). */
export const toPy = (v) => PLOT_SIZE - PLOT_PAD - ((v + 1) / 2) * span;
