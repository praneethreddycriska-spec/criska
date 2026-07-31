import { site } from "@/content/site";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

export function Industries() {
  const { industries } = site;
  return (
    <section id="industries" className="bg-panel py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <SectionHead eyebrow={industries.eyebrow} title={industries.title} lead={industries.lead} />

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {industries.items.map((it, i) => (
            <Reveal key={it} i={i % 3}>
              <div className="group flex items-center gap-4 bg-surface px-6 py-6 transition-colors hover:bg-panel-2">
                <span className="font-display text-[15px] text-faint tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[16px] text-foreground">{it}</span>
                <svg
                  className="ml-auto text-faint opacity-0 transition-opacity group-hover:opacity-100"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
