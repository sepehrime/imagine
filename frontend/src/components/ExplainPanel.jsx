import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

/**
 * ExplainPanel Component
 *
 * A collapsed "Explain this step" box placed under a visualization. Closed by
 * default so the visual stays the focus; open it for a walkthrough of the
 * numbers currently on screen.
 *
 * SWE Design Patterns applied:
 * 1. Disclosure Pattern (WAI-ARIA): a real <button> with `aria-expanded` and
 *    `aria-controls` pointing at the region it opens — works with Tab + Enter/Space
 *    out of the box, and screen readers announce "collapsed/expanded".
 * 2. Progressive Disclosure: beginners get the visual first, detail on demand.
 * 3. Composition via children: the panel owns open/close + animation; each
 *    page passes in its own (often live, state-derived) explanation.
 * 4. Unique IDs with `useId`: safe even with several panels on one page.
 */
export default function ExplainPanel({ title = "Explain this step", children, className = "" }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();

  return (
    <div
      className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={regionId}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-2xl text-left text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
        <span className="flex-1">{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={regionId}
            role="region"
            aria-label={title}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
