import { site } from "@/content/site";
import { SectionHead } from "@/components/section-head";

export function Clients() {
  const { clients } = site;
  const row = [...clients.items, ...clients.items];
  return (
    <section id="clients" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10">
        <SectionHead eyebrow={clients.eyebrow} title={clients.title} center />
      </div>

      <div className="relative mt-14 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-12 px-6 hover:[animation-play-state:paused]">
          {row.map((c, i) => (
            <span
              key={`${c}-${i}`}
              className="font-display shrink-0 text-[26px] text-foreground/45 transition-colors hover:text-foreground md:text-[30px]"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
