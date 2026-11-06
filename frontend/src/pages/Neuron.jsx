import { useState } from "react";
import SectionNavFooter from "../components/SectionNavFooter";
import KeyTakeaway from "../components/KeyTakeaway";
import GlossaryTerm from "../components/GlossaryTerm";
import Tooltip from "../components/Tooltip";
import SliderControl from "../components/SliderControl";
import ExplainPanel from "../components/ExplainPanel";
import NeuronDiagram from "../components/neuron/NeuronDiagram";
import ActivationChart from "../components/neuron/ActivationChart";
import { useProgress } from "../hooks/useProgress";
import {
  ACTIVATIONS,
  BIAS_RANGE,
  INPUT_RANGE,
  WEIGHT_RANGE,
  computeNeuron,
  fmt,
  outputToGlow,
} from "../utils/neuronMath";
import { CircleDot, HelpCircle, RotateCcw, Umbrella, Calculator } from "lucide-react";

/**
 * Neuron Page (Section 1)
 *
 * SWE Design Patterns applied:
 * 1. Container / Presentational Split: this page owns all neuron state and
 *    passes plain values down to NeuronDiagram, ActivationChart and sliders.
 * 2. Derived State: weighted sum, output and glow are *computed* during
 *    render from inputs/weights/bias, never stored in their own useState —
 *    so they can't go stale.
 * 3. Immutable Updates: array state is replaced with a mapped copy, never
 *    mutated in place, so React sees a new reference and re-renders.
 */

// The umbrella analogy gives each abstract input a concrete meaning.
const INPUT_LABELS = ["Rain", "Clouds", "Walk"];
const INPUT_DESCRIPTIONS = [
  "Forecast chance of rain",
  "How dark the clouds look",
  "How far you're walking",
];

const DEFAULTS = {
  inputs: [0.8, 0.6, 0.3],
  weights: [1.5, 0.8, -0.6],
  bias: -0.5,
  activation: "sigmoid",
};

const SUBSCRIPTS = "₁₂₃";

const STEPS = [
  { title: "Takes inputs", text: "A few numbers describing the situation." },
  {
    title: "Weighs each one",
    text: "Multiplies each input by a weight: how much it matters. Negative means “this argues against.”",
  },
  { title: "Adds a bias", text: "A built-in lean toward yes or no, before looking at any input." },
  { title: "Activates", text: "An activation function reshapes the total into the final output." },
];

