import { useState } from "react";

/**
 * Tooltip Component
 *
 * SWE Design Pattern: Accessible Overlay Pattern.
 * - Supports mouse hover (mouseenter/mouseleave) and keyboard navigation (focus/blur).
 * - Implements WAI-ARIA role="tooltip" to allow screen readers to announce explanations.
 */
export default function Tooltip({ content, children }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="button"
      aria-expanded={isVisible}
    >
      {children}

      {isVisible && (
        <span
          role="tooltip"
          className="absolute z-50 px-3 py-1.5 text-xs font-medium text-white bg-slate-900/95 dark:bg-slate-800 dark:text-slate-100 rounded-xl shadow-xl backdrop-blur-sm whitespace-normal max-w-xs w-max pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 bottom-full left-1/2 -translate-x-1/2 mb-2"
        >
          {content}
          {/* Subtle Arrow */}
          <span
            className="absolute left-1/2 -translate-x-1/2 border-4 border-transparent top-full border-t-slate-900/95 dark:border-t-slate-800"
          />
        </span>
      )}
    </span>
  );
}
