import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import SectionHeader from "../components/SectionHeader";
import ConceptGrid from "../components/ConceptGrid";
import GlossaryTerm from "../components/GlossaryTerm";
import Tooltip from "../components/Tooltip";
import SliderControl from "../components/SliderControl";
import ExplainPanel from "../components/ExplainPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ForwardPassDiagram from "../components/forward/ForwardPassDiagram";
import { useProgress } from "../hooks/useProgress";
import { useArchitecture } from "../hooks/useArchitecture";
import { runForwardPass, toApiError, isCancel } from "../api/client";
import { DEFAULT_ARCHITECTURE, toLayerSizes, describeLayer } from "../utils/architecture";
import { ACTIVATIONS } from "../utils/neuronMath";
import {
  Play,
  Shuffle,
  Dices,
  SkipForward,
  RotateCcw,
  HelpCircle,
  Layers,
  ArrowRight,
  Zap,
  Target,
  AlertTriangle,
} from "lucide-react";

const CONCEPTS = [
  {
    icon: ArrowRight,
    title: "Input → output",
    text: (
      <>
        A forward pass takes the input values and pushes them through each layer in turn. Each layer&rsquo;s outputs
        become the next layer&rsquo;s inputs.
      </>
    ),
  },
  {
    icon: Zap,
    title: "Every prediction",
    text: (
      <>
        Whenever an AI recognises a photo or suggests a word, it&rsquo;s running a forward pass, just with millions of
        neurons instead of a few dozen.
      </>
    ),
  },
  {
    icon: AlertTriangle,
    title: "Not trained yet",
    text: (
      <>
        These weights are random, so the answer is meaningless for now. Watch <em>how</em> the numbers flow; Section 4
        is where the network learns.
      </>
    ),
  },
];

/**
 * ForwardPass Page (Section 3)
 *
 * SWE Design Patterns applied:
 * 1. Explicit Async State Machine: `status` is one of idle → loading →
 *    success | error, so the UI can never show a spinner and an error at once.
 * 2. Request Cancellation: each run aborts the previous in-flight request
 *    (AbortController), so a slow old response can't overwrite a newer one.
 *    The request is also aborted if the page unmounts.
 * 3. Staleness Detection: the result remembers the exact request it answers;
 *    if the inputs change afterwards, the UI flags it as out of date instead
 *    of silently showing numbers for different inputs.
 * 4. Timer-Driven Animation via useEffect: auto-play schedules one
 *    `setTimeout` per layer and cleans it up on every change, so pausing,
 *    switching modes or unmounting can't leave stray timers running.
 */

const SPEEDS = [
  { label: "Slow", ms: 1600 },
  { label: "Normal", ms: 900 },
  { label: "Fast", ms: 450 },
];

const FN_LABELS = { ...Object.fromEntries(Object.entries(ACTIVATIONS).map(([k, v]) => [k, v.label])), softmax: "Softmax" };

const randomInputs = (n) => Array.from({ length: n }, () => Math.random().toFixed(2));
const randomSeed = () => Math.floor(Math.random() * 1_000_000);

function parseInput(str) {
  const n = Number(str);
  return str.trim() !== "" && Number.isFinite(n) && n >= 0 && n <= 1 ? n : null;
}

