import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact-form";
import { getContactInfo } from "@/lib/data";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact — Criska Business Consulting",
  description: "Talk to Criska about consulting, software development, staffing, or outsourcing.",
};

export const dynamic = "force-dynamic";

const MAP_QUERY = "Spacion Business Towers, Madhapur, Hyderabad";

export default async function ContactPage() {
  const contact = { ...site.contact, ...(await getContactInfo()) };
  const tel = `tel:${contact.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={contact.eyebrow} title={contact.title} lead={contact.lead} />

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            {/* Quick actions */}
            <div className="grid gap-4 sm:grid-cols-3">
              <QuickTile
                href={tel}
                icon={<PhoneIcon />}
                label="Call us"
                value={contact.phone}
              />
              <QuickTile
                href={`mailto:${contact.emails[0]}`}
                icon={<MailIcon />}
                label="Email us"
                value={contact.emails[0]}
              />
              <QuickTile
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                external
                icon={<PinIcon />}
                label="Visit us"
                value="Madhapur, Hyderabad"
              />
            </div>

            {/* Info card + form */}
            <div className="mt-4 grid gap-4 lg:grid-cols-12">
              {/* Dark premium info card */}
              <div
                className="relative flex flex-col overflow-hidden rounded-[var(--radius)] p-8 lg:col-span-5 md:p-10"
                style={{ background: "var(--navy-bg)", color: "var(--navy-body)", colorScheme: "dark" }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "radial-gradient(60% 50% at 100% 0%, rgba(169,192,205,0.14), transparent 70%)" }}
                />
                <div className="relative">
                  <div className="text-[12.5px] uppercase tracking-[0.14em]" style={{ color: "var(--navy-faint)" }}>
                    {contact.officeLabel}
                  </div>
                  <h2 className="font-display mt-3 text-[26px] leading-tight" style={{ color: "var(--navy-text)" }}>
                    {contact.company}
                  </h2>

                  <div className="mt-6 flex items-start gap-3.5">
                    <IconWrap><PinIcon /></IconWrap>
                    <address className="not-italic text-[15px] leading-relaxed" style={{ color: "var(--navy-muted)" }}>
                      {contact.address.map((line) => (
                        <div key={line}>{line}</div>
                      ))}
                    </address>
                  </div>

                  <div className="mt-6 space-y-4 border-t pt-6" style={{ borderColor: "var(--navy-border)" }}>
                    <InfoRow icon={<PhoneIcon />} href={tel}>{contact.phone}</InfoRow>
                    {contact.emails.map((e) => (
                      <InfoRow key={e} icon={<MailIcon />} href={`mailto:${e}`}>{e}</InfoRow>
                    ))}
                    {(() => {
                      // Normalise: strip any leading scheme so we never emit
                      // "https://https://…" if the stored value already has one.
                      const host = contact.website.replace(/^https?:\/\//i, "");
                      return (
                        <InfoRow icon={<GlobeIcon />} href={`https://${host}`} external>
                          {host}
                        </InfoRow>
                      );
                    })()}
                  </div>

                  <div className="mt-auto pt-8">
                    <span
                      className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px]"
                      style={{ border: "1px solid var(--navy-border-strong)", color: "var(--navy-body)" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#5fce9b" }} />
                      Typically replies within 24 hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-7">
                <ContactForm />
              </div>
            </div>

            {/* Location panel with Dark Navy Styled Map */}
            <div className="mt-4 overflow-hidden rounded-[var(--radius)] border border-border">
              <div
                className="relative h-[320px] md:h-[420px] overflow-hidden"
                style={{ background: "#0a151d", colorScheme: "dark" }}
              >
                {/* Live Google Map with Dark Navy Styling */}
                <iframe
                  title="Criska Office Location Map"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  className="absolute inset-0 h-full w-full border-0 opacity-80 transition-opacity duration-300 hover:opacity-100"
                  style={{
                    filter: "invert(92%) hue-rotate(195deg) contrast(115%) saturate(75%) brightness(85%)",
                    mixBlendMode: "luminosity",
                  }}
                  loading="lazy"
                />

                {/* Dark Navy Gradient Vignette Overlay */}
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,21,29,0.75) 100%), linear-gradient(to bottom, rgba(10,21,29,0.3), transparent 30%, rgba(10,21,29,0.6))",
                  }}
                />

                {/* Pin Overlay */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="relative grid place-items-center">
                    <span className="absolute h-16 w-16 rounded-full animate-ping bg-accent/30" />
                    <span className="absolute h-24 w-24 rounded-full border border-accent/40" />
                    <span className="relative grid h-12 w-12 place-items-center rounded-full bg-accent text-[#0a151d] font-bold shadow-[0_10px_30px_-6px_rgba(0,0,0,0.8)]">
                      <PinIcon />
                    </span>
                  </div>
                </div>

                {/* Floating address chip */}
                <div className="absolute left-5 top-5 max-w-[85%] rounded-xl px-4 py-3 backdrop-blur-md z-10 shadow-lg" style={{ background: "rgba(10,21,29,0.88)", border: "1px solid var(--navy-border-strong)" }}>
                  <div className="text-[11px] uppercase tracking-[0.14em] font-semibold" style={{ color: "var(--navy-faint)" }}>Corporate Office · Madhapur</div>
                  <div className="mt-0.5 text-[14px] font-medium text-white">Spacion Business Towers, Madhapur, Hyderabad</div>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between gap-2 border-t border-border bg-surface px-6 py-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-2.5 text-[14px] text-foreground">
                  <span className="text-accent"><PinIcon /></span>
                  {contact.address.join(" · ")}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground transition-colors hover:text-accent"
                >
                  Get directions
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M8 7h9v9" /></svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

/* ---------- pieces ---------- */

function QuickTile({
  href,
  icon,
  label,
  value,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-4 rounded-[var(--radius)] border border-border bg-surface p-5 transition-all duration-300 hover:border-border-strong hover:shadow-[0_24px_60px_-40px_rgba(10,22,34,0.5)]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-panel text-foreground transition-colors group-hover:bg-accent-soft">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[12.5px] uppercase tracking-[0.12em] text-faint">{label}</span>
        <span className="block truncate text-[15px] font-medium text-foreground">{value}</span>
      </span>
      <svg className="ml-auto shrink-0 text-faint transition-transform group-hover:translate-x-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    </a>
  );
}

function IconWrap({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg"
      style={{ background: "rgba(245,242,236,0.06)", color: "var(--navy-accent)" }}
    >
      {children}
    </span>
  );
}

function InfoRow({
  icon,
  href,
  external,
  children,
}: {
  icon: React.ReactNode;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <IconWrap>{icon}</IconWrap>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="text-[15px] transition-colors hover:opacity-80"
        style={{ color: "var(--navy-body)" }}
      >
        {children}
      </a>
    </div>
  );
}

/* ---------- icons ---------- */
const ico = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
function PhoneIcon() {
  return <svg {...ico}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" /></svg>;
}
function MailIcon() {
  return <svg {...ico}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
}
function PinIcon() {
  return <svg {...ico}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function GlobeIcon() {
  return <svg {...ico}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></svg>;
}
