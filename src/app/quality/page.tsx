import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { JsonLd } from "@/components/json-ld";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Quality Standards & ISO Compliance — Criska Business Consulting",
  description:
    "Criska's quality commitment — ISO 27001 certified information security, SOC 2 alignment, HIPAA compliance, and advancing toward CMMI maturity.",
  alternates: { canonical: "https://criska.org/quality" },
  keywords: [
    "Criska Quality Policy",
    "Criska ISO 27001 Certified",
    "Criska SOC 2 Compliance",
    "Criska CMMI Level Journey",
    "Criska Security Standards",
  ],
};

export default function QualityPage() {
  const { quality } = site;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Quality", path: "/quality" },
          ]),
        ]}
      />
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={quality.eyebrow} title={quality.title} lead={quality.intro} />

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="grid gap-4 md:grid-cols-2">
              {quality.blocks.map((b) => (
                <div key={b.title} className="rounded-[var(--radius)] border border-border bg-surface p-8">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-panel text-accent">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
                      <path d="M9.5 12l1.8 1.8L15 10" />
                    </svg>
                  </div>
                  <h2 className="font-display mt-5 text-[26px] leading-tight">{b.title}</h2>
                  <p className="mt-3 text-[15.5px] leading-relaxed text-muted">{b.body}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-[var(--radius)] bg-panel p-8 md:p-12">
              <div className="text-[12.5px] uppercase tracking-[0.14em] text-faint">Our Quality Promise</div>
              <h2 className="font-display mt-3 text-[30px] leading-tight sm:text-[38px]">We are committed to</h2>
              <ul className="mt-8 grid gap-x-10 gap-y-0 sm:grid-cols-2">
                {quality.promise.map((p) => (
                  <li key={p} className="flex items-start gap-3 border-b border-border py-4">
                    <svg className="mt-1 shrink-0 text-accent" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    <span className="text-[16px] leading-snug text-foreground">{p}</span>
                  </li>
                ))}
              </ul>
              <p className="font-display mt-10 text-[24px] text-foreground sm:text-[28px]">{quality.closer}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
