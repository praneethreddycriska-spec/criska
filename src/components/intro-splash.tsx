"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CKMark } from "@/components/logo";

/**
 * Brief branded intro — the Criska mark + wordmark animate in, hold, then fade
 * out to reveal the site. No spinner. Shown once per browser session.
 */
export function IntroSplash() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("criska_intro_seen")) return;
      sessionStorage.setItem("criska_intro_seen", "1");
    } catch {
      /* ignore */
    }
    setShow(true);
    const t = setTimeout(() => setShow(false), 1900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[200] grid place-items-center bg-paper"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ rotate: -8 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <CKMark className="h-14 w-auto text-foreground md:h-16" />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.28em" }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="mt-5 text-[22px] font-semibold uppercase text-foreground md:text-[26px]"
              style={{ letterSpacing: "0.28em" }}
            >
              Criska
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
