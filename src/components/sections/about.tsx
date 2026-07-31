import { site } from "@/content/site";
import { Reveal } from "@/components/reveal";

export function About() {
  const { about } = site;
  return (
    <section id="about" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <Reveal>
            <span className="eyebrow">{about.eyebrow}</span>
          </Reveal>
          <Reveal i={1}>
            <h2 className="font-display mt-4 text-[32px] leading-[1.1] sm:text-[40px]">
              {about.title}
            </h2>
          </Reveal>
        </div>
        <div className="space-y-5 md:col-span-6 md:col-start-7">
          {about.body.map((p, i) => (
            <Reveal key={i} i={i + 1}>
              <p className="text-[17px] leading-relaxed text-muted">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
