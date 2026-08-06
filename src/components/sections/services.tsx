import { site } from "@/content/site";
import { Reveal } from "@/components/reveal";
import { ServiceIcon } from "@/components/icons";
import { SectionHead } from "@/components/section-head";

// Vibrant gradient accents for each service card
const CARD_THEMES = [
  {
    bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_10px_25px_-5px_rgba(16,185,129,0.4)]",
    pillBg: "border-emerald-500/35 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white",
    borderHover: "hover:border-emerald-500/50 hover:shadow-[0_24px_60px_-20px_rgba(16,185,129,0.3)]",
  },
  {
    bgGradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_10px_25px_-5px_rgba(59,130,246,0.4)]",
    pillBg: "border-blue-500/35 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white",
    borderHover: "hover:border-blue-500/50 hover:shadow-[0_24px_60px_-20px_rgba(59,130,246,0.3)]",
  },
  {
    bgGradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    iconBg: "bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-[0_10px_25px_-5px_rgba(168,85,247,0.4)]",
    pillBg: "border-purple-500/35 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500 hover:text-white",
    borderHover: "hover:border-purple-500/50 hover:shadow-[0_24px_60px_-20px_rgba(168,85,247,0.3)]",
  },
  {
    bgGradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    iconBg: "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4)]",
    pillBg: "border-amber-500/35 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white",
    borderHover: "hover:border-amber-500/50 hover:shadow-[0_24px_60px_-20px_rgba(245,158,11,0.3)]",
  },
  {
    bgGradient: "from-cyan-500/10 via-blue-500/5 to-transparent",
    iconBg: "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-[0_10px_25px_-5px_rgba(6,182,212,0.4)]",
    pillBg: "border-cyan-500/35 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-white",
    borderHover: "hover:border-cyan-500/50 hover:shadow-[0_24px_60px_-20px_rgba(6,182,212,0.3)]",
  },
  {
    bgGradient: "from-rose-500/10 via-red-500/5 to-transparent",
    iconBg: "bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_10px_25px_-5px_rgba(244,63,94,0.4)]",
    pillBg: "border-rose-500/35 bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white",
    borderHover: "hover:border-rose-500/50 hover:shadow-[0_24px_60px_-20px_rgba(244,63,94,0.3)]",
  },
];

export function Services() {
  const { services } = site;
  return (
    <section id="services" className="relative border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <SectionHead eyebrow={services.eyebrow} title={services.title} lead={services.lead} />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.items.map((s, i) => {
            const theme = CARD_THEMES[i % CARD_THEMES.length];
            return (
              <Reveal key={s.title} i={i % 3}>
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-gradient-to-b ${theme.bgGradient} bg-surface p-7 transition-all duration-300 ${theme.borderHover}`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`grid h-12 w-12 place-items-center rounded-xl ${theme.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      <ServiceIcon name={s.icon} />
                    </div>
                    <span className="font-display text-[15px] font-semibold tabular-nums text-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <h3 className="font-display mt-6 text-[24px] leading-tight text-foreground transition-colors group-hover:text-foreground font-semibold">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted font-normal">
                    {s.desc}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {s.includes.map((c) => (
                      <span
                        key={c}
                        className={`rounded-full border px-3 py-1 text-[12px] font-medium transition-colors duration-200 ${theme.pillBg}`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  {s.extra && (
                    <div className="mt-auto pt-6">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-faint">
                        {s.extra.label}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.extra.items.map((c) => (
                          <span
                            key={c}
                            className="rounded-full border border-border bg-panel px-2.5 py-1 text-[11.5px] text-foreground/80 font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
