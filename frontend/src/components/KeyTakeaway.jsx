import { CheckCircle2, Circle, Lightbulb } from "lucide-react";

/**
 * KeyTakeaway Component
 *
 * SWE Design Pattern: Active Learning Feedback & Micro-Commitment.
 * Highlights essential mental models at the end of each section and provides
 * an interactive completion button that directly updates global progress state.
 */
export default function KeyTakeaway({
  points = [],
  sectionId,
  isCompleted = false,
  onToggleComplete = null,
  className = "",
}) {
  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 border transition-all duration-300 shadow-sm ${
        isCompleted
          ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-emerald-500/5"
          : "bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/80 shadow-blue-500/5"
      } ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
              isCompleted
                ? "bg-emerald-600 text-white"
                : "bg-blue-600 text-white"
            }`}
          >
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Summary Card
            </span>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
              Key Takeaways
            </h3>
          </div>
        </div>

        {/* Interactive "Mark as Complete" Button */}
        {onToggleComplete && (
          <button
            type="button"
            onClick={() => onToggleComplete(sectionId)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 ${
              isCompleted
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700"
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                Section Completed! (Click to Undo)
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-slate-400" />
                Mark as Complete
              </>
            )}
          </button>
        )}
      </div>

      {/* Bullet Points */}
      <ul className="space-y-3">
        {points.map((pt, idx) => (
          <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                isCompleted
                  ? "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                  : "bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              }`}
            >
              {idx + 1}
            </span>
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
