/**
 * Skeleton Components
 *
 * Grey placeholder shapes that match the layout of content still loading, so
 * the page doesn't jump when the data arrives.
 *
 * SWE Design Patterns applied:
 * 1. Layout-Preserving Placeholder: a skeleton reserves the same space as the
 *    real content (less layout shift than a centred spinner).
 * 2. Composition: <Skeleton> is one shimmering block; pages assemble blocks
 *    into a shape that mirrors their real UI, inside one <SkeletonGroup>.
 * 3. Accessible Loading State: the group is a single `role="status"` with a
 *    visually-hidden label; the blocks themselves are aria-hidden.
 *    `motion-safe:` skips the pulse for users who prefer reduced motion.
 */
export function Skeleton({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`rounded-xl bg-slate-200 dark:bg-slate-800 motion-safe:animate-pulse ${className}`}
    />
  );
}

export function SkeletonGroup({ label, className = "", children }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