export default function ForwardPass() {
  const { isCompleted, toggleCompleted } = useProgress();
  const { locked } = useArchitecture();
  const sectionId = 3;

  const arch = locked ?? DEFAULT_ARCHITECTURE;
  const archLayers = useMemo(() => toLayerSizes(arch), [arch]);

  // Inputs are kept as strings so the user can type freely ("0.", "") before
  // they become valid numbers; padded/trimmed to the current input layer size.
  const [rawInputs, setRawInputs] = useState(() => Array(arch.inputs).fill("0.50"));
  const inputStrings = Array.from({ length: arch.inputs }, (_, i) => rawInputs[i] ?? "0.50");
  const parsedInputs = inputStrings.map(parseInput);
  const inputsValid = parsedInputs.every((v) => v !== null);

  const [seed, setSeed] = useState(42);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [resultKey, setResultKey] = useState(null);
  const [runId, setRunId] = useState(0);

  const [mode, setMode] = useState("play"); // play | step
  const [speed, setSpeed] = useState(1);
  const [revealed, setRevealed] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);

  const abortRef = useRef(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const payload = { architecture: archLayers, inputs: parsedInputs, activation: arch.activation, seed };
  const payloadKey = JSON.stringify(payload);
  const isStale = result && resultKey !== payloadKey;

  async function run() {
    if (!inputsValid) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    setError(null);
    try {
      const data = await runForwardPass(payload, { signal: controller.signal });
      setResult(data);
      setResultKey(payloadKey);
      setRunId((id) => id + 1);
      setRevealed(0);
      setSelectedNode(null);
      setStatus("success");
    } catch (err) {
      if (isCancel(err)) return; // superseded by a newer run
      setError(toApiError(err));
      setStatus("error");
    }
  }

  // The diagram always draws the network the result came from
  const diagramLayers = result ? result.architecture : archLayers;
  const lastLayer = diagramLayers.length - 1;
  const isDone = result && revealed >= lastLayer;
  const stepMs = SPEEDS[speed].ms;

  // Auto-play: reveal one more layer per tick
  useEffect(() => {
    if (!result || mode !== "play" || revealed >= lastLayer) return;
    const timer = setTimeout(() => setRevealed((r) => r + 1), stepMs);
    return () => clearTimeout(timer);
  }, [result, runId, mode, revealed, lastLayer, stepMs]);

  const replay = () => {
    setRevealed(0);
    setRunId((id) => id + 1);
  };

  const setInputAt = (i, value) =>
    setRawInputs(() => inputStrings.map((v, j) => (j === i ? value : v)));

  // Node shown in the "computation" panel: the clicked one if it's visible,
  // otherwise the first node of the most recently revealed layer.
  const focus =
    result && revealed >= 1
      ? selectedNode && selectedNode.layer <= revealed
        ? selectedNode
        : { layer: revealed, index: 0 }
      : null;

  const takeawayPoints = [
    "A forward pass feeds the inputs through the network one layer at a time until it reaches the output. This is what happens every time an AI makes a prediction.",
    "Each neuron in a layer does exactly what you saw in Section 1: a weighted sum of the previous layer's values plus a bias, then an activation.",
    "With random weights the prediction is meaningless. Training (Section 4) is how the network finds weights that give useful answers.",
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <SectionHeader sectionId={sectionId} title="The Forward Pass">
        Feed numbers in on the left and watch them flow, layer by layer, until a prediction comes
        out on the right. This is the{" "}
        <GlossaryTerm
          term="Forward Pass"
        >
          forward pass
        </GlossaryTerm>
        .
      </SectionHeader>

      {/* Concept Explainer */}
      <ConceptGrid sectionId={sectionId} concepts={CONCEPTS} />

      {/* Simulator */}
      <div className="rounded-3xl p-5 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Architecture source */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="font-bold text-slate-900 dark:text-white font-mono">
              {archLayers.join(" → ")}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              · {ACTIVATIONS[arch.activation].label} hidden layers ·{" "}
              {locked ? (
                "your network from Section 2"
              ) : (
                <>
                  default network.{" "}
                  <Link to="/build" className="text-cyan-700 dark:text-cyan-400 font-semibold hover:underline">
                    Lock your own in Section 2
                  </Link>
                </>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setSeed(randomSeed())}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Dices className="w-3.5 h-3.5" />
            New random weights
            <Tooltip content="Weights are generated from a seed: the same seed always gives the same weights, so re-running with the same inputs gives the same answer.">
              <span className="font-mono text-slate-500">#{seed}</span>
            </Tooltip>
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Diagram */}
          <div className="lg:col-span-3">
            <ForwardPassDiagram
              layers={diagramLayers}
              result={result}
              revealed={revealed}
              runId={runId}
              pulseDuration={(stepMs * 0.8) / 1000}
              selectedNode={focus}
              onSelectNode={setSelectedNode}
            />
            <ExplainPanel className="mt-4">
              <ForwardWalkthrough layers={diagramLayers} result={result} revealed={revealed} />
            </ExplainPanel>
          </div>

          {/* Controls */}
          <div className="space-y-5">
            <fieldset className="space-y-2">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Inputs (0 to 1)
              </legend>
              {inputStrings.map((value, i) => {
                const invalid = parsedInputs[i] === null;
                return (
                  <label key={i} className="flex items-center gap-2">
                    <span className="w-8 text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                      x{i + 1}
                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={1}
                      step={0.01}
                      value={value}
                      onChange={(e) => setInputAt(i, e.target.value)}
                      aria-invalid={invalid}
                      className={`flex-1 min-w-0 px-3 py-1.5 rounded-xl text-sm font-mono bg-slate-50 dark:bg-slate-800 border text-slate-900 dark:text-white focus:outline-none focus:ring-2 ${
                        invalid
                          ? "border-rose-400 focus:ring-rose-500/50"
                          : "border-slate-300 dark:border-slate-700 focus:ring-cyan-500/50"
                      }`}
                    />
                  </label>
                );
              })}
              {!inputsValid && (
                <p className="text-xs text-rose-600 dark:text-rose-400">Each input must be a number from 0 to 1.</p>
              )}
              <button
                type="button"
                onClick={() => setRawInputs(randomInputs(arch.inputs))}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-700 dark:text-cyan-400 hover:underline"
              >
                <Shuffle className="w-3.5 h-3.5" />
                Randomize inputs
              </button>
            </fieldset>

            {/* Mode toggle */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mode
              </span>
              <div role="radiogroup" aria-label="Playback mode" className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                {[
                  ["play", "Auto-play"],
                  ["step", "Step through"],
                ].map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="radio"
                    aria-checked={mode === key}
                    onClick={() => setMode(key)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      mode === key
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {mode === "play" && (
              <SliderControl
                label="Speed"
                value={speed}
                min={0}
                max={SPEEDS.length - 1}
                step={1}
                format={(v) => SPEEDS[v].label}
                accent="accent-cyan-600"
                onChange={setSpeed}
              />
            )}

            {/* Actions */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={run}
                disabled={!inputsValid || status === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-cyan-600 hover:bg-cyan-700 text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {status === "loading" ? (
                  <LoadingSpinner label="" className="[&_svg]:text-white" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                Run Forward Pass
              </button>
              {result && mode === "step" && (
                <button
                  type="button"
                  onClick={() => setRevealed((r) => Math.min(lastLayer, r + 1))}
                  disabled={isDone}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 border-cyan-600 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <SkipForward className="w-4 h-4" />
                  Next Layer
                </button>
              )}
              {result && (isDone || mode === "step") && (
                <button
                  type="button"
                  onClick={replay}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {mode === "step" ? "Back to start" : "Replay"}
                </button>
              )}
            </div>
          </div>
        </div>

        {status === "error" && error && (
          <ErrorMessage title={error.title} message={error.message} details={error.details} onRetry={run} />
        )}

        {isStale && (
          <p className="flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            The inputs or weights changed since this run. Press Run Forward Pass to update.
          </p>
        )}

        {/* Computation + Output */}
        <div className="grid md:grid-cols-2 gap-6">
          <ComputationPanel result={result} revealed={revealed} focus={focus} />
          <OutputPanel result={result} isDone={isDone} />
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

/** Shows the math for one node of the latest revealed layer: z = Σ w·a + b → activation. */
function ComputationPanel({ result, revealed, focus }) {
  const panel = "rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3";
  const heading = (
    <div className="flex items-center gap-1.5">
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        What this layer computed
      </h3>
      <Tooltip content="Click any lit node in the diagram to see its calculation.">
        <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
      </Tooltip>
    </div>
  );

  if (!result) {
    return (
      <div className={panel}>
        {heading}
        <p className="text-sm text-slate-500 dark:text-slate-400">Run a forward pass to see the math.</p>
      </div>
    );
  }
  if (!focus) {
    return (
      <div className={panel}>
        {heading}
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <strong>Input layer:</strong> no math here. These nodes just hold your input values (
          <span className="font-mono">{result.layers[0].activation.map((v) => v.toFixed(2)).join(", ")}</span>).
          {revealed < result.layers.length - 1 && " Next, every hidden neuron combines them."}
        </p>
      </div>
    );
  }

  const layer = result.layers[focus.layer];
  const prev = result.layers[focus.layer - 1].activation;
  const w = result.weights[focus.layer - 1][focus.index];
  const b = result.biases[focus.layer - 1][focus.index];
  const z = layer.pre_activation[focus.index];
  const a = layer.activation[focus.index];
  const fn = FN_LABELS[layer.activation_fn];

  return (
    <div className={panel}>
      {heading}
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        {layer.name}, node {focus.index + 1}
      </p>
      <div className="font-mono text-xs text-slate-600 dark:text-slate-400 space-y-1.5 overflow-x-auto">
        <p className="leading-relaxed">
          z ={" "}
          {/* Each term stays on one line; the " + " between terms (outside the
              nowrap spans) is where long sums are allowed to wrap. */}
          {w.map((wi, i) => (
            <Fragment key={i}>
              {i > 0 && " + "}
              <span className="whitespace-nowrap">
                <span className={wi >= 0 ? "text-blue-600 dark:text-blue-400" : "text-rose-600 dark:text-rose-400"}>
                  ({wi.toFixed(2)})
                </span>
                ({prev[i].toFixed(2)})
              </span>
            </Fragment>
          ))}
          {" + "}
          <span className="whitespace-nowrap text-amber-600 dark:text-amber-400">({b.toFixed(2)})</span>
        </p>
        <p>
          z = <strong className="text-slate-900 dark:text-white">{z.toFixed(3)}</strong>
        </p>
        <p>
          {layer.activation_fn === "softmax" ? (
            <>
              Softmax(all z) → <strong className="text-cyan-600 dark:text-cyan-400 text-sm">{a.toFixed(3)}</strong>
            </>
          ) : (
            <>
              {fn}({z.toFixed(3)}) = <strong className="text-cyan-600 dark:text-cyan-400 text-sm">{a.toFixed(3)}</strong>
            </>
          )}
        </p>
      </div>
      {layer.activation_fn === "softmax" && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Softmax looks at every output&rsquo;s z together and turns them into probabilities that add up to 1.
        </p>
      )}
      {/* Whole layer at a glance */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {layer.activation.map((v, i) => (
          <span
            key={i}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-mono ${
              i === focus.index
                ? "bg-cyan-600 text-white"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            }`}
          >
            {v.toFixed(2)}
          </span>
        ))}
      </div>
    </div>
  );
}

function OutputPanel({ result, isDone }) {
  const panel = "rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3";
  const heading = (
    <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
      <Target className="w-3.5 h-3.5" />
      Output
    </h3>
  );

  if (!result || !isDone) {
    return (
      <div className={panel}>
        {heading}
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {result ? "Still flowing… the output appears when the last layer is reached." : "No prediction yet."}
        </p>
      </div>
    );
  }

  const multi = result.output.length > 1;
  return (
    <div className={panel} aria-live="polite">
      {heading}
      {multi ? (
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Prediction:{" "}
          <strong className="text-amber-600 dark:text-amber-400 text-lg">Output #{result.prediction + 1}</strong>{" "}
          (highest probability)
        </p>
      ) : (
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Score:{" "}
          <strong className="text-amber-600 dark:text-amber-400 text-lg">{result.output[0].toFixed(3)}</strong>{" "}
          <span className="text-slate-500 dark:text-slate-400">(sigmoid, between 0 and 1)</span>
        </p>
      )}
      <ul className="space-y-2">
        {result.output.map((v, i) => {
          const top = multi && i === result.prediction;
          return (
            <li key={i} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className={top ? "font-bold text-amber-700 dark:text-amber-400" : "text-slate-600 dark:text-slate-400"}>
                  Output #{i + 1}
                </span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{(v * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${top || !multi ? "bg-amber-500" : "bg-slate-400 dark:bg-slate-600"}`}
                  style={{ width: `${v * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// "Explain this step" for Section 3: what the layer that just lit up did
function ForwardWalkthrough({ layers, result, revealed }) {
  if (!result) {
    return (
      <p>
        Nothing has run yet. Press <strong>Run Forward Pass</strong>: your inputs enter on the left, and each layer
        lights up as it&apos;s computed. Hover or Tab to any circle to see its value.
      </p>
    );
  }
  const last = layers.length - 1;
  const { name } = describeLayer(revealed, layers.length);
  if (revealed === 0) {
    return (
      <p>
        <strong>Step 0: {name}.</strong> Your {layers[0]} input values are placed on the left. No maths happens here;
        they&apos;re just the starting numbers. Press <strong>Next Layer</strong> (or watch auto-play) to push them forward.
      </p>
    );
  }
  const trace = result.layers[revealed];
  const prev = layers[revealed - 1];
  const size = layers[revealed];
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  return (
    <>
      <p>
        <strong>
          Step {revealed} of {last}: {name}.
        </strong>{" "}
        {size === 1 ? "Its single neuron" : `Each of its ${size} neurons`} took all {prev} values from the previous layer, multiplied each by its
        own weight (the lines; thicker = bigger), added a bias, and passed the total through {trace.activation_fn}.
      </p>
      <p>
        That&apos;s {size} × {prev} = {plural(size * prev, "multiplication")} in this step alone, producing{" "}
        {plural(size, "new number")}
        {revealed === last ? "." : ", which become the input to the next layer."}
      </p>
      {revealed === last ? (
        <p>
          <strong>Done.</strong> {size === 1 ? "The output value is" : "The output values are"} the network&apos;s answer
          {layers[last] > 1 ? `; the largest (neuron ${result.prediction + 1}, ringed in amber) is its prediction` : ""}.
          These weights are random, so the answer is meaningless until Section 4 trains them.
        </p>
      ) : (
        <p>Click a lit neuron to see its exact sum in the panel below.</p>
      )}
    </>
  );
}
