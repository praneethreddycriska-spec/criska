"use client";

import { motion, useInView, useReducedMotion, animate } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { hero } = site;
  const reduce = useReducedMotion();
  const surfaceRef = useRef<HTMLElement>(null);

  // Move the cursor spotlight by writing pointer coords onto the hero surface.
  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    const el = surfaceRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  const leadWords = hero.titleLead.split(" ");
  const accentWords = hero.titleAccent.split(" ");

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
  };
  const word = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <header
      ref={surfaceRef}
      id="top"
      onPointerMove={handlePointerMove}
      className="hero-surface relative isolate overflow-hidden"
    >
      {/* soft pastel wash + faint guide lines */}
      <div className="pointer-events-none absolute inset-0 pastel-wash" />
      {/* interactive cursor spotlight */}
      <div className="hero-spotlight pointer-events-none absolute inset-0" aria-hidden />
      {/* subtle drifting ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="aura-orb aura-orb--a" style={{ top: "-8%", left: "-6%", width: "42vw", height: "42vw", maxWidth: 560, maxHeight: 560 }} />
        <div className="aura-orb aura-orb--b" style={{ top: "18%", right: "-8%", width: "38vw", height: "38vw", maxWidth: 520, maxHeight: 520 }} />
      </div>
      <div className="pointer-events-none absolute inset-0 mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="grid h-full grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-l border-dashed border-border/60 last:border-r" />
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-36 text-center md:px-10 md:pb-24 md:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-4 py-1.5 shadow-[0_6px_18px_-12px_rgba(10,22,34,0.4)] backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span className="eyebrow">{hero.eyebrow}</span>
          </span>
        </motion.div>

        <motion.h1
          aria-label={`${hero.titleLead} ${hero.titleAccent}`}
          variants={container}
          initial={reduce ? false : "hidden"}
          animate="visible"
          className="font-display mx-auto mt-6 max-w-[15ch] text-[44px] leading-[1.04] sm:text-[64px] md:text-[74px]"
        >
          <span aria-hidden>
            {leadWords.map((w, i) => (
              <Fragment key={`l-${i}`}>
                <motion.span variants={word} className="inline-block">{w}</motion.span>{" "}
              </Fragment>
            ))}
            {accentWords.map((w, i) => (
              <Fragment key={`a-${i}`}>
                <motion.span variants={word} className="inline-block italic text-accent/90">{w}</motion.span>
                {i < accentWords.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </span>
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
          <MagneticButton href={hero.primaryCta.href} reduce={!!reduce} className="btn-pill btn-primary">
            {hero.primaryCta.label}
          </MagneticButton>
          <MagneticButton href={hero.secondaryCta.href} reduce={!!reduce} className="btn-pill btn-ghost">
            {hero.secondaryCta.label}
          </MagneticButton>
        </motion.div>

        {/* Stats — editorial serif numbers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-y-10 border-t border-border pt-12 sm:grid-cols-4 sm:divide-x sm:divide-border"
        >
          {hero.stats.map((s) => (
            <div key={s.label} className="px-4 text-center">
              <Stat value={s.value} />
              <div className="mt-2.5 text-[12px] uppercase tracking-[0.14em] text-faint">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </header>
  );
}

function MagneticButton({
  href,
  className,
  reduce,
  children,
}: {
  href: string;
  className?: string;
  reduce: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  function onMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.25;
    const y = (e.clientY - r.top - r.height / 2) * 0.25;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }
  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  return (
    <a
      ref={ref}
      href={href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`magnetic ${className ?? ""}`}
    >
      {children}
    </a>
  );
}

function Stat({ value }: { value: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\d+)(\D*)$/);
    const isYear = /^\d{4}$/.test(value);

    if (!inView || !match || isYear) {
      setDisplay(value);
      return;
    }
    const target = parseInt(match[1], 10);
    const suffix = match[2] ?? "";
    const controls = animate(0, target, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <div ref={ref} className="font-display tabular-nums text-[40px] leading-none text-foreground md:text-[46px]">
      {display}
    </div>
  );
}
