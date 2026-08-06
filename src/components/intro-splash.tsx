"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CKMark } from "@/components/logo";

/**
 * Brief branded intro. It renders opaque on the very first paint so the page
 * never flashes underneath it, then fades away to reveal the site. Shown once
 * per browser session; repeat views dismiss it instantly.
 */
export function IntroSplash() {
  // Start visible so it covers content from the first paint (no flash-then-cover).
  const [show, setShow] = useState(true);
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("criska_intro_seen");
      sessionStorage.setItem("criska_intro_seen", "1");
    } catch {
      /* ignore */
    }
    if (seen) {
      // Already shown this session — remove immediately, no animation.
      setInstant(true);
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(false), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: instant ? 0 : 0.4, ease: "easeOut" } }}
          className="fixed inset-0 z-[200] grid place-items-center bg-paper"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <CKMark className="h-14 w-auto text-foreground md:h-16" />
            <span className="mt-5 text-[22px] font-semibold uppercase text-foreground md:text-[26px]" style={{ letterSpacing: "0.28em" }}>
              Criska
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
