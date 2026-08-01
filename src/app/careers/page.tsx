import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Careers — Criska Business Consulting",
  description: "Join Criska — build across AI, cloud, security, data, and consulting with a people-focused team.",
};

export default function CareersPage() {
  const { careers, contact } = site;
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={careers.eyebrow} title={careers.title} lead={careers.lead} />

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            {/* Culture */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {careers.culture.map((c) => (
                <div key={c.title} className="rounded-[var(--radius)] border border-border bg-surface p-6">
                  <h3 className="font-display text-[20px] leading-tight">{c.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{c.desc}</p>
                </div>
              ))}
            </div>

            {/* Open roles */}
            <div className="mt-16">
              <div className="eyebrow">Open Positions</div>
              <h2 className="font-display mt-3 text-[30px] leading-tight sm:text-[38px]">Current openings</h2>
              <div className="mt-8 overflow-hidden rounded-[var(--radius)] border border-border">
                {careers.roles.map((r, i) => {
                  const external = /^https?:\/\//.test(r.applyUrl);
                  const href = r.applyUrl
                    ? r.applyUrl
                    : `mailto:${contact.emails[1]}?subject=${encodeURIComponent("Application: " + r.title)}&body=${encodeURIComponent("Hi Criska team,\n\nI'd like to apply for the " + r.title + " role. My resume is attached.\n\nThanks,")}`;
                  return (
                    <a
                      key={r.title}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className={`group flex flex-col gap-1 bg-surface px-6 py-5 transition-colors hover:bg-panel sm:flex-row sm:items-center sm:justify-between ${i > 0 ? "border-t border-border" : ""}`}
                    >
                      <div>
                        <div className="font-display text-[20px]">{r.title}</div>
                        <div className="text-[13.5px] text-muted">{r.type}</div>
                      </div>
                      <span className="inline-flex items-center gap-2 text-[14px] text-foreground">
                        Apply
                        <svg className="transition-transform group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </span>
                    </a>
                  );
                })}
              </div>

              <div className="mt-8 rounded-[var(--radius)] bg-panel p-8 text-center">
                <p className="text-[16px] text-foreground">{careers.ctaNote}</p>
                <a href={`mailto:${contact.emails[1]}`} className="btn-pill btn-primary mt-5">
                  Send us your resume
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
