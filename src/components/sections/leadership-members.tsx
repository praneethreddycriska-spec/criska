import { site } from "@/content/site";
import { Reveal } from "@/components/reveal";
import { getLeadership, type Member } from "@/lib/data";
import { safeHttpUrl } from "@/lib/validation";

const CREAM = "var(--navy-text)";

function MemberCard({ m, featured = false }: { m: Member; featured?: boolean }) {
  const avatar = featured ? "w-44 md:w-52" : "w-40 md:w-44";
  return (
    <div className="flex max-w-[26ch] flex-col items-center text-center">
      <div
        className={`relative aspect-square overflow-hidden rounded-full ${avatar}`}
        style={{ background: "var(--navy-surface)", border: "1px solid var(--navy-border-strong)" }}
      >
        {m.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.image} alt={m.name || m.role} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full w-full place-items-center" style={{ color: "var(--navy-faint)" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="9" r="4" />
              <path d="M4 20a8 8 0 0116 0" />
            </svg>
          </div>
        )}
      </div>

      <h3 className={`font-display mt-6 leading-tight ${featured ? "text-[27px]" : "text-[24px]"}`} style={{ color: CREAM }}>
        {m.name || m.role}
      </h3>
      {m.name && (
        <div className="mt-1 text-[13.5px]" style={{ color: "var(--navy-accent)" }}>{m.role}</div>
      )}
      <p className="mt-3 text-[13.5px] leading-relaxed" style={{ color: "var(--navy-muted)" }}>
        {m.bio}
      </p>

      {safeHttpUrl(m.linkedin) && (
        <a
          href={safeHttpUrl(m.linkedin)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${m.name || m.role} on LinkedIn`}
          className="mt-5 grid h-9 w-9 place-items-center rounded-lg transition-colors"
          style={{ border: "1px solid var(--navy-border-strong)", color: "var(--navy-body)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21H18.6v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H10z" />
          </svg>
        </a>
      )}
    </div>
  );
}

export async function LeadershipMembers({
  eyebrow = site.leadership.eyebrow,
  title = site.leadership.membersTitle,
  lead,
}: {
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  const members = await getLeadership();
  if (members.length === 0) return null;
  return (
    <section
      className="relative isolate overflow-hidden py-24 md:py-32"
      style={{ background: "var(--navy-bg)", color: "var(--navy-body)", colorScheme: "dark" }}
    >
      <div className="relative mx-auto max-w-[1200px] px-6 md:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow" style={{ color: "var(--navy-faint)" }}>{eyebrow}</span>
          </Reveal>
          <Reveal i={1}>
            <h2 className="font-display mt-4 text-[34px] leading-[1.08] sm:text-[46px]" style={{ color: CREAM }}>
              {title}
            </h2>
          </Reveal>
          {lead && (
            <Reveal i={2}>
              <p className="mx-auto mt-5 max-w-[52ch] text-[17px] leading-relaxed" style={{ color: "var(--navy-muted)" }}>
                {lead}
              </p>
            </Reveal>
          )}
        </div>

        {/* Row 1: the founder, centered on its own. Row 2: up to four others
            across four columns. Falls back to a plain grid for other counts. */}
        {(() => {
          const [lead, ...rest] = members;
          return (
            <div className="mt-16 space-y-12">
              <Reveal>
                <div className="flex justify-center">
                  <MemberCard m={lead} featured />
                </div>
              </Reveal>
              {rest.length > 0 && (
                <div
                  className={`grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 ${
                    rest.length >= 4 ? "lg:grid-cols-4" : rest.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
                  } ${rest.length < 4 ? "mx-auto max-w-4xl" : ""}`}
                >
                  {rest.map((m, i) => (
                    <Reveal key={m.id} i={i}>
                      <MemberCard m={m} />
                    </Reveal>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </section>
  );
}
