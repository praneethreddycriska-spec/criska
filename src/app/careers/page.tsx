import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { CareersClient } from "@/components/careers-client";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Careers & ATS Portal — Criska Business Consulting",
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

            {/* Open roles & ATS apply flow */}
            <div className="mt-16">
              <div className="eyebrow">Open Positions</div>
              <h2 className="font-display mt-3 text-[30px] leading-tight sm:text-[38px]">Current openings</h2>

              <CareersClient />

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