export default function Neuron() {
  const { isCompleted, toggleCompleted } = useProgress();
  const sectionId = 1;

  const [inputs, setInputs] = useState(DEFAULTS.inputs);
  const [weights, setWeights] = useState(DEFAULTS.weights);
  const [bias, setBias] = useState(DEFAULTS.bias);
  const [activation, setActivation] = useState(DEFAULTS.activation);
  // Bumped on every change to replay the data-flow animation
  const [pulseKey, setPulseKey] = useState(0);

  const pulse = () => setPulseKey((k) => k + 1);

  const updateAt = (setter) => (index, value) => {
    setter((prev) => prev.map((v, i) => (i === index ? value : v)));
    pulse();
  };
  const setInputAt = updateAt(setInputs);
  const setWeightAt = updateAt(setWeights);

  const reset = () => {
    setInputs(DEFAULTS.inputs);
    setWeights(DEFAULTS.weights);
    setBias(DEFAULTS.bias);
    setActivation(DEFAULTS.activation);
    pulse();
  };

  // Derived values: recomputed each render, never stored
  const { weightedSum, output } = computeNeuron({ inputs, weights, bias, activation });
  const glow = outputToGlow(output, activation);
  const act = ACTIVATIONS[activation];
  // All three activations are increasing, so "output above activation(0)" is
  // the same test as "z > 0" — one decision rule works for every activation.
  const bringUmbrella = weightedSum > 0;

  const takeawayPoints = [
    "A neuron multiplies each input by its weight, adds them up, and adds a bias: z = w₁x₁ + w₂x₂ + w₃x₃ + b.",
    "The activation function then reshapes z. Without it, stacking layers would collapse into one big linear equation, so networks could only learn straight lines.",
    "Weights set how much each input matters and in which direction (positive or negative). The bias shifts how easily the neuron fires.",
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
          >
            weights
          </GlossaryTerm>
          , shifted by a{" "}
          <GlossaryTerm
            term="Bias"
          >
            bias
          </GlossaryTerm>
          , and squashed through an{" "}
          <GlossaryTerm
            term="Activation Function"
          >
            activation function
          </GlossaryTerm>
          .
        </p>
      </div>

      {/* Concept Explainer: the 4 steps, matching left → right in the diagram */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">What a neuron does</h2>
        </div>
        <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800"
            >
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Step {i + 1}</span>
              <p className="font-semibold text-sm text-slate-900 dark:text-white">{step.title}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Interactive Neuron, framed by the umbrella example */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Scenario banner: tells the learner what the demo below represents */}
        <div className="p-5 sm:p-6 bg-amber-50/70 dark:bg-amber-950/20 border-b border-amber-200 dark:border-amber-900/60">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Try it yourself · Example
              </span>
              <div className="flex items-center gap-2">
                <Umbrella className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                  Should I bring an umbrella?
                </h2>
                <Tooltip content="Edge thickness shows how big each weight is. Blue edges push the output up, rose edges push it down.">
                  <HelpCircle className="w-4 h-4 text-slate-400 cursor-help" />
                </Tooltip>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                The neuron below makes this decision. Rain matters a lot (big weight), clouds a bit,
                and a long walk argues <em>against</em> carrying one (negative weight). The bias is
                your personality: a negative bias means you&rsquo;d rather not carry things.
              </p>
              {/* Input chips: link each story element to its x in the diagram */}
              <div className="flex flex-wrap gap-2 pt-1">
                {INPUT_LABELS.map((name, i) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/60 text-slate-700 dark:text-slate-300"
                  >
                    <strong className="font-mono">x{SUBSCRIPTS[i]}</strong>
                    {INPUT_DESCRIPTIONS[i]}
                  </span>
                ))}
              </div>
            </div>

            {/* Live verdict, driven by the neuron's output */}
            <div
              aria-live="polite"
              className={`shrink-0 rounded-2xl px-5 py-4 text-center border-2 transition-colors ${
                bringUmbrella
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
              }`}
            >
              <span className="block text-[11px] font-bold uppercase tracking-wider opacity-80">
                Neuron says
              </span>
              <span className="flex items-center justify-center gap-1.5 text-lg font-extrabold">
                {bringUmbrella && <Umbrella className="w-4 h-4" />}
                {bringUmbrella ? "Bring it" : "Leave it"}
              </span>
              <span className="block text-[11px] opacity-80 font-mono">
                {activation === "sigmoid"
                  ? `${Math.round(output * 100)}% sure`
                  : `z ${weightedSum > 0 ? ">" : "≤"} 0`}
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-8 space-y-6">
          <div className="flex justify-end -mb-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Diagram */}
            <div className="lg:col-span-3 flex flex-col justify-center">
              <NeuronDiagram
                inputs={inputs}
                weights={weights}
                labels={INPUT_LABELS}
                weightedSum={weightedSum}
                output={output}
                activationLabel={act.label}
                glow={glow}
                pulseKey={pulseKey}
              />
            </div>

            {/* Controls */}
            <div className="lg:col-span-2 space-y-5">
              <fieldset className="space-y-3">
                <legend className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Inputs (x)
                </legend>
                {inputs.map((x, i) => (
                  <SliderControl
                    key={`x-${i}`}
                    label={`x${SUBSCRIPTS[i]} · ${INPUT_LABELS[i]}`}
                    hint={INPUT_DESCRIPTIONS[i]}
                    value={x}
                    {...INPUT_RANGE}
                    format={(v) => v.toFixed(2)}
                    accent="accent-slate-500"
                    onChange={(v) => setInputAt(i, v)}
                  />
                ))}
              </fieldset>

              <fieldset className="space-y-3">
                <legend className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Weights (w) &amp; bias (b)
                </legend>
                {weights.map((w, i) => (
                  <SliderControl
                    key={`w-${i}`}
                    label={`w${SUBSCRIPTS[i]}`}
                    value={w}
                    {...WEIGHT_RANGE}
                    accent={w >= 0 ? "accent-blue-600" : "accent-rose-500"}
                    onChange={(v) => setWeightAt(i, v)}
                  />
                ))}
                <SliderControl
                  label="b (bias)"
                  value={bias}
                  {...BIAS_RANGE}
                  accent="accent-amber-500"
                  onChange={(v) => {
                    setBias(v);
                    pulse();
                  }}
                />
              </fieldset>

              <div className="space-y-1.5">
                <label
                  htmlFor="activation-select"
                  className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Activation function
                </label>
                <select
                  id="activation-select"
                  value={activation}
                  onChange={(e) => {
                    setActivation(e.target.value);
                    pulse();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-sm font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  {Object.entries(ACTIVATIONS).map(([key, a]) => (
                    <option key={key} value={key}>
                      {a.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 dark:text-slate-400">{act.blurb}</p>
              </div>
            </div>
          </div>

          {/* Formula + Activation Chart */}
          <div className="grid md:grid-cols-2 gap-6 pt-2">
            <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                The math, live
              </h3>
              <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
                output = {act.label}(w₁x₁ + w₂x₂ + w₃x₃ + b)
              </p>
              <div className="font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-400 space-y-1 overflow-x-auto">
                <p className="whitespace-nowrap">
                  z ={" "}
                  {weights.map((w, i) => (
                    <span key={i}>
                      {i > 0 && " + "}
                      <span className={w >= 0 ? "text-blue-600 dark:text-blue-400" : "text-rose-600 dark:text-rose-400"}>
                        ({fmt(w, 1)})
                      </span>
                      ({fmt(inputs[i])})
                    </span>
                  ))}{" "}
                  + <span className="text-amber-600 dark:text-amber-400">({fmt(bias, 1)})</span>
                </p>
                <p>
                  z = <strong className="text-slate-900 dark:text-white">{fmt(weightedSum)}</strong>
                </p>
                <p>
                  output = {act.label}({fmt(weightedSum)}) ={" "}
                  <strong className="text-amber-600 dark:text-amber-400 text-base">{fmt(output, 3)}</strong>
                </p>
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {act.label} curve: where your neuron lands
              </h3>
              <ActivationChart activation={activation} weightedSum={weightedSum} output={output} />
            </div>
          </div>

          <ExplainPanel>
            <NeuronWalkthrough
              inputs={inputs}
              weights={weights}
              bias={bias}
              weightedSum={weightedSum}
              output={output}
              actLabel={act.label}
              bringUmbrella={bringUmbrella}
            />
          </ExplainPanel>
        </div>
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

// "Explain this step" for Section 1: the neuron's calculation with the live numbers
function NeuronWalkthrough({ inputs, weights, bias, weightedSum, output, actLabel, bringUmbrella }) {
  const products = inputs.map((x, i) => weights[i] * x);
  const biggest = products.reduce((best, p, i) => (Math.abs(p) > Math.abs(products[best]) ? i : best), 0);
  return (
    <ol className="list-decimal pl-5 space-y-2">
      <li>
        <strong>Weigh each input.</strong>{" "}
        {products.map((p, i) => (
          <span key={i}>
            {INPUT_LABELS[i]}: {fmt(weights[i], 1)} × {fmt(inputs[i])} = <span className="font-mono">{fmt(p)}</span>
            {i < products.length - 1 ? "; " : ". "}
          </span>
        ))}
        {INPUT_LABELS[biggest]} has the biggest say right now
        {products[biggest] < 0 ? ", and it's voting against the umbrella" : ""}.
      </li>
      <li>
        <strong>Add them up, plus the bias.</strong> {products.map((p) => fmt(p)).join(" + ")} + {fmt(bias, 1)} ={" "}
        <span className="font-mono font-semibold">z = {fmt(weightedSum)}</span>. The bias is a head start (or a
        handicap) that doesn&apos;t depend on any input.
      </li>
      <li>
        <strong>Squash with the activation.</strong> {actLabel}({fmt(weightedSum)}) ={" "}
        <span className="font-mono font-semibold">{fmt(output, 3)}</span>. That&apos;s the dot on the curve above.
      </li>
      <li>
        <strong>Decide.</strong> z is {weightedSum > 0 ? "above" : "at or below"} 0, so the neuron says{" "}
        <strong>{bringUmbrella ? "bring the umbrella" : "leave it at home"}</strong>. Try dragging the bias until it flips.
      </li>
    </ol>
  );
}
