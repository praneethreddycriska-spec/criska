"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { site } from "@/content/site";
import { LogoLockup } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [mobileEventsOpen, setMobileEventsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Event categories power the "Events" nav dropdown; derived from event tags.
  useEffect(() => {
    let alive = true;
    fetch("/api/event-categories")
      .then((r) => (r.ok ? r.json() : { categories: [] }))
      .then((j) => alive && Array.isArray(j.categories) && setCategories(j.categories))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setOpen(false);

    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          window.history.pushState(null, "", href);
        }
      } else {
        e.preventDefault();
        router.push(href);
      }
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`transition-all duration-300 ${
            scrolled
              ? "border-b border-border bg-paper/85 backdrop-blur-xl shadow-xs"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <nav className="mx-auto flex h-[74px] max-w-[1200px] items-center justify-between px-6 md:px-10">
            <Link href="/" className="text-foreground" aria-label="Criska home">
              <LogoLockup markClassName="h-[30px] w-auto" />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden items-center gap-7 lg:flex">
              {site.nav.links.map((l) =>
                l.href === "/events" && categories.length > 0 ? (
                  <div key={l.href} className="group relative">
                    <Link
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href)}
                      className="flex items-center gap-1 whitespace-nowrap text-[15px] text-foreground/80 transition-colors hover:text-foreground cursor-pointer"
                    >
                      {l.label}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 transition-transform duration-200 group-hover:rotate-180">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </Link>
                    {/* Hover dropdown */}
                    <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                      <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)]">
                        <Link href="/events" className="block rounded-xl px-3 py-2 text-[14px] text-foreground/80 transition-colors hover:bg-panel hover:text-foreground">
                          All Events
                        </Link>
                        <div className="my-1 h-px bg-border" />
                        {categories.map((c) => (
                          <Link
                            key={c}
                            href={`/events?category=${encodeURIComponent(c)}`}
                            className="block rounded-xl px-3 py-2 text-[14px] text-foreground/80 transition-colors hover:bg-panel hover:text-foreground"
                          >
                            {c}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className="whitespace-nowrap text-[15px] text-foreground/80 transition-colors hover:text-foreground cursor-pointer"
                  >
                    {l.label}
                  </Link>
                ),
              )}
            </div>

            <div className="hidden items-center gap-3 lg:flex">
              <ThemeToggle />
              <Link
                href={site.nav.cta.href}
                className="btn-pill btn-primary !px-5 !py-2.5 text-[14px]"
              >
                {site.nav.cta.label}
              </Link>
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={open}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((prev) => !prev);
                }}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:bg-panel"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                >
                  {open ? (
                    <path d="M6 6l12 12M18 6L6 18" />
                  ) : (
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  )}
                </svg>
              </button>
            </div>
          </nav>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mx-4 mt-2 rounded-2xl border border-border bg-surface p-4 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] md:hidden"
            >
              <div className="flex flex-col gap-1">
                {site.nav.links.map((l) =>
                  l.href === "/events" && categories.length > 0 ? (
                    <div key={l.href}>
                      <div className="flex items-center">
                        <Link
                          href={l.href}
                          onClick={(e) => handleNavClick(e, l.href)}
                          className="flex-1 rounded-xl px-3 py-3 text-foreground transition-colors hover:bg-panel cursor-pointer"
                        >
                          {l.label}
                        </Link>
                        <button
                          type="button"
                          aria-label="Toggle event categories"
                          aria-expanded={mobileEventsOpen}
                          onClick={() => setMobileEventsOpen((v) => !v)}
                          className="grid h-10 w-10 place-items-center rounded-xl text-foreground/70 transition-colors hover:bg-panel"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${mobileEventsOpen ? "rotate-180" : ""}`}>
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                      </div>
                      {mobileEventsOpen && (
                        <div className="ml-3 mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3">
                          {categories.map((c) => (
                            <Link
                              key={c}
                              href={`/events?category=${encodeURIComponent(c)}`}
                              onClick={() => setOpen(false)}
                              className="rounded-lg px-3 py-2 text-[14px] text-foreground/75 transition-colors hover:bg-panel hover:text-foreground"
                            >
                              {c}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={(e) => handleNavClick(e, l.href)}
                      className="rounded-xl px-3 py-3 text-foreground transition-colors hover:bg-panel cursor-pointer"
                    >
                      {l.label}
                    </Link>
                  ),
                )}
                <Link
                  href={site.nav.cta.href}
                  onClick={() => setOpen(false)}
                  className="btn-pill btn-primary mt-2 text-center"
                >
                  {site.nav.cta.label}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
