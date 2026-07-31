import { Reveal } from "./reveal";

export function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
  invert = false,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  center?: boolean;
  invert?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <Reveal>
        <span className="eyebrow" style={invert ? { color: "rgba(245,242,236,0.6)" } : undefined}>
          {eyebrow}
        </span>
      </Reveal>
      <Reveal i={1}>
        <h2
          className="font-display mt-4 text-[34px] leading-[1.08] sm:text-[44px]"
          style={{ color: invert ? "var(--on-ink)" : "var(--foreground)" }}
        >
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal i={2}>
          <p
            className="mt-5 text-[17px] leading-relaxed"
            style={{ color: invert ? "rgba(245,242,236,0.7)" : "var(--muted)" }}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
