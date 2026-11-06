import { useState } from "react";
import { Link } from "react-router-dom";
import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import SliderControl from "../components/SliderControl";
import LoadingSpinner from "../components/LoadingSpinner";
import ExplainPanel from "../components/ExplainPanel";
import { Skeleton, SkeletonGroup } from "../components/Skeleton";
import ErrorMessage from "../components/ErrorMessage";
import DatasetPlot, { ClassLegend, Marker } from "../components/train/DatasetPlot";
import BoundaryLayer from "../components/boundary/BoundaryLayer";
import { useProgress } from "../hooks/useProgress";
import { useTraining } from "../hooks/useTraining";
import { useBoundaryGrid } from "../hooks/useBoundaryGrid";
import { useTheme } from "../context/ThemeContext";
import { predictPoint, trainDefaultModel, toApiError } from "../api/client";
import { toPx, toPy } from "../utils/plotScale";
import {
  Grid,
  MousePointerClick,
  Spline,
  Gauge,
  RefreshCw,
  Activity,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

/**
 * Boundary Page (Section 5)
 *
 * SWE Design Patterns applied:
 * 1. Reusing Section 4's Machinery: retraining goes through the same
 *    `useTraining` hook and /api/train endpoints; this page only adds the
 *    boundary view on top.
 * 2. Derived "After" State: the comparison's "after" is not stored; it is
 *    simply the current grid once it belongs to the retrain run and that run
 *    is done. Only "before" (a snapshot of the past) needs its own state.
 * 3. Lazy Defaults Without Effects: the retrain sliders show the current
 *    model's settings until the learner moves them (`value ?? fromModel`),
 *    so there's no effect copying props into state.
 */

// Same log-scale mapping as Section 4 (positions 0..60 → 0.001..1)
const positionToLr = (p) => Number((10 ** (-3 + p / 20)).toPrecision(2));
const lrToPosition = (lr) => Math.round((Math.log10(lr) + 3) * 20);

const CONCEPTS = [
  {
    icon: Grid,
    title: "The boundary",
    text: "Ask the network about every point on the map and colour it by its answer. Where the colours meet is the decision boundary.",
  },
  {
    icon: Spline,
    title: "Curves, not just lines",
    text: "A single neuron can only draw a straight line. Hidden layers bend and combine lines into curves, circles and islands.",
  },
  {
    icon: Gauge,
    title: "Confidence",
    text: "Stronger colour means the network is surer. Near the boundary the colour fades: that's where it's closest to a coin flip.",
  },
];

export default function Boundary() {
  const { isCompleted, toggleCompleted } = useProgress();
  const { isDark } = useTheme();
  const sectionId = 5;

  const training = useTraining();
  const retrainId = training.session?.training_id ?? null;
  const { grid, noModel, error, reload } = useBoundaryGrid(retrainId);

  const [before, setBefore] = useState(null);
  const [probe, setProbe] = useState(null); // { x, y, result | null, error | null }
  const [lrPosition, setLrPosition] = useState(null);
  const [epochs, setEpochs] = useState(null);
  const [defaultState, setDefaultState] = useState({ busy: false, error: null });

  const model = grid?.model;
  const shownLrPosition = lrPosition ?? (model ? lrToPosition(model.learning_rate) : 40);
  const shownEpochs = epochs ?? model?.epochs ?? 200;
  const learningRate = positionToLr(shownLrPosition);
  const retraining = model?.training_id === retrainId && model?.status === "running";
  const after = before && model && model.training_id === retrainId && model.status === "done" ? grid : null;

  const dataset = grid && {
    label: model.dataset_label,
    class_names: model.class_names,
    points: grid.points,
    labels: grid.labels,
  };

  async function handleProbe(x, y) {
    setProbe({ x, y, result: null, error: null });
    try {
      const result = await predictPoint({ x, y, trainingId: model.training_id });
      setProbe({ x, y, result, error: null });
    } catch (err) {
      setProbe({ x, y, result: null, error: toApiError(err) });
    }
  }

  function retrain() {
    setBefore(grid);
    setProbe(null);
    training.start({
      dataset: model.dataset,
      learningRate,
      epochs: shownEpochs,
      hiddenSize: model.hidden_size,
    });
  }

  async function loadDefaultModel() {
    setDefaultState({ busy: true, error: null });
    try {
      await trainDefaultModel();
      setDefaultState({ busy: false, error: null });
      reload();
    } catch (err) {
      setDefaultState({ busy: false, error: toApiError(err) });
    }
  }

  const takeawayPoints = [
    "A decision boundary is where the network switches from one answer to another. It shows what the network has actually learned.",
    "Hidden neurons let networks bend that boundary into curves and closed shapes, which one neuron alone could never draw.",
    "Training settings matter: the same network with a different learning rate or number of epochs can draw a very different boundary.",
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 text-xs font-bold uppercase tracking-wider">
            <Grid className="w-3.5 h-3.5" />
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
          What has the network actually learned? Colour the whole map by its answers and you can see
          the{" "}
          <GlossaryTerm
            term="Decision Boundary"
          >
            decision boundary
          </GlossaryTerm>{" "}
          it drew to separate the classes.
        </p>
      </div>

      {/* Concept Explainer */}
      <div className="grid md:grid-cols-3 gap-4">
        {CONCEPTS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div className="rounded-3xl p-5 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        {error ? (
          <ErrorMessage title={error.title} message={error.message} details={error.details} onRetry={reload} />
        ) : noModel ? (
          <NoModel onUseDefault={loadDefaultModel} state={defaultState} />
        ) : !grid ? (
          <SkeletonGroup label="Loading the trained model…" className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="lg:col-span-2 space-y-5">
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-40 w-full rounded-2xl" />
              <Skeleton className="h-10 w-1/2" />
            </div>
          </SkeletonGroup>
        ) : (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Plot */}
            <div className="lg:col-span-3 space-y-3">
              <DatasetPlot
                dataset={dataset}
                markerSize={2.4}
                predictions={grid.point_predictions}
                onPlotClick={handleProbe}
                label={`Decision boundary for ${model.dataset_label}. Accuracy ${(grid.accuracy * 100).toFixed(1)}%. Click to ask the network about a point.`}
                overlay={probe && <ProbeMarker probe={probe} />}
              >
                <BoundaryLayer grid={grid} isDark={isDark} />
              </DatasetPlot>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <ClassLegend classNames={model.class_names} />
                <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <svg viewBox="0 0 12 12" className="w-3 h-3" aria-hidden="true">
                    <Marker x={6} y={6} classIndex={0} size={3.6} variant="cross" />
                  </svg>
                  Misclassified
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Stronger colour = more confident</span>
              </div>
              <ExplainPanel>
                <BoundaryWalkthrough grid={grid} />
              </ExplainPanel>
            </div>

            {/* Side panel */}
            <div className="lg:col-span-2 space-y-5">
              {/* Model info */}
              <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Current model
                  </span>
                  {retraining && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-violet-700 dark:text-violet-400" aria-live="polite">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Retraining… epoch {model.epoch} / {model.epochs}
                    </span>
                  )}
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{model.dataset_label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  2 → {model.hidden_size} → {model.class_names.length} network · learning rate {model.learning_rate} ·{" "}
                  {model.epochs} epochs
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Accuracy{" "}
                  <strong className="font-mono text-lg text-slate-900 dark:text-white">
                    {(grid.accuracy * 100).toFixed(1)}%
                  </strong>
                </p>
                <Link to="/train" className="text-xs font-semibold text-violet-700 dark:text-violet-400 hover:underline">
                  Train on a different dataset in Section 4
                </Link>
              </div>

              {/* Probe */}
              <div className="rounded-2xl p-4 border border-dashed border-slate-300 dark:border-slate-700 space-y-1" aria-live="polite">
                <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <MousePointerClick className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  Click anywhere on the map
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Keyboard: Tab to the map, arrow keys to aim, Enter to ask.</p>
                {!probe ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    The network will tell you which class it thinks that spot belongs to, and how sure it is.
                  </p>
                ) : probe.error ? (
                  <p className="text-xs text-rose-600 dark:text-rose-400">{probe.error.message}</p>
                ) : !probe.result ? (
                  <LoadingSpinner label="Asking the network…" />
                ) : (
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    At ({probe.x.toFixed(2)}, {probe.y.toFixed(2)}) it says{" "}
                    <strong className="text-slate-900 dark:text-white">{probe.result.class_name}</strong>,{" "}
                    {Math.round(probe.result.confidence * 100)}% sure.
                  </p>
                )}
              </div>

              {/* Retrain */}
              <fieldset disabled={retraining || training.busy} className="space-y-3">
                <legend className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Retrain with new settings
                </legend>
                <SliderControl
                  label="Learning rate"
                  value={shownLrPosition}
                  min={0}
                  max={60}
                  step={1}
                  format={() => String(learningRate)}
                  accent="accent-violet-600"
                  disabled={retraining}
                  onChange={setLrPosition}
                />
                <SliderControl
                  label="Epochs"
                  value={shownEpochs}
                  min={10}
                  max={500}
                  step={10}
                  format={String}
                  accent="accent-violet-600"
                  disabled={retraining}
                  onChange={setEpochs}
                />
                <button
                  type="button"
                  onClick={retrain}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {retraining ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  {retraining ? "Watch the boundary move…" : "Retrain"}
                </button>
              </fieldset>
              {training.error && <ErrorMessage title={training.error.title} message={training.error.message} />}
              {training.session?.status === "error" && (
                <ErrorMessage title="Retraining stopped" message={training.session.error} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* What Changed? */}
      {before && (
        <div className="rounded-3xl p-5 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              What changed?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {after
                ? "The same network shape and data, trained with different settings."
                : "The comparison appears when retraining finishes."}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <ComparePlot title="Before" grid={before} isDark={isDark} />
            {after ? (
              <ComparePlot title="After" grid={after} isDark={isDark} delta={after.accuracy - before.accuracy} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-sm text-slate-500 dark:text-slate-400 min-h-48">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Retraining…
              </div>
            )}
          </div>
        </div>
      )}

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

/** Crosshair + label for the point the learner clicked. */
function ProbeMarker({ probe }) {
  const x = toPx(probe.x);
  const y = toPy(probe.y);
  const text = probe.result
    ? `${probe.result.class_name} · ${Math.round(probe.result.confidence * 100)}%`
    : "…";
  // Keep the label inside the plot: flip it to the left near the right edge
  const flip = probe.x > 0.35;
  return (
    <g className="pointer-events-none">
      <circle cx={x} cy={y} r={5} fill="none" strokeWidth={2} className="stroke-slate-900 dark:stroke-white" />
      <circle cx={x} cy={y} r={1.5} className="fill-slate-900 dark:fill-white" />
      <text
        x={flip ? x - 8 : x + 8}
        y={y - 7}
        textAnchor={flip ? "end" : "start"}
        stroke="currentColor"
        strokeWidth={3}
        paintOrder="stroke"
        className="text-[8px] font-bold fill-slate-900 dark:fill-white text-white dark:text-slate-900"
      >
        {text}
      </text>
    </g>
  );
}

function ComparePlot({ title, grid, isDark, delta }) {
  const { model } = grid;
  const dataset = { label: model.dataset_label, class_names: model.class_names, points: grid.points, labels: grid.labels };
  return (
    <figure className="space-y-2">
      <DatasetPlot dataset={dataset} markerSize={2.2} predictions={grid.point_predictions}>
        <BoundaryLayer grid={grid} isDark={isDark} />
      </DatasetPlot>
      <figcaption className="flex items-baseline justify-between gap-2">
        <span>
          <span className="font-bold text-slate-900 dark:text-white">{title}</span>{" "}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            lr {model.learning_rate} · {model.epochs} epochs
          </span>
        </span>
        <span className="font-mono font-bold text-slate-900 dark:text-white">
          {(grid.accuracy * 100).toFixed(1)}%
          {delta !== undefined && (
            <span className="ml-1.5 text-xs text-slate-500 dark:text-slate-400">
              ({delta >= 0 ? "+" : "−"}
              {Math.abs(delta * 100).toFixed(1)})
            </span>
          )}
        </span>
      </figcaption>
    </figure>
  );
}

function NoModel({ onUseDefault, state }) {
  return (
    <div className="py-8 max-w-lg mx-auto text-center space-y-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
        <Sparkles className="w-7 h-7" />
      </div>
      <h2 className="font-bold text-lg text-slate-900 dark:text-white">No trained network yet</h2>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        This section shows what a trained network learned. Train one yourself in Section 4, or start with a
        ready-made one trained on XOR.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/train"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-violet-600 hover:bg-violet-700 text-white shadow-sm"
        >
          Go to Section 4
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button
          type="button"
          onClick={onUseDefault}
          disabled={state.busy}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
        >
          {state.busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Use a pretrained network
        </button>
      </div>
      {state.error && <ErrorMessage title={state.error.title} message={state.error.message} />}
    </div>
  );
}

// "Explain this step" for Section 5: how the heatmap is produced
function BoundaryWalkthrough({ grid }) {
  const cells = grid.resolution * grid.resolution;
  const wrong = grid.point_predictions.filter((p, i) => p !== grid.labels[i]).length;
  return (
    <>
      <p>
        <strong>How this picture is made:</strong> the square is split into a {grid.resolution} × {grid.resolution}{" "}
        grid. The (x, y) position of each of those {cells.toLocaleString()} cells is fed through the trained network,
        exactly like a forward pass. Each cell is coloured by the class the network picks, and the colour is stronger
        when the network is more confident.
      </p>
      <p>
        <strong>The boundary</strong> is where the colours meet: the line where the network changes its mind. Its
        curves come from the hidden layer&apos;s activations; without them it could only draw a straight line.
      </p>
      <p>
        <strong>The dots</strong> are the real training data. {wrong === 0
          ? "Every dot sits in a region of its own colour, so the network gets all of them right."
          : `${wrong} of ${grid.labels.length} sit on the wrong side (marked ✕). That's the ${(100 - grid.accuracy * 100).toFixed(1)}% it gets wrong.`}{" "}
        Click anywhere to ask the network about a brand-new point.
      </p>
    </>
  );
}
