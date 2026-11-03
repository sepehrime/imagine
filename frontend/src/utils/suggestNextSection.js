/**
 * suggestNextSection — pure helper that picks which section Home should highlight.
 *
 * SWE Design Patterns applied:
 * 1. Pure Function / Business Logic Isolation: no React, no storage — just data
 *    in, answer out. Easy to unit test in Phase 7.
 * 2. Single Source of Truth: iterates `sections` (SECTIONS_NAV) in curriculum
 *    order instead of hardcoding ids.
 *
 * @param {Array<{id: number}>} sections      Sections in curriculum order (SECTIONS_NAV)
 * @param {number[]}            completedIds  Ids of sections the user has completed
 * @returns {number | null}  Id of the section to highlight, or null for "highlight nothing"
 */
export function suggestNextSection(sections, completedIds) {
  // Suggest the first incomplete section in curriculum order, so learners who
  // skip ahead are nudged back to fill the gap. All done → highlight nothing.
  const next = sections.find((section) => !completedIds.includes(section.id));
  return next ? next.id : null;
}
