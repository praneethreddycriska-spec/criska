import { site } from "@/content/site";
import { Reveal } from "@/components/reveal";
import { SectionHead } from "@/components/section-head";

export function WhyChoose() {
  const { why } = site;
  return (
    <section id="why" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <SectionHead eyebrow={why.eyebrow} title={why.title} lead={why.lead} />

        <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-0 sm:grid-cols-2">
          {why.items.map((it, i) => (
            <Reveal key={it} i={i % 2}>
              <div className="flex items-start gap-4 border-b border-border py-5">
                <svg className="mt-0.5 shrink-0 text-accent" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span className="text-[17px] leading-snug text-foreground">{it}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
