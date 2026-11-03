import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import Tooltip from "../components/Tooltip";
import { useProgress } from "../hooks/useProgress";
import { CircleDot, Sparkles, HelpCircle } from "lucide-react";

export default function Neuron() {
  const { isCompleted, toggleCompleted } = useProgress();
  const sectionId = 1;

  const takeawayPoints = [
    "A neuron computes an affine transformation: it multiplies each input by its weight, sums them up, and adds a bias: z = (w₁x₁ + w₂x₂ + ...) + b.",
    "Without an activation function, stacking multiple linear layers collapses into just one big linear layer. Non-linear activations allow networks to learn complex curves.",
    "Weights determine the importance and direction (positive or negative) of each feature, while the bias shifts the activation threshold.",
  ];

  return (
    <div className="space-y-10">
      {/* Section Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <CircleDot className="w-3.5 h-3.5" />
            Section 1 of 5
          </div>
          {isCompleted(sectionId) && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ● Completed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          What is a Neuron?
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          The basic building block of any neural network. Learn how inputs are scaled by{" "}
          <GlossaryTerm
            term="Weights"
            definition="Numerical parameters adjusted during training that scale the strength and influence of an incoming input signal."
          >
            weights
          </GlossaryTerm>
          , shifted by a{" "}
          <GlossaryTerm
            term="Bias"
            definition="An added constant that allows the neuron to shift its activation threshold independently of its inputs."
          >
            bias
          </GlossaryTerm>
          , and squashed through an{" "}
          <GlossaryTerm
            term="Activation Function"
            definition="A mathematical function (like ReLU or Sigmoid) that introduces non-linearity, allowing neural networks to learn non-linear boundaries."
          >
            activation function
          </GlossaryTerm>
          .
        </p>
      </div>

      {/* Interactive Diagram Placeholder */}
      <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[360px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold shadow-inner">
          ∑ + σ
        </div>
        <div className="max-w-md space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Single Neuron Interactive Diagram
            </h3>
            <Tooltip content="Hover to explore how mathematical formulas translate directly into node activations.">
              <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
            </Tooltip>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Adjust inputs, tweak weights $w_1, w_2$, modify the bias $b$, and pick activation functions to observe the live activation output.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          Interactive Canvas Scheduled for Phase 4
        </span>
      </div>

      {/* Key Takeaways Card with Progress Toggle */}
      <KeyTakeaway
        points={takeawayPoints}
        sectionId={sectionId}
        isCompleted={isCompleted(sectionId)}
        onToggleComplete={toggleCompleted}
      />

      {/* Dynamic Previous / Next Pagination */}
      <SectionNavFooter currentSectionId={sectionId} />
    </div>
  );
}
