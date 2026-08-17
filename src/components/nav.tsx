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
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
              {site.nav.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  className="whitespace-nowrap text-[15px] text-foreground/80 transition-colors hover:text-foreground cursor-pointer"
                >
                  {l.label}
                </Link>
              ))}
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
                {site.nav.links.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className="rounded-xl px-3 py-3 text-foreground transition-colors hover:bg-panel cursor-pointer"
                  >
                    {l.label}
                  </Link>
                ))}
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
