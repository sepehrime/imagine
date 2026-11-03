import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import { useProgress } from "../hooks/useProgress";
import { Sliders, Grid, Sparkles } from "lucide-react";

export default function Boundary() {
  const { isCompleted, toggleCompleted } = useProgress();
  const sectionId = 5;

  const takeawayPoints = [
    "A decision boundary separates different predicted classes geometrically across the input space.",
    "Linear models (single perceptron without hidden layers) can only draw straight lines or hyperplanes (failing non-linear problems like XOR).",
    "Hidden layers with non-linear activations warp and curve the space, enabling the network to wrap around arbitrary non-linear clusters.",
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5" />
            Section 5 of 5
          </div>
          {isCompleted(sectionId) && (
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              ● Completed
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Decision Boundary
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          See what the network learned geometrically. Visualize the 2D classification{" "}
          <GlossaryTerm
            term="Decision Boundary"
            definition="The geometric surface in feature space that separates different output classes predicted by the model."
          >
            decision boundary
          </GlossaryTerm>{" "}
          warping and separating different classes of data points in real time.
        </p>
      </div>

      {/* Simulator Placeholder */}
      <div className="rounded-3xl p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm min-h-[360px] flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center text-2xl font-bold shadow-inner">
          <Grid className="w-8 h-8" />
        </div>
        <div className="max-w-md space-y-2">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">
            2D Decision Boundary Contour Plot
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Click to add data points (circles vs crosses) and observe how the neural network fits a non-linear decision boundary around your data.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <Sparkles className="w-3.5 h-3.5" />
          Contour Plot Visualizer Scheduled for Phase 4
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
