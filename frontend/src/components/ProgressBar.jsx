import { Trophy } from "lucide-react";

/**
 * ProgressBar Component
 *
 * SWE Design Pattern: Accessible Visual Metric Indicator.
 * Includes proper WAI-ARIA attributes (`role="progressbar"`, `aria-valuenow`,
 * `aria-valuemin`, `aria-valuemax`) for screen readers, with smooth hardware-accelerated
 * CSS transitions for visual state changes.
 */
export default function ProgressBar({
  percentage = 0,
  completedCount = 0,
  totalSections = 5,
  showLabel = true,
  className = "",
}) {
  const isComplete = percentage === 100;

  return (
    <div className={`space-y-2.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-300">
            {isComplete ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <Trophy className="w-4 h-4" />
                All Sections Completed!
              </span>
            ) : (
              <span>Curriculum Progress</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              {completedCount} of {totalSections} completed
            </span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
              {percentage}%
            </span>
          </div>
        </div>
      )}

      {/* Track */}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Curriculum completion progress"
        className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5 shadow-inner"
      >
        {/* Animated Fill Bar */}
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isComplete
              ? "bg-gradient-to-r from-emerald-500 to-teal-400"
              : "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"
          }`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    </div>
  );
}
