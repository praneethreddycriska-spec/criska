import { Reveal } from "@/components/reveal";

const items = [
  {
    kind: "badge",
    label: "ISO 27001",
    caption: "Information security certified",
  },
  {
    kind: "badge",
    label: "SOC 2 · PCI DSS",
    caption: "Aligned to global controls",
  },
  {
    kind: "icon",
    icon: "shield",
    label: "GDPR · HIPAA",
    caption: "Privacy & compliance aligned",
  },
  {
    kind: "icon",
    icon: "lock",
    label: "End-to-end protection",
    caption: "Encryption in transit & at rest",
  },
] as const;

export function Security() {
  return (
    <section
      className="relative isolate overflow-hidden py-24 md:py-32"
      style={{ background: "var(--navy-bg)", color: "var(--navy-body)", colorScheme: "dark" }}
    >
      <div className="relative mx-auto grid max-w-[1200px] items-center gap-14 px-6 md:grid-cols-2 md:px-10">
        {/* Left — copy */}
        <div>
          <Reveal>
            <span className="eyebrow" style={{ color: "var(--navy-faint)" }}>
              Security & Compliance
            </span>
          </Reveal>
          <Reveal i={1}>
            <h2 className="font-display mt-4 text-[34px] leading-[1.08] sm:text-[46px]" style={{ color: "var(--navy-text)" }}>
              Engineered to the highest standards of data protection
            </h2>
          </Reveal>
          <Reveal i={2}>
            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed" style={{ color: "var(--navy-muted)" }}>
              Criska takes a cybersecurity-first approach across every engagement — ISO certified,
              aligned to global frameworks, and advancing toward CMMI. Your data stays protected.
              That&apos;s non-negotiable.
            </p>
          </Reveal>
          <Reveal i={3}>
            <a
              href="/quality"
              className="btn-pill mt-8"
              style={{ background: "var(--navy-text)", color: "var(--navy-bg)" }}
            >
              View our commitment
            </a>
          </Reveal>
        </div>

        {/* Right — certification grid */}
        <div className="grid grid-cols-2 gap-4">
          {items.map((it, i) => (
            <Reveal key={it.label} i={i}>
              <div
                className="flex h-full min-h-[190px] flex-col items-center justify-center rounded-[var(--radius)] px-6 py-8 text-center"
                style={{ background: "var(--navy-surface)", border: "1px solid var(--navy-border)" }}
              >
                {it.kind === "badge" ? (
                  <div
                    className="grid h-14 w-14 place-items-center rounded-full text-[10px] font-medium tracking-wide"
                    style={{ border: "1px solid var(--navy-border-strong)", color: "var(--navy-accent)" }}
                  >
                    {it.label.split(" ")[0]}
                  </div>
                ) : (
                  <div className="grid h-14 w-14 place-items-center rounded-full" style={{ border: "1px solid var(--navy-border-strong)", color: "var(--navy-accent)" }}>
                    <TrustIcon name={it.icon} />
                  </div>
                )}
                <div className="mt-4 text-[15px] font-medium" style={{ color: "var(--navy-text)" }}>
                  {it.label}
                </div>
                <div className="mt-1 text-[12.5px]" style={{ color: "var(--navy-muted)" }}>
                  {it.caption}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustIcon({ name }: { name: "shield" | "lock" }) {
  if (name === "lock") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
        <circle cx="12" cy="15.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="M9.5 12l1.8 1.8L15 10" />
    </svg>
  );
}
