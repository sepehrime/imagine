import { useEffect, useState } from "react";
import { getBoundaryGrid, toApiError, isCancel } from "../api/client";

const LIVE_POLL_MS = 400;

/**
 * Custom Hook: useBoundaryGrid
 *
 * Fetches the decision-boundary grid. With a `trainingId` of a run that's
 * still training, it keeps re-fetching until that run finishes, which is
 * what animates the boundary while retraining.
 *
 * SWE Design Patterns applied:
 * 1. One Loop, Self-Terminating: the setTimeout chain decides from each
 *    *response* (`model.status`) whether to fetch again, so it stops on its
 *    own when training ends, with no extra "is it done?" state to keep in sync.
 * 2. Typed Empty State: a 409 from the backend means "no model yet", which is
 *    a normal state with its own UI, not an error.
 * 3. Reload Key: `reload()` bumps a counter in the effect's deps to refetch,
 *    instead of calling setState from inside the effect.
 */
export function useBoundaryGrid(trainingId) {
  const [grid, setGrid] = useState(null);
  const [noModel, setNoModel] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let timer;

    const tick = async () => {
      try {
        const data = await getBoundaryGrid(trainingId, { signal: controller.signal });
        setGrid(data);
        setNoModel(false);
        setError(null);
        if (trainingId && data.model.status === "running") timer = setTimeout(tick, LIVE_POLL_MS);
      } catch (err) {
        if (isCancel(err)) return;
        if (err.response?.status === 409) setNoModel(true);
        else setError(toApiError(err));
      }
    };
    tick();

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trainingId, reloadKey]);

  const reload = () => {
    setError(null);
    setReloadKey((k) => k + 1);
  };

  return { grid, noModel, error, reload };
}
