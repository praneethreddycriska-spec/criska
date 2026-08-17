"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CKMark } from "@/components/logo";

/**
 * Quick branded CK transition that plays on each in-app navigation (client-side
 * route change). The first paint of a session is handled by <IntroSplash>, so
 * this skips the initial mount and only fires on subsequent section changes.
 * Deliberately short (~550ms) so it reads as a snappy brand beat, not a wait.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [show, setShow] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return; // don't play on the very first load (IntroSplash covers that)
    }
    if (reduce) return; // honour reduced-motion — no flash
    setShow(true);
    const t = setTimeout(() => setShow(false), 480);
    return () => clearTimeout(t);
  }, [pathname, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="route-ck"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="fixed inset-0 z-[190] grid place-items-center bg-paper"
          aria-hidden
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <CKMark className="h-12 w-auto text-foreground md:h-14" />
            <span
              className="mt-3.5 text-[15px] font-semibold uppercase text-foreground md:text-[17px]"
              style={{ letterSpacing: "0.28em" }}
            >
              Criska
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
