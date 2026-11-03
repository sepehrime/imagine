import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { SECTIONS_NAV } from "../components/Header";
import { useProgress } from "../hooks/useProgress";
import ProgressBar from "../components/ProgressBar";
import SectionCard from "../components/SectionCard";

export default function Home() {
  const {
    completedCount,
    totalSections,
    percentage,
    isCompleted,
    resetProgress,
  } = useProgress();

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
            An interactive visual explainer that takes you deep inside the math and mechanics
            of artificial intelligence. No advanced math degree required.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              to="/neuron"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
            >
              Start Exploring Section 1
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

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

          {completedCount > 0 && (
            <button
              type="button"
              onClick={resetProgress}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Reset progress to 0%"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Progress
            </button>
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
            />
          ))}
        </div>
      </section>
    </div>
  );
}
