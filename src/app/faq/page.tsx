import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "FAQs — Criska Business Consulting",
  description: "Answers to common questions about services, engagement models, security, and getting started with Criska.",
};

export default function FaqPage() {
  const { faq } = site;
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={faq.eyebrow} title={faq.title} lead={faq.lead} />

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[820px] px-6 md:px-10">
            <div className="overflow-hidden rounded-[var(--radius)] border border-border">
              {faq.items.map((it, i) => (
                <details key={it.q} className={`group bg-surface ${i > 0 ? "border-t border-border" : ""}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-7 py-6">
                    <span className="font-display text-[21px] leading-snug">{it.q}</span>
                    <svg className="shrink-0 text-muted transition-transform group-open:rotate-45" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </summary>
                  <p className="px-7 pb-6 text-[15.5px] leading-relaxed text-muted">{it.a}</p>
                </details>
              ))}
            </div>

            <div className="mt-8 rounded-[var(--radius)] bg-panel p-8 text-center">
              <p className="text-[16px] text-foreground">Still have questions?</p>
              <a href="/contact" className="btn-pill btn-primary mt-5">Talk to our team</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
