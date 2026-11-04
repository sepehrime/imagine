import { Link } from "react-router-dom";
import { Info, ShieldCheck, Target, Monitor, Server, ArrowRight, ExternalLink, GraduationCap, Heart } from "lucide-react";
import { SECTIONS_NAV } from "../components/Header";

/**
 * About Page
 *
 * SWE Design Patterns applied:
 * 1. Content as Data: the tech stack, credits and resources are plain arrays
 *    rendered by small components, so adding a library is one line of data,
 *    not a new block of JSX.
 * 2. Single Source of Truth: the learning journey is generated from
 *    `SECTIONS_NAV`, so it always matches the header and the section order.
 * 3. Safe External Links: every outbound link opens in a new tab with
 *    `rel="noopener noreferrer"`, so the opened site can't control this tab.
 */

const FRONTEND = [
  { name: "React", role: "UI components and state", url: "https://react.dev" },
  { name: "Vite", role: "Dev server, /api proxy and production build", url: "https://vite.dev" },
  { name: "Tailwind CSS", role: "Styling and dark mode", url: "https://tailwindcss.com" },
  { name: "Framer Motion", role: "Network and data-flow animations", url: "https://motion.dev" },
  { name: "D3", role: "Scales and line paths for the SVG charts", url: "https://d3js.org" },
  { name: "Recharts", role: "Live loss and accuracy charts", url: "https://recharts.org" },
  { name: "React Router", role: "Page routing", url: "https://reactrouter.com" },
  { name: "Axios", role: "HTTP requests to the backend", url: "https://axios-http.com" },
  { name: "Lucide", role: "Icons", url: "https://lucide.dev" },
];

const BACKEND = [
  { name: "FastAPI", role: "API framework and auto-generated /docs", url: "https://fastapi.tiangolo.com" },
  { name: "Pydantic", role: "Request and response validation", url: "https://docs.pydantic.dev" },
  { name: "Uvicorn", role: "ASGI server that runs the API", url: "https://www.uvicorn.org" },
  { name: "PyTorch", role: "Networks, forward passes and training", url: "https://pytorch.org" },
  { name: "scikit-learn", role: "Generating the toy datasets", url: "https://scikit-learn.org" },
  { name: "NumPy", role: "Numerical arrays", url: "https://numpy.org" },
];

const RESOURCES = [
  {
    name: "3Blue1Brown: Neural Networks",
    by: "Grant Sanderson",
    blurb: "Beautifully animated videos on what neural networks are, gradient descent, and backpropagation. The perfect next step.",
    url: "https://www.3blue1brown.com/topics/neural-networks",
  },
  {
    name: "Practical Deep Learning for Coders",
    by: "fast.ai",
    blurb: "A free, hands-on course that gets you training real models on images and text with code from the first lesson.",
    url: "https://course.fast.ai",
  },
  {
    name: "Neural Networks and Deep Learning",
    by: "Michael Nielsen",
    blurb: "A free online book that builds a network from scratch and explains every equation along the way.",
    url: "http://neuralnetworksanddeeplearning.com",
  },
  {
    name: "TensorFlow Playground",
    by: "Google",
    blurb: "Another in-browser sandbox for training small networks on 2D datasets. Great for more experiments like Sections 4 and 5.",
    url: "https://playground.tensorflow.org",
  },
];

const FLOW = [
  { label: "Your browser", detail: "React app" },
  { label: "Vite proxy", detail: "/api/* → :8000" },
  { label: "FastAPI", detail: "validates requests" },
  { label: "PyTorch", detail: "runs and trains networks" },
];

export default function About() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Info className="w-3.5 h-3.5" />
          Project Overview
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About Inside the Network
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          An educational app that demystifies neural networks by letting you see, build and train one
          yourself. No maths degree required.
        </p>
      </div>

      {/* Purpose + journey */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card icon={Target} title="Why this exists">
          <p>
            Neural networks power everything from photo search to chatbots, but most explanations jump
            straight to equations. This app takes the opposite route: every idea comes with something you
            can poke at, and the numbers update the moment you change them.
          </p>
          <p>
            The networks here are tiny (a few dozen neurons), but they work exactly like the giant ones:
            weighted sums, activations, forward passes, gradient descent. Small enough to see every
            connection, real enough to learn from.
          </p>
        </Card>

        <Card icon={GraduationCap} title="The journey">
          <ol className="space-y-2">
            {SECTIONS_NAV.map((section) => (
              <li key={section.id}>
                <Link
                  to={section.path}
                  className="group flex items-start gap-3 rounded-xl p-2 -m-2 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <section.icon className="w-4 h-4 mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  <span className="flex-1">
                    <span className="block font-semibold text-slate-900 dark:text-white">{section.title}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">{section.desc}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 mt-0.5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </Link>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* How it works */}
      <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">How it works: 100% local</h2>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Everything runs on your own machine. The React frontend handles the visuals and quick maths (like
          the single neuron in Section 1), and a Python backend does the real neural-network work with
          PyTorch. No accounts, no tracking, no cloud.
        </p>
        <ol className="flex flex-col md:flex-row md:items-center gap-2" aria-label="Request flow">
          {FLOW.map((step, i) => (
            <li key={step.label} className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
              <div className="flex-1 rounded-2xl px-4 py-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-center">
                <span className="block text-sm font-bold text-slate-900 dark:text-white">{step.label}</span>
                <span className="block text-xs font-mono text-slate-500 dark:text-slate-400">{step.detail}</span>
              </div>
              {i < FLOW.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-400 self-center rotate-90 md:rotate-0 shrink-0" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </div>

      {/* Tech stack & credits */}
      <div className="space-y-4">
        <div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            Built with open source
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Thank you to the maintainers and communities behind these projects.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <StackList icon={Monitor} title="Frontend" items={FRONTEND} />
          <StackList icon={Server} title="Backend" items={BACKEND} />
        </div>
      </div>

      {/* Learning resources */}
      <div className="space-y-4">
        <div>
          <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Keep learning
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Finished all five sections? These are great next steps.</p>
        </div>
        <ul className="grid sm:grid-cols-2 gap-4">
          {RESOURCES.map((r) => (
            <li key={r.url}>
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                    {r.name}
                  </span>
                  <ExternalLink className="w-4 h-4 shrink-0 text-slate-400" aria-hidden="true" />
                </span>
                <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{r.by}</span>
                <span className="block text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-2">{r.blurb}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-lg text-slate-900 dark:text-white">{title}</h2>
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function StackList({ icon: Icon, title, items }) {
  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
        <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        {title}
      </h3>
      <ul className="divide-y divide-slate-100 dark:divide-slate-800">
        {items.map((item) => (
          <li key={item.name} className="flex items-baseline justify-between gap-3 py-2">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm text-slate-900 dark:text-white hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline"
            >
              {item.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <span className="text-xs text-slate-500 dark:text-slate-400 text-right">{item.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
