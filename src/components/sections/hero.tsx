"use client";

import { motion, useInView, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

export function Hero() {
  const { hero } = site;
  return (
    <header id="top" className="relative isolate overflow-hidden">
      {/* soft pastel wash + faint guide lines */}
      <div className="pointer-events-none absolute inset-0 pastel-wash" />
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid h-full grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-l border-dashed border-border/60 last:border-r" />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-36 text-center md:px-10 md:pb-24 md:pt-44">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="eyebrow"
        >
          {hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.05 }}
          className="font-display mx-auto mt-6 max-w-[15ch] text-[44px] leading-[1.04] sm:text-[64px] md:text-[74px]"
        >
          {hero.titleLead}{" "}
          <em className="italic text-accent/90">{hero.titleAccent}</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.12 }}
          className="mx-auto mt-7 max-w-[52ch] text-[18px] leading-relaxed text-muted"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <a href={hero.primaryCta.href} className="btn-pill btn-primary">
            {hero.primaryCta.label}
          </a>
          <a href={hero.secondaryCta.href} className="btn-pill btn-ghost">
            {hero.secondaryCta.label}
          </a>
        </motion.div>

        {/* Stats — editorial serif numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-y-10 border-t border-border pt-10 sm:grid-cols-4"
        >
          {hero.stats.map((s) => (
            <div key={s.label} className="px-2 text-center">
              <Stat value={s.value} />
              <div className="mt-2 text-[12.5px] uppercase tracking-[0.12em] text-faint">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </header>
  );
}

function Stat({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(value);

  const match = value.match(/^(\d+)(\D*)$/);
  const isYear = /^\d{4}$/.test(value);

  useEffect(() => {
    if (!inView || !match || isYear) {
      setDisplay(value);
      return;
    }
    const target = parseInt(match[1], 10);
    const suffix = match[2] ?? "";
    const controls = animate(0, target, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value, isYear, match]);

  return (
    <div ref={ref} className="font-display text-[40px] leading-none text-foreground md:text-[46px]">
      {display}
    </div>
  );
}
