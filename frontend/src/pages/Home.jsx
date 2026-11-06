import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, RotateCcw, Trophy, GraduationCap } from "lucide-react";
import { SECTIONS_NAV } from "../components/Header";
import { useProgress } from "../hooks/useProgress";
import ProgressBar from "../components/ProgressBar";
import SectionCard from "../components/SectionCard";
import NetworkBackground from "../components/NetworkBackground";
import { suggestNextSection } from "../utils/suggestNextSection";

/**
 * Home / Landing Page
 *
 * SWE Design Patterns applied:
 * 1. Container Component: owns progress state via `useProgress()` and passes
 *    plain props (`isCompleted`, `isSuggested`) down to presentational cards.
 * 2. Business Logic Isolation: "which section is next" lives in a pure helper
 *    (`suggestNextSection`), not inline in JSX.
 * 3. Data-Driven Rendering: the grid maps over `SECTIONS_NAV` (SSOT).
 * 4. Two-Step Confirmation: "Reset Progress" is destructive and can't be undone,
 *    so the first click only asks; the second click actually resets.
 */
export default function Home() {
  const {
    completedSections,
    completedCount,
    totalSections,
    percentage,
    isCompleted,
    resetProgress,
  } = useProgress();

  const [confirmingReset, setConfirmingReset] = useState(false);
  const suggestedId = suggestNextSection(SECTIONS_NAV, completedSections);

  function handleConfirmReset() {
    resetProgress();
    setConfirmingReset(false);
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8 md:p-14 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Interactive Visual Curriculum
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            See How Neural Networks Think
          </h1>
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
            Build, run, and train a real neural network right in your browser, and watch every
            number move as it learns. Made for curious beginners, students, and developers who
            want to see what&apos;s actually happening inside AI.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/neuron"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Animated network: covers the hero on mobile, sits on the right on desktop */}
        <NetworkBackground className="absolute inset-0 w-full h-full md:left-auto md:w-1/2 opacity-50 md:opacity-80" />

        {/* Decorative background blur */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Live Curriculum Progress Bar Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Your Learning Journey
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track completed interactive modules saved to local storage
              </p>
            </div>
          </div>

          {completedCount > 0 && !confirmingReset && (
            <button
              type="button"
              onClick={() => setConfirmingReset(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset Progress
            </button>
          )}

          {completedCount > 0 && confirmingReset && (
            <div role="group" aria-label="Confirm reset" className="flex flex-wrap items-center justify-end gap-2 text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-300">Clear all {completedCount} completed?</span>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-3 py-1.5 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
              >
                Yes, reset
              </button>
              <button
                type="button"
                autoFocus
                onClick={() => setConfirmingReset(false)}
                className="px-3 py-1.5 rounded-xl font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <ProgressBar
          percentage={percentage}
          completedCount={completedCount}
          totalSections={totalSections}
        />
      </section>

      {/* Curriculum Sections Overview Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Curriculum Sections
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore step-by-step or jump directly into any visual simulation
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            5 Interactive Sections
          </span>
        </div>

        {/* Section Cards decorated with live completion state */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS_NAV.map((sec) => (
            <SectionCard
              key={sec.id}
              section={sec}
              isCompleted={isCompleted(sec.id)}
              isSuggested={sec.id === suggestedId}
            />
          ))}
        </div>
      </section>

      {/* Reassurance Blurb */}
      <section className="flex flex-col sm:flex-row items-start gap-5 p-6 sm:p-8 rounded-3xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60">
        <div className="w-12 h-12 shrink-0 rounded-2xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No math degree required
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            If you can multiply two numbers and add them up, you already know the core math
            behind a neuron. Every idea here is explained in plain language first, and the
            sliders, diagrams, and live charts do the heavy lifting. Formulas only show up after
            you&apos;ve seen what they do, and every piece of jargon has a pop-up definition.
          </p>
        </div>
      </section>
    </div>
  );
}
