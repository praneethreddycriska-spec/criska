"use client";

import { motion } from "motion/react";
import { site } from "@/content/site";
import { Reveal } from "@/components/reveal";

const CREAM = "var(--navy-text)";

type Card = { label: string; top: string; left: string; z: number; delay: number; dur: number; dim: number; alt?: boolean };

// Cards ring the phone (phone sits centre); depth via translateZ + dim.
const cards: Card[] = [
  { label: "AWS", top: "3%", left: "28%", z: 70, delay: 0, dur: 7, dim: 0 },
  { label: "Docker", top: "-1%", left: "62%", z: 28, delay: 0.8, dur: 8, dim: 0.45, alt: true },
  { label: "Azure", top: "19%", left: "83%", z: 58, delay: 0.3, dur: 7.5, dim: 0.12 },
  { label: "Kubernetes", top: "45%", left: "90%", z: 14, delay: 1.1, dur: 9, dim: 0.5, alt: true },
  { label: "Terraform", top: "71%", left: "80%", z: 50, delay: 0.5, dur: 8.5, dim: 0.2 },
  { label: "GitHub Actions", top: "90%", left: "54%", z: 24, delay: 0.9, dur: 7.8, dim: 0.45, alt: true },
  { label: "Snowflake", top: "82%", left: "15%", z: 64, delay: 0.2, dur: 7.2, dim: 0.1 },
  { label: "Power BI", top: "53%", left: "0%", z: 34, delay: 1.3, dur: 9.2, dim: 0.4, alt: true },
  { label: "Google Cloud", top: "24%", left: "4%", z: 54, delay: 0.6, dur: 8.1, dim: 0.18 },
];

