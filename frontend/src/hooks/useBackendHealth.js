import { useCallback, useEffect, useRef, useState } from "react";
import { checkHealth, isCancel } from "../api/client";

// How often to re-check while the backend is DOWN (so the banner clears itself
// soon after the user starts uvicorn). While it's up we don't poll at all.
const OFFLINE_RETRY_MS = 5000;

/**
 * Custom Hook: useBackendHealth
 *
 * Reports whether the FastAPI backend is reachable: "checking" | "online" | "offline".
 *
 * SWE Design Patterns applied:
 * 1. Adaptive Polling: polls only while offline; when online it re-checks on
 *    window focus instead, so a healthy app makes no background requests.
 * 2. Cancellation: each check gets an AbortController, aborted on unmount,
 *    so StrictMode's double-mount never leaves a stray request updating state.
 * 3. Manual Retry Hook: returns `recheck()` for a "Try again" button.
 */
export function useBackendHealth() {
  const [status, setStatus] = useState("checking");
  const controllerRef = useRef(null);

  const recheck = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const ok = await checkHealth({ signal: controller.signal });
      setStatus(ok ? "online" : "offline");
    } catch (err) {
      if (!isCancel(err)) setStatus("offline");
    }
  }, []);

  // First check on mount. setState only happens after the network await
  // (syncing with an external system), so the lint rule doesn't apply here.
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    recheck();
    return () => controllerRef.current?.abort();
  }, [recheck]);

  // Poll while offline
  useEffect(() => {
    if (status !== "offline") return;
    const id = setInterval(recheck, OFFLINE_RETRY_MS);
    return () => clearInterval(id);
  }, [status, recheck]);

  // Re-check when the user comes back to the tab (they may have stopped the server)
  useEffect(() => {
    window.addEventListener("focus", recheck);
    return () => window.removeEventListener("focus", recheck);
  }, [recheck]);

  return { status, recheck };
}
