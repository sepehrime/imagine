import { Network, ShieldCheck, BookOpen, Info, Sparkles } from "lucide-react";
import { SECTIONS_NAV } from "./Header";

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors duration-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Mission Statement */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Network className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                Inside the Network
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              An interactive visual explainer that takes you deep inside a neural network.
              Explore how artificial neurons activate, how signals forward-propagate, and how weights adjust during training.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Local Execution
              </span>
            </div>
          </div>

          {/* Curriculum Sections */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              The 5 Sections
            </h3>
            <ul className="space-y-2 text-sm">
              {SECTIONS_NAV.map((sec) => (
                <li key={sec.id}>
                  <a
                    href={sec.path}
                    className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                  >
                    {sec.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Reference */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/glossary"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Glossary of Terms
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  About the App
                </a>
              </li>
              <li>
                <a
                  href="http://localhost:8000/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  FastAPI Swagger API
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="border-t border-slate-200/80 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} Inside the Network. Educational AI Visualizer.</p>
          <p className="flex items-center gap-1">
            Built with React, Vite, Tailwind CSS, and FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
