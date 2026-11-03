import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import { useProgress } from "../hooks/useProgress";
import { Play, FastForward, Sparkles } from "lucide-react";

export default function ForwardPass() {
  const { isCompleted, toggleCompleted } = useProgress();
  const sectionId = 3;

  const takeawayPoints = [
    "The forward pass is the inference phase: inputs flow from layer to layer until reaching the output.",
    "Each layer performs a matrix multiplication of inputs and weights, followed by a non-linear activation vector.",
    "During inference, weights remain completely fixed; no learning happens until the backward pass.",
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Play className="w-3.5 h-3.5" />
            Section 3 of 5
          </div>
          {isCompleted(sectionId) && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ● Completed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          The Forward Pass
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Watch numbers pulse and propagate from input features across intermediate hidden layers
          until a final prediction emerges through the{" "}
          <GlossaryTerm
            term="Forward Pass"
            definition="The calculation process of transmitting input values forward through network layers to compute predicted outputs."
          >
            forward pass
          </GlossaryTerm>
          .
        </p>
      </div>

      {/* Simulator Placeholder */}
      <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[360px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-2xl font-bold shadow-inner">
          <FastForward className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            Forward Pass Flow Simulator
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Step through forward propagation frame by frame. Watch synaptic activations animate and transform feature values across each layer.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          Framer Motion Animation Scheduled for Phase 4
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
