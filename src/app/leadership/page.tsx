import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { LeadershipMembers } from "@/components/sections/leadership-members";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Leadership Team & Management — Criska Business Consulting",
  description:
    "Meet the board and executive leadership team at Criska Business Consulting — driving AI-enabled technology innovation, cloud engineering, cybersecurity, and talent partnerships.",
  alternates: { canonical: "/leadership" },
  keywords: [
    "Criska Leadership Team",
    "Criska Management",
    "Criska Executive Board",
    "Criska Founders",
    "Criska Technology Directors",
  ],
};

export const revalidate = 300; // ISR: cached, refreshed every 5 min

export default function LeadershipPage() {
  const { leadership } = site;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Leadership", path: "/leadership" },
          ]),
        ]}
      />
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={leadership.eyebrow} title={leadership.title} lead={leadership.lead} />

        <LeadershipMembers title={leadership.membersTitle} />

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="mb-10">
              <span className="eyebrow">How we&apos;re organized</span>
              <h2 className="font-display mt-3 text-[30px] leading-tight sm:text-[38px]">Leadership by function</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {leadership.functions.map((f) => (
                <div key={f.area} className="rounded-[var(--radius)] border border-border bg-surface p-8">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-panel text-accent">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="3.2" />
                      <path d="M5 20a7 7 0 0114 0" />
                    </svg>
                  </div>
                  <h2 className="font-display mt-5 text-[22px] leading-tight">{f.area}</h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{f.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[var(--radius)] bg-panel p-10 text-center">
              <p className="mx-auto max-w-xl text-[16px] text-foreground">{leadership.note}</p>
              <a href="/contact" className="btn-pill btn-primary mt-6">Get in touch</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
