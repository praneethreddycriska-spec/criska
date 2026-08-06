import { site } from "@/content/site";
import { Reveal } from "@/components/reveal";
import { ServiceIcon } from "@/components/icons";
import { SectionHead } from "@/components/section-head";

export function Services() {
  const { services } = site;
  return (
    <section id="services" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <SectionHead eyebrow={services.eyebrow} title={services.title} lead={services.lead} />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => (
            <Reveal key={s.title} i={i % 3}>
              <article
                className={`h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-7 transition-all duration-300 hover:border-border-strong hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.4)] ${
                  i >= 3 ? "hidden sm:flex" : "flex"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-panel text-foreground">
                    <ServiceIcon name={s.icon} />
                  </div>
                  <span className="text-[12px] tabular-nums text-faint">{String(i + 1).padStart(2, "0")}</span>
                </div>

                <h3 className="font-display mt-5 text-[23px] leading-tight">{s.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.desc}</p>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {s.includes.map((c) => (
                    <span key={c} className="rounded-full bg-panel px-2.5 py-1 text-[11.5px] text-muted">
                      {c}
                    </span>
                  ))}
                </div>

                {s.extra && (
                  <div className="mt-auto pt-5">
                    <div className="text-[11px] uppercase tracking-[0.14em] text-faint">{s.extra.label}</div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.extra.items.map((c) => (
                        <span key={c} className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[11.5px] text-foreground/75">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        {/* Mobile: the grid shows only the first 3 — link out to the full page */}
        <div className="mt-8 text-center sm:hidden">
          <a href="/services" className="btn-pill btn-ghost">
            View all {services.items.length} services →
          </a>
        </div>
      </div>
    </section>
  );
}
