import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Search, X, ArrowRight } from "lucide-react";
import { GLOSSARY } from "../data/glossary";
import { SECTIONS_NAV } from "../components/Header";

/**
 * Glossary Page
 *
 * SWE Design Patterns applied:
 * 1. Data-Driven Rendering: every term, definition and section link comes from
 *    `data/glossary.js` (shared with the inline <GlossaryTerm> popups) and
 *    `SECTIONS_NAV` (shared with the header). The page holds no content of its own.
 * 2. Derived View Pipeline: search → filter → group by letter is recomputed
 *    from the query with useMemo; nothing derived is stored in state.
 * 3. URL as State: `/glossary#weight` deep-links to a term. The highlighted
 *    term is read straight from `location.hash`, so it can't drift out of
 *    sync, and scrolling to it is the only side effect.
 */

const SECTION_BY_ID = Object.fromEntries(SECTIONS_NAV.map((s) => [s.id, s]));
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function matches(entry, q) {
  return (
    entry.term.toLowerCase().includes(q) ||
    entry.aliases.some((a) => a.toLowerCase().includes(q)) ||
    entry.definition.toLowerCase().includes(q)
  );
}

export default function Glossary() {
  const { hash } = useLocation();
  const targetSlug = hash ? decodeURIComponent(hash.slice(1)) : null;
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q ? GLOSSARY.filter((e) => matches(e, q)) : GLOSSARY;
    const byLetter = new Map();
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase();
      if (!byLetter.has(letter)) byLetter.set(letter, []);
      byLetter.get(letter).push(entry);
    }
    return byLetter;
  }, [query]);

  const shownCount = [...groups.values()].reduce((n, list) => n + list.length, 0);

  // Deep link: scroll the targeted term into view (after it has rendered)
  useEffect(() => {
    if (!targetSlug) return;
    const el = document.getElementById(targetSlug);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [targetSlug]);

  const jumpTo = (letter) =>
    document.getElementById(`letter-${letter}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Reference Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Glossary of AI Terms
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
          Plain-language definitions for the {GLOSSARY.length} neural network terms used throughout this app,
          each linked to the section where you can see it in action.
        </p>
      </div>

      {/* Search + letter navigation (sticky under the site header) */}
      <div className="sticky top-16 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="relative max-w-md">
          <label htmlFor="glossary-search" className="sr-only">
            Search terms
          </label>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="glossary-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search terms or definitions…"
            className="w-full pl-9 pr-9 py-2 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <nav aria-label="Jump to letter" className="flex gap-1 overflow-x-auto -mx-1 px-1 sm:flex-wrap sm:overflow-visible">
          {ALPHABET.map((letter) => {
            const available = groups.has(letter);
            return (
              <button
                key={letter}
                type="button"
                onClick={() => jumpTo(letter)}
                disabled={!available}
                className="shrink-0 w-7 h-7 rounded-lg text-xs font-bold transition-colors text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 disabled:text-slate-300 dark:disabled:text-slate-700 disabled:hover:bg-transparent disabled:cursor-default"
              >
                {letter}
              </button>
            );
          })}
        </nav>
        <p className="text-xs text-slate-500 dark:text-slate-400" aria-live="polite">
          {query ? `${shownCount} of ${GLOSSARY.length} terms match "${query.trim()}"` : `${GLOSSARY.length} terms`}
        </p>
      </div>

      {/* Terms */}
      {shownCount === 0 ? (
        <div className="rounded-3xl p-10 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <p className="font-semibold text-slate-900 dark:text-white">No terms match &ldquo;{query.trim()}&rdquo;</p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            Clear the search
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([letter, entries]) => (
            <section key={letter} id={`letter-${letter}`} className="scroll-mt-48 space-y-3" aria-labelledby={`heading-${letter}`}>
              <h2 id={`heading-${letter}`} className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">
                {letter}
              </h2>
              <dl className="grid md:grid-cols-2 gap-4">
                {entries.map((entry) => (
                  <TermCard key={entry.slug} entry={entry} highlighted={entry.slug === targetSlug} />
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function TermCard({ entry, highlighted }) {
  return (
    <div
      id={entry.slug}
      className={`scroll-mt-48 rounded-2xl p-5 bg-white dark:bg-slate-900 border shadow-sm space-y-2 transition-shadow ${
        highlighted
          ? "border-emerald-500 ring-4 ring-emerald-500/20"
          : "border-slate-200 dark:border-slate-800"
      }`}
    >
      <dt className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-bold text-slate-900 dark:text-white">{entry.term}</span>
        {entry.aliases.length > 0 && (
          <span className="text-xs text-slate-500 dark:text-slate-400">also: {entry.aliases.join(", ")}</span>
        )}
      </dt>
      <dd className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{entry.definition}</dd>
      <dd className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Explore in
        </span>
        {entry.sections.map((id) => {
          const section = SECTION_BY_ID[id];
          return (
            <Link
              key={id}
              to={section.path}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            >
              {section.title}
              <ArrowRight className="w-3 h-3" />
            </Link>
          );
        })}
      </dd>
    </div>
  );
}
