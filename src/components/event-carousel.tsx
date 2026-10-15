"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Auto-scrolling image carousel for an event card. Slides horizontally, advances
 * on an interval, pauses on hover/focus, supports manual dots + arrows, loops,
 * and respects prefers-reduced-motion (no auto-advance). Falls back gracefully to
 * a single image or a placeholder.
 */
export function EventCarousel({
  images,
  alt,
  className = "",
  interval = 3800,
}: {
  images: string[];
  alt: string;
  className?: string;
  interval?: number;
}) {
  const slides = images.filter(Boolean);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  const count = slides.length;
  const go = (i: number) => setIndex(((i % count) + count) % count);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setIndex((p) => (p + 1) % count), interval);
    return () => clearInterval(id);
  }, [count, paused, interval]);

  if (count === 0) return <EventPlaceholder />;

  return (
    <div
      className={`group/carousel relative h-full w-full overflow-hidden ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${alt} — image gallery`}
    >
      {/* Sliding track */}
      <div
        ref={trackRef}
        className="flex h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((src, i) => (
          <div key={i} className="relative h-full w-full shrink-0 basis-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={count > 1 ? `${alt} (${i + 1} of ${count})` : alt}
              className="h-full w-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
              draggable={false}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          {/* Arrows (appear on hover) */}
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(index - 1)}
            className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-paper/80 text-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover/carousel:opacity-100 focus-visible:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(index + 1)}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-paper/80 text-foreground opacity-0 backdrop-blur transition-opacity duration-200 group-hover/carousel:opacity-100 focus-visible:opacity-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-5 bg-paper" : "w-1.5 bg-paper/55 hover:bg-paper/80"
                }`}
              />
            ))}
          </div>

          {/* Count badge */}
          <span className="absolute right-3 top-3 rounded-full bg-paper/85 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur">
            {index + 1}/{count}
          </span>
        </>
      )}
    </div>
  );
}

function EventPlaceholder() {
  return (
    <div className="grid h-full w-full place-items-center bg-[linear-gradient(135deg,var(--panel),var(--panel-2))] text-faint">
      <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 2v4M16 2v4" />
        <circle cx="8.5" cy="14" r="1.2" fill="currentColor" stroke="none" />
        <path d="M11 16l2-2 3 3" />
      </svg>
    </div>
  );
}
