import { useId } from "react";

/**
 * SliderControl Component
 *
 * Labelled range input with a live numeric readout. Reused by every section
 * that has tunable parameters (weights, layer sizes, learning rate…).
 *
 * SWE Design Patterns applied:
 * 1. Controlled Component: the parent owns `value`; the slider only reports
 *    changes through `onChange(number)`.
 * 2. Accessible Labelling: `useId()` links <label> ↔ <input> with a unique id,
 *    so screen readers announce the name and clicking the label focuses it.
 * 3. Adapter: converts the DOM's string `event.target.value` into a number
 *    once, here, so callers never deal with strings.
 */
export default function SliderControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => v.toFixed(1),
  hint,
  accent = "accent-blue-600",
  disabled = false,
}) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
          {hint && (
            <span className="ml-1.5 font-normal text-slate-400 dark:text-slate-500">{hint}</span>
          )}
        </label>
        <span className="text-xs font-mono font-bold tabular-nums text-slate-900 dark:text-white">
          {format(value)}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className={`w-full h-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${accent}`}
      />
    </div>
  );
}
