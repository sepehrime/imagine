import { SECTIONS_NAV } from "./Header";
import { useProgress } from "../hooks/useProgress";
import { SECTION_ACCENTS } from "../utils/sectionAccents";

/**
 * SectionHeader Component
 *
 * The top of every section page: "Section N of 5" badge, a "● Completed" mark,
 * the page title and a short intro (passed as children, so it can contain
 * <GlossaryTerm> links).
 *
 * SWE Design Patterns applied:
 * 1. Single Source of Truth: the section number, total, icon and accent colour
 *    all come from SECTIONS_NAV, so reordering sections can't leave a stale
 *    "Section 3 of 5" behind. (Before this, all five pages hardcoded it.)
 * 2. Self-Sufficient Component: reads completion from useProgress() itself
 *    instead of making every page pass `isCompleted` down.
 */
export default function SectionHeader({ sectionId, title, children }) {
  const { isCompleted } = useProgress();
  const section = SECTIONS_NAV.find((s) => s.id === sectionId);
  const Icon = section.icon;
  const accent = SECTION_ACCENTS[section.accent];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${accent.badge}`}
        >
          <Icon className="w-3.5 h-3.5" />
          Section {sectionId} of {SECTIONS_NAV.length}
        </div>
        {isCompleted(sectionId) && (
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">● Completed</span>
        )}
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">{title}</h1>
      <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{children}</p>
    </div>
  );
}
