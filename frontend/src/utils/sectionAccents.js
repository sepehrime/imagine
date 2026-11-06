/**
 * Per-section accent colours, as COMPLETE Tailwind class strings.
 *
 * Tailwind only generates classes it can find written out in the source, so
 * `bg-${accent}-100` would silently produce no CSS (see lessons 4.27). Each
 * accent therefore spells out every class it needs. Keys match the `accent`
 * field of SECTIONS_NAV.
 */
export const SECTION_ACCENTS = {
  blue: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
    iconTile: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
  },
  indigo: {
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
    iconTile: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400",
  },
  cyan: {
    badge: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300",
    iconTile: "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400",
  },
  emerald: {
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
    iconTile: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
  },
  violet: {
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
    iconTile: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400",
  },
};
