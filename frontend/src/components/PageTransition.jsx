import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

/**
 * PageTransition Component
 *
 * Fades + slides each page in when the route changes.
 *
 * SWE Design Patterns applied:
 * 1. Keyed Remount: `key={pathname}` makes React treat each route as a new
 *    element, which replays the `initial → animate` animation.
 * 2. Enter-Only Animation (deliberate): no exit animation / AnimatePresence
 *    "wait" mode. Exit animations keep the OLD page mounted for a moment,
 *    which delays navigation, fights ScrollToTop, and lets tests briefly see
 *    two pages at once. An enter-only fade gives most of the polish with none
 *    of that.
 * 3. Reduced Motion: honoured globally by <MotionConfig reducedMotion="user">
 *    in App.jsx (transform animations are skipped, opacity still fades).
 */
export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
