import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#2563eb", "#6366f1", "#a855f7", "#10b981", "#f59e0b", "#f43f5e"];
const PIECE_COUNT = 90;
export const CONFETTI_DURATION_MS = 4500;

// Random but fixed per burst: computed once in a useState initializer so pieces
// don't jump around on re-render.
function makePieces() {
  return Array.from({ length: PIECE_COUNT }, (_, i) => ({
    id: i,
    left: Math.random() * 100, // vw
    drift: (Math.random() - 0.5) * 30, // vw
    rotate: (Math.random() - 0.5) * 1080,
    delay: Math.random() * 0.6,
    duration: 2.6 + Math.random() * 1.6,
    width: 6 + Math.random() * 6,
    color: COLORS[i % COLORS.length],
    round: Math.random() < 0.3,
  }));
}

/**
 * Confetti Component
 *
 * A one-shot burst of falling paper pieces, drawn with Framer Motion (no extra
 * dependency). Purely decorative.
 *
 * SWE Design Patterns applied:
 * 1. Decorative-Only Overlay: `aria-hidden` + `pointer-events-none`, so it
 *    never steals clicks or gets read out; the accompanying text message is
 *    what screen readers hear (see <Celebration>).
 * 2. Respect User Preferences: renders nothing under `prefers-reduced-motion`.
 * 3. Stable Randomness: random layout generated once per mount, not per render.
 */
export default function Confetti() {
  const reduceMotion = useReducedMotion();
  const [pieces] = useState(makePieces);

  if (reduceMotion) return null;

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute top-0 block"
          style={{
            left: `${p.left}vw`,
            width: p.width,
            height: p.round ? p.width : p.width * 0.45,
            backgroundColor: p.color,
            borderRadius: p.round ? "9999px" : "2px",
          }}
          initial={{ y: "-5vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: `${p.drift}vw`, rotate: p.rotate, opacity: [1, 1, 0.8] }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.25, 0.4, 0.6, 1] }}
        />
      ))}
    </div>
  );
}
