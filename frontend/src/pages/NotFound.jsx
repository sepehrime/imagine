import { Link } from "react-router-dom";
import { AlertTriangle, Home, ArrowRight, Layers } from "lucide-react";

/**
 * NotFound Component (404 Page)
 *
 * SWE Design Pattern: Graceful Failure & Dead-End Recovery.
 * In production web engineering, users may follow stale bookmarks, mistype URLs,
 * or encounter broken links. A 404 page should never be a blank screen or a generic
 * browser error; it should explain what happened and provide immediate navigation
 * pathways back to core functionality.
 */
export default function NotFound() {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/10">
        <AlertTriangle className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
        Signal Lost in the Network
      </h1>
      <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        We couldn't find the page or section you were looking for. It may have been moved,
        renamed, or the URL might have a typo.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all hover:scale-105"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          to="/neuron"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-sm hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
        >
          <Layers className="w-4 h-4" />
          Start with Section 1
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
