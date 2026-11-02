import SectionNavFooter from "../components/SectionNavFooter";
import { Layers, Plus, Minus, Sparkles } from "lucide-react";

export default function Build() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" />
          Section 2 of 5
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Build the Network
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          From a single neuron to deep architectures. Stack layers, connect synapses, and customize
          how many hidden neurons process information.
        </p>
      </div>

      {/* Interactive Builder Placeholder Card */}
      <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[380px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold shadow-inner">
          <Layers className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Network Architecture Builder
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Add or remove hidden layers, adjust neuron count per layer, and watch D3 calculate synaptic connection lines dynamically.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          Ready for D3 Network Visualizer (Phase 4)
        </span>
      </div>

      {/* Previous / Next Section Pagination */}
      <SectionNavFooter currentSectionId={2} />
    </div>
  );
}
