import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Home, CheckCircle2 } from "lucide-react";
import { SECTIONS_NAV } from "./Header";

/**
 * SectionNavFooter Component
 *
 * SWE Design Pattern: Dynamic Flow Pagination (DRY Principle).
 * Rather than hardcoding "Next Section" and "Previous Section" buttons on every page,
 * this component derives the sequence dynamically from the centralized `SECTIONS_NAV` array.
 * If the section order or titles ever change, navigation pagination updates automatically.
 */
export default function SectionNavFooter({ currentSectionId }) {
  const currentIndex = SECTIONS_NAV.findIndex((s) => s.id === currentSectionId);
  const prevSection = currentIndex > 0 ? SECTIONS_NAV[currentIndex - 1] : null;
  const nextSection = currentIndex < SECTIONS_NAV.length - 1 ? SECTIONS_NAV[currentIndex + 1] : null;

  return (
    <nav
      aria-label="Section pagination"
      className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      {/* Previous Section Button */}
      {prevSection ? (
        <Link
          to={prevSection.path}
          className="w-full sm:w-auto inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 transition-all group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-1 group-hover:text-blue-500 transition-transform" />
          <div className="text-left">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Previous Section
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {prevSection.title}
            </span>
          </div>
        </Link>
      ) : (
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          Return to Overview
        </Link>
      )}

      {/* Next Section Button */}
      {nextSection ? (
        <Link
          to={nextSection.path}
          className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-end gap-3 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 hover:shadow-lg transition-all group"
        >
          <div className="text-left sm:text-right">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-blue-200">
              Next Section
            </span>
            <span className="text-sm font-bold">
              {nextSection.title}
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 group-hover:text-white transition-transform" />
        </Link>
      ) : (
        <Link
          to="/glossary"
          className="w-full sm:w-auto inline-flex items-center justify-between sm:justify-end gap-3 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all group"
        >
          <div className="text-left sm:text-right">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-emerald-200">
              All Sections Complete 🎉
            </span>
            <span className="text-sm font-bold">Explore Glossary of Terms</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
        </Link>
      )}
    </nav>
  );
}
