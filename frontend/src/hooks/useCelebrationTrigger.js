import { useEffect, useRef, useState } from "react";

/**
 * Custom Hook: useCelebrationTrigger
 *
 * Decides WHEN the "all 5 sections complete" confetti plays.
 *
 * SWE Design Patterns applied:
 * 1. Edge Detection with a ref: compares the previous value (kept in a ref, so
 *    it survives renders without causing them) with the current one, reacting
 *    to the *change* rather than the *state*.
 * 2. Self-Expiring UI State: the celebration turns itself off after `durationMs`.
 *
 * @param {boolean} isAllComplete  current "all sections done" flag from useProgress()
 * @param {number}  durationMs     how long the celebration stays visible
 * @returns {boolean} celebrating — true while confetti should be on screen
 */
export function useCelebrationTrigger(isAllComplete, durationMs) {
  const [celebrating, setCelebrating] = useState(false);
  // Value of isAllComplete on the previous render. Starts as the value at
  // mount, so a returning user who already finished everything isn't
  // celebrated again on every page load.
  const prevRef = useRef(isAllComplete);

  useEffect(() => {
    // Celebrate only on the false → true edge: the moment the 5th section is
    // marked complete. Undoing one and re-marking it celebrates again.
    const wasComplete = prevRef.current;
    prevRef.current = isAllComplete;
    if (!wasComplete && isAllComplete) {
      // oxlint-disable-next-line react/set-state-in-effect
      setCelebrating(true);
    }
  }, [isAllComplete]);

  // Turn the celebration off once it has played
  useEffect(() => {
    if (!celebrating) return;
    const id = setTimeout(() => setCelebrating(false), durationMs);
    return () => clearTimeout(id);
  }, [celebrating, durationMs]);

  return celebrating;
}
