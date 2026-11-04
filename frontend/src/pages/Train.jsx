import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import SliderControl from "../components/SliderControl";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import DatasetPlot, { ClassLegend } from "../components/train/DatasetPlot";
import MetricChart from "../components/train/MetricChart";
import WeightsDiagram from "../components/train/WeightsDiagram";
import { useProgress } from "../hooks/useProgress";
import { useTraining } from "../hooks/useTraining";
import { getDataset, toApiError } from "../api/client";
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Repeat,
  TrendingDown,
  Footprints,
  CalendarClock,
  ArrowRight,
  PartyPopper,
  CheckCircle2,
  Loader2,
  AlertTriangle,
} from "lucide-react";

/**
 * Train Page (Section 4)
 *
 * SWE Design Patterns applied:
 * 1. Server-Owned Process, Client-Owned View: training runs on the backend;
 *    the page only renders snapshots delivered by `useTraining` polling.
 * 2. Log-Scale Slider Adapter: the learning-rate slider moves linearly over
 *    an integer "position" that is mapped to 10^(−3 + position/20), so each
 *    decade (0.001 → 0.01 → 0.1 → 1) gets the same slider distance.
 * 3. Settings Lock While Active: knobs are disabled while a run is running or
 *    paused, so the settings shown always match the run being shown.
 * 4. Parallel Fetch on Mount: the three dataset previews load together with
 *    Promise.all, with one loading and one error state.
 */

const DATASETS = [
  { name: "xor", blurb: "Opposite corners belong together. One straight line can't separate them." },
  { name: "circle", blurb: "Is the point inside the circle, or out in the corners of the square?" },
  { name: "clusters", blurb: "Three groups to tell apart, so the network needs three outputs." },
];

// Learning-rate slider: position 0..60 → 0.001..1 on a log scale (20 steps per ×10)
const LR_POSITIONS = 60;
const positionToLr = (p) => Number((10 ** (-3 + p / 20)).toPrecision(2));

const STATUS_LABELS = {
  running: { text: "Training…", icon: Loader2, spin: true, cls: "text-emerald-700 dark:text-emerald-400" },
  paused: { text: "Paused", icon: Pause, cls: "text-amber-700 dark:text-amber-400" },
  done: { text: "Done ✓", icon: CheckCircle2, cls: "text-emerald-700 dark:text-emerald-400" },
  stopped: { text: "Stopped", icon: AlertTriangle, cls: "text-slate-600 dark:text-slate-400" },
  error: { text: "Training failed", icon: AlertTriangle, cls: "text-rose-700 dark:text-rose-400" },
};

const CONCEPTS = [
  {
    icon: Repeat,
    title: "Training",
    text: "Show the network an example, compare its answer to the correct one, adjust the weights a little. Repeat thousands of times.",
  },
  {
    icon: TrendingDown,
    title: "Loss",
    text: "One number for how wrong the network is right now. High loss means bad guesses; training is the hunt for low loss.",
  },
  {
    icon: Footprints,
    title: "Gradient descent",
    text: "For every weight, work out which direction would lower the loss, then take a small step that way. The learning rate is the step size.",
  },
  {
    icon: CalendarClock,
    title: "Epochs",
    text: "One epoch is one full pass through every example in the dataset. Networks usually need many epochs to learn.",
  },
];

