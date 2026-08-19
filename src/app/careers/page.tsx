import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { CareersRoles } from "@/components/careers-roles";
import { JsonLd } from "@/components/json-ld";
import { jobPostingsJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getJobs } from "@/lib/data";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Careers & Job Opportunities — Criska Business Consulting",
  description:
    "Explore career opportunities at Criska in Hyderabad and remote. Build next-gen AI, cloud infrastructure, cybersecurity, and software applications with an enterprise technology partner.",
  alternates: { canonical: "/careers" },
  keywords: [
    "Criska Careers",
    "Criska Jobs",
    "Criska ATS",
    "IT Jobs Hyderabad",
    "AI Engineer jobs Hyderabad",
    "Cloud DevOps jobs India",
    "Cybersecurity analyst careers Hyderabad",
    "Full-Stack developer jobs India",
  ],
};

export const revalidate = 60; // ISR: cached, refreshed every 60s (jobs change often)

export default async function CareersPage() {
  const { careers } = site;
  const jobs = await getJobs();
  const openJobs = jobs.filter((j) => j.isOpen);

  return (
    <>
      <JsonLd
        data={[
          jobPostingsJsonLd(openJobs),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Careers", path: "/careers" },
          ]),
        ]}
      />
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

            <CareersRoles jobs={jobs} ctaNote={careers.ctaNote} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
