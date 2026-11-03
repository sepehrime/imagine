import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Sparkles } from "lucide-react";

/**
 * SectionCard Component
 *
 * SWE Design Pattern: Composite Presentational Component with State Decoration.
 * Renders an accessible interactive card that reflects progress state through color
 * tokens, completion badges, and micro-interactions.
 * `isSuggested` adds an "Up next" highlight so the container (Home) can steer
 * the learner without the card knowing any progress rules.
 */
export default function SectionCard({ section, isCompleted = false, isSuggested = false }) {
  const Icon = section.icon;

  return (
    <Link
      to={section.path}
      aria-label={isSuggested ? `${section.title} (suggested next section)` : undefined}
      className={`group relative p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl hover:-translate-y-1 ${
        isSuggested && !isCompleted
          ? "bg-white dark:bg-slate-900 border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/15 dark:ring-blue-400/20"
          : isCompleted
          ? "bg-white dark:bg-slate-900 border-emerald-500/30 dark:border-emerald-500/30 hover:border-emerald-500"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-500/50"
      }`}
    >
      {/* Top Header: Icon & Completion Status Badge */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-inner ${
              isCompleted
                ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                : "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
            }`}
          >
            <Icon className="w-6 h-6" />
          </div>

          {/* Completion Status Badge */}
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm animate-in fade-in duration-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Completed
            </span>
          ) : isSuggested ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Up Next
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <Circle className="w-3 h-3 text-slate-400" />
              Section {section.id}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Interactive Section {section.id}
          </span>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-0.5">
            {section.title.replace(/^\d+\.\s*/, "")}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {section.desc}
          </p>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold">
        <span
          className={
            isCompleted
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-blue-600 dark:text-blue-400"
          }
        >
          {isCompleted ? "Review Section" : "Start Exploring"}
        </span>
        <ArrowRight
          className={`w-4 h-4 transition-transform group-hover:translate-x-1.5 ${
            isCompleted
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-blue-600 dark:text-blue-400"
          }`}
        />
      </div>
    </Link>
  );
}
