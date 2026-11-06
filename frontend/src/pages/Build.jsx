import { useMemo, useState } from "react";
import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import Tooltip from "../components/Tooltip";
import SliderControl from "../components/SliderControl";
import ExplainPanel from "../components/ExplainPanel";
import NetworkDiagram from "../components/build/NetworkDiagram";
import { useProgress } from "../hooks/useProgress";
import { useArchitecture } from "../hooks/useArchitecture";
import { ACTIVATIONS } from "../utils/neuronMath";
import {
  ARCH_LIMITS,
  DEFAULT_ARCHITECTURE,
  computeStats,
  sameArchitecture,
  toLayerSizes,
} from "../utils/architecture";
import {
  Layers,
  HelpCircle,
  Lock,
  LockOpen,
  CheckCircle2,
  RotateCcw,
  ArrowRightLeft,
  Network,
  TrendingUp,
} from "lucide-react";

/**
 * Build Page (Section 2)
 *
 * SWE Design Patterns applied:
 * 1. Draft vs. Committed State: the sliders edit a local *draft* config; the
 *    "Lock" button *commits* it to storage via useArchitecture. The UI compares
 *    the two to show "Locked", "Unsaved changes" or "Not locked yet".
 * 2. Lazy State Initialisation: the draft starts from the locked architecture
 *    (if any) via `useState(() => ...)`, so returning learners see their
 *    network, not the default.
 * 3. Derived State: layer sizes and stats are computed from the draft, never
 *    stored separately.
 */

const CONCEPTS = [
  {
    icon: Layers,
    title: "Layers",
    text: "Data enters at the input layer, is transformed by one or more hidden layers, and comes out at the output layer as the prediction.",
  },
  {
    icon: ArrowRightLeft,
    title: "Fully connected",
    text: "Every neuron is wired to every neuron in the next layer. Each wire has its own weight, just like the three weights in Section 1.",
  },
  {
    icon: TrendingUp,
    title: "Why depth matters",
    text: "Each hidden layer builds on the previous one's output, so deeper networks can combine simple patterns into more complex ones.",
  },
];