export default function Train() {
  const { isCompleted, toggleCompleted } = useProgress();
  const sectionId = 4;
  const training = useTraining();
  const { session, history } = training;

  // Dataset previews
  const [datasets, setDatasets] = useState(null);
  const [datasetError, setDatasetError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0); // bump to refetch after an error
  useEffect(() => {
    const controller = new AbortController();
    Promise.all(DATASETS.map((d) => getDataset(d.name, { signal: controller.signal })))
      .then((list) => setDatasets(Object.fromEntries(list.map((d) => [d.name, d]))))
      .catch((err) => {
        if (!controller.signal.aborted) setDatasetError(toApiError(err));
      });
    return () => controller.abort();
  }, [reloadKey]);
  const retryDatasets = () => {
    setDatasetError(null);
    setReloadKey((k) => k + 1);
  };

  // Settings
  const [dataset, setDataset] = useState("xor");
  const [lrPosition, setLrPosition] = useState(40); // 0.1
  const [epochs, setEpochs] = useState(200);
  const [hiddenSize, setHiddenSize] = useState(8);
  const learningRate = positionToLr(lrPosition);

  const status = session?.status;
  const active = status === "running" || status === "paused";
  const done = status === "done";
  const latest = history.at(-1);
  const statusInfo = status && STATUS_LABELS[status];
  const shownDataset = datasets?.[session?.dataset ?? dataset];

  const start = () => training.start({ dataset, learningRate, epochs, hiddenSize });

  const takeawayPoints = [
    "Training is a loop: make a prediction, measure how wrong it is (the loss), nudge every weight to make the loss smaller, repeat.",
    "The learning rate is the step size. Too small and learning crawls; too large and the network overshoots and never settles.",
    "Watch the weights: training doesn't change the network's shape, only the strength and sign of its connections.",
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
          In Section 3 the weights were random. Now the network learns its own: watch the{" "}
          <GlossaryTerm
            term="Loss Function"
          >
            loss
          </GlossaryTerm>{" "}
          fall as{" "}
          <GlossaryTerm
            term="Gradient Descent"
          >
            gradient descent
          </GlossaryTerm>{" "}
          adjusts the weights, epoch after epoch.
        </p>
      </div>

      {/* Concept Explainer */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CONCEPTS.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Setup */}
      <div className="rounded-3xl p-5 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">1. Choose a dataset</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Each dot is one example. The network sees its (x, y) position and must learn its class.
          </p>
        </div>

        {datasetError ? (
          <ErrorMessage
            title={datasetError.title}
            message={datasetError.message}
            details={datasetError.details}
            onRetry={retryDatasets}
          />
        ) : !datasets ? (
          <div className="py-10 flex justify-center">
            <LoadingSpinner label="Loading datasets…" />
          </div>
        ) : (
          <div role="radiogroup" aria-label="Dataset" className="grid sm:grid-cols-3 gap-4">
            {DATASETS.map(({ name, blurb }) => {
              const d = datasets[name];
              const selected = dataset === name;
              return (
                <button
                  key={name}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  disabled={active}
                  onClick={() => setDataset(name)}
                  className={`text-left rounded-2xl p-3 border-2 transition-all disabled:cursor-not-allowed ${
                    selected
                      ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 disabled:opacity-50"
                  }`}
                >
                  <DatasetPlot dataset={d} markerSize={2.6} />
                  <div className="px-1 pt-2 space-y-1">
                    <p className="font-bold text-sm text-slate-900 dark:text-white">{d.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{blurb}</p>
                    <ClassLegend classNames={d.class_names} />
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-6 items-end pt-2">
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
            <SliderControl
              label="Learning rate"
              hint="step size"
              value={lrPosition}
              min={0}
              max={LR_POSITIONS}
              step={1}
              format={() => String(learningRate)}
              accent="accent-emerald-600"
              disabled={active}
              onChange={setLrPosition}
            />
            <SliderControl
              label="Epochs"
              hint="passes over the data"
              value={epochs}
              min={10}
              max={500}
              step={10}
              format={String}
              accent="accent-emerald-600"
              disabled={active}
              onChange={setEpochs}
            />
            <SliderControl
              label="Hidden layer size"
              hint="neurons"
              value={hiddenSize}
              min={2}
              max={16}
              step={1}
              format={String}
              accent="accent-emerald-600"
              disabled={active}
              onChange={setHiddenSize}
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            {status === "running" ? (
              <button type="button" onClick={training.pause} disabled={training.busy} className={secondaryBtn}>
                <Pause className="w-4 h-4" />
                Pause
              </button>
            ) : status === "paused" ? (
              <button type="button" onClick={training.resume} disabled={training.busy} className={primaryBtn}>
                <Play className="w-4 h-4" />
                Resume
              </button>
            ) : (
              <button type="button" onClick={start} disabled={training.busy || !datasets} className={primaryBtn}>
                <Play className="w-4 h-4" />
                {session ? "Train Again" : "Start Training"}
              </button>
            )}
            <button
              type="button"
              onClick={training.reset}
              disabled={training.busy || !session}
              className={secondaryBtn}
              aria-label="Reset training"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden xl:inline">Reset</span>
            </button>
          </div>
        </div>
        {active && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Settings are locked while this run is in progress. Reset to change them.
          </p>
        )}
        {training.error && (
          <ErrorMessage title={training.error.title} message={training.error.message} details={training.error.details} />
        )}
      </div>

      {/* Live training view */}
      <div className="rounded-3xl p-5 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">2. Watch it learn</h2>
            {statusInfo ? (
              <p className={`flex items-center gap-1.5 text-sm font-semibold ${statusInfo.cls}`} aria-live="polite">
                <statusInfo.icon className={`w-4 h-4 ${statusInfo.spin ? "animate-spin" : ""}`} />
                {statusInfo.text}
              </p>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">Press Start Training to begin.</p>
            )}
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Epoch
            </span>
            <p className="font-mono font-extrabold tabular-nums text-slate-900 dark:text-white leading-none">
              <span className="text-4xl">{session?.epoch ?? 0}</span>
              <span className="text-lg text-slate-400"> / {session?.total_epochs ?? epochs}</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={session?.total_epochs ?? epochs}
          aria-valuenow={session?.epoch ?? 0}
          aria-label="Training progress"
        >
          <div
            className="h-full bg-emerald-500 transition-[width] duration-200"
            style={{ width: `${session ? (session.epoch / session.total_epochs) * 100 : 0}%` }}
          />
        </div>

        {status === "error" && session.error && (
          <ErrorMessage title="Training stopped" message={session.error} />
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <MetricChart
            data={history}
            dataKey="loss"
            title="Loss (lower is better)"
            seriesName="Loss"
            totalEpochs={session?.total_epochs ?? epochs}
            stroke="#2a78d6"
          />
          <MetricChart
            data={history}
            dataKey="accuracy"
            title="Accuracy (higher is better)"
            seriesName="Accuracy"
            totalEpochs={session?.total_epochs ?? epochs}
            yDomain={[0, 1]}
            format={(v) => `${Math.round(v * 100)}%`}
            stroke="#1baf7a"
          />
        </div>

        <div className="grid lg:grid-cols-5 gap-6 items-center">
          <div className="lg:col-span-3 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              The network&rsquo;s weights, live
            </p>
            <WeightsDiagram
              architecture={session?.architecture ?? [2, hiddenSize, shownDataset?.class_names.length ?? 2]}
              weights={session?.weights}
              classNames={shownDataset?.class_names}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Thicker = stronger connection. <span className="text-blue-600 dark:text-blue-400 font-semibold">Blue</span>{" "}
              pushes a neuron up, <span className="text-rose-600 dark:text-rose-400 font-semibold">rose</span> pushes it
              down.
            </p>
          </div>

          {/* Result */}
          <div className="lg:col-span-2">
            {done && latest ? (
              <div className="rounded-2xl p-5 bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 space-y-4" aria-live="polite">
                <p className="flex items-center gap-2 font-extrabold text-lg text-emerald-800 dark:text-emerald-300">
                  <PartyPopper className="w-5 h-5" />
                  Training Complete 🎉
                </p>
                <dl className="grid grid-cols-2 gap-3">
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Final loss</dt>
                    <dd className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">{latest.loss.toFixed(3)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accuracy</dt>
                    <dd className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                      {(latest.accuracy * 100).toFixed(1)}%
                    </dd>
                  </div>
                </dl>
                <Link
                  to="/boundary"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
                >
                  View Decision Boundary
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="rounded-2xl p-5 border border-dashed border-slate-300 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400 space-y-2">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Things to try</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Learning rate 0.001: does it learn at all in 200 epochs?</li>
                  <li>Learning rate 1: how does the loss curve look?</li>
                  <li>Circle vs Square with only 2 hidden neurons.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
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

const primaryBtn =
  "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
const secondaryBtn =
  "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
