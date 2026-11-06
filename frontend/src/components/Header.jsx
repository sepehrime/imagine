import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  Network,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  BookOpen,
  Info,
  CircleDot,
  Grid,
  Play,
  Activity,
  Layers,
} from "lucide-react";

/**
 * Single Source of Truth for the 5 curriculum sections: id, title, route,
 * icon, short description and accent colour.
 */
export const SECTIONS_NAV = [
  {
    id: 1,
    title: "1. What is a Neuron?",
    path: "/neuron",
    accent: "blue", // key into SECTION_ACCENTS (utils/sectionAccents.js)
    icon: CircleDot,
    desc: "Inputs, weights, bias & activations",
  },
  {
    id: 2,
    title: "2. Build the Network",
    path: "/build",
    accent: "indigo",
    icon: Layers,
    desc: "Connect layers & customize architecture",
  },
  {
    id: 3,
    title: "3. Forward Pass",
    path: "/forward-pass",
    accent: "cyan",
    icon: Play,
    desc: "Watch numbers flow node-to-node",
  },
  {
    id: 4,
    title: "4. Train & Watch it Learn",
    path: "/train",
    accent: "emerald",
    icon: Activity,
    desc: "Loss curves, backpropagation & epochs",
  },
  {
    id: 5,
    title: "5. Decision Boundary",
    path: "/boundary",
    accent: "violet",
    icon: Grid,
    desc: "See how the network classifies 2D space",
  },
];

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sectionsDropdownOpen, setSectionsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if user clicks outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSectionsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Escape closes any open menu and returns focus to its toggle button
  // (WAI-ARIA disclosure-menu keyboard pattern)
  const sectionsButtonRef = useRef(null);
  const mobileButtonRef = useRef(null);
  useEffect(() => {
    if (!sectionsDropdownOpen && !mobileMenuOpen) return;
    function handleKeyDown(event) {
      if (event.key !== "Escape") return;
      if (sectionsDropdownOpen) {
        setSectionsDropdownOpen(false);
        sectionsButtonRef.current?.focus();
      }
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        mobileButtonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [sectionsDropdownOpen, mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg p-1"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <Network className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  Inside the Network
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    Interactive
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium -mt-1 hidden sm:block">
                  Visual Neural Network Explorer
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links (Client-Side Routing) */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
            >
              Home
            </NavLink>

            {/* Sections Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={sectionsButtonRef}
                type="button"
                onClick={() => setSectionsDropdownOpen(!sectionsDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-expanded={sectionsDropdownOpen}
                aria-controls="sections-menu"
              >
                <Layers className="w-4 h-4 text-blue-500" />
                <span>Sections</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    sectionsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {sectionsDropdownOpen && (
                <div id="sections-menu" className="absolute left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    The 5 Learning Sections
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {SECTIONS_NAV.map((sec) => {
                      const Icon = sec.icon;
                      return (
                        <Link
                          key={sec.id}
                          to={sec.path}
                          onClick={() => setSectionsDropdownOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">{sec.title}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                              {sec.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <NavLink
              to="/glossary"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
            >
              <BookOpen className="w-4 h-4 text-emerald-500" />
              <span>Glossary</span>
            </NavLink>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`
              }
            >
              <Info className="w-4 h-4 text-indigo-500" />
              <span>About</span>
            </NavLink>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            {/* Dark / Light Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 animate-in spin-in-180 duration-300" />
              )}
            </button>

            {/* Mobile Menu Hamburger Button */}
            <button
              type="button"
              ref={mobileButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="md:hidden border-t border-slate-200 dark:border-slate-800 py-4 px-2 space-y-1 animate-in slide-in-from-top-4 duration-200">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Home
            </Link>

            <div className="pt-2 pb-1">
              <span className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                The 5 Sections
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1 pl-2">
              {SECTIONS_NAV.map((sec) => (
                <Link
                  key={sec.id}
                  to={sec.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {sec.title}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <Link
                to="/glossary"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <BookOpen className="w-4 h-4 text-emerald-500" />
                Glossary
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Info className="w-4 h-4 text-indigo-500" />
                About
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
