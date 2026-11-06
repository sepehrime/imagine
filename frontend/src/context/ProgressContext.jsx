import { ProgressContext, useProgressStore } from "../hooks/useProgress";

/**
 * ProgressProvider
 *
 * SWE Design Patterns applied:
 * 1. Provider Pattern: owns the ONE progress store for the whole app, so the
 *    section pages, the Home page and the layout-level confetti all read the
 *    same state (same-tab updates are instant; cross-tab still uses `storage`).
 * 2. Separation of Concerns: the store logic stays in `hooks/useProgress.js`
 *    (plain JS, no JSX); this file only makes it available via context.
 */
export function ProgressProvider({ children }) {
  const progress = useProgressStore();
  return <ProgressContext.Provider value={progress}>{children}</ProgressContext.Provider>;
}
