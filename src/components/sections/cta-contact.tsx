import { site } from "@/content/site";
import { Reveal } from "@/components/reveal";

export function CtaContact() {
  const { cta, contact } = site;
  return (
    <section
      id="contact-cta"
      className="relative isolate overflow-hidden"
      style={{ background: "var(--navy-bg)", color: "var(--navy-body)", colorScheme: "dark" }}
    >
      {/* faint radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 120%, rgba(169,192,205,0.14), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px] px-6 py-28 text-center md:px-10 md:py-36">
        <Reveal>
          <span className="eyebrow" style={{ color: "var(--navy-faint)" }}>{cta.eyebrow}</span>
        </Reveal>
        <Reveal i={1}>
          <h2 className="font-display mx-auto mt-5 max-w-[16ch] text-[42px] leading-[1.05] sm:text-[60px]" style={{ color: "var(--navy-text)" }}>
            {cta.title}
          </h2>
        </Reveal>
        <Reveal i={2}>
          <p className="mx-auto mt-6 max-w-[48ch] text-[18px] leading-relaxed" style={{ color: "var(--navy-muted)" }}>
            {cta.lead}
          </p>
        </Reveal>

        <Reveal i={3}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href={cta.button.href}
              className="btn-pill"
              style={{ background: "var(--navy-text)", color: "var(--navy-bg)" }}
            >
              {cta.button.label}
            </a>
            <a
              href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
              className="btn-pill"
              style={{ border: "1px solid var(--navy-border-strong)", color: "var(--navy-body)" }}
            >
              {contact.phone}
            </a>
          </div>
        </Reveal>

        <Reveal i={4}>
          <p className="mx-auto mt-12 max-w-[52ch] text-[13.5px] leading-relaxed" style={{ color: "var(--navy-faint)" }}>
            {contact.company} · {contact.address.join(" · ")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
