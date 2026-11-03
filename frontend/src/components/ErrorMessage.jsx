import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * ErrorMessage Component
 *
 * SWE Design Pattern: Actionable Error Recovery.
 * Displays network failures and unexpected exceptions with helpful diagnostic context
 * and an optional retry callback to let the user recover without refreshing the page.
 */
export default function ErrorMessage({
  title = "Something went wrong",
  message = "An error occurred while communicating with the backend server.",
  details = null,
  onRetry = null,
  className = "",
}) {
  return (
    <div
      role="alert"
      className={`rounded-2xl p-5 border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 shadow-sm ${className}`}
    >
      <div className="flex items-start gap-3.5">
        <div className="p-1 rounded-lg bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-sm tracking-tight">{title}</h4>
          <p className="text-xs sm:text-sm text-rose-700 dark:text-rose-300 leading-relaxed">
            {message}
          </p>

          {details && (
            <details className="mt-2 text-xs">
              <summary className="cursor-pointer font-semibold text-rose-600 dark:text-rose-400 hover:underline">
                Technical Details
              </summary>
              <pre className="mt-1 p-2 rounded-lg bg-rose-100/70 dark:bg-rose-950 font-mono text-[11px] overflow-x-auto text-rose-800 dark:text-rose-300">
                {typeof details === "object" ? JSON.stringify(details, null, 2) : String(details)}
              </pre>
            </details>
          )}

          {onRetry && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
