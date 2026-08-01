"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/content/site";
import { LogoLockup } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-paper/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-6 md:px-10">
          <a href="/" className="text-foreground" aria-label="Criska home">
            <LogoLockup markClassName="h-[30px] w-auto" />
          </a>

          <div className="hidden items-center gap-7 lg:flex">
            {site.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="whitespace-nowrap text-[15px] text-foreground/80 transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <a href={site.nav.cta.href} className="btn-pill btn-primary !px-5 !py-2.5 text-[14px]">
              {site.nav.cta.label}
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-2 rounded-2xl border border-border bg-surface p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] md:hidden"
          >
            <div className="flex flex-col gap-1">
              {site.nav.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-foreground transition-colors hover:bg-panel"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={site.nav.cta.href}
                onClick={() => setOpen(false)}
                className="btn-pill btn-primary mt-2"
              >
                {site.nav.cta.label}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
