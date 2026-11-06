import { SECTIONS_NAV } from "./Header";
import { SECTION_ACCENTS } from "../utils/sectionAccents";

/**
 * ConceptGrid Component
 *
 * The row of short concept cards near the top of a section page
 * (icon + title + one paragraph each), tinted with the section's accent.
 *
 * SWE Design Patterns applied:
 * 1. Data-Driven Rendering: pages pass a plain `concepts` array
 *    ({ icon, title, text }); `text` may be JSX for emphasis or entities.
 * 2. Single Source of Truth: the accent comes from SECTIONS_NAV via `sectionId`.
 * 3. Layout as a Prop: `className` sets the grid columns, since a 4-card row
 *    and a 3-card row break differently.
 */
export default function ConceptGrid({ sectionId, concepts, className = "md:grid-cols-3" }) {
  const accent = SECTION_ACCENTS[SECTIONS_NAV.find((s) => s.id === sectionId).accent];

  return (
    <div className={`grid gap-4 ${className}`}>
      {concepts.map(({ icon: Icon, title, text }) => (
        <div
          key={title}
          className="rounded-3xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
        >
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${accent.iconTile}`}>
              <Icon className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-slate-900 dark:text-white">{title}</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{text}</p>
        </div>
      ))}
    </div>
  );
}
