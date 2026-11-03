import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner Component
 *
 * SWE Design Pattern: Accessible Async State Indicator.
 * Informs users that a long-running process (model training, API call) is executing.
 * Includes `role="status"` and visually hidden text for assistive technologies.
 */
export default function LoadingSpinner({
  size = "md",
  label = "Processing...",
  className = "",
  inline = false,
}) {
  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-10 h-10 text-base",
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.md;

  if (inline) {
    return (
      <span role="status" className={`inline-flex items-center gap-2 ${className}`}>
        <Loader2 className={`${spinnerClass.split(" ")[0]} ${spinnerClass.split(" ")[1]} animate-spin text-blue-600 dark:text-blue-400`} />
        {label && <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>}
        <span className="sr-only">Loading...</span>
      </span>
    );
  }

  return (
    <div
      role="status"
      className={`py-8 flex flex-col items-center justify-center gap-3 text-center ${className}`}
    >
      <Loader2
        className={`${spinnerClass.split(" ")[0]} ${spinnerClass.split(" ")[1]} animate-spin text-blue-600 dark:text-blue-400`}
      />
      {label && (
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 animate-pulse">
          {label}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
