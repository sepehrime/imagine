import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import { useProgress } from "../hooks/useProgress";
import { Activity, Sparkles } from "lucide-react";

export default function Train() {
  const { isCompleted, toggleCompleted } = useProgress();
  const sectionId = 4;

  const takeawayPoints = [
    "Training requires a Loss Function: a mathematical formula quantifying how far off predictions are from the true ground-truth targets.",
    "Backpropagation computes the gradient of the loss with respect to every weight in the network via the calculus chain rule.",
    "Gradient Descent steps each weight in the negative gradient direction, gradually nudging the model toward lower loss over multiple epochs.",
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            Section 4 of 5
          </div>
          {isCompleted(sectionId) && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ● Completed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Train & Watch It Learn
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          How do models actually improve? Explore{" "}
          <GlossaryTerm
            term="Loss Function"
            definition="A mathematical formula (e.g. Mean Squared Error, Cross-Entropy) evaluating the discrepancy between model outputs and target labels."
          >
            loss functions
          </GlossaryTerm>
          ,{" "}
          <GlossaryTerm
            term="Backpropagation"
            definition="The backward pass algorithm calculating gradients of the loss with respect to all trainable parameters via the chain rule."
          >
            backpropagation
          </GlossaryTerm>
          , and{" "}
          <GlossaryTerm
            term="Gradient Descent"
            definition="An optimization algorithm that iteratively updates network weights in the opposite direction of the gradient to minimize the loss."
          >
            gradient descent
          </GlossaryTerm>
          .
        </p>
      </div>

      {/* Simulator Placeholder */}
      <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[360px] flex flex-col items-center justify-center text-center space-y-4">
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
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          FastAPI PyTorch Training Loop Scheduled for Phase 4
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
