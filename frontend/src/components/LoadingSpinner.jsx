import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner Component
 *
 * A small inline spinner for short waits inside a control (a button, a status
 * line). For content that is still loading, use <Skeleton> instead.
 *
 * SWE Design Pattern: Accessible Async State Indicator.
 * Includes `role="status"` and visually hidden text for assistive technologies.
 */
export default function LoadingSpinner({ label = "Processing...", className = "" }) {
  return (
    <span role="status" className={`inline-flex items-center gap-2 ${className}`}>
      <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
      {label && <span className="text-slate-600 dark:text-slate-300 font-medium">{label}</span>}
      <span className="sr-only">Loading...</span>
    </span>
  );
}
