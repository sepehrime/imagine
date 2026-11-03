import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import { useProgress } from "../hooks/useProgress";
import { Layers, Sparkles } from "lucide-react";

export default function Build() {
  const { isCompleted, toggleCompleted } = useProgress();
  const sectionId = 2;

  const takeawayPoints = [
    "A neural network architecture consists of an input layer, one or more hidden layers, and an output layer.",
    "Wider layers (more neurons) allow the network to learn more features in parallel; deeper layers (more hidden layers) allow the network to learn hierarchical abstractions.",
    "Every connection between neurons has an independent weight, creating dense matrices that represent the network's total memory.",
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            Section 2 of 5
          </div>
          {isCompleted(sectionId) && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ● Completed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Build the Network
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          From a single neuron to deep architectures. Stack{" "}
          <GlossaryTerm
            term="Hidden Layer"
            definition="Intermediate layers of neurons situated between the input and output layers that extract progressively higher-level features."
          >
            hidden layers
          </GlossaryTerm>
          , connect synapses, and customize how many neurons process information.
        </p>
      </div>

      {/* Builder Placeholder */}
      <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[360px] flex flex-col items-center justify-center text-center space-y-4">
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
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          D3 Visualizer Scheduled for Phase 4
        </span>
      </div>

      {/* Key Takeaways */}
      <KeyTakeaway
        points={takeawayPoints}
        sectionId={sectionId}
        isCompleted={isCompleted(sectionId)}
        onToggleComplete={toggleCompleted}
      />

      {/* Pagination */}
      <SectionNavFooter currentSectionId={sectionId} />
    </div>
  );
}
