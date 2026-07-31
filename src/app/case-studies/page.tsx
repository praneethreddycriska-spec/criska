import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Case Studies — Criska Business Consulting",
  description: "Measurable outcomes Criska has delivered across banking, healthcare, retail, and technology.",
};

export default function CaseStudiesPage() {
  const { caseStudies } = site;
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={caseStudies.eyebrow} title={caseStudies.title} lead={caseStudies.lead} />

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="grid gap-4 md:grid-cols-2">
              {caseStudies.items.map((c) => (
                <article key={c.title} className="flex flex-col rounded-[var(--radius)] border border-border bg-surface p-8">
                  <span className="text-[12px] uppercase tracking-[0.12em] text-accent">{c.sector}</span>
                  <h2 className="font-display mt-3 text-[26px] leading-tight">{c.title}</h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{c.result}</p>
                  <div className="mt-6 flex items-baseline gap-3 border-t border-border pt-6">
                    <span className="font-display text-[42px] leading-none">{c.metric}</span>
                    <span className="text-[14px] text-muted">{c.metricLabel}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 rounded-[var(--radius)] bg-panel p-10 text-center">
              <h2 className="font-display text-[28px] leading-tight">Want the full story?</h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
                Detailed case studies and industry reports are available on request.
              </p>
              <a href="/contact" className="btn-pill btn-primary mt-6">Request case studies</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
