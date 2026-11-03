import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";

/**
 * GlossaryTerm Component
 *
 * SWE Design Pattern: Contextual Micro-Definitions.
 * Wraps technical jargon with an interactive inline popover providing an immediate
 * plain-language definition and a deep-link into the comprehensive Glossary.
 */
export default function GlossaryTerm({ term, definition, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const slug = term.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <span
      className="relative inline-block"
      ref={containerRef}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="font-medium text-blue-600 dark:text-blue-400 underline decoration-dotted decoration-blue-400 dark:decoration-blue-500 underline-offset-4 hover:decoration-solid hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded px-0.5"
        aria-expanded={isOpen}
      >
        {children || term}
      </button>

      {isOpen && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-left block animate-in fade-in zoom-in-95 duration-150">
          <span className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              {term}
            </span>
            <Link
              to={`/glossary#${slug}`}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              Glossary
              <ExternalLink className="w-3 h-3" />
            </Link>
          </span>
          <span className="block text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {definition}
          </span>
          {/* Bottom pointer */}
          <span className="absolute left-1/2 -translate-x-1/2 top-full border-4 border-transparent border-t-white dark:border-t-slate-900" />
        </span>
      )}
    </span>
  );
}