export default function Build() {
  const { isCompleted, toggleCompleted } = useProgress();
  const { locked, lock, unlock } = useArchitecture();
  const sectionId = 2;

  const [config, setConfig] = useState(() => locked ?? DEFAULT_ARCHITECTURE);
  const setField = (key) => (value) => setConfig((prev) => ({ ...prev, [key]: value }));

  // Memoised so NetworkDiagram gets a stable array (and skips re-layout)
  // on renders where the config didn't change, e.g. hovering
  const layers = useMemo(() => toLayerSizes(config), [config]);
  const stats = computeStats(layers);

  const isLocked = sameArchitecture(config, locked);
  const lockStatus = isLocked ? "locked" : locked ? "changed" : "none";

  const takeawayPoints = [
    "A network is a stack of layers: an input layer, one or more hidden layers, and an output layer.",
    "In a fully connected network every neuron connects to every neuron in the next layer, so the number of weights grows quickly (layer size × next layer size).",
    "Wider layers can detect more patterns at once; deeper networks can combine simple patterns into complex ones.",
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
          One neuron can only draw a straight line. Connect many of them into{" "}
          <GlossaryTerm
            term="Hidden Layer"
          >
            hidden layers
          </GlossaryTerm>{" "}
          and the network can learn far more complex patterns. Design your own below.
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
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Builder */}
      <div className="rounded-3xl p-5 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Design your network</h2>
            <Tooltip content="Hover a node to see its layer, or hover a connection to see its weight.">
              <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
            </Tooltip>
          </div>
          <button
            type="button"
            onClick={() => setConfig(DEFAULT_ARCHITECTURE)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="space-y-4 lg:order-2">
            <SliderControl
              label="Input nodes"
              value={config.inputs}
              {...ARCH_LIMITS.inputs}
              step={1}
              format={String}
              accent="accent-sky-500"
              onChange={setField("inputs")}
            />
            <SliderControl
              label="Hidden layers"
              value={config.hiddenLayers}
              {...ARCH_LIMITS.hiddenLayers}
              step={1}
              format={String}
              accent="accent-violet-500"
              onChange={setField("hiddenLayers")}
            />
            <SliderControl
              label="Nodes per hidden layer"
              value={config.hiddenSize}
              {...ARCH_LIMITS.hiddenSize}
              step={1}
              format={String}
              accent="accent-violet-500"
              onChange={setField("hiddenSize")}
            />
            <SliderControl
              label="Output nodes"
              value={config.outputs}
              {...ARCH_LIMITS.outputs}
              step={1}
              format={String}
              accent="accent-amber-500"
              onChange={setField("outputs")}
            />
            <div className="space-y-1.5">
              <label
                htmlFor="hidden-activation"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Hidden layer activation
              </label>
              <select
                id="hidden-activation"
                value={config.activation}
                onChange={(e) => setField("activation")(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {Object.entries(ACTIVATIONS).map(([key, a]) => (
                  <option key={key} value={key}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Diagram */}
          <div className="lg:col-span-3 lg:order-1">
            <NetworkDiagram layers={layers} activationLabel={ACTIVATIONS[config.activation].label} />
            <ExplainPanel className="mt-4">
              <BuildWalkthrough layers={layers} stats={stats} activationLabel={ACTIVATIONS[config.activation].label} />
            </ExplainPanel>
          </div>
        </div>

        {/* Stats */}
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Layers" value={stats.layers} note={`1 input · ${stats.hiddenLayers} hidden · 1 output`} />
          <Stat label="Neurons" value={stats.neurons} note={`+ ${stats.inputNodes} input ${stats.inputNodes === 1 ? "node" : "nodes"} (they only hold data)`} />
          <Stat label="Weights" value={stats.weights} note="one per connection" />
          <Stat label="Parameters" value={stats.parameters} note={`${stats.weights} weights + ${stats.biases} biases`} />
        </dl>

        {/* Lock architecture */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl p-4 border ${
            lockStatus === "locked"
              ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
              : "bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="text-sm text-slate-600 dark:text-slate-400" aria-live="polite">
            {lockStatus === "locked" && (
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Locked: {layers.join(" → ")}. Section 3 will run data through this network.
              </span>
            )}
            {lockStatus === "changed" && (
              <span>
                You have changes that aren&rsquo;t locked. Section 3 still uses{" "}
                <strong className="font-mono">{toLayerSizes(locked).join(" → ")}</strong>.
              </span>
            )}
            {lockStatus === "none" && (
              <span>Happy with it? Lock it in to carry this network into the next sections.</span>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {locked && (
              <button
                type="button"
                onClick={unlock}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <LockOpen className="w-3.5 h-3.5" />
                Unlock
              </button>
            )}
            <button
              type="button"
              onClick={() => lock(config)}
              disabled={isLocked}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-95 disabled:bg-emerald-600 disabled:cursor-default disabled:active:scale-100"
            >
              {isLocked ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isLocked ? "Locked" : locked ? "Update Locked Architecture" : "Lock This Architecture"}
            </button>
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

function Stat({ label, value, note }) {
  return (
    <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
      <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </dt>
      <dd className="text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">{value}</dd>
      <dd className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{note}</dd>
    </div>
  );
}

// "Explain this step" for Section 2: how the diagram and its counts relate
function BuildWalkthrough({ layers, stats, activationLabel }) {
  const pairs = layers.slice(1).map((n, i) => `${layers[i]} × ${n}`);
  return (
    <>
      <p>
        <strong>Reading the diagram:</strong> each column is a layer, each circle a neuron, and each line a weight. Data
        flows left to right. Input circles only hold numbers; every other circle runs the Section 1 calculation with{" "}
        {activationLabel}.
      </p>
      <p>
        <strong>Counting the weights:</strong> every neuron connects to every neuron in the next layer, so each pair of
        neighbouring layers adds <em>left size × right size</em> lines: {pairs.join(" + ")} ={" "}
        <strong>{stats.weights}</strong>. Add one bias per non-input neuron ({stats.biases}) to get{" "}
        <strong>{stats.parameters}</strong> numbers that training will tune.
      </p>
      <p>
        <strong>Try it:</strong> add one neuron to a middle layer and watch the weight count jump by the size of
        <em> both</em> its neighbours.
      </p>
    </>
  );
}
