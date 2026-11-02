import { useState, useEffect } from "react";
import axios from "axios";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import MainLayout from "./layouts/MainLayout";
import { Sparkles, ArrowRight, CheckCircle2, Shield, Cpu, Network, BookOpen, Layers } from "lucide-react";
import { SECTIONS_NAV } from "./components/Header";

function MainDashboard() {
  const { isDark, toggleTheme } = useTheme();
  const [backendStatus, setBackendStatus] = useState({
    loading: true,
    connected: false,
    data: null,
    error: null,
  });

  useEffect(() => {
    // Health check verification
    axios
      .get("/health")
      .then((res) => {
        setBackendStatus({
          loading: false,
          connected: true,
          data: res.data,
          error: null,
        });
      })
      .catch((err) => {
        setBackendStatus({
          loading: false,
          connected: false,
          data: null,
          error: err.message,
        });
      });
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Welcome Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-8 md:p-14 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Phase 2.1 Complete — Global Layout Active
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            See How Neural Networks Think
          </h1>
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
            An interactive visual explainer that takes you deep inside the math and mechanics
            of artificial intelligence. No advanced math degree required.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="/neuron"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95"
            >
              Start Exploring Section 1
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-medium text-sm backdrop-blur-md transition-all border border-white/20"
            >
              Current Theme: {isDark ? "Dark 🌙" : "Light ☀️"} (Click to Toggle)
            </button>
          </div>
        </div>

        {/* Decorative background blur */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Curriculum Preview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              The 5 Learning Sections
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive visual journeys step-by-step
            </p>
          </div>
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
            5 Interactive Sections
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS_NAV.map((sec) => {
            const Icon = sec.icon;
            return (
              <a
                key={sec.id}
                href={sec.path}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {sec.desc}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <span>Explore Section</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Diagnostics Grid: Layout Verification & Live Backend Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Card 1: Layout Architecture */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            MainLayout & Header
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Shared persistent layout with responsive navigation, sticky header, mobile drawer, and accessibility labels.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Responsive on all viewports
          </div>
        </div>

        {/* Card 2: Dark Mode & State Persistence */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Theme Context & Storage
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Theme preference is synchronized between React state, Tailwind's <code className="text-purple-600 dark:text-purple-400 font-mono">dark</code> class, and <code className="text-purple-600 dark:text-purple-400 font-mono">localStorage</code>.
          </p>
          <div className="pt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Persists across page reloads
          </div>
        </div>

        {/* Card 3: Backend Connection Status */}
        <div className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            FastAPI Connectivity
          </h3>
          <div className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Status:</span>
              {backendStatus.loading ? (
                <span className="text-amber-500 font-medium">Checking...</span>
              ) : backendStatus.connected ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  ● 200 OK Connected
                </span>
              ) : (
                <span className="text-rose-500 font-semibold">● Offline</span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Reverse Proxy:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">/health → 8000</span>
            </div>
          </div>
          {backendStatus.connected && (
            <pre className="text-[11px] bg-slate-50 dark:bg-slate-950 p-2 rounded-lg font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 overflow-x-auto">
              {JSON.stringify(backendStatus.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainLayout>
        <MainDashboard />
      </MainLayout>
    </ThemeProvider>
  );
}
