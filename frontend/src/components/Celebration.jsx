import { Trophy } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Confetti, { CONFETTI_DURATION_MS } from "./Confetti";
import { useProgress } from "../hooks/useProgress";
import { useCelebrationTrigger } from "../hooks/useCelebrationTrigger";

/**
 * Celebration Component
 *
 * Mounted once in MainLayout. When the learner completes the 5th section
 * (on any page), shows confetti plus a short toast.
 *
 * SWE Design Patterns applied:
 * 1. Observer via Shared Context: reacts to `isAllComplete` from the single
 *    progress store, so no section page needs to know about confetti.
 * 2. Accessible Announcement: the toast is a `role="status"` live region, so
 *    screen-reader users get the "you finished" moment too.
 */
export default function Celebration() {
  const { isAllComplete } = useProgress();
  const celebrating = useCelebrationTrigger(isAllComplete, CONFETTI_DURATION_MS);

  return (
    <AnimatePresence>
      {celebrating && (
        <motion.div key="celebration" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Confetti />
          <motion.div
            role="status"
            style={{ x: "-50%" }} // centre via Framer: its transform would override Tailwind's -translate-x-1/2
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className="fixed bottom-6 left-1/2 z-[61] flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-xl shadow-emerald-600/30"
          >
            <Trophy className="w-5 h-5" aria-hidden="true" />
            All 5 sections complete. You&apos;ve seen inside the network!
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
