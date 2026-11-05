import { useCallback, useEffect, useRef, useState } from "react";
import {
  getTrainingStatus,
  pauseTraining,
  resetTraining,
  resumeTraining,
  startTraining,
  toApiError,
  isCancel,
} from "../api/client";

const POLL_MS = 200;

/**
 * Merges a status response into the history we already have.
 * A response's `history` covers indices [history_length - history.length,
 * history_length), so we keep only the part at or after `since`. This works
 * for both incremental polls (`?since=N`) and full snapshots (start/pause).
 */
export function newEntries(status, since) {
  const firstIndex = status.history_length - status.history.length;
  return status.history.slice(Math.max(0, since - firstIndex));
}

/**
 * Custom Hook: useTraining
 *
 * Owns one backend training run: start / pause / resume / reset, plus polling
 * for progress while it runs.
 *
 * SWE Design Patterns applied:
 * 1. Polling with a setTimeout chain (not setInterval): the next request is
 *    scheduled only after the previous response arrives, so slow responses
 *    can never pile up into overlapping requests.
 * 2. Incremental Sync: each poll sends `since` = how many epochs we have, and
 *    the server only returns the new ones. The payload stays tiny no matter
 *    how long training runs.
 * 3. Lifecycle-Bound Effects: polling lives in a useEffect keyed on the run id
 *    and "is it running?", so pausing, finishing, starting a new run or leaving
 *    the page all stop the old loop automatically (and abort its request).
 * 4. Facade: the page sees `{ status, history, start, pause, resume, reset }`
 *    and never deals with ids, offsets or HTTP.
 */
export function useTraining() {
  const [session, setSession] = useState(null); // latest status, minus history
  const [history, setHistory] = useState([]); // [{ epoch, loss, accuracy }]
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false); // a control request is in flight
  const sinceRef = useRef(0);

  const apply = useCallback((status, { replace = false } = {}) => {
    const since = replace ? 0 : sinceRef.current;
    const fresh = newEntries(status, since);
    sinceRef.current = Math.max(since, status.history_length);
    setHistory((prev) => (replace ? fresh : fresh.length ? [...prev, ...fresh] : prev));
    const meta = { ...status };
    delete meta.history; // history lives in its own state
    setSession(meta);
  }, []);

  const trainingId = session?.training_id;
  const isRunning = session?.status === "running";

  // Poll while running
  useEffect(() => {
    if (!trainingId || !isRunning) return;
    let stopped = false;
    let timer;
    const controller = new AbortController();

    const tick = async () => {
      try {
        const status = await getTrainingStatus(trainingId, sinceRef.current, {
          signal: controller.signal,
        });
        if (stopped) return;
        apply(status);
        if (status.status === "running") timer = setTimeout(tick, POLL_MS);
      } catch (err) {
        if (stopped || isCancel(err)) return;
        setError(toApiError(err));
      }
    };
    timer = setTimeout(tick, POLL_MS);

    return () => {
      stopped = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [trainingId, isRunning, apply]);

  // Wraps a control request: one at a time, errors surfaced the same way
  const control = useCallback(async (request, onSuccess) => {
    setBusy(true);
    setError(null);
    try {
      onSuccess(await request());
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setBusy(false);
    }
  }, []);

  const start = useCallback(
    (config) => control(() => startTraining(config), (status) => apply(status, { replace: true })),
    [control, apply]
  );
  const pause = useCallback(() => control(pauseTraining, (status) => apply(status)), [control, apply]);
  const resume = useCallback(() => control(resumeTraining, (status) => apply(status)), [control, apply]);
  const reset = useCallback(
    () =>
      control(resetTraining, () => {
        sinceRef.current = 0;
        setSession(null);
        setHistory([]);
      }),
    [control]
  );

  return { session, history, error, busy, start, pause, resume, reset };
}
