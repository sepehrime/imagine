import SectionNavFooter from "../components/SectionNavFooter";
import { CircleDot, Sliders, Play, Sparkles } from "lucide-react";

export default function Neuron() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
          <CircleDot className="w-3.5 h-3.5" />
          Section 1 of 5
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What is a Neuron?
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The basic building block of any neural network. Learn how inputs are weighted, summed with a bias,
          and squashed through an activation function to produce an output signal.
        </p>
      </div>

      {/* Interactive Canvas Placeholder Card */}
      <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[380px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold shadow-inner">
          ∑ + σ
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Single Neuron Interactive Diagram
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Adjust inputs, tweak weights $w_1, w_2$, modify the bias $b$, and pick activation functions (ReLU, Sigmoid, Tanh) to observe the live activation output.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          Ready for Interactive Canvas (Phase 4)
        </span>
      </div>

      {/* Previous / Next Section Pagination */}
      <SectionNavFooter currentSectionId={1} />
    </div>
  );
}
