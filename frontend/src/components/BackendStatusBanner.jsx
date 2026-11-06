import { AnimatePresence, motion } from "framer-motion";
import { RefreshCw, ServerOff } from "lucide-react";
import { useBackendHealth } from "../hooks/useBackendHealth";

/**
 * BackendStatusBanner Component
 *
 * A slim, site-wide warning shown when the FastAPI server can't be reached.
 * Sections 1 and 2 run fully in the browser, so the banner says what still
 * works instead of making the whole app look broken.
 *
 * SWE Design Patterns applied:
 * 1. Graceful Degradation: the app stays usable; only backend-powered
 *    sections (3–5) are flagged, and the banner disappears on its own once the
 *    server answers again (see `useBackendHealth`).
 * 2. Polite Live Region: `aria-live="polite"` announces the change without
 *    interrupting. It deliberately is NOT `role="alert"`: per-request errors
 *    inside sections already use that role.
 * 3. Container/Presentational Split: health logic lives in the hook; this file
 *    only renders.
 */
export default function BackendStatusBanner() {
  const { status, recheck } = useBackendHealth();
  const offline = status === "offline";

  return (
    <div aria-live="polite">
      <AnimatePresence initial={false}>
        {offline && (
          <motion.section
            key="offline"
            aria-label="Backend status"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-b border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-amber-900 dark:text-amber-100">
              <ServerOff className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <p className="flex-1 min-w-[16rem]">
                <strong className="font-semibold">Backend offline.</strong> Sections 1–2 still work; Sections 3–5 need
                the Python server: <code className="px-1 rounded bg-amber-100 dark:bg-amber-900/60 text-xs">uvicorn main:app --reload --port 8000</code>
              </p>
              <button
                type="button"
                onClick={recheck}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                Check again
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
