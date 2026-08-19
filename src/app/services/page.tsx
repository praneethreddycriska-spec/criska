import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/sections/footer";
import { PageHeader } from "@/components/page-header";
import { ServiceIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { serviceListJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/content/site";
import { getServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Technology Services & AI Consulting — Criska Business Consulting",
  description:
    "Explore Criska's full-spectrum technology & consulting services: AI/ML engineering, Cloud & DevOps, Cybersecurity & SOC, Software Development, Data Analytics, and IT Staffing across India, UK, and US.",
  alternates: { canonical: "https://criska.org/services" },
  keywords: [
    "Criska Services",
    "Criska AI Consulting",
    "Criska Technology Solutions",
    "AI and Generative AI Services Hyderabad",
    "Cloud DevOps Consulting India",
    "Cybersecurity Consulting Hyderabad",
    "Software Product Engineering Company",
    "Data Engineering and BI Dashboards",
    "IT Staffing and Consulting",
  ],
};

export const revalidate = 300; // ISR: cached, refreshed every 5 min

export default async function ServicesPage() {
  const { services } = site;
  const items = await getServices();
  return (
    <>
      <JsonLd
        data={[
          serviceListJsonLd(items.map((s) => ({ title: s.title, desc: s.desc }))),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
        ]}
      />
      <Nav />
      <main className="flex-1">
        <PageHeader eyebrow={services.eyebrow} title={services.title} lead={services.lead} />

        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((s, i) => (
                <article
                  key={s.id}
                  className="flex h-full flex-col rounded-[var(--radius)] border border-border bg-surface p-7 transition-all duration-300 hover:border-border-strong hover:shadow-[0_24px_60px_-34px_rgba(0,0,0,0.4)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-panel text-foreground">
                      <ServiceIcon name={s.icon} />
                    </div>
                    <span className="text-[12px] tabular-nums text-faint">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h2 className="font-display mt-5 text-[23px] leading-tight">{s.title}</h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{s.desc}</p>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {s.includes.map((c) => (
                      <span key={c} className="rounded-full bg-panel px-2.5 py-1 text-[11.5px] text-muted">
                        {c}
                      </span>
                    ))}
                  </div>

                  {s.extra && (
                    <div className="mt-auto pt-5">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-faint">{s.extra.label}</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {s.extra.items.map((c) => (
                          <span key={c} className="rounded-full border border-accent/30 bg-accent-soft px-2.5 py-1 text-[11.5px] text-foreground/75">
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-10 rounded-[var(--radius)] bg-panel p-10 text-center">
              <h2 className="font-display text-[28px] leading-tight">Not sure where to start?</h2>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-muted">
                Tell us your goals and we&apos;ll recommend the right engagement.
              </p>
              <a href="/contact" className="btn-pill btn-primary mt-6">Schedule Consultation</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
