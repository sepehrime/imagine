import SectionNavFooter from "../components/SectionNavFooter";
import { Activity, RotateCcw, Sparkles } from "lucide-react";

export default function Train() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5" />
          Section 4 of 5
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Train & Watch It Learn
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          How do models actually improve? Explore loss functions, gradient descent, and backpropagation
          as the network iteratively reduces its error over training epochs.
        </p>
      </div>

      {/* Interactive Training & Loss Curve Placeholder Card */}
      <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[380px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold shadow-inner">
          <Activity className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Live Training Loop & Recharts Loss Curve
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Click "Train Model" to trigger training iterations via the FastAPI backend and watch real-time loss graphs decrease epoch-by-epoch.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          Ready for Live Training & Recharts (Phase 4)
        </span>
      </div>

      {/* Previous / Next Section Pagination */}
      <SectionNavFooter currentSectionId={4} />
    </div>
  );
}