export function TechShowcase() {
  const { technologies } = site;
  return (
    <section
      className="relative isolate overflow-hidden py-24 md:py-32"
      style={{ background: "var(--navy-bg)", color: "var(--navy-body)", colorScheme: "dark" }}
    >
      {/* ambient glow */}
      <div
        className="animate-glow pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(50% 45% at 72% 45%, rgba(169,192,205,0.16), transparent 70%)" }}
      />

      <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-6 md:grid-cols-2 md:px-10">
        {/* Left — copy */}
        <div className="order-2 md:order-1">
          <Reveal>
            <span className="eyebrow" style={{ color: "var(--navy-faint)" }}>{technologies.eyebrow}</span>
          </Reveal>
          <Reveal i={1}>
            <h2 className="font-display mt-4 text-[34px] leading-[1.08] sm:text-[46px]" style={{ color: CREAM }}>
              {technologies.title}
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed" style={{ color: "var(--navy-muted)" }}>
              {technologies.lead}
            </p>
          </Reveal>
          <Reveal i={3}>
            <div className="mt-8 flex flex-wrap gap-2">
              {technologies.items.map((t) => (
                <span
                  key={t}
                  className="rounded-full px-3 py-1.5 text-[12.5px]"
                  style={{ border: "1px solid var(--navy-border)", color: "var(--navy-body)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right — 3D stage */}
        <div className="order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto h-[440px] w-full max-w-[440px] sm:h-[520px]"
            style={{ perspective: "1300px" }}
          >
            <div
              className="relative h-full w-full"
              style={{ transformStyle: "preserve-3d", transform: "rotateX(6deg) rotateY(-16deg)" }}
            >
              {/* Phone */}
              <div
                className="animate-phone absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ transform: "translate(-50%,-50%) translateZ(20px)" }}
              >
                <Phone />
              </div>

              {/* Floating tech cards */}
              {cards.map((c) => (
                <div
                  key={c.label}
                  className="absolute"
                  style={{
                    top: c.top,
                    left: c.left,
                    transform: `translateZ(${c.z}px)`,
                    opacity: 1 - c.dim * 0.7,
                    filter: c.dim > 0.4 ? "blur(0.4px)" : undefined,
                  }}
                >
                  <div className="animate-floaty" style={{ animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s` }}>
                    <TechCard label={c.label} alt={c.alt} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TechCard({ label, alt }: { label: string; alt?: boolean }) {
  return (
    <div
      className="flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md"
      style={{
        background: "rgba(22,40,53,0.72)",
        border: "1px solid var(--navy-border-strong)",
      }}
    >
      <span
        className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[12px] font-semibold"
        style={{
          background: alt ? "rgba(169,192,205,0.14)" : "rgba(245,242,236,0.06)",
          color: "var(--navy-accent)",
        }}
      >
        {label[0]}
      </span>
      <span className="whitespace-nowrap text-[13px] font-medium" style={{ color: "var(--navy-text)" }}>
        {label}
      </span>
    </div>
  );
}

/* Crisp vector iPhone + Criska AI assistant UI */
function Phone() {
  const bar = (w: string, o = 0.14) => (
    <div className="h-2 rounded-full" style={{ width: w, background: `rgba(245,242,236,${o})` }} />
  );
  return (
    <div
      className="relative rounded-[42px] p-[10px] shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)]"
      style={{
        width: 250,
        background: "linear-gradient(160deg,#1c2f3d,#0d1a24)",
        border: "1px solid rgba(245,242,236,0.14)",
      }}
    >
      {/* screen */}
      <div
        className="relative overflow-hidden rounded-[34px] p-5"
        style={{ height: 470, background: "linear-gradient(180deg,#0f1e29,#0a151d)" }}
      >
        {/* dynamic island */}
        <div className="absolute left-1/2 top-3 h-5 w-20 -translate-x-1/2 rounded-full" style={{ background: "#050d13" }} />

        {/* header */}
        <div className="mt-6 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--navy-accent)" }} />
          <span className="text-[13px] font-medium" style={{ color: "var(--navy-text)" }}>Criska Assistant</span>
        </div>

        {/* search pill */}
        <div
          className="mt-5 flex items-center gap-2 rounded-full px-3 py-2.5"
          style={{ background: "rgba(245,242,236,0.06)", border: "1px solid rgba(245,242,236,0.08)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--navy-muted)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
          </svg>
          <span className="text-[12px]" style={{ color: "var(--navy-muted)" }}>Ask anything…</span>
        </div>

        <div className="mt-5 text-[10px] uppercase tracking-[0.16em]" style={{ color: "var(--navy-faint)" }}>Suggestions</div>

        {/* suggestion rows */}
        <div className="mt-3 space-y-2.5">
          {[
            { t: "Migrate workloads to Azure", hot: true },
            { t: "Automate our CI/CD pipeline", hot: false },
            { t: "Analyze last quarter's sales", hot: false },
          ].map((r) => (
            <div
              key={r.t}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{
                background: r.hot ? "rgba(169,192,205,0.1)" : "rgba(245,242,236,0.04)",
                border: `1px solid ${r.hot ? "rgba(169,192,205,0.35)" : "rgba(245,242,236,0.06)"}`,
              }}
            >
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md" style={{ background: "rgba(245,242,236,0.06)", color: "var(--navy-accent)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7z" /></svg>
              </span>
              <span className="text-[11.5px]" style={{ color: "var(--navy-body)" }}>{r.t}</span>
            </div>
          ))}
        </div>

        {/* mini insight card */}
        <div className="mt-4 rounded-xl p-3.5" style={{ background: "rgba(245,242,236,0.04)", border: "1px solid rgba(245,242,236,0.06)" }}>
          <div className="flex items-end gap-1.5" style={{ height: 40 }}>
            {[40, 62, 48, 78, 90, 68].map((h, i) => (
              <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, background: i === 4 ? "var(--navy-accent)" : "rgba(245,242,236,0.16)" }} />
            ))}
          </div>
          <div className="mt-3 space-y-1.5">{bar("70%")}{bar("45%", 0.1)}</div>
        </div>

        {/* input bar */}
        <div className="absolute inset-x-5 bottom-5 flex items-center gap-2 rounded-full px-3 py-2.5" style={{ background: "rgba(245,242,236,0.06)", border: "1px solid rgba(245,242,236,0.08)" }}>
          <span className="text-[12px]" style={{ color: "var(--navy-faint)" }}>Message Criska…</span>
          <span className="ml-auto grid h-7 w-7 place-items-center rounded-full" style={{ background: "var(--navy-accent)", color: "#0a151d" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </div>
      </div>
    </div>
  );
}
